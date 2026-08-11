import { google } from 'googleapis';

const OAuth2 = google.auth.OAuth2;

export async function sendEmail({
                                    to,
                                    subject,
                                    html,
                                }: {
    to: string;
    subject: string;
    html: string;
}) {
    try {
        const oauth2Client = new OAuth2(
            process.env.GMAIL_CLIENT_ID,
            process.env.GMAIL_CLIENT_SECRET,
            'https://developers.google.com/oauthplayground'
        );

        oauth2Client.setCredentials({
            refresh_token: process.env.GMAIL_REFRESH_TOKEN,
        });

        const accessToken = await oauth2Client.getAccessToken();

        if (!accessToken.token) {
            throw new Error('Failed to generate Gmail access token.');
        }

        const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

        const emailContent = [
            `From: Vault App <${process.env.GMAIL_USER}>`,
            `To: ${to}`,
            `Subject: ${subject}`,
            'Content-Type: text/html; charset=utf-8',
            '',
            html
        ].join('\r\n');

        const encodedEmail = Buffer.from(emailContent)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

        await gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: encodedEmail,
            },
        });

        return { success: true };
    } catch (error) {
        console.error('Failed to send email via Gmail API:', error);
        return { success: false, error };
    }
}