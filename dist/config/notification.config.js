"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationConfig = void 0;
exports.notificationConfig = {
    email: {
        sendgrid: {
            apiKey: process.env.SENDGRID_API_KEY || 'your-sendgrid-api-key',
            fromEmail: process.env.SENDGRID_FROM_EMAIL || 'noreply@gwan.com.br',
            fromName: process.env.SENDGRID_FROM_NAME || 'GWAN',
        },
        ses: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION || 'us-east-1',
        },
    },
    whatsapp: {
        apiUrl: process.env.WHATSAPP_API_URL || 'https://graph.facebook.com/v17.0',
        apiToken: process.env.WHATSAPP_API_TOKEN || 'your-whatsapp-api-token',
        phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || 'your-phone-number-id',
        businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || 'your-business-account-id',
    },
};
//# sourceMappingURL=notification.config.js.map