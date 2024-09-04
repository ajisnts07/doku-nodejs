const axios = require('axios');
const crypto = require('crypto');
const { ObjectId } = require('bson');

const CLIENT_ID = ''; // ganti dengan client-id anda yang ada di dashboard doku "BRN-...."
const SECRET_KEY = ''; // ganti dengan secret-key anda yang ada di dashboard doku "SK-...."
const URL_PAYMENT_GATEWAY = '/checkout/v1/payment';
const PAYMENT_METHOD_TYPES = ''; // tipe array cek dokumentasi ada method apa saja
const PAYMENT_DUE_DATE = ''; // ganti dengan integer berapa lama
const CALLBACK_URL = ''; // ganti dengan url callback website
const CALLBACK_URL_CANCEL = '';

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

// post payment service
async function postPaymentService() {
  const clientId = CLIENT_ID;
  const secretKey = SECRET_KEY;
  const requestId = generateRequestId();
  const url = URL_PAYMENT_GATEWAY;
  const requestTimestamp = getCurrentTimestamp();
  let paymentObject = {
    payment_method_types: PAYMENT_METHOD_TYPES ? PAYMENT_METHOD_TYPES : null,
    payment_due_date: PAYMENT_DUE_DATE,
  };

  let jsonBody = JSON.stringify({
    order: {
      amount: 10000, // sesuaikan bisa ganti menggunakan param
      invoice_number: requestId,
      currency: 'IDR',
      callback_url: CALLBACK_URL,
      callback_url_cancel: CALLBACK_URL_CANCEL,
      disable_retry_payment: true,
      line_items: [
        {
          id: '001',
          name: 'Fresh flowers',
          quantity: 1,
          price: 10000,
          sku: 'FF01',
          category: 'gift-and-flowers',
          url: 'http://item-url.domain/',
          image_url: 'http://image-url.domain/',
          type: 'ABC',
        },
      ],
    },
    payment: paymentObject,
    customer: {
      id: 121212,
      name: 'Zolanda',
      last_name: 'Anggaraeni',
      phone: '628121212121',
      email: 'zolanda@example.com',
      address: 'taman setiabudi',
      postcode: '120129',
      state: 'Jakarta',
      city: 'Jakarta Selatan',
      country: 'ID',
    },
    shipping_address: {
      first_name: 'Joe',
      last_name: 'Doe',
      address: 'Jalan DOKU no 15',
      city: 'Jakarta',
      postal_code: '11923',
      phone: '081312345678',
      country_code: 'IDN',
    },
    billing_address: {
      first_name: 'Joe',
      last_name: 'Doe',
      address: 'Jalan DOKU no 15',
      city: 'Jakarta',
      postal_code: '11923',
      phone: '081312345678',
      country_code: 'IDN',
    },
  });

  let digest = generateDigest(jsonBody);
  let headerSignature = generateSignature(clientId, requestId, url, digest, secretKey, requestTimestamp);

  try {
    const response = await axios.post('https://api-sandbox.doku.com' + url, jsonBody, {
      headers: {
        'Client-Id': clientId,
        'Request-Id': requestId,
        'Request-Timestamp': requestTimestamp,
        Signature: headerSignature,
        'Content-Type': 'application/json',
      },
    });

    console.log(response.data.response.payment.url);
  } catch (error) {
    if (error.response) {
      console.error('Response Data:', error.response.data);
    }
    return null;
  }
}

postPaymentService();
