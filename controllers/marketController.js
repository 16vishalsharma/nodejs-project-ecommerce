const axios = require('axios');
const asyncHandler = require('../middleware/asyncHandler');
const MarketData = require('../models/MarketData');

// CoinGecko API - Free, no key required
const COINGECKO_API = 'https://api.coingecko.com/api/v3';

// In-memory cache to avoid CoinGecko rate limits (free tier: ~10-30 req/min)
let cachedCoinGeckoData = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60 * 1000; // 1 minute

async function fetchCoinGeckoData() {
  const now = Date.now();
  if (cachedCoinGeckoData && now - cacheTimestamp < CACHE_TTL) {
    return cachedCoinGeckoData;
  }

  const { data } = await axios.get(`${COINGECKO_API}/coins/markets`, {
    params: {
      vs_currency: 'inr',
      ids: 'bitcoin,ethereum,dogecoin,tether-gold',
      order: 'market_cap_desc',
      sparkline: false,
      price_change_percentage: '24h,7d',
    },
    timeout: 15000,
  });

  cachedCoinGeckoData = data;
  cacheTimestamp = now;
  return data;
}

function mapCryptoData(data) {
  const cryptoIds = ['bitcoin', 'ethereum', 'dogecoin'];
  return data.filter((c) => cryptoIds.includes(c.id)).map((coin) => ({
    id: coin.id,
    symbol: coin.symbol.toUpperCase(),
    name: coin.name,
    image: coin.image,
    current_price_inr: coin.current_price,
    market_cap: coin.market_cap,
    market_cap_rank: coin.market_cap_rank,
    total_volume: coin.total_volume,
    price_change_24h: coin.price_change_24h,
    price_change_percentage_24h: coin.price_change_percentage_24h,
    price_change_percentage_7d: coin.price_change_percentage_7d_in_currency,
    high_24h: coin.high_24h,
    low_24h: coin.low_24h,
    last_updated: coin.last_updated,
  }));
}

function mapMetalsData(data) {
  const xaut = data.find((c) => c.id === 'tether-gold');
  const goldPricePerOzINR = xaut?.current_price || null;
  const goldPricePerGram = goldPricePerOzINR ? goldPricePerOzINR / 31.1035 : null;

  return {
    gold: {
      name: 'Gold',
      price_inr_per_oz: goldPricePerOzINR,
      price_inr_per_gram: goldPricePerGram ? Math.round(goldPricePerGram) : null,
      price_inr_per_10gram: goldPricePerGram ? Math.round(goldPricePerGram * 10) : null,
      price_change_percentage_24h: xaut?.price_change_percentage_24h || null,
      price_change_24h: xaut?.price_change_24h || null,
      high_24h: xaut?.high_24h || null,
      low_24h: xaut?.low_24h || null,
      image: xaut?.image || null,
    },
    silver: {
      name: 'Silver',
      price_inr_per_gram: null,
      price_inr_per_kg: null,
    },
    source: 'CoinGecko (XAUT)',
    last_updated: new Date().toISOString(),
  };
}

// Save market data to MongoDB
async function saveToDb(crypto, metals, stocks) {
  try {
    await MarketData.create({ crypto, metals, stocks });
    // Keep only last 100 records to avoid DB bloat
    const count = await MarketData.countDocuments();
    if (count > 100) {
      const oldest = await MarketData.find().sort({ fetchedAt: 1 }).limit(count - 100).select('_id');
      await MarketData.deleteMany({ _id: { $in: oldest.map((d) => d._id) } });
    }
  } catch (err) {
    console.error('Failed to save market data to DB:', err.message);
  }
}

// Get latest data from MongoDB as fallback
async function getFromDb() {
  const latest = await MarketData.findOne().sort({ fetchedAt: -1 });
  if (!latest) return null;
  return {
    crypto: latest.crypto || [],
    metals: latest.metals || null,
    stocks: latest.stocks || [],
    last_updated: latest.fetchedAt.toISOString(),
    from_db: true,
  };
}

// @desc    Get crypto prices (Bitcoin, Ethereum, Dogecoin)
// @route   GET /api/market/crypto
// @access  Public
exports.getCryptoPrices = asyncHandler(async (req, res) => {
  try {
    const data = await fetchCoinGeckoData();
    const crypto = mapCryptoData(data);
    res.status(200).json({ success: true, data: crypto });
  } catch {
    const dbData = await getFromDb();
    res.status(200).json({
      success: true,
      data: dbData?.crypto || [],
      from_db: true,
      message: 'Showing last saved data (API unavailable)',
    });
  }
});

// @desc    Get metal prices (Gold via XAUT from CoinGecko)
// @route   GET /api/market/metals
// @access  Public
exports.getMetalPrices = asyncHandler(async (req, res) => {
  try {
    const data = await fetchCoinGeckoData();
    res.status(200).json({ success: true, data: mapMetalsData(data) });
  } catch {
    const dbData = await getFromDb();
    res.status(200).json({
      success: true,
      data: dbData?.metals || null,
      from_db: true,
      message: 'Showing last saved data (API unavailable)',
    });
  }
});

// @desc    Get Indian stock market data (NIFTY 50, SENSEX, top stocks)
// @route   GET /api/market/stocks
// @access  Public
exports.getStockPrices = asyncHandler(async (req, res) => {
  try {
    const stocks = await fetchAllStocks();
    if (stocks.length > 0) {
      res.status(200).json({ success: true, data: stocks });
    } else {
      throw new Error('No stock data');
    }
  } catch {
    const dbData = await getFromDb();
    res.status(200).json({
      success: true,
      data: dbData?.stocks || [],
      from_db: true,
      message: 'Showing last saved data (API unavailable)',
    });
  }
});

// @desc    Get all market data combined
// @route   GET /api/market/all
// @access  Public
exports.getAllMarketData = asyncHandler(async (req, res) => {
  const [coinGeckoRes, stocksRes] = await Promise.allSettled([
    fetchCoinGeckoData(),
    fetchAllStocks(),
  ]);

  const coinGeckoData = coinGeckoRes.status === 'fulfilled' ? coinGeckoRes.value : [];
  const stocks = stocksRes.status === 'fulfilled' ? stocksRes.value : [];

  const crypto = coinGeckoData.length ? mapCryptoData(coinGeckoData) : [];
  const metals = coinGeckoData.length ? mapMetalsData(coinGeckoData) : null;

  const hasLiveData = crypto.length > 0 || stocks.length > 0;

  if (hasLiveData) {
    // Save fresh data to DB in background
    saveToDb(crypto, metals, stocks);

    // If only partial data, fill missing from DB
    let finalCrypto = crypto;
    let finalMetals = metals;
    let finalStocks = stocks;

    if (crypto.length === 0 || stocks.length === 0) {
      const dbData = await getFromDb();
      if (dbData) {
        if (crypto.length === 0) finalCrypto = dbData.crypto;
        if (!metals) finalMetals = dbData.metals;
        if (stocks.length === 0) finalStocks = dbData.stocks;
      }
    }

    res.status(200).json({
      success: true,
      data: {
        crypto: finalCrypto,
        metals: finalMetals,
        stocks: finalStocks,
        last_updated: new Date().toISOString(),
      },
    });
  } else {
    // All APIs failed — fallback to DB
    const dbData = await getFromDb();
    if (dbData) {
      res.status(200).json({
        success: true,
        data: {
          crypto: dbData.crypto,
          metals: dbData.metals,
          stocks: dbData.stocks,
          last_updated: dbData.last_updated,
          from_db: true,
          message: 'Showing last saved data (APIs unavailable)',
        },
      });
    } else {
      res.status(200).json({
        success: true,
        data: {
          crypto: [],
          metals: null,
          stocks: [],
          last_updated: new Date().toISOString(),
          message: 'No market data available',
        },
      });
    }
  }
});

// @desc    Get market data history from DB
// @route   GET /api/market/history
// @access  Public
exports.getMarketHistory = asyncHandler(async (req, res) => {
  const { limit = 20, page = 1 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await MarketData.countDocuments();

  const history = await MarketData.find()
    .sort({ fetchedAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    count: history.length,
    total,
    page: parseInt(page),
    totalPages: Math.ceil(total / parseInt(limit)),
    data: history,
  });
});

// --- Stock helpers ---

async function fetchYahooQuote(symbol, name, type) {
  const { data } = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}`, {
    params: { interval: '1d', range: '1d' },
    timeout: 10000,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },
  });

  const result = data?.chart?.result?.[0];
  if (!result) return null;

  const meta = result.meta;
  const previousClose = meta.chartPreviousClose || meta.previousClose;
  const currentPrice = meta.regularMarketPrice;
  const change = currentPrice - previousClose;
  const changePercent = previousClose ? (change / previousClose) * 100 : 0;

  return {
    symbol: meta.symbol,
    name,
    type,
    currency: meta.currency,
    current_price: currentPrice,
    previous_close: previousClose,
    change: parseFloat(change.toFixed(2)),
    change_percent: parseFloat(changePercent.toFixed(2)),
    day_high: meta.regularMarketDayHigh || null,
    day_low: meta.regularMarketDayLow || null,
    volume: meta.regularMarketVolume || null,
    last_updated: new Date(meta.regularMarketTime * 1000).toISOString(),
  };
}

async function fetchAllStocks() {
  const symbols = [
    { symbol: '^NSEI', name: 'NIFTY 50', type: 'index' },
    { symbol: '^BSESN', name: 'SENSEX', type: 'index' },
    { symbol: 'RELIANCE.NS', name: 'Reliance Industries', type: 'stock' },
    { symbol: 'TCS.NS', name: 'Tata Consultancy Services', type: 'stock' },
    { symbol: 'INFY.NS', name: 'Infosys', type: 'stock' },
    { symbol: 'HDFCBANK.NS', name: 'HDFC Bank', type: 'stock' },
  ];

  const results = await Promise.allSettled(
    symbols.map((s) => fetchYahooQuote(s.symbol, s.name, s.type))
  );

  return results
    .filter((r) => r.status === 'fulfilled' && r.value)
    .map((r) => r.value);
}
