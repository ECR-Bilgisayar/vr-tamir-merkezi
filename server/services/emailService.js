const getRentalRequestCustomerEmail = (data) => ({
  to: data.email,
  bcc: BCC_EMAILS,
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
          <p class="greeting">Sayın <strong>${data.fullName}</strong>,</p>
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
            <div class="info-row">
              <span class="info-label">İletişim</span>
              <span class="info-value">${data.email}</span>
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
