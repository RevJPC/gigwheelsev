import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const sesClient = new SESClient({ region: process.env.AWS_REGION || 'us-east-1' });

export const handler = async (event: any) => {
    const { email, token, requestId, changes } = event.arguments;

    // Construct the confirmation link
    const confirmLink = `https://gigwheelsev.com/confirm-changes?token=${token}&id=${requestId}`;

    console.log('=== SENDING EMAIL ===');
    console.log(`To: ${email}`);
    console.log(`Subject: Profile Change Request`);
    console.log(`Confirmation Link: ${confirmLink}`);
    console.log('====================');

    try {
        // Parse changes if it's a string
        let parsedChanges = changes;
        if (typeof changes === 'string') {
            try {
                parsedChanges = JSON.parse(changes);
            } catch (e) {
                parsedChanges = changes;
            }
        }

        // Format changes for email
        const changesHtml = Object.entries(parsedChanges)
            .map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`)
            .join('');

        const params = {
            Source: process.env.SES_FROM_EMAIL || 'noreply@gigwheelsev.com',
            Destination: {
                ToAddresses: [email]
            },
            Message: {
                Subject: {
                    Data: 'GigWheels EV - Profile Change Request'
                },
                Body: {
                    Html: {
                        Data: `
                            <!DOCTYPE html>
                            <html>
                            <head>
                                <style>
                                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                                    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
                                    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
                                    .changes { background: white; padding: 15px; border-radius: 6px; margin: 20px 0; }
                                    .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
                                    .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }
                                </style>
                            </head>
                            <body>
                                <div class="container">
                                    <div class="header">
                                        <h1 style="margin: 0;">🚗 GigWheels EV</h1>
                                        <p style="margin: 5px 0 0 0;">Profile Change Request</p>
                                    </div>
                                    <div class="content">
                                        <h2>Profile Update Requested</h2>
                                        <p>An administrator has requested to update your profile information.</p>
                                        
                                        <div class="changes">
                                            <h3>Proposed Changes:</h3>
                                            <ul>
                                                ${changesHtml}
                                            </ul>
                                        </div>

                                        <p><strong>Please review these changes carefully.</strong></p>
                                        <p>If you approve these changes, click the button below:</p>
                                        
                                        <a href="${confirmLink}" class="button">Review & Confirm Changes</a>
                                        
                                        <p style="color: #6b7280; font-size: 14px;">
                                            If you did not request this change or have concerns, please contact support immediately.
                                        </p>
                                    </div>
                                    <div class="footer">
                                        <p>© ${new Date().getFullYear()} GigWheels EV. All rights reserved.</p>
                                        <p>This is an automated message, please do not reply to this email.</p>
                                    </div>
                                </div>
                            </body>
                            </html>
                        `
                    },
                    Text: {
                        Data: `
GigWheels EV - Profile Change Request

An administrator has requested to update your profile information.

Proposed Changes:
${Object.entries(parsedChanges).map(([key, value]) => `- ${key}: ${value}`).join('\n')}

Please review these changes by visiting:
${confirmLink}

If you did not request this change or have concerns, please contact support immediately.

© ${new Date().getFullYear()} GigWheels EV
                        `.trim()
                    }
                }
            }
        };

        const command = new SendEmailCommand(params);
        const result = await sesClient.send(command);

        console.log('✅ Email sent successfully:', result.MessageId);

        return {
            success: true,
            message: 'Email sent successfully',
            messageId: result.MessageId,
            confirmLink
        };

    } catch (error: any) {
        console.error('❌ Error sending email:', error);

        // Log the error but don't fail the request
        // The ProfileChangeRequest is still created in the database
        return {
            success: false,
            message: `Failed to send email: ${error.message}`,
            error: error.message,
            confirmLink
        };
    }
};
