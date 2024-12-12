const bodyParser = require('body-parser');
const cors = require('cors');

const express = require('express');
const app = express();
const port = 4000;
const axios = require('axios');

// Enable CORS for specific origin and specific methods
app.use(
  cors({
    origin: 'http://127.0.0.1:5500', // Your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true, // Allow cookies and authorization headers (if needed)
  })
);

// Middleware to parse JSON request bodies
app.use(express.json());

app.post('/convert', async (req, res) => {
  try {
    const { btc } = req.body;
    if (!btc || btc <= 0) {
      return res.status(400).send({ message: 'Invalid BTC value' });
    }

    const result = await GetConvertionBitcoin(btc, 'USD', 'IDR');

    res.json({ convertedValue: result });
  } catch (error) {
    console.error(error);
    return res.status(400).send({
      message: 'Error API',
    });
  }
});

app.get('/', async (req, res) => {
  res.send('hello world');
});
async function GetLatestPriceBitcoin() {
  try {
    const bitcoinApi = 'https://api.coindesk.com/v1/bpi/currentprice.json';
    const response = await axios.get(bitcoinApi);

    if (!response) {
      throw new Error('Error fetching latest price bitcoin API');
    }
    const responseData = response?.data || {};
    return responseData;
  } catch (error) {
    console.log(error.message);
    throw new Error('Error GetLatestPriceBitcoin', error.message);
  }
}

async function GetConvertionBitcoin(bitcoinAmount = 1, baseRate, symbols) {
  try {
    const getResponseBitcoin = await GetLatestPriceBitcoin();
    const getResponseExchangeRate = await ConvertExchangeRate(
      baseRate,
      symbols
    );

    const getRateBitcoinBasedOnRate =
      getResponseBitcoin?.bpi?.[baseRate]?.rate_float || 0;
    const getExchangeRateBasedOnRate =
      getResponseExchangeRate?.rates?.[symbols] || 0;

    const calculateBitcoinWithExchangeRate =
      bitcoinAmount * getRateBitcoinBasedOnRate * getExchangeRateBasedOnRate;

    const formattedAmount = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: symbols,
    }).format(calculateBitcoinWithExchangeRate);

    return {
      value: formattedAmount,
      currency: symbols,
    };
  } catch (error) {
    console.log(error);
    throw new Error('Error GetConvertionBitcoin', error.message);
  }
}

async function ConvertExchangeRate(baseRate = 'USD', symbols = 'IDR') {
  try {
    const apiKey = 'lCY2a84qw6CtKpCFC8vjxBq9L5r3Lq6X';
    const apiExchangeRate =
      'https://api.apilayer.com/exchangerates_data/latest';

    const response = await axios.get(apiExchangeRate, {
      headers: {
        apikey: apiKey,
      },
      params: {
        symbols: symbols,
        base: baseRate,
      },
    });

    if (!response) {
      throw new Error('Error fetching latest price bitcoin API');
    }
    const responseData = response?.data || {};

    return responseData;
  } catch (error) {
    console.log(error.message);
    throw new Error('Error ConvertExchangeRate', error.message);
  }
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
