// src/services/email/index.sample.ts

import { configDotenv } from 'dotenv';
import EmailService from './index.js';

configDotenv({ quiet: true });

async function main() {
    const emailService = EmailService.fromEnv();
    await emailService.load();
    const otp = emailService.generateOtp();

    console.log(otp);
}

main()
    .then(() => {
        console.log('Sample email sent successfully');
    })
    .catch((error) => {
        console.error('Failed to send sample email:', error);
        process.exit(1);
    });
