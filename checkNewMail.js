const axios = require("axios");
const { generateConfig } = require("./utils");
const { google } = require("googleapis");

async function readMail(userid) {
    try {
        const url = `https://gmail.googleapis.com/gmail/v1/users/${userid}/messages/`;
        const { token } = await oAuth2Client.getAccessToken();
        const config = generateConfig(url, token);

        let data = await response.data;

        res.json(data);
    } catch (error) {
        res.send(error);
    }
}