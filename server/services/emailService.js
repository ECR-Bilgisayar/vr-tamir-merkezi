import sgMail from '@sendgrid/mail';

// API key kontrolü ve set etme
if (!process.env.SENDGRID_API_KEY) {
  console.error('❌ SENDGRID_API_KEY is not defined!');
} else {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  console.log('✅ SendGrid API key set');
}

// BCC Email addresses
const BBCC_EMAILS = [process.env.BCC_EMAIL].filter(Boolean);

// =====================
// SERVICE REQUEST EMAILS
// =====================

const getServiceRequestCustomerEmail = (data) => ({
  to: data.email,
  bcc: BBCC_EMAILS,
  from: process.env.FROM_EMAIL,
  subject: `VR Tamir Merkezi - Servis Talebiniz Alındı (#${data.serviceId})`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; background: #f5f5f5; }
        .container { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); margin: 20px; }
        .header { background: linear-gradient(135deg, #1e293b, #334155); color: white; padding: 40px 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
        .header .subtitle { color: #94a3b8; font-size: 14px; margin-top: 8px; }
        .content { padding: 30px; }
        .greeting { font-size: 16px; margin-bottom: 20px; }
        .info-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 24px; margin: 24px 0; }
        .info-card-header { font-size: 14px; font-weight: 600; color: #8b5cf6; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 2px solid #8b5cf6; }
        .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0; }
        .info-row:last-child { border-bottom: none; }
        .info-label { color: #64748b; font-size: 14px; }
        .info-value { color: #1e293b; font-weight: 600; font-size: 14px; }
        .tracking-box { background: linear-gradient(135deg, #8b5cf6, #6366f1); color: white; padding: 20px; border-radius: 10px; text-align: center; margin: 24px 0; }
        .tracking-label { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9; }
        .tracking-number { font-size: 28px; font-weight: 700; margin-top: 8px; letter-spacing: 2px; }
        .message-box { background: #fffbeb; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 0 8px 8px 0; margin: 24px 0; }
        .message-box p { margin: 0; color: #92400e; font-size: 14px; }
        .message-box.info { background: #eff6ff; border-left-color: #3b82f6; }
        .message-box.info p { color: #1e40af; }
        .message-box.success { background: #f0fdf4; border-left-color: #22c55e; }
        .message-box.success p { color: #166534; }
        .steps { margin: 24px 0; }
        .steps-header { font-size: 14px; font-weight: 600; color: #1e293b; margin-bottom: 12px; }
        .step { display: flex; align-items: center; padding: 8px 0; }
        .step-number { width: 24px; height: 24px; background: #8b5cf6; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; margin-right: 12px; }
        .step-text { color: #475569; font-size: 14px; }
        .btn { display: inline-block; background: linear-gradient(135deg, #8b5cf6, #6366f1); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 16px; }
        .footer { background: #1e293b; color: #94a3b8; padding: 24px; text-align: center; }
        .footer-brand { color: white; font-weight: 600; font-size: 16px; margin-bottom: 8px; }
        .footer-text { font-size: 12px; margin: 4px 0; }
        .footer-contact { margin-top: 16px; padding-top: 16px; border-top: 1px solid #334155; }
        .footer-contact a { color: #8b5cf6; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🛠️ Servis Talebiniz Alındı</h1>
          <div class="subtitle">VR Tamir Merkezi - Profesyonel VR Servis Hizmetleri</div>
        </div>
        
        <div class="content">
          <p class="greeting">Sayın <strong>${data.fullName}</strong>,</p>
          <p>Servis talebiniz başarıyla oluşturulmuştur. Ekibimiz en kısa sürede sizinle iletişime geçecektir.</p>
          
          <div class="tracking-box">
            <div class="tracking-label">Takip Numaranız</div>
            <div class="tracking-number">${data.serviceId}</div>
          </div>
          
          <div class="info-card">
            <div class="info-card-header">📋 Talep Özeti</div>
            <div class="info-row">
              <span class="info-label">Cihaz</span>
              <span class="info-value">${data.device}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Arıza Tipi</span>
              <span class="info-value">${data.faultType}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Teslimat Yöntemi</span>
              <span class="info-value">${data.deliveryMethod === 'kargo' ? 'Kargo ile Gönderim' : 'Elden Teslim'}</span>
            </div>
          </div>
          
          ${data.deliveryMethod === 'kargo' ? `
          <div class="message-box">
            <p><strong>📦 Kargo Adresi:</strong> İstoç, 32. Ada No:76-78, Bağcılar, İstanbul</p>
            <p style="margin-top: 8px; font-size: 13px;">Not: Kargo ücretleri müşteriye aittir.</p>
          </div>
          ` : `
          <div class="message-box success">
            <p><strong>📍 Elden Teslim Adresi:</strong> İstoç, 32. Ada No:76-78, Bağcılar, İstanbul</p>
            <p style="margin-top: 8px; font-size: 13px;">Hafta içi 09:00 - 18:00 arası teslim alınmaktadır.</p>
          </div>
          `}
          
          <div class="steps">
            <div class="steps-header">Sonraki Adımlar</div>
            <div class="step"><span class="step-number">1</span><span class="step-text">Ekibimiz talebinizi inceleyecek</span></div>
            <div class="step"><span class="step-number">2</span><span class="step-text">Sizinle iletişime geçilecek</span></div>
            <div class="step"><span class="step-number">3</span><span class="step-text">Cihazınız teslim alınacak</span></div>
            <div class="step"><span class="step-number">4</span><span class="step-text">Arıza tespiti ve fiyat teklifi sunulacak</span></div>
            <div class="step"><span class="step-number">5</span><span class="step-text">Onayınız sonrası onarım yapılacak</span></div>
          </div>
          
          <center>
            <a href="${process.env.SITE_URL || 'https://vrtamirmerkezi.com'}/takip" class="btn">Durumu Takip Et →</a>
          </center>
        </div>
        
        <div class="footer">
          <div class="footer-brand">VR Tamir Merkezi</div>
          <div class="footer-text">Profesyonel VR Servis & Onarım Hizmetleri</div>
          <div class="footer-contact">
            <div class="footer-text">📞 +90 850 228 7574</div>
            <div class="footer-text">📧 <a href="mailto:vr@vrtamirmerkezi.com">vr@vrtamirmerkezi.com</a></div>
            <div class="footer-text">🌐 <a href="https://vrtamirmerkezi.com">vrtamirmerkezi.com</a></div>
          </div>
        </div>
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
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
        .container { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); margin: 20px; }
        .header { background: #dc2626; color: white; padding: 24px; text-align: center; }
        .header h1 { margin: 0; font-size: 20px; }
        .content { padding: 24px; }
        .info-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0; }
        .info-card-header { font-size: 13px; font-weight: 600; color: #64748b; text-transform: uppercase; margin-bottom: 12px; }
        .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
        .info-row:last-child { border-bottom: none; }
        .info-label { color: #64748b; font-size: 14px; }
        .info-value { color: #1e293b; font-weight: 600; font-size: 14px; }
        .description { background: #f1f5f9; padding: 12px; border-radius: 6px; margin-top: 16px; }
        .btn { display: inline-block; background: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🛠️ Yeni Servis Talebi</h1>
        </div>
        <div class="content">
          <p><strong>Takip No:</strong> ${data.serviceId}</p>
          <p><strong>Tarih:</strong> ${new Date().toLocaleString('tr-TR')}</p>
          
          <div class="info-card">
            <div class="info-card-header">Müşteri Bilgileri</div>
            <div class="info-row"><span class="info-label">Ad Soyad</span><span class="info-value">${data.fullName}</span></div>
            <div class="info-row"><span class="info-label">E-posta</span><span class="info-value">${data.email}</span></div>
            <div class="info-row"><span class="info-label">Telefon</span><span class="info-value">${data.phone}</span></div>
            <div class="info-row"><span class="info-label">Aranmak İstiyor</span><span class="info-value">${data.callbackPreference ? 'Evet ✓' : 'Hayır'}</span></div>
          </div>
          
          <div class="info-card">
            <div class="info-card-header">Servis Detayları</div>
            <div class="info-row"><span class="info-label">Cihaz</span><span class="info-value">${data.device}</span></div>
            <div class="info-row"><span class="info-label">Arıza Tipi</span><span class="info-value">${data.faultType}</span></div>
            <div class="info-row"><span class="info-label">Teslimat</span><span class="info-value">${data.deliveryMethod === 'kargo' ? '📦 Kargo' : '🏢 Elden Teslim'}</span></div>
          </div>
          
          <div class="description">
            <strong>Arıza Açıklaması:</strong><br>
            ${data.faultDescription || 'Açıklama girilmedi.'}
          </div>
          
          <center>
            <a href="${process.env.SITE_URL || 'https://vrtamirmerkezi.com'}/admin" class="btn">Admin Paneline Git →</a>
          </center>
        </div>
      </div>
    </body>
    </html>
  `
});

const getDeviceReceivedEmail = (data) => ({
  to: data.email,
  bcc: BBCC_EMAILS,
  from: process.env.FROM_EMAIL,
  subject: `VR Tamir Merkezi - Cihazınız Teslim Alındı (#${data.serviceId})`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; background: #f5f5f5; }
        .container { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); margin: 20px; }
        .header { background: linear-gradient(135deg, #1e293b, #334155); color: white; padding: 40px 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
        .header .subtitle { color: #94a3b8; font-size: 14px; margin-top: 8px; }
        .content { padding: 30px; }
        .info-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 24px; margin: 24px 0; }
        .info-card-header { font-size: 14px; font-weight: 600; color: #8b5cf6; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 2px solid #8b5cf6; }
        .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0; }
        .info-row:last-child { border-bottom: none; }
        .info-label { color: #64748b; font-size: 14px; }
        .info-value { color: #1e293b; font-weight: 600; font-size: 14px; }
        .tracking-box { background: linear-gradient(135deg, #8b5cf6, #6366f1); color: white; padding: 20px; border-radius: 10px; text-align: center; margin: 24px 0; }
        .tracking-label { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9; }
        .tracking-number { font-size: 28px; font-weight: 700; margin-top: 8px; letter-spacing: 2px; }
        .message-box { background: #f0fdf4; border-left: 4px solid #22c55e; padding: 16px; border-radius: 0 8px 8px 0; margin: 24px 0; }
        .message-box p { margin: 0; color: #166534; font-size: 14px; }
        .steps { margin: 24px 0; }
        .steps-header { font-size: 14px; font-weight: 600; color: #1e293b; margin-bottom: 12px; }
        .step { display: flex; align-items: center; padding: 8px 0; }
        .step-number { width: 24px; height: 24px; background: #8b5cf6; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; margin-right: 12px; }
        .step-text { color: #475569; font-size: 14px; }
        .btn { display: inline-block; background: linear-gradient(135deg, #8b5cf6, #6366f1); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 16px; }
        .footer { background: #1e293b; color: #94a3b8; padding: 24px; text-align: center; }
        .footer-brand { color: white; font-weight: 600; font-size: 16px; margin-bottom: 8px; }
        .footer-text { font-size: 12px; margin: 4px 0; }
        .footer-contact { margin-top: 16px; padding-top: 16px; border-top: 1px solid #334155; }
        .footer-contact a { color: #8b5cf6; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📦 Cihazınız Teslim Alındı</h1>
          <div class="subtitle">VR Tamir Merkezi - Profesyonel VR Servis Hizmetleri</div>
        </div>
        
        <div class="content">
          <p>Sayın <strong>${data.fullName}</strong>,</p>
          <p>Cihazınız servis merkezimize başarıyla teslim alınmıştır. Arıza tespiti işlemi başlamıştır.</p>
          
          <div class="tracking-box">
            <div class="tracking-label">Takip Numaranız</div>
            <div class="tracking-number">${data.serviceId}</div>
          </div>
          
          <div class="info-card">
            <div class="info-card-header">📋 Cihaz Bilgileri</div>
            <div class="info-row">
              <span class="info-label">Cihaz</span>
              <span class="info-value">${data.device}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Arıza Tipi</span>
              <span class="info-value">${data.faultType}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Teslim Tarihi</span>
              <span class="info-value">${new Date().toLocaleString('tr-TR')}</span>
            </div>
          </div>
          
          <div class="message-box">
            <p><strong>✅ Cihazınız güvende!</strong> Uzman ekibimiz arıza tespiti yapacak ve size fiyat teklifi sunacaktır.</p>
          </div>
          
          <div class="steps">
            <div class="steps-header">Sonraki Adımlar</div>
            <div class="step"><span class="step-number">1</span><span class="step-text">Arıza tespiti yapılacak</span></div>
            <div class="step"><span class="step-number">2</span><span class="step-text">Size fiyat teklifi sunulacak</span></div>
            <div class="step"><span class="step-number">3</span><span class="step-text">Onayınız sonrası onarım başlayacak</span></div>
          </div>
          
          <center>
            <a href="${process.env.SITE_URL || 'https://vrtamirmerkezi.com'}/takip" class="btn">Durumu Takip Et →</a>
          </center>
        </div>
        
        <div class="footer">
          <div class="footer-brand">VR Tamir Merkezi</div>
          <div class="footer-text">Profesyonel VR Servis & Onarım Hizmetleri</div>
          <div class="footer-contact">
            <div class="footer-text">📞 +90 850 228 7574</div>
            <div class="footer-text">📧 <a href="mailto:vr@vrtamirmerkezi.com">vr@vrtamirmerkezi.com</a></div>
            <div class="footer-text">🌐 <a href="https://vrtamirmerkezi.com">vrtamirmerkezi.com</a></div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
});

const getPriceQuoteEmail = (data) => ({
  to: data.email,
  bcc: BBCC_EMAILS,
  from: process.env.FROM_EMAIL,
  subject: `VR Tamir Merkezi - Fiyat Teklifiniz Hazır (#${data.serviceId})`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; background: #f5f5f5; }
        .container { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); margin: 20px; }
        .header { background: linear-gradient(135deg, #1e293b, #334155); color: white; padding: 40px 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
        .header .subtitle { color: #94a3b8; font-size: 14px; margin-top: 8px; }
        .content { padding: 30px; }
        .info-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 24px; margin: 24px 0; }
        .info-card-header { font-size: 14px; font-weight: 600; color: #8b5cf6; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 2px solid #8b5cf6; }
        .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0; }
        .info-row:last-child { border-bottom: none; }
        .info-label { color: #64748b; font-size: 14px; }
        .info-value { color: #1e293b; font-weight: 600; font-size: 14px; }
        .tracking-box { background: linear-gradient(135deg, #8b5cf6, #6366f1); color: white; padding: 20px; border-radius: 10px; text-align: center; margin: 24px 0; }
        .tracking-label { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9; }
        .tracking-number { font-size: 28px; font-weight: 700; margin-top: 8px; letter-spacing: 2px; }
        .price-box { background: linear-gradient(135deg, #22c55e, #16a34a); color: white; padding: 24px; border-radius: 10px; text-align: center; margin: 24px 0; }
        .price-label { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9; }
        .price-value { font-size: 36px; font-weight: 700; margin-top: 8px; }
        .message-box { background: #fffbeb; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 0 8px 8px 0; margin: 24px 0; }
        .message-box p { margin: 0; color: #92400e; font-size: 14px; }
        .message-box.info { background: #eff6ff; border-left-color: #3b82f6; }
        .message-box.info p { color: #1e40af; }
        .btn { display: inline-block; background: linear-gradient(135deg, #8b5cf6, #6366f1); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 16px; }
        .footer { background: #1e293b; color: #94a3b8; padding: 24px; text-align: center; }
        .footer-brand { color: white; font-weight: 600; font-size: 16px; margin-bottom: 8px; }
        .footer-text { font-size: 12px; margin: 4px 0; }
        .footer-contact { margin-top: 16px; padding-top: 16px; border-top: 1px solid #334155; }
        .footer-contact a { color: #8b5cf6; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>💰 Fiyat Teklifiniz Hazır</h1>
          <div class="subtitle">VR Tamir Merkezi - Profesyonel VR Servis Hizmetleri</div>
        </div>
        
        <div class="content">
          <p>Sayın <strong>${data.fullName}</strong>,</p>
          <p>Cihazınızın arıza tespiti tamamlanmış ve fiyat teklifiniz hazırlanmıştır.</p>
          
          <div class="tracking-box">
            <div class="tracking-label">Takip Numaranız</div>
            <div class="tracking-number">${data.serviceId}</div>
          </div>
          
          <div class="info-card">
            <div class="info-card-header">📋 Arıza Tespiti</div>
            <div class="info-row">
              <span class="info-label">Cihaz</span>
              <span class="info-value">${data.device}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Tespit Edilen Arıza</span>
              <span class="info-value">${data.faultType}</span>
            </div>
          </div>
          
          <div class="price-box">
            <div class="price-label">Onarım Ücreti</div>
            <div class="price-value">₺${data.priceQuote ? Number(data.priceQuote).toLocaleString('tr-TR') : '0'}</div>
          </div>
          
          ${data.notes ? `
          <div class="message-box info">
            <p><strong>📝 Açıklama:</strong> ${data.notes}</p>
          </div>
          ` : ''}
          
          <div class="message-box">
            <p><strong>📞 Sonraki Adım:</strong> Onarım işleminin başlaması için lütfen bizimle iletişime geçerek teklifinizi onaylayın.</p>
          </div>
          
          <center>
            <a href="${process.env.SITE_URL || 'https://vrtamirmerkezi.com'}/takip" class="btn">Durumu Takip Et →</a>
          </center>
        </div>
        
        <div class="footer">
          <div class="footer-brand">VR Tamir Merkezi</div>
          <div class="footer-text">Profesyonel VR Servis & Onarım Hizmetleri</div>
          <div class="footer-contact">
            <div class="footer-text">📞 +90 850 228 7574</div>
            <div class="footer-text">📧 <a href="mailto:vr@vrtamirmerkezi.com">vr@vrtamirmerkezi.com</a></div>
            <div class="footer-text">🌐 <a href="https://vrtamirmerkezi.com">vrtamirmerkezi.com</a></div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
});

// =====================
// RENTAL REQUEST EMAILS
// =====================

const getRentalRequestCustomerEmail = (data) => ({
  to: data.email,
  bcc: BBCC_EMAILS,
  from: process.env.FROM_EMAIL,
  subject: `VR Tamir Merkezi - Kiralama Talebiniz Alındı (#${data.rentalId})`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; background: #f5f5f5; }
        .container { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); margin: 20px; }
        .header { background: linear-gradient(135deg, #1e293b, #334155); color: white; padding: 40px 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
        .header .subtitle { color: #94a3b8; font-size: 14px; margin-top: 8px; }
        .content { padding: 30px; }
        .info-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 24px; margin: 24px 0; }
        .info-card-header { font-size: 14px; font-weight: 600; color: #8b5cf6; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 2px solid #8b5cf6; }
        .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0; }
        .info-row:last-child { border-bottom: none; }
        .info-label { color: #64748b; font-size: 14px; }
        .info-value { color: #1e293b; font-weight: 600; font-size: 14px; }
        .tracking-box { background: linear-gradient(135deg, #8b5cf6, #6366f1); color: white; padding: 20px; border-radius: 10px; text-align: center; margin: 24px 0; }
        .tracking-label { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9; }
        .tracking-number { font-size: 28px; font-weight: 700; margin-top: 8px; letter-spacing: 2px; }
        .message-box { background: #fffbeb; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 0 8px 8px 0; margin: 24px 0; }
        .message-box p { margin: 0; color: #92400e; font-size: 14px; }
        .footer { background: #1e293b; color: #94a3b8; padding: 24px; text-align: center; }
        .footer-brand { color: white; font-weight: 600; font-size: 16px; margin-bottom: 8px; }
        .footer-text { font-size: 12px; margin: 4px 0; }
        .footer-contact { margin-top: 16px; padding-top: 16px; border-top: 1px solid #334155; }
        .footer-contact a { color: #8b5cf6; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎮 Kiralama Talebiniz Alındı</h1>
          <div class="subtitle">VR Tamir Merkezi - Kurumsal Kiralama Hizmetleri</div>
        </div>
        
        <div class="content">
          <p>Sayın <strong>${data.fullName}</strong>,</p>
          <p>Kurumsal VR kiralama talebiniz başarıyla alınmıştır. Ekibimiz en kısa sürede sizinle iletişime geçecektir.</p>
          
          <div class="tracking-box">
            <div class="tracking-label">Talep Numaranız</div>
            <div class="tracking-number">${data.rentalId}</div>
          </div>
          
          <div class="info-card">
            <div class="info-card-header">📋 Talep Özeti</div>
            <div class="info-row">
              <span class="info-label">Firma / Kurum</span>
              <span class="info-value">${data.company || '-'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Talep Edilen Ürün</span>
              <span class="info-value">${data.productName || 'Belirtilmedi'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Adet</span>
              <span class="info-value">${data.quantity || 'Belirtilmedi'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Kiralama Süresi</span>
              <span class="info-value">${data.duration ? data.duration + ' Gün' : 'Belirtilmedi'}</span>
            </div>
          </div>
          
          <div class="message-box">
            <p><strong>📞 Sonraki Adım:</strong> Uzman ekibimiz talebinizi inceleyecek ve size özel fiyat teklifi ile 24 saat içinde dönüş yapacaktır.</p>
          </div>
        </div>
        
        <div class="footer">
          <div class="footer-brand">VR Tamir Merkezi</div>
          <div class="footer-text">Profesyonel VR Çözümleri & Kurumsal Kiralama</div>
          <div class="footer-contact">
            <div class="footer-text">📞 +90 850 228 7574</div>
            <div class="footer-text">📧 <a href="mailto:vr@vrtamirmerkezi.com">vr@vrtamirmerkezi.com</a></div>
            <div class="footer-text">🌐 <a href="https://vrtamirmerkezi.com">vrtamirmerkezi.com</a></div>
          </div>
        </div>
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
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
        .container { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); margin: 20px; }
        .header { background: #2563eb; color: white; padding: 24px; text-align: center; }
        .header h1 { margin: 0; font-size: 20px; }
        .content { padding: 24px; }
        .info-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0; }
        .info-card-header { font-size: 13px; font-weight: 600; color: #64748b; text-transform: uppercase; margin-bottom: 12px; }
        .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
        .info-row:last-child { border-bottom: none; }
        .info-label { color: #64748b; font-size: 14px; }
        .info-value { color: #1e293b; font-weight: 600; font-size: 14px; }
        .description { background: #f1f5f9; padding: 12px; border-radius: 6px; margin-top: 16px; }
        .btn { display: inline-block; background: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎮 Yeni Kiralama Talebi</h1>
        </div>
        <div class="content">
          <p><strong>Talep No:</strong> ${data.rentalId}</p>
          <p><strong>Tarih:</strong> ${new Date().toLocaleString('tr-TR')}</p>
          
          <div class="info-card">
            <div class="info-card-header">Müşteri Bilgileri</div>
            <div class="info-row"><span class="info-label">Ad Soyad</span><span class="info-value">${data.fullName}</span></div>
            <div class="info-row"><span class="info-label">Firma</span><span class="info-value">${data.company}</span></div>
            <div class="info-row"><span class="info-label">E-posta</span><span class="info-value">${data.email}</span></div>
            <div class="info-row"><span class="info-label">Telefon</span><span class="info-value">${data.phone}</span></div>
          </div>
          
          <div class="info-card">
            <div class="info-card-header">Kiralama Detayları</div>
            <div class="info-row"><span class="info-label">Ürün</span><span class="info-value">${data.productName || 'Belirtilmedi'}</span></div>
            <div class="info-row"><span class="info-label">Adet</span><span class="info-value">${data.quantity || 'Belirtilmedi'}</span></div>
            <div class="info-row"><span class="info-label">Süre</span><span class="info-value">${data.duration ? data.duration + ' Gün' : 'Belirtilmedi'}</span></div>
          </div>
          
          ${data.message ? `
          <div class="description">
            <strong>Mesaj:</strong><br>
            ${data.message}
          </div>
          ` : ''}
          
          <center>
            <a href="${process.env.SITE_URL || 'https://vrtamirmerkezi.com'}/admin" class="btn">Admin Paneline Git →</a>
          </center>
        </div>
      </div>
    </body>
    </html>
  `
});

// =====================
// PURCHASE REQUEST EMAILS
// =====================

const getPurchaseCreatedCustomerEmail = (data) => ({
  to: data.email,
  bcc: BBCC_EMAILS,
  from: process.env.FROM_EMAIL,
  subject: `VR Tamir Merkezi - Siparişiniz Alındı (#${data.purchaseId})`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; background: #f5f5f5; }
        .container { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); margin: 20px; }
        .header { background: linear-gradient(135deg, #1e293b, #334155); color: white; padding: 40px 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
        .header .subtitle { color: #94a3b8; font-size: 14px; margin-top: 8px; }
        .content { padding: 30px; }
        .info-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 24px; margin: 24px 0; }
        .info-card-header { font-size: 14px; font-weight: 600; color: #8b5cf6; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 2px solid #8b5cf6; }
        .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0; }
        .info-row:last-child { border-bottom: none; }
        .info-label { color: #64748b; font-size: 14px; }
        .info-value { color: #1e293b; font-weight: 600; font-size: 14px; }
        .tracking-box { background: linear-gradient(135deg, #8b5cf6, #6366f1); color: white; padding: 20px; border-radius: 10px; text-align: center; margin: 24px 0; }
        .tracking-label { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9; }
        .tracking-number { font-size: 28px; font-weight: 700; margin-top: 8px; letter-spacing: 2px; }
        .price-box { background: linear-gradient(135deg, #22c55e, #16a34a); color: white; padding: 24px; border-radius: 10px; text-align: center; margin: 24px 0; }
        .price-label { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9; }
        .price-value { font-size: 36px; font-weight: 700; margin-top: 8px; }
        .message-box { background: #fffbeb; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 0 8px 8px 0; margin: 24px 0; }
        .message-box p { margin: 0; color: #92400e; font-size: 14px; }
        .btn { display: inline-block; background: linear-gradient(135deg, #8b5cf6, #6366f1); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 16px; }
        .footer { background: #1e293b; color: #94a3b8; padding: 24px; text-align: center; }
        .footer-brand { color: white; font-weight: 600; font-size: 16px; margin-bottom: 8px; }
        .footer-text { font-size: 12px; margin: 4px 0; }
        .footer-contact { margin-top: 16px; padding-top: 16px; border-top: 1px solid #334155; }
        .footer-contact a { color: #8b5cf6; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🛒 Siparişiniz Alındı</h1>
          <div class="subtitle">VR Tamir Merkezi - VR Hijyen Ürünleri</div>
        </div>
        
        <div class="content">
          <p>Sayın <strong>${data.fullName}</strong>,</p>
          <p>VR Hijyen Gözlük Bandı siparişiniz başarıyla alınmıştır. Dekontunuz kontrol edildikten sonra siparişiniz onaylanacaktır.</p>
          
          <div class="tracking-box">
            <div class="tracking-label">Sipariş Numaranız</div>
            <div class="tracking-number">${data.purchaseId}</div>
          </div>
          
          <div class="info-card">
            <div class="info-card-header">📋 Sipariş Özeti</div>
            <div class="info-row">
              <span class="info-label">Ürün</span>
              <span class="info-value">VR Hijyen Gözlük Bandı</span>
            </div>
            <div class="info-row">
              <span class="info-label">Adet</span>
              <span class="info-value">${data.quantity}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Teslimat Yöntemi</span>
              <span class="info-value">${data.deliveryMethod === 'kargo' ? 'Kargo ile Gönderim' : 'Elden Teslim'}</span>
            </div>
            ${data.deliveryMethod === 'kargo' && data.address ? `
            <div class="info-row">
              <span class="info-label">Teslimat Adresi</span>
              <span class="info-value">${data.address}</span>
            </div>
            ` : ''}
          </div>
          
          <div class="price-box">
            <div class="price-label">Toplam Tutar</div>
            <div class="price-value">₺${Number(data.totalPrice).toLocaleString('tr-TR')}</div>
          </div>
          
          <div class="message-box">
            <p><strong>⏳ Sonraki Adım:</strong> Ödeme dekontunuz kontrol edildikten sonra siparişiniz onaylanacak ve hazırlanmaya başlanacaktır.</p>
          </div>
          
          <center>
            <a href="${process.env.SITE_URL || 'https://vrtamirmerkezi.com'}/takip" class="btn">Siparişi Takip Et →</a>
          </center>
        </div>
        
        <div class="footer">
          <div class="footer-brand">VR Tamir Merkezi</div>
          <div class="footer-text">Profesyonel VR Çözümleri & Hijyen Ürünleri</div>
          <div class="footer-contact">
            <div class="footer-text">📞 +90 850 228 7574</div>
            <div class="footer-text">📧 <a href="mailto:vr@vrtamirmerkezi.com">vr@vrtamirmerkezi.com</a></div>
            <div class="footer-text">🌐 <a href="https://vrtamirmerkezi.com">vrtamirmerkezi.com</a></div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
});

const getPurchaseCreatedAdminEmail = (data) => ({
  to: process.env.ADMIN_EMAIL,
  from: process.env.FROM_EMAIL,
  subject: `💰 Yeni Sipariş - ${data.fullName} (#${data.purchaseId})`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
        .container { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); margin: 20px; }
        .header { background: #059669; color: white; padding: 24px; text-align: center; }
        .header h1 { margin: 0; font-size: 20px; }
        .content { padding: 24px; }
        .info-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0; }
        .info-card-header { font-size: 13px; font-weight: 600; color: #64748b; text-transform: uppercase; margin-bottom: 12px; }
        .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
        .info-row:last-child { border-bottom: none; }
        .info-label { color: #64748b; font-size: 14px; }
        .info-value { color: #1e293b; font-weight: 600; font-size: 14px; }
        .price-highlight { background: #dcfce7; color: #166534; padding: 12px; border-radius: 8px; text-align: center; font-size: 20px; font-weight: 700; margin: 16px 0; }
        .btn { display: inline-block; background: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>💰 Yeni Sipariş</h1>
        </div>
        <div class="content">
          <p><strong>Sipariş No:</strong> ${data.purchaseId}</p>
          <p><strong>Tarih:</strong> ${new Date().toLocaleString('tr-TR')}</p>
          
          <div class="info-card">
            <div class="info-card-header">Müşteri Bilgileri</div>
            <div class="info-row"><span class="info-label">Ad Soyad</span><span class="info-value">${data.fullName}</span></div>
            <div class="info-row"><span class="info-label">Fatura Tipi</span><span class="info-value">${data.invoiceType === 'corporate' ? 'Kurumsal' : 'Bireysel'}</span></div>
            <div class="info-row"><span class="info-label">E-posta</span><span class="info-value">${data.email}</span></div>
            <div class="info-row"><span class="info-label">Telefon</span><span class="info-value">${data.phone}</span></div>
            ${data.invoiceType === 'corporate' ? `
            <div class="info-row"><span class="info-label">Firma</span><span class="info-value">${data.companyName}</span></div>
            <div class="info-row"><span class="info-label">Vergi Dairesi / No</span><span class="info-value">${data.taxOffice} / ${data.taxNo}</span></div>
            ` : `
            <div class="info-row"><span class="info-label">TC Kimlik No</span><span class="info-value">${data.tcNo}</span></div>
            `}
          </div>
          
          <div class="info-card">
            <div class="info-card-header">Sipariş Detayları</div>
            <div class="info-row"><span class="info-label">Ürün</span><span class="info-value">VR Hijyen Gözlük Bandı</span></div>
            <div class="info-row"><span class="info-label">Adet</span><span class="info-value">${data.quantity}</span></div>
            <div class="info-row"><span class="info-label">Teslimat</span><span class="info-value">${data.deliveryMethod === 'kargo' ? 'Kargo' : 'Elden Teslim'}</span></div>
            ${data.address ? `<div class="info-row"><span class="info-label">Adres</span><span class="info-value">${data.address}</span></div>` : ''}
          </div>
          
          <div class="price-highlight">
            Toplam: ₺${Number(data.totalPrice).toLocaleString('tr-TR')}
          </div>
          
          <center>
            <a href="${process.env.SITE_URL || 'https://vrtamirmerkezi.com'}/admin" class="btn">Admin Paneline Git →</a>
          </center>
        </div>
      </div>
    </body>
    </html>
  `
});

const getPurchaseStatusEmail = (data) => ({
  to: data.email,
  bcc: BBCC_EMAILS,
  from: process.env.FROM_EMAIL,
  subject: `VR Tamir Merkezi - Sipariş Durumu Güncellendi (#${data.purchaseId})`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; background: #f5f5f5; }
        .container { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); margin: 20px; }
        .header { background: linear-gradient(135deg, #1e293b, #334155); color: white; padding: 40px 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
        .header .subtitle { color: #94a3b8; font-size: 14px; margin-top: 8px; }
        .content { padding: 30px; }
        .tracking-box { background: linear-gradient(135deg, #8b5cf6, #6366f1); color: white; padding: 20px; border-radius: 10px; text-align: center; margin: 24px 0; }
        .tracking-label { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9; }
        .tracking-number { font-size: 28px; font-weight: 700; margin-top: 8px; letter-spacing: 2px; }
        .status-box { padding: 20px; border-radius: 10px; text-align: center; margin: 24px 0; }
        .status-box.confirmed { background: #dcfce7; border: 2px solid #22c55e; }
        .status-box.confirmed .status-text { color: #166534; }
        .status-box.preparing { background: #dbeafe; border: 2px solid #3b82f6; }
        .status-box.preparing .status-text { color: #1e40af; }
        .status-box.shipped { background: #fef3c7; border: 2px solid #f59e0b; }
        .status-box.shipped .status-text { color: #92400e; }
        .status-box.delivered { background: #d1fae5; border: 2px solid #10b981; }
        .status-box.delivered .status-text { color: #065f46; }
        .status-box.cancelled { background: #fee2e2; border: 2px solid #ef4444; }
        .status-box.cancelled .status-text { color: #991b1b; }
        .status-label { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; }
        .status-text { font-size: 20px; font-weight: 700; margin-top: 8px; }
        .message-box { background: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px; border-radius: 0 8px 8px 0; margin: 24px 0; }
        .message-box p { margin: 0; color: #1e40af; font-size: 14px; }
        .btn { display: inline-block; background: linear-gradient(135deg, #8b5cf6, #6366f1); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 16px; }
        .footer { background: #1e293b; color: #94a3b8; padding: 24px; text-align: center; }
        .footer-brand { color: white; font-weight: 600; font-size: 16px; margin-bottom: 8px; }
        .footer-text { font-size: 12px; margin: 4px 0; }
        .footer-contact { margin-top: 16px; padding-top: 16px; border-top: 1px solid #334155; }
        .footer-contact a { color: #8b5cf6; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📦 Sipariş Durumu Güncellendi</h1>
          <div class="subtitle">VR Tamir Merkezi - VR Hijyen Ürünleri</div>
        </div>
        
        <div class="content">
          <p>Sayın <strong>${data.fullName}</strong>,</p>
          <p>Siparişinizin durumu güncellenmiştir.</p>
          
          <div class="tracking-box">
            <div class="tracking-label">Sipariş Numaranız</div>
            <div class="tracking-number">${data.purchaseId}</div>
          </div>
          
          <div class="status-box ${data.status}">
            <div class="status-label">Güncel Durum</div>
            <div class="status-text">${data.statusLabel}</div>
          </div>
          
          ${data.notes ? `
          <div class="message-box">
            <p><strong>📝 Not:</strong> ${data.notes}</p>
          </div>
          ` : ''}
          
          ${data.status === 'confirmed' ? `
          <div class="message-box">
            <p><strong>✅ Ödemeniz onaylandı!</strong> Siparişiniz hazırlanmaya başlanacaktır.</p>
          </div>
          ` : ''}
          
          ${data.status === 'shipped' ? `
          <div class="message-box">
            <p><strong>🚚 Kargoya verildi!</strong> Kargo takip numaranız SMS ile ayrıca bildirilecektir.</p>
          </div>
          ` : ''}
          
          ${data.status === 'delivered' ? `
          <div class="message-box">
            <p><strong>🎉 Teslim edildi!</strong> Bizi tercih ettiğiniz için teşekkür ederiz.</p>
          </div>
          ` : ''}
          
          <center>
            <a href="${process.env.SITE_URL || 'https://vrtamirmerkezi.com'}/takip" class="btn">Siparişi Takip Et →</a>
          </center>
        </div>
        
        <div class="footer">
          <div class="footer-brand">VR Tamir Merkezi</div>
          <div class="footer-text">Profesyonel VR Çözümleri & Hijyen Ürünleri</div>
          <div class="footer-contact">
            <div class="footer-text">📞 +90 850 228 7574</div>
            <div class="footer-text">📧 <a href="mailto:vr@vrtamirmerkezi.com">vr@vrtamirmerkezi.com</a></div>
            <div class="footer-text">🌐 <a href="https://vrtamirmerkezi.com">vrtamirmerkezi.com</a></div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
});

// =====================
// SEND EMAIL FUNCTIONS
// =====================

export const sendServiceRequestEmails = async (data) => {
  console.log('📧 Sending service request emails...');

  try {
    await sgMail.send(getServiceRequestCustomerEmail(data));
    console.log(`✅ Customer email sent to ${data.email}`);

    await sgMail.send(getServiceRequestAdminEmail(data));
    console.log(`✅ Admin notification sent`);

    return { success: true };
  } catch (error) {
    console.error('❌ Email sending error:', error.message);
    if (error.response) {
      console.error('Response body:', JSON.stringify(error.response.body));
    }
    return { success: false, error: error.message };
  }
};

export const sendRentalRequestEmails = async (data) => {
  console.log('📧 Sending rental request emails...');

  try {
    await sgMail.send(getRentalRequestCustomerEmail(data));
    console.log(`✅ Customer email sent to ${data.email}`);

    await sgMail.send(getRentalRequestAdminEmail(data));
    console.log(`✅ Admin notification sent`);

    return { success: true };
  } catch (error) {
    console.error('❌ Email sending error:', error.message);
    if (error.response) {
      console.error('Response body:', JSON.stringify(error.response.body));
    }
    return { success: false, error: error.message };
  }
};

export const sendDeviceReceivedEmail = async (data) => {
  console.log('📧 Sending device received email...');

  try {
    await sgMail.send(getDeviceReceivedEmail(data));
    console.log(`✅ Device received email sent to ${data.email}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Device received email error:', error.message);
    if (error.response) {
      console.error('Response body:', JSON.stringify(error.response.body));
    }
    return { success: false, error: error.message };
  }
};

export const sendPriceQuoteEmail = async (data) => {
  console.log('📧 Sending price quote email...');

  try {
    await sgMail.send(getPriceQuoteEmail(data));
    console.log(`✅ Price quote email sent to ${data.email}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Price quote email error:', error.message);
    if (error.response) {
      console.error('Response body:', JSON.stringify(error.response.body));
    }
    return { success: false, error: error.message };
  }
};

export const sendPurchaseCreatedEmail = async (data) => {
  console.log('📧 Sending purchase emails...');

  try {
    await sgMail.send(getPurchaseCreatedCustomerEmail(data));
    console.log(`✅ Purchase email sent to ${data.email}`);

    await sgMail.send(getPurchaseCreatedAdminEmail(data));
    console.log(`✅ Admin purchase notification sent`);

    return { success: true };
  } catch (error) {
    console.error('❌ Purchase email error:', error.message);
    if (error.response) {
      console.error('Response body:', JSON.stringify(error.response.body));
    }
    return { success: false, error: error.message };
  }
};

export const sendPurchaseStatusEmail = async (data) => {
  console.log('📧 Sending purchase status email...');

  const statusLabels = {
    pending: 'Ödeme Bekleniyor',
    confirmed: 'Ödeme Onaylandı',
    preparing: 'Hazırlanıyor',
    shipped: 'Kargoya Verildi',
    delivered: 'Teslim Edildi',
    cancelled: 'İptal Edildi'
  };

  try {
    await sgMail.send(getPurchaseStatusEmail({
      ...data,
      statusLabel: statusLabels[data.status] || data.status
    }));
    console.log(`✅ Purchase status email sent to ${data.email}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Purchase status email error:', error.message);
    if (error.response) {
      console.error('Response body:', JSON.stringify(error.response.body));
    }
    return { success: false, error: error.message };
  }
};

export default sgMail;
