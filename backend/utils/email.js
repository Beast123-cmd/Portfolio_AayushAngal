import nodemailer from 'nodemailer';

// Create transporter lazily to ensure env vars are loaded
let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }
  return transporter;
};

export const sendNotificationEmail = async (contact) => {
  try {
    // Skip if email credentials not configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.log('📧 Email service not configured. Configure EMAIL_USER and EMAIL_PASSWORD in .env');
      return;
    }

    // Send email to yourself (admin)
    await getTransporter().sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Portfolio Contact: ${contact.name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${contact.name}</p>
        <p><strong>Email:</strong> ${contact.email}</p>
        <p><strong>Message:</strong></p>
        <p>${contact.message.replace(/\n/g, '<br>')}</p>
        <hr>
        <small>Submitted on: ${new Date(contact.createdAt).toLocaleString()}</small>
      `
    });

    console.log('✅ Notification email sent to admin');
  } catch (error) {
    console.error('⚠️ Failed to send email:', error.message);
    // Don't throw - let the contact still be saved even if email fails
  }
};

export const sendConfirmationEmail = async (email, name) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.log('📧 Email credentials not configured for confirmation email');
      return;
    }

    await getTransporter().sendMail({
      from: `"Aayush Angal" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Thank you for reaching out!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">Hello ${name},</h2>
          
          <p style="color: #555; line-height: 1.6;">
            Thank you for reaching out and for your interest in my profile. I truly appreciate you taking the time to connect.
          </p>
          
          <p style="color: #555; line-height: 1.6;">
            I have received your message successfully and will review it in detail. I will get back to you at the earliest with a proper response.
          </p>
          
          <p style="color: #555; line-height: 1.6;">
            Looking forward to discussing potential opportunities.
          </p>
          
          <br>
          
          <p style="color: #333; margin-bottom: 5px;"><strong>Kind regards,</strong></p>
          <p style="color: #333; margin: 0;"><strong>Aayush Angal</strong></p>
          <p style="color: #666; margin: 5px 0;">AI & Machine Learning Engineer</p>
          
          <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #eee;">
            <p style="color: #888; font-size: 14px; margin: 5px 0;">
              🌐 Portfolio: <a href="https://aayushangal.dev" style="color: #6366f1;">aayushangal.dev</a>
            </p>
            <p style="color: #888; font-size: 14px; margin: 5px 0;">
              💼 LinkedIn: <a href="https://linkedin.com/in/aayushangal" style="color: #6366f1;">linkedin.com/in/aayushangal</a>
            </p>
            <p style="color: #888; font-size: 14px; margin: 5px 0;">
              🐙 GitHub: <a href="https://github.com/Beast123-cmd" style="color: #6366f1;">github.com/Beast123-cmd</a>
            </p>
          </div>
        </div>
      `
    });

    console.log('✅ Confirmation email sent to user:', email);
  } catch (error) {
    console.error('⚠️ Failed to send confirmation email:', error.message);
  }
};
