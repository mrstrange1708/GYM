import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendReminderEmail = async (to: string) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: '💪 Exercise Reminder - Get Moving!',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 16px;">
        <div style="background: rgba(255,255,255,0.95); border-radius: 12px; padding: 30px; text-align: center;">
          <h1 style="color: #764ba2; margin-bottom: 10px;">🏋️ Hey Champion!</h1>
          <p style="font-size: 18px; color: #333; margin-bottom: 20px;">
            You haven't exercised today yet!
          </p>
          <div style="font-size: 48px; margin: 20px 0;">💪</div>
          <p style="font-size: 16px; color: #666; margin-bottom: 20px;">
            "Don't chase soreness. Chase consistency."
          </p>
          <p style="font-size: 20px; color: #764ba2; font-weight: bold;">
            Exercise bro! Power lies in YOU! 
          </p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="font-size: 12px; color: #999;">
              This reminder was sent because you haven't logged a workout today.
            </p>
          </div>
        </div>
      </div>
    `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('✉️ Reminder email sent to:', to);
        return true;
    } catch (error) {
        console.error('❌ Failed to send email:', error);
        return false;
    }
};
