import { sendEmail } from '@/lib/mail';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/db';

export const auth = betterAuth({
    baseURL: process.env.APP_URL || 'http://localhost:3000',
    database: drizzleAdapter(db, {
        provider: 'pg',
    }),
    user: {
        additionalFields: {
            firstName: { type: 'string', required: true },
            lastName: { type: 'string', required: true },
        },
    },
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
    },
    emailVerification: {
        sendVerificationEmail: async ({ user, url }) => {
            const result = await sendEmail({
                to: user.email,
                subject: 'Verify your Vault Account',
                html: `
          <div style="font-family: sans-serif; padding: 20px; background-color: #000; color: #fff;">
            <h2>Welcome to Vault, ${user.name}!</h2>
            <p>Please verify your email address to activate your account:</p>
            <a href="${url}" style="display: inline-block; padding: 10px 20px; background-color: #fff; color: #000; text-decoration: none; font-weight: bold; border-radius: 5px;">Verify Email</a>
          </div>
        `,
            });
            if (!result.success) {
                console.error('Failed to send verification email:', result.error);
                throw new Error('Failed to send verification email');
            }
        },
    },
});