import express from 'express';
import Contact from '../models/Contact.js';
import { validateContactForm } from '../utils/validation.js';
import { sendNotificationEmail, sendConfirmationEmail } from '../utils/email.js';

const router = express.Router();

// POST: Submit contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate input
    const validation = validateContactForm({ name, email, message });
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
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

    // Send emails (admin notification and user confirmation)
    await sendNotificationEmail(contact);
    await sendConfirmationEmail(contact.email, contact.name);

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

// GET: Fetch all contacts (admin only)
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

// GET: Single contact by ID
router.get('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json(contact);
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({ error: 'Failed to fetch contact' });
  }
});

// PATCH: Update contact status
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['new', 'read', 'replied'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json(contact);
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ error: 'Failed to update contact' });
  }
});

// DELETE: Delete contact
router.delete('/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ error: 'Failed to delete contact' });
  }
});

export default router;
