# Stock Analyzer Pro

An advanced AI-powered stock analysis platform that combines fundamental analysis, technical indicators, chart pattern recognition, and AI insights to help make informed investment decisions.

## Features

- **Real-time Stock Data**: Fetches comprehensive stock data including Indian stocks via FMP API
- **Fundamental Analysis**: Income statements, balance sheets, cash flow, and key financial ratios
- **Technical Analysis**: Moving averages, RSI, MACD, Bollinger Bands, ADX, and more
- **Chart Pattern Detection**: Identifies bullish and bearish candlestick patterns
- **AI-Powered Insights**: GPT-4 powered analysis providing investment recommendations
- **News Sentiment**: Latest news and market sentiment analysis
- **Beautiful UI**: Modern, responsive design using DaisyUI and Tailwind CSS
- **Session Management**: Support for multiple concurrent users

## Tech Stack

- **Frontend**: Next.js 14 (App Router), DaisyUI, Tailwind CSS
- **Backend**: FastAPI (Python)
- **AI**: OpenAI GPT-4
- **Data Sources**: Financial Modeling Prep (FMP), Yahoo Finance, Web Scraping
- **Technical Analysis**: TA-Lib

## Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- TA-Lib (for technical indicators)

## Setup Instructions

### 1. Install TA-Lib

**On Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install ta-lib
```

**On macOS:**
```bash
brew install ta-lib
```

**On Windows:**
Download and install from [TA-Lib official site](https://www.ta-lib.org/hdr_dw.html)

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
```

Edit the `.env` file and add your API keys:
- `OPENAI_API_KEY`: Get from [OpenAI Platform](https://platform.openai.com/)
- `FMP_API_KEY`: Get from [Financial Modeling Prep](https://financialmodelingprep.com/developer/docs/)

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies (since you already have Next.js and DaisyUI installed)
npm install

# Create .env.local file
cp .env.local.example .env.local
```

### 4. Running the Application

**Start the backend:**
```bash
cd backend
python main.py
```
The backend will run on http://localhost:8000

**Start the frontend:**
```bash
cd frontend
npm run dev
```
The frontend will run on http://localhost:3000

## Usage

1. Open http://localhost:3000 in your browser
2. Enter a stock symbol (e.g., AAPL for Apple, RELIANCE.NS for Reliance Industries)
3. Click "Analyze" to fetch comprehensive stock analysis
4. Navigate through different tabs to view:
   - Fundamental analysis
   - Technical indicators
   - AI-powered insights
   - Latest news

## API Keys Required

1. **OpenAI API Key** (Required)
   - For AI-powered analysis
   - Get it from: https://platform.openai.com/

2. **Financial Modeling Prep API Key** (Required)
   - For stock data and fundamentals
   - Free tier available
   - Get it from: https://financialmodelingprep.com/developer/docs/

## Important Notes

- The application uses the "business" theme from DaisyUI for a professional dark mode appearance
- Sessions are stored in memory (for production, use Redis or a database)
- API responses are cached for 5 minutes to reduce API calls
- Make sure to handle rate limits for free tier API keys

## Troubleshooting

### TA-Lib Installation Issues
If you face issues installing TA-Lib:
- On Windows, you might need to install Visual C++ Build Tools
- On macOS, ensure you have Xcode Command Line Tools installed
- Consider using `talib-binary` package as an alternative: `pip install talib-binary`

### CORS Issues
If you encounter CORS errors, ensure the backend is running and the frontend is configured with the correct API URL.

### API Rate Limits
Free tier API keys have rate limits. Consider implementing:
- Request queuing
- Extended caching
- Fallback data sources

## Future Enhancements

- Real-time price charts using Chart.js or D3.js
- Portfolio tracking
- Watchlist functionality
- Email alerts for price movements
- More advanced chart pattern recognition
- Integration with more data sources
- Redis for session management
- PostgreSQL for data persistence

## License

MIT