const { google } = require('googleapis');
const { OAuth2 } = google.auth;
const gmail = google.gmail('v1');
const dotenv = require('dotenv');
dotenv.config();

const oauth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);

oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
});

google.options({ auth: oauth2Client });

const to = "ashishk.9333@gmail.com"
const subject = "heyy"
const body = "heyy"

const sendMail = async (userid) => {
    try {
        const response = await gmail.users.messages.list({
            userId: userid,
        });

        const messages = response.data.messages;
        // console.log(messages)
        if (messages) {
            const latestMessage = await gmail.users.messages.get({
                userId: userid,
                id: messages[0].id

            });
            console.log(latestMessage.id)

            const threadId = latestMessage.data.threadId;

            const threads = await gmail.users.threads.list({
                userId: 'me',
                q: `to:${to}`,
                maxResults: 1
            });

            if (threads.data.resultSizeEstimate === 0 || threads.data.threads[0].id !== threadId) {
                const messageText = body;

                const messageToSend = [
                    `To: ${to}`,
                    `Subject: ${subject}`,
                    '',
                    messageText
                ].join('\n');

                await gmail.users.messages.send({
                    userId: 'me',
                    requestBody: {
                        raw: Buffer.from(messageToSend).toString('base64')
                    }
                });

                console.log('Sent email successfully!');
            } else {
                console.log('Email already exists in conversation!');
            }
        } else {
            const messageText = body;

            const messageToSend = [
                `To: ${to}`,
                `Subject: ${subject}`,
                '',
                messageText
            ].join('\n');

            await gmail.users.messages.send({
                userId: 'me',
                requestBody: {
                    raw: Buffer.from(messageToSend).toString('base64')
                }
            });

            console.log('Sent email successfully!');
        }
    } catch (err) {
        console.error(err);
    }
}


module.exports = sendMail