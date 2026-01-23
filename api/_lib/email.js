import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendServiceRequestEmails = async (data) => {
  try {
    // Customer email
    await sgMail.send({
      to: data.email,
      cc: process.env.BCC_EMAIL,
      from: process.env.FROM_EMAIL,
      subject: `VR Tamir Merkezi - Servis Talebiniz Alındı (#${data.serviceId})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #8b5cf6, #3b82f6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1>🛠️ Servis Talebiniz Alındı</h1>
          </div>
          <div style="background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0;">
            <p>Sayın <strong>${data.fullName}</strong>,</p>
            <p>Servis talebiniz başarıyla oluşturulmuştur.</p>
            <div style="background: #f3e8ff; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <strong style="font-size: 20px; color: #8b5cf6;">Takip No: ${data.serviceId}</strong>
            </div>
            <p><strong>Cihaz:</strong> ${data.device}</p>
            <p><strong>Arıza:</strong> ${data.faultType}</p>
            <p><strong>Teslimat:</strong> ${data.deliveryMethod === 'kargo' ? 'Kargo ile' : 'Elden Teslim'}</p>
            ${data.deliveryMethod === 'kargo' ? `
            <div style="background: #fffbeb; padding: 15px; border-left: 4px solid #f59e0b; margin: 20px 0;">
              <p><strong>📦 Kargo Adresi:</strong></p>
              <p>İstoç, 32. Ada No:76-78, Bağcılar, İstanbul</p>
              <p style="color: #92400e; font-size: 14px;"><em>Not: Kargo ücretleri müşteriye aittir.</em></p>
            </div>
            ` : ''}
          </div>
        </div>
      `
    });

    // Admin email
    await sgMail.send({
      to: process.env.ADMIN_EMAIL,
      from: process.env.FROM_EMAIL,
      subject: `🔔 Yeni Servis Talebi - ${data.fullName} (#${data.serviceId})`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Yeni Servis Talebi</h2>
          <p><strong>Takip No:</strong> ${data.serviceId}</p>
          <p><strong>Müşteri:</strong> ${data.fullName}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Telefon:</strong> ${data.phone}</p>
          <p><strong>Cihaz:</strong> ${data.device}</p>
          <p><strong>Arıza:</strong> ${data.faultType}</p>
          <p><strong>Açıklama:</strong> ${data.faultDescription || '-'}</p>
        </div>
      `
    });

    return { success: true };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error: error.message };
  }
};

export const sendRentalRequestEmails = async (data) => {
  try {
    await sgMail.send({
      to: data.email,
      cc: process.env.BCC_EMAIL,
      from: process.env.FROM_EMAIL,
      subject: `VR Kiralama - Talebiniz Alındı (#${data.rentalId})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #8b5cf6, #3b82f6); color: white; padding: 30px; text-align: center;">
            <h1>🎮 Kiralama Talebiniz Alındı</h1>
          </div>
          <div style="padding: 30px;">
            <p>Sayın <strong>${data.fullName}</strong>,</p>
            <p>Kiralama talebiniz alınmıştır. En kısa sürede sizinle iletişime geçeceğiz.</p>
            <p><strong>Talep No:</strong> ${data.rentalId}</p>
          </div>
        </div>
      `
    });

    await sgMail.send({
      to: process.env.ADMIN_EMAIL,
      from: process.env.FROM_EMAIL,
      subject: `🎮 Yeni Kiralama Talebi - ${data.company} (#${data.rentalId})`,
      html: `
        <p><strong>Talep No:</strong> ${data.rentalId}</p>
        <p><strong>Müşteri:</strong> ${data.fullName} - ${data.company}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Telefon:</strong> ${data.phone}</p>
        <p><strong>Ürün:</strong> ${data.productName || '-'}</p>
        <p><strong>Adet:</strong> ${data.quantity} | <strong>Süre:</strong> ${data.duration} Gün</p>
      `
    });

    return { success: true };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error: error.message };
  }
};
