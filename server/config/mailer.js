import nodemailer from 'nodemailer';

let transporter = null;

if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendBookingNotification(booking) {
  const ariEmail = process.env.ADMIN_EMAIL || 'ari@smith-illusion.co.uk';
  const clientEmail = booking.email;

  const subjectAri = `[SEALED INQUIRY] New Mind-Reading & Illusion Booking from ${booking.name}`;
  const subjectClient = `[CONFIDENTIAL] Your Private Inquiry with Ari Smith | ${booking.eventDate}`;

  const htmlAri = `
    <div style="background-color: #080808; color: #E2E8F0; padding: 24px; font-family: serif; border: 1px solid #4A5568;">
      <h2 style="color: #D97706; margin-bottom: 8px;">New Performance Inquiry</h2>
      <p style="color: #94A3B8;">A mind-reading / illusion consultation has been sealed for review.</p>
      <hr style="border-color: #334155; margin: 16px 0;" />
      <p><strong>Client:</strong> ${booking.name}</p>
      <p><strong>Email:</strong> ${booking.email}</p>
      <p><strong>Phone:</strong> ${booking.phone}</p>
      <p><strong>Date Requested:</strong> ${booking.eventDate}</p>
      <p><strong>Act / Format:</strong> ${booking.eventType}</p>
      <p><strong>Venue & City:</strong> ${booking.venueCity}</p>
      <p><strong>Guest Count:</strong> ${booking.guestCount} attendees</p>
      <p><strong>Budget Range:</strong> ${booking.budgetRange || 'Bespoke'}</p>
      <p><strong>Estimated Quote:</strong> ${booking.priceQuote}</p>
      <p><strong>Notes:</strong> ${booking.specialRequests || 'None provided'}</p>
    </div>
  `;

  const htmlClient = `
    <div style="background-color: #080808; color: #E2E8F0; padding: 24px; font-family: serif; border: 1px solid #4A5568;">
      <h2 style="color: #E2E8F0; letter-spacing: 2px;">ARI SMITH | ILLUSIONIST & MIND READER</h2>
      <p style="color: #94A3B8; font-style: italic;">"Reality is merely an agreed-upon illusion."</p>
      <hr style="border-color: #334155; margin: 16px 0;" />
      <p>Dear ${booking.name},</p>
      <p>Your inquiry for <strong>${booking.eventDate}</strong> in <strong>${booking.venueCity}</strong> has been received by Ari's private concierge.</p>
      <p>Format: <em>${booking.eventType}</em> (${booking.guestCount} guests).</p>
      <p>Ari reviews each engagement personally to ensure the environment permits the highest caliber of psychological illusions.</p>
      <p>You will receive a confidential response and performance rider within 24 hours.</p>
      <br/>
      <p style="color: #94A3B8; font-size: 13px;">Ari Smith Illusionist Ltd &bull; Manchester, UK &bull; London &bull; Worldwide</p>
    </div>
  `;

  if (transporter) {
    try {
      await transporter.sendMail({
        from: '"Ari Smith Concierge" <concierge@arismithmagic.com>',
        to: ariEmail,
        subject: subjectAri,
        html: htmlAri
      });
      await transporter.sendMail({
        from: '"Ari Smith Concierge" <concierge@arismithmagic.com>',
        to: clientEmail,
        subject: subjectClient,
        html: htmlClient
      });
      console.log(`[Email] Notifications sent successfully for ${booking.email}`);
    } catch (err) {
      console.warn('[Email] SMTP send failed:', err.message);
    }
  } else {
    console.log(`[Email Simulated] Booking confirmation created for: ${booking.email} (Date: ${booking.eventDate})`);
  }
}
