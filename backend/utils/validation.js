export const validateContactForm = ({ name, email, message }) => {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Name is required' };
  }

  if (name.trim().length > 100) {
    return { valid: false, error: 'Name must be less than 100 characters' };
  }

  if (!email || email.trim().length === 0) {
    return { valid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { valid: false, error: 'Invalid email address' };
  }

  if (email.trim().length > 255) {
    return { valid: false, error: 'Email must be less than 255 characters' };
  }

  if (!message || message.trim().length === 0) {
    return { valid: false, error: 'Message is required' };
  }

  if (message.trim().length < 10) {
    return { valid: false, error: 'Message must be at least 10 characters' };
  }

  if (message.trim().length > 1000) {
    return { valid: false, error: 'Message must be less than 1000 characters' };
  }

  return { valid: true };
};
