import { Resend } from 'resend';

// Lazy init - only creates the client when first used
let _resend: Resend | null = null;

function getResend(): Resend | null {
  if (_resend !== null) return _resend;
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    _resend = null; // Will never be set, but this ensures getResend() keeps returning null
    return null;
  }
  try {
    _resend = new Resend(key);
    return _resend;
  } catch {
    console.error('📧 Failed to initialize Resend client');
    return null;
  }
}

interface ReservationEmail {
  id: string;
  name: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  requests?: string;
}

// Simple HTML escaping to prevent injection
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function sendConfirmationEmail(reservation: ReservationEmail): Promise<void> {
  const client = getResend();
  
  if (!client) {
    console.log('📧 Email not sent (no RESEND_API_KEY configured). Would send to:', reservation.email);
    return;
  }

  const safeName = escapeHtml(reservation.name);
  const safeDate = escapeHtml(reservation.date);
  const safeTime = escapeHtml(reservation.time);
  const safeGuests = reservation.guests;
  const safeRequests = reservation.requests ? escapeHtml(reservation.requests) : '';

  try {
    await client.emails.send({
      from: 'Brew & Bean <onboarding@resend.dev>',
      to: reservation.email,
      subject: '✅ Reservation Confirmed - Brew & Bean',
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #1C130F; color: #F5F0EB; border-radius: 16px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #A67C52, #C4956A); padding: 32px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px; color: #1C130F; font-weight: 800;">☕ Brew &amp; Bean</h1>
            <p style="margin: 8px 0 0; color: #1C130F; font-size: 14px;">Reservation Confirmed</p>
          </div>
          
          <div style="padding: 32px;">
            <p style="font-size: 16px; margin: 0 0 4px;">Hi <strong>${safeName}</strong>,</p>
            <p style="color: #C4956A; font-size: 14px; margin: 0 0 24px;">Your table is ready. Here's what we've got planned:</p>
            
            <div style="background: #281C16; border: 1px solid rgba(166,124,82,0.2); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #A67C52; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Date</td>
                  <td style="padding: 8px 0; text-align: right; font-size: 14px;">${safeDate}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #A67C52; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; border-top: 1px solid rgba(166,124,82,0.1);">Time</td>
                  <td style="padding: 8px 0; text-align: right; font-size: 14px; border-top: 1px solid rgba(166,124,82,0.1);">${safeTime}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #A67C52; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; border-top: 1px solid rgba(166,124,82,0.1);">Guests</td>
                  <td style="padding: 8px 0; text-align: right; font-size: 14px; border-top: 1px solid rgba(166,124,82,0.1);">${safeGuests}</td>
                </tr>
                ${safeRequests ? `
                <tr>
                  <td style="padding: 8px 0; color: #A67C52; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; border-top: 1px solid rgba(166,124,82,0.1);">Special Requests</td>
                  <td style="padding: 8px 0; text-align: right; font-size: 14px; font-style: italic; border-top: 1px solid rgba(166,124,82,0.1);">${safeRequests}</td>
                </tr>` : ''}
              </table>
            </div>
            
            <p style="color: #999; font-size: 12px; text-align: center; margin: 0 0 16px;">
              Need to make changes? Call us at <a href="tel:+15035551234" style="color: #C4956A;">(503) 555-1234</a>
            </p>
            
            <div style="text-align: center; padding-top: 16px; border-top: 1px solid rgba(166,124,82,0.15);">
              <p style="color: #666; font-size: 11px; margin: 0;">
                Brew &amp; Bean Coffee Co. &bull; 245 NW 12th Avenue, Portland, OR 97209
              </p>
            </div>
          </div>
        </div>
      `,
    });
    console.log(`📧 Confirmation email sent to ${reservation.email}`);
  } catch (err) {
    console.error('📧 Failed to send confirmation email:', err);
  }
}
