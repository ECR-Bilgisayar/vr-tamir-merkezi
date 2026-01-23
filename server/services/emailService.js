import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// CC Email addresses
const CC_EMAILS = [process.env.CC_EMAIL, 'info@etkinlikbilgisayar.com'].filter(Boolean);

// Email templates
const getServiceRequestCustomerEmail = (data) => ({
  to: data.email,
  cc: CC_EMAILS,
  from: process.env.FROM_EMAIL,
  subject: `VR Tamir Merkezi - Servis Talebiniz Alındı (#${data.serviceId})`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #8b5cf6, #3b82f6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; }
        .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #8b5cf6; }
        .tracking-number { font-size: 24px; font-weight: bold; color: #8b5cf6; text-align: center; padding: 15px; background: #f3e8ff; border-radius: 8px; margin: 20px 0; }
        .footer { background: #1e293b; color: #94a3b8; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; }
        .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
        .label { color: #64748b; }
        .value { font-weight: 600; color: #1e293b; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🛠️ Servis Talebiniz Alındı</h1>
      </div>
      <div class="content">
        <p>Sayın <strong>${data.fullName}</strong>,</p>
        <p>Servis talebiniz başarıyla oluşturulmuştur. En kısa sürede sizinle iletişime geçeceğiz.</p>
        
        <div class="tracking-number">
          Takip No: ${data.serviceId}
        </div>
        
        <div class="info-box">
          <h3 style="margin-top: 0; color: #8b5cf6;">Talep Detayları</h3>
          <div class="detail-row">
            <span class="label">Cihaz:</span>
            <span class="value">${data.device}</span>
          </div>
          <div class="detail-row">
            <span class="label">Arıza Tipi:</span>
            <span class="value">${data.faultType}</span>
          </div>
          <div class="detail-row">
            <span class="label">Teslimat:</span>
            <span class="value">${data.deliveryMethod === 'kargo' ? 'Kargo ile Gönderim' : 'Elden Teslim'}</span>
          </div>
        </div>
        
        ${data.deliveryMethod === 'kargo' ? `
        <div class="info-box" style="border-left-color: #f59e0b; background: #fffbeb;">
          <h4 style="margin-top: 0; color: #d97706;">📦 Kargo Bilgileri</h4>
          <p style="margin-bottom: 0;">Cihazınızı aşağıdaki adrese gönderebilirsiniz:</p>
          <p><strong>İstoç, 32. Ada No:76-78, Bağcılar, İstanbul</strong></p>
          <p style="color: #92400e; font-size: 14px;"><em>Not: Kargo ücretleri müşteriye aittir.</em></p>
        </div>
        ` : `
        <div class="info-box" style="border-left-color: #22c55e; background: #f0fdf4;">
          <h4 style="margin-top: 0; color: #16a34a;">📍 Elden Teslim Adresi</h4>
          <p style="margin-bottom: 0;"><strong>İstoç, 32. Ada No:76-78, Bağcılar, İstanbul</strong></p>
          <p>Hafta içi 09:00 - 18:00 arası teslim alınmaktadır.</p>
        </div>
        `}
        
        <h4>Sonraki Adımlar:</h4>
        <ol>
          <li>Ekibimiz talebinizi inceleyecek</li>
          <li>Sizinle iletişime geçilecek</li>
          <li>Cihazınız teslim alınacak</li>
          <li>Arıza tespiti ve fiyat teklifi sunulacak</li>
          <li>Onayınız sonrası onarım yapılacak</li>
        </ol>
      </div>
      <div class="footer">
        <p>VR Tamir Merkezi | Profesyonel VR Servis Hizmetleri</p>
        <p>Bu e-posta otomatik olarak gönderilmiştir. Yanıtlamayınız.</p>
      </div>
    </body>
    </html>
  `
});

const getServiceRequestAdminEmail = (data) => ({
  to: process.env.ADMIN_EMAIL,
  from: process.env.FROM_EMAIL,
  subject: `🔔 Yeni Servis Talebi - ${data.fullName} (#${data.serviceId})`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #dc2626; color: white; padding: 15px; border-radius: 8px 8px 0 0; }
        .content { background: #fff; padding: 20px; border: 1px solid #ddd; }
        .info-table { width: 100%; border-collapse: collapse; }
        .info-table td { padding: 10px; border-bottom: 1px solid #eee; }
        .label { color: #666; width: 40%; }
        .value { font-weight: bold; }
        .btn { display: inline-block; background: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 15px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2 style="margin: 0;">🛠️ Yeni Servis Talebi</h2>
        </div>
        <div class="content">
          <p><strong>Takip No:</strong> ${data.serviceId}</p>
          <p><strong>Tarih:</strong> ${new Date().toLocaleString('tr-TR')}</p>
          
          <h3>Müşteri Bilgileri</h3>
          <table class="info-table">
            <tr><td class="label">Ad Soyad:</td><td class="value">${data.fullName}</td></tr>
            <tr><td class="label">E-posta:</td><td class="value">${data.email}</td></tr>
            <tr><td class="label">Telefon:</td><td class="value">${data.phone}</td></tr>
            <tr><td class="label">Aranmak İstiyor:</td><td class="value">${data.callbackPreference ? 'Evet ✓' : 'Hayır'}</td></tr>
          </table>
          
          <h3>Servis Detayları</h3>
          <table class="info-table">
            <tr><td class="label">Cihaz:</td><td class="value">${data.device}</td></tr>
            <tr><td class="label">Arıza Tipi:</td><td class="value">${data.faultType}</td></tr>
            <tr><td class="label">Teslimat:</td><td class="value">${data.deliveryMethod === 'kargo' ? '📦 Kargo' : '🏢 Elden Teslim'}</td></tr>
          </table>
          
          <h3>Arıza Açıklaması</h3>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 6px;">
            ${data.faultDescription || 'Açıklama girilmedi.'}
          </div>
          
          <a href="${process.env.SITE_URL || 'https://vrservis.com'}/admin" class="btn">Admin Paneline Git →</a>
        </div>
      </div>
    </body>
    </html>
  `
});

// Device Received Email - sent when device is received at service center
const getDeviceReceivedEmail = (data) => ({
  to: data.email,
  cc: CC_EMAILS,
  from: process.env.FROM_EMAIL,
  subject: `VR Tamir Merkezi - Cihazınız Teslim Alındı (#${data.serviceId})`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; }
        .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #6366f1; }
        .tracking-number { font-size: 24px; font-weight: bold; color: #6366f1; text-align: center; padding: 15px; background: #eef2ff; border-radius: 8px; margin: 20px 0; }
        .footer { background: #1e293b; color: #94a3b8; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; }
        .btn { display: inline-block; background: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 15px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>📦 Cihazınız Teslim Alındı</h1>
      </div>
      <div class="content">
        <p>Sayın <strong>${data.fullName}</strong>,</p>
        <p>Cihazınız servis merkezimize başarıyla teslim alınmıştır. Arıza tespiti işlemi başlamıştır.</p>
        
        <div class="tracking-number">
          Takip No: ${data.serviceId}
        </div>
        
        <div class="info-box">
          <h3 style="margin-top: 0; color: #6366f1;">Cihaz Bilgileri</h3>
          <p><strong>Cihaz:</strong> ${data.device}</p>
          <p><strong>Arıza Tipi:</strong> ${data.faultType}</p>
          <p><strong>Teslim Tarihi:</strong> ${new Date().toLocaleString('tr-TR')}</p>
        </div>
        
        <h4>Sonraki Adımlar:</h4>
        <ol>
          <li>Arıza tespiti yapılacak</li>
          <li>Size fiyat teklifi sunulacak</li>
          <li>Onayınız sonrası onarım başlayacak</li>
        </ol>
        
        <p style="text-align: center;">
          <a href="${process.env.SITE_URL || 'https://vrservis.com'}/takip" class="btn">Durumu Takip Et →</a>
        </p>
      </div>
      <div class="footer">
        <p>VR Tamir Merkezi | Profesyonel VR Servis Hizmetleri</p>
        <p>Bu e-posta otomatik olarak gönderilmiştir. Yanıtlamayınız.</p>
      </div>
    </body>
    </html>
  `
});

// Price Quote Email - sent when price quote is ready
const getPriceQuoteEmail = (data) => ({
  to: data.email,
  cc: CC_EMAILS,
  from: process.env.FROM_EMAIL,
  subject: `VR Tamir Merkezi - Fiyat Teklifiniz Hazır (#${data.serviceId})`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #f59e0b, #ef4444); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; }
        .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }
        .tracking-number { font-size: 24px; font-weight: bold; color: #f59e0b; text-align: center; padding: 15px; background: #fffbeb; border-radius: 8px; margin: 20px 0; }
        .price-box { font-size: 32px; font-weight: bold; color: #16a34a; text-align: center; padding: 20px; background: #f0fdf4; border-radius: 8px; margin: 20px 0; border: 2px solid #22c55e; }
        .footer { background: #1e293b; color: #94a3b8; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; }
        .btn { display: inline-block; background: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 15px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>💰 Fiyat Teklifiniz Hazır</h1>
      </div>
      <div class="content">
        <p>Sayın <strong>${data.fullName}</strong>,</p>
        <p>Cihazınızın arıza tespiti tamamlanmış ve fiyat teklifiniz hazırlanmıştır.</p>
        
        <div class="tracking-number">
          Takip No: ${data.serviceId}
        </div>
        
        <div class="info-box">
          <h3 style="margin-top: 0; color: #f59e0b;">Arıza Tespiti</h3>
          <p><strong>Cihaz:</strong> ${data.device}</p>
          <p><strong>Tespit Edilen Arıza:</strong> ${data.faultType}</p>
        </div>
        
        <div class="price-box">
          ₺${data.priceQuote ? data.priceQuote.toLocaleString('tr-TR') : '0'}
        </div>
        
        ${data.notes ? `
        <div class="info-box" style="border-left-color: #3b82f6;">
          <h4 style="margin-top: 0; color: #3b82f6;">📝 Açıklama</h4>
          <p>${data.notes}</p>
        </div>
        ` : ''}
        
        <p><strong>Onarım İşleminin Başlaması İçin:</strong></p>
        <p>Lütfen bizimle iletişime geçerek teklifinizi onaylayın. Onayınız sonrası onarım işlemine başlanacaktır.</p>
        
        <p style="text-align: center;">
          <a href="${process.env.SITE_URL || 'https://vrservis.com'}/takip" class="btn">Durumu Takip Et →</a>
        </p>
        
        <p style="color: #64748b; font-size: 14px; margin-top: 20px;">
          📞 İletişim: +90 850 228 7574<br>
          📧 E-posta: vr@vrtamirmerkezi.com
        </p>
      </div>
      <div class="footer">
        <p>VR Tamir Merkezi | Profesyonel VR Servis Hizmetleri</p>
        <p>Bu e-posta otomatik olarak gönderilmiştir. Yanıtlamayınız.</p>
      </div>
    </body>
    </html>
  `
});

const getRentalRequestCustomerEmail = (data) => ({
  to: data.email,
  cc: CC_EMAILS,
  from: process.env.FROM_EMAIL,
  subject: `VR Kiralama - Talebiniz Alındı (#${data.rentalId})`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #8b5cf6, #3b82f6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; }
        .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #8b5cf6; }
        .footer { background: #1e293b; color: #94a3b8; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🎮 Kiralama Talebiniz Alındı</h1>
      </div>
      <div class="content">
        <p>Sayın <strong>${data.fullName}</strong>,</p>
        <p>Kurumsal kiralama talebiniz başarıyla alınmıştır. En kısa sürede sizinle iletişime geçeceğiz.</p>
        
        <div class="info-box">
          <h3 style="margin-top: 0; color: #8b5cf6;">Talep Özeti</h3>
          <p><strong>Ürün:</strong> ${data.productName || 'Belirtilmedi'}</p>
          <p><strong>Adet:</strong> ${data.quantity || 'Belirtilmedi'}</p>
          <p><strong>Süre:</strong> ${data.duration || 'Belirtilmedi'} Gün</p>
          <p><strong>Firma:</strong> ${data.company}</p>
        </div>
        
        <p>Sizinle en kısa sürede iletişime geçeceğiz.</p>
      </div>
      <div class="footer">
        <p>VR Kiralama | Kurumsal VR Çözümleri</p>
      </div>
    </body>
    </html>
  `
});

const getRentalRequestAdminEmail = (data) => ({
  to: process.env.ADMIN_EMAIL,
  from: process.env.FROM_EMAIL,
  subject: `🎮 Yeni Kiralama Talebi - ${data.company} (#${data.rentalId})`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 15px; border-radius: 8px 8px 0 0; }
        .content { background: #fff; padding: 20px; border: 1px solid #ddd; }
        .btn { display: inline-block; background: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 15px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2 style="margin: 0;">🎮 Yeni Kiralama Talebi</h2>
        </div>
        <div class="content">
          <p><strong>Talep No:</strong> ${data.rentalId}</p>
          <p><strong>Tarih:</strong> ${new Date().toLocaleString('tr-TR')}</p>
          
          <h3>Müşteri</h3>
          <p><strong>${data.fullName}</strong> - ${data.company}</p>
          <p>📧 ${data.email} | 📞 ${data.phone}</p>
          
          <h3>Kiralama Detayları</h3>
          <p>Ürün: <strong>${data.productName || 'Belirtilmedi'}</strong></p>
          <p>Adet: <strong>${data.quantity}</strong> | Süre: <strong>${data.duration} Gün</strong></p>
          
          <h3>Mesaj</h3>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 6px;">
            ${data.message || 'Mesaj girilmedi.'}
          </div>
          
          <a href="${process.env.SITE_URL || 'https://vrservis.com'}/admin" class="btn">Admin Paneline Git →</a>
        </div>
      </div>
    </body>
    </html>
  `
});

// Send email functions
export const sendServiceRequestEmails = async (data) => {
  try {
    // Send to customer
    await sgMail.send(getServiceRequestCustomerEmail(data));
    console.log(`✉️ Customer email sent to ${data.email}`);

    // Send to admin
    await sgMail.send(getServiceRequestAdminEmail(data));
    console.log(`✉️ Admin notification sent`);

    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    // Don't throw - email failure shouldn't break the request
    return { success: false, error: error.message };
  }
};

export const sendRentalRequestEmails = async (data) => {
  try {
    // Send to customer
    await sgMail.send(getRentalRequestCustomerEmail(data));
    console.log(`✉️ Customer email sent to ${data.email}`);

    // Send to admin
    await sgMail.send(getRentalRequestAdminEmail(data));
    console.log(`✉️ Admin notification sent`);

    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: error.message };
  }
};

// Status update emails
export const sendDeviceReceivedEmail = async (data) => {
  try {
    await sgMail.send(getDeviceReceivedEmail(data));
    console.log(`✉️ Device received email sent to ${data.email}`);
    return { success: true };
  } catch (error) {
    console.error('Device received email error:', error);
    return { success: false, error: error.message };
  }
};

export const sendPriceQuoteEmail = async (data) => {
  try {
    await sgMail.send(getPriceQuoteEmail(data));
    console.log(`✉️ Price quote email sent to ${data.email}`);
    return { success: true };
  } catch (error) {
    console.error('Price quote email error:', error);
    return { success: false, error: error.message };
  }
};

export default sgMail;

