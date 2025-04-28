export declare const notificationConfig: {
    email: {
        sendgrid: {
            apiKey: string;
            fromEmail: string;
            fromName: string;
        };
        ses: {
            accessKeyId: string;
            secretAccessKey: string;
            region: string;
        };
    };
    whatsapp: {
        apiUrl: string;
        apiToken: string;
        phoneNumberId: string;
        businessAccountId: string;
    };
};
