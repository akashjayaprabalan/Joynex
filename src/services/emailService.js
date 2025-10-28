import sgMail from '@sendgrid/mail';

// Initialize SendGrid with API key
sgMail.setApiKey(import.meta.env.VITE_SENDGRID_API_KEY);

/**
 * Send verification code email
 * @param {string} to - Recipient email
 * @param {string} code - Verification code
 * @returns {Promise} SendGrid response
 */
export const sendVerificationEmail = async (to, code) => {
  try {
    const msg = {
      to,
      from: 'noreply@joynex.online', // Replace with your verified sender
      subject: 'Verify your Joynex account',
      templateId: import.meta.env.VITE_SENDGRID_VERIFICATION_TEMPLATE_ID,
      dynamicTemplateData: {
        code,
        expiry: '15 minutes',
      },
    };

    const response = await sgMail.send(msg);
    return { data: response, error: null };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return { data: null, error };
  }
};

/**
 * Send welcome email after successful verification
 * @param {string} to - Recipient email
 * @param {string} name - User's name
 * @returns {Promise} SendGrid response
 */
export const sendWelcomeEmail = async (to, name) => {
  try {
    const msg = {
      to,
      from: 'noreply@joynex.online', // Replace with your verified sender
      subject: 'Welcome to Joynex!',
      templateId: import.meta.env.VITE_SENDGRID_WELCOME_TEMPLATE_ID,
      dynamicTemplateData: {
        name,
      },
    };

    const response = await sgMail.send(msg);
    return { data: response, error: null };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { data: null, error };
  }
};

/**
 * Send group join notification email
 * @param {string} to - Recipient email
 * @param {Object} group - Group details
 * @returns {Promise} SendGrid response
 */
export const sendGroupJoinEmail = async (to, group) => {
  try {
    const msg = {
      to,
      from: 'noreply@joynex.online',
      subject: `You've joined ${group.name}!`,
      templateId: import.meta.env.VITE_SENDGRID_GROUP_JOIN_TEMPLATE_ID,
      dynamicTemplateData: {
        groupName: group.name,
        groupType: group.type,
        date: new Date(group.date).toLocaleDateString(),
        time: group.timeSlot,
        location: group.location,
        locationLink: group.locationLink,
        contactMethod: group.contactMethod,
        contactInfo: group.contactInfo,
      },
    };

    const response = await sgMail.send(msg);
    return { data: response, error: null };
  } catch (error) {
    console.error('Error sending group join email:', error);
    return { data: null, error };
  }
};

/**
 * Send group update notification email
 * @param {string} to - Recipient email
 * @param {Object} group - Updated group details
 * @returns {Promise} SendGrid response
 */
export const sendGroupUpdateEmail = async (to, group) => {
  try {
    const msg = {
      to,
      from: 'noreply@joynex.online',
      subject: `${group.name} has been updated`,
      templateId: import.meta.env.VITE_SENDGRID_GROUP_UPDATE_TEMPLATE_ID,
      dynamicTemplateData: {
        groupName: group.name,
        groupType: group.type,
        date: new Date(group.date).toLocaleDateString(),
        time: group.timeSlot,
        location: group.location,
        locationLink: group.locationLink,
        contactMethod: group.contactMethod,
        contactInfo: group.contactInfo,
      },
    };

    const response = await sgMail.send(msg);
    return { data: response, error: null };
  } catch (error) {
    console.error('Error sending group update email:', error);
    return { data: null, error };
  }
};
