const functions = require('firebase-functions');
const crypto = require('crypto');

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.encryptText = functions
  .runWith({ secrets: ['ENCRYPTION_KEY', 'ENCRYPTION_IV'] })
  .onCall((plainText) => {
    const keyHex = process.env.ENCRYPTION_KEY;
    const ivHex = process.env.ENCRYPTION_IV;
    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      Buffer.from(keyHex, 'hex'),
      Buffer.from(ivHex, 'hex')
    );
    let encryptedText = cipher.update(plainText, 'utf8', 'hex');
    encryptedText += cipher.final('hex');
    return encryptedText;
  });

exports.decryptText = functions
  .runWith({ secrets: ['ENCRYPTION_KEY', 'ENCRYPTION_IV'] })
  .onCall((encryptedText) => {
    const keyHex = process.env.ENCRYPTION_KEY;
    const ivHex = process.env.ENCRYPTION_IV;
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(keyHex, 'hex'),
      Buffer.from(ivHex, 'hex')
    );
    let plainText = decipher.update(encryptedText, 'hex', 'utf8');
    plainText += decipher.final('utf8');
    return plainText;
  });
