import nodemailer from 'nodemailer';
import config from '../config/index.js';
import logger from './logger.js';

/**
 * Email Transporter Configuration
 * 
 * For Gmail, you can use two approaches:
 * 1. Username/Password (less secure, requires "Less secure app access" to be enabled)
 * 2. OAuth2 (recommended, more secure but requires additional setup)
 */
const createTransporter = () => {
  // Basic authentication transporter
  const basicTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.EMAIL_USERNAME,
      pass: config.EMAIL_PASSWORD
    }
  });

  // OAuth2 authentication transporter (recommended for production)
  const oauth2Transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: config.EMAIL_USERNAME,
      clientId: config.OAUTH_CLIENT_ID,
      clientSecret: config.OAUTH_CLIENT_SECRET,
      refreshToken: config.OAUTH_REFRESH_TOKEN,
      accessToken: config.OAUTH_ACCESS_TOKEN
    }
  });

  // Return the appropriate transporter based on configuration
  return config.EMAIL_USE_OAUTH ? oauth2Transporter : basicTransporter;
};

/**
 * Send Email
 * @param {Object} options - Email options
 * @param {string} options.email - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.message - Plain text message (optional if html is provided)
 * @param {string} options.html - HTML message (optional)
 * @param {Array} options.attachments - Email attachments (optional)
 * @returns {Promise} - Resolves with info about the sent email
 */
export const sendEmail = async (options) => {
  try {
    // Validate required fields
    if (!options.email) {
      throw new Error('Recipient email is required');
    }
    if (!options.subject) {
      throw new Error('Email subject is required');
    }
    if (!options.message && !options.html) {
      throw new Error('Email message (text or HTML) is required');
    }

    // Create transporter
    const transporter = createTransporter();

    // Set email options
    const mailOptions = {
      from: `"${config.EMAIL_FROM_NAME}" <${config.EMAIL_FROM_ADDRESS || config.EMAIL_USERNAME}>`,
      to: options.email,
      subject: options.subject,
      text: options.message || '', // Plain text body
      html: options.html || '', // HTML body
      attachments: options.attachments || []
    };

    // Log email attempt (masking recipient email for privacy)
    const maskedEmail = options.email.replace(/(.{3})(.*)(@.*)/, '$1***$3');
    logger.info(`Sending email to ${maskedEmail} with subject: ${options.subject}`);

    // Send email
    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent: ${info.messageId}`);
    
    return info;
  } catch (error) {
    logger.error(`Error sending email: ${error.message}`);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

/**
 * Verify email configuration and connection
 * @returns {Promise<boolean>} True if verification succeeds
 */
export const verifyEmailConfig = async () => {
  try {
    if (!config.EMAIL_USERNAME || 
        (!config.EMAIL_PASSWORD && !config.EMAIL_USE_OAUTH)) {
      logger.warn('Email configuration is incomplete');
      return false;
    }

    const transporter = createTransporter();
    await transporter.verify();
    
    logger.info('Email service is configured correctly');
    return true;
  } catch (error) {
    logger.error(`Email configuration error: ${error.message}`);
    return false;
  }
};

/**
 * Send templated email
 * @param {Object} options - Email options
 * @param {string} options.email - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.template - Template name
 * @param {Object} options.data - Data to populate the template
 * @returns {Promise} - Resolves with info about the sent email
 */
export const sendTemplatedEmail = async (options) => {
  try {
    // This is a simplified version - in a real app, you'd use a templating engine like handlebars
    // or EJS to render the template with the provided data
    
    const templates = {
      welcomeEmail: (data) => `
        <h1>Welcome to Chop Waka, ${data.name}!</h1>
        <p>Thank you for joining our platform. We're excited to have you on board.</p>
        <p>Get started by exploring our delicious menu items.</p>
        <p>Best regards,<br>The Chop Waka Team</p>
      `,
      
      passwordReset: (data) => `
        <h2>Password Reset Request</h2>
        <p>You requested a password reset for your Chop Waka account.</p>
        <p>Please click the link below to reset your password:</p>
        <p><a href="${data.resetUrl}" style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px;">Reset Password</a></p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>This link will expire in 10 minutes.</p>
        <p>Best regards,<br>The Chop Waka Team</p>
      `,
      
      orderConfirmation: (data) => `
        <h2>Order Confirmation #${data.orderNumber}</h2>
        <p>Thank you for your order, ${data.name}!</p>
        <h3>Order Details:</h3>
        <ul>
          ${data.items.map(item => `<li>${item.quantity}x ${item.name} - $${item.price.toFixed(2)}</li>`).join('')}
        </ul>
        <p><strong>Total:</strong> $${data.total.toFixed(2)}</p>
        <p><strong>Estimated Delivery/Pickup Time:</strong> ${data.estimatedTime}</p>
        <p>If you have any questions about your order, please contact us.</p>
        <p>Best regards,<br>The Chop Waka Team</p>
      `
    };
    
    // Get the template function based on the template name
    const templateFn = templates[options.template];
    
    if (!templateFn) {
      throw new Error(`Template '${options.template}' not found`);
    }
    
    // Render the template with the provided data
    const html = templateFn(options.data);
    
    // Send the email with the rendered HTML
    return await sendEmail({
      email: options.email,
      subject: options.subject,
      html,
      // Generate plain text version (simplified)
      message: html.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim()
    });
  } catch (error) {
    logger.error(`Error sending templated email: ${error.message}`);
    throw new Error(`Failed to send templated email: ${error.message}`);
  }
};

export default { sendEmail, verifyEmailConfig, sendTemplatedEmail };