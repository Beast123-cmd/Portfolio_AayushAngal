import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// GET: Download resume
router.get('/download', (req, res) => {
  try {
    // Path to your resume file in the public folder
    // You can store it as public/resume.pdf or similar
    const resumePath = join(__dirname, '../../public/resume.pdf');

    // Check if file exists
    if (!fs.existsSync(resumePath)) {
      return res.status(404).json({ 
        error: 'Resume file not found. Please upload your resume.pdf to the public folder.' 
      });
    }

    // Set headers for download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="Aayush_Angal_Resume.pdf"');

    // Send file
    res.sendFile(resumePath);
  } catch (error) {
    console.error('Resume download error:', error);
    res.status(500).json({ error: 'Failed to download resume' });
  }
});

export default router;
