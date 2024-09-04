const axios = require('axios');
const crypto = require('crypto');
const { ObjectId } = require('bson');

const CLIENT_ID = ''; // ganti dengan client-id anda yang ada di dashboard doku "BRN-...."
const SECRET_KEY = ''; // ganti dengan secret-key anda yang ada di dashboard doku "SK-...."
const INVOICE_NUMBER = ''; // isi dengan invoice number yang akan di cek
const URL_PAYMENT_GATEWAY = '/orders/v1/status/';

// generate timestamp
function getCurrentTimestamp() {
  return new Date().toISOString().slice(0, 19) + 'Z';
}

// generate digest
function generateDigest(jsonBody) {
  return crypto.createHash('sha256').update(jsonBody, 'utf-8').digest('base64');
}

// generate signature
function generateSignature(clientId, requestId, requestTarget, digest, secret) {
  let requestTimestamp = getCurrentTimestamp();
  let componentSignature = `Client-Id:${clientId}\nRequest-Id:${requestId}\nRequest-Timestamp:${requestTimestamp}\nRequest-Target:${requestTarget}`;
  if (digest) {
    componentSignature += `\nDigest:${digest}`;
  }
  let hmac256Value = crypto.createHmac('sha256', secret).update(componentSignature).digest('base64');
  return `HMACSHA256=${hmac256Value}`;
}

// generate ObjectId
const generateRequestId = () => {
  return new ObjectId().toString();
};

// get payment service
async function getPaymentService() {
  const clientId = CLIENT_ID;
  const secretKey = SECRET_KEY;
  const invoiceNumber = INVOICE_NUMBER;
  const requestId = generateRequestId();
  const url = URL_PAYMENT_GATEWAY + invoiceNumber;
  const requestTimestamp = getCurrentTimestamp();
  const digest = '';
  const headerSignature = generateSignature(clientId, requestId, url, digest, secretKey);

  try {
    const response = await axios.get(`https://api-sandbox.doku.com${url}`, {
      headers: {
        'Client-Id': clientId,
        'Request-Id': requestId,
        'Request-Timestamp': requestTimestamp,
        Signature: headerSignature,
        'Content-Type': 'application/json',
      },
    });

    if (response.data && response.data.transaction) {
      console.log(response.data.transaction);
    } else {
      console.error('Transaction not successful or invalid response structure:', response.data);

      return null;
    }
  } catch (error) {
    if (error.response) {
      console.error('Response Error Data:', error.response.data);
    } else {
      console.error('Request Error:', error.message);
    }

    return null;
  }
}

getPaymentService();
