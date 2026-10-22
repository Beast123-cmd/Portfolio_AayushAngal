import express from 'express';
import Contact from '../models/Contact.js';
import { validateContactForm } from '../utils/validation.js';
import { sendNotificationEmail, sendConfirmationEmail } from '../utils/email.js';

const router = express.Router();

// POST: Submit contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body ?? {};

    // Validate input
    const validation = validateContactForm({ name, email, message });
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    if (Contact.db.readyState !== 1) {
      const fallbackContact = {
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        createdAt: new Date(),
      };
      const emailDelivered = await sendNotificationEmail(fallbackContact);
      if (!emailDelivered) {
        return res.status(503).json({ error: 'Contact form is temporarily unavailable. Please email me directly.' });
      }

      void sendConfirmationEmail(fallbackContact.email, fallbackContact.name);
      return res.status(201).json({
        success: true,
        message: 'Your message was sent by email. Thank you!',
      });
    }

    // Create new contact document
    const contact = new Contact({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    await contact.save();

    // Send emails in background (don't wait for them)
    Promise.all([
      sendNotificationEmail(contact),
      sendConfirmationEmail(contact.email, contact.name)
    ]).catch(err => console.error('Email sending error:', err));

    res.status(201).json({
      success: true,
      message: 'Your message has been received. Thank you!',
      contactId: contact._id
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Failed to save contact information' });
  }
});

export default router;
