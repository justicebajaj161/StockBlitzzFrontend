'use client'

import { useState, useEffect } from 'react'
import { Search, TrendingUp, Globe, ChevronDown, Star, Filter } from 'lucide-react'

export default function SearchBar({ onSearch }) {
  const [symbol, setSymbol] = useState('')
  const [market, setMarket] = useState('US')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [searchHistory, setSearchHistory] = useState([])

  const popularStocks = {
    US: [
      { symbol: 'AAPL', name: 'Apple Inc.', category: 'Tech', marketCap: '$3.0T' },
      { symbol: 'GOOGL', name: 'Alphabet Inc.', category: 'Tech', marketCap: '$2.1T' },
      { symbol: 'MSFT', name: 'Microsoft Corp.', category: 'Tech', marketCap: '$2.8T' },
      { symbol: 'TSLA', name: 'Tesla Inc.', category: 'Auto', marketCap: '$800B' },
      { symbol: 'NVDA', name: 'NVIDIA Corp.', category: 'Tech', marketCap: '$1.8T' },
      { symbol: 'JPM', name: 'JPMorgan Chase', category: 'Finance', marketCap: '$500B' },
      { symbol: 'JNJ', name: 'Johnson & Johnson', category: 'Healthcare', marketCap: '$450B' },
      { symbol: 'V', name: 'Visa Inc.', category: 'Finance', marketCap: '$520B' },
      { symbol: 'WMT', name: 'Walmart Inc.', category: 'Retail', marketCap: '$600B' },
      { symbol: 'PG', name: 'Procter & Gamble', category: 'Consumer', marketCap: '$380B' }
    ],
    Indian: [
      { symbol: 'RELIANCE', name: 'Reliance Industries', category: 'Energy', marketCap: '₹18L Cr' },
      { symbol: 'TCS', name: 'Tata Consultancy Services', category: 'IT', marketCap: '₹14L Cr' },
      { symbol: 'INFY', name: 'Infosys Limited', category: 'IT', marketCap: '₹7L Cr' },
      { symbol: 'HDFCBANK', name: 'HDFC Bank Limited', category: 'Banking', marketCap: '₹12L Cr' },
      { symbol: 'IREDA', name: 'Indian Renewable Energy Development Agency', category: 'Infrastructure', marketCap: '₹50K Cr' },
      { symbol: 'IRCON', name: 'IRCON International Limited', category: 'Infrastructure', marketCap: '₹25K Cr' },
      { symbol: 'RVNL', name: 'Rail Vikas Nigam Limited', category: 'Infrastructure', marketCap: '₹1L Cr' },
      { symbol: 'BAJFINANCE', name: 'Bajaj Finance Limited', category: 'Finance', marketCap: '₹4L Cr' },
      { symbol: 'ITC', name: 'ITC Limited', category: 'FMCG', marketCap: '₹5L Cr' },
      { symbol: 'LT', name: 'Larsen & Toubro', category: 'Engineering', marketCap: '₹4L Cr' }
    ]
  }

  // Load search history from localStorage
  useEffect(() => {
    const history = localStorage.getItem('stockSearchHistory')
    if (history) {
      setSearchHistory(JSON.parse(history))
    }
  }, [])

  useEffect(() => {
    if (symbol.length > 1) {
      const currentStocks = popularStocks[market] || []
      const filtered = currentStocks.filter(stock =>
        stock.symbol.toLowerCase().includes(symbol.toLowerCase()) ||
        stock.name.toLowerCase().includes(symbol.toLowerCase())
      )
      setSuggestions(filtered.slice(0, 8))
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }, [symbol, market])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (symbol.trim()) {
      setIsLoading(true)
      setShowSuggestions(false)
      
      // Add to search history
      const newSearch = { symbol: symbol.trim(), market, timestamp: Date.now() }
      const updatedHistory = [newSearch, ...searchHistory.filter(h => h.symbol !== symbol.trim() || h.market !== market)].slice(0, 5)
      setSearchHistory(updatedHistory)
      localStorage.setItem('stockSearchHistory', JSON.stringify(updatedHistory))
      
      try {
        await onSearch(symbol.trim(), market)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setSymbol(suggestion.symbol)
    setShowSuggestions(false)
    
    // Add to search history
    const newSearch = { symbol: suggestion.symbol, market, timestamp: Date.now() }
    const updatedHistory = [newSearch, ...searchHistory.filter(h => h.symbol !== suggestion.symbol || h.market !== market)].slice(0, 5)
    setSearchHistory(updatedHistory)
    localStorage.setItem('stockSearchHistory', JSON.stringify(updatedHistory))
    
    onSearch(suggestion.symbol, market)
  }

  const getCategoryColor = (category) => {
    const colors = {
      'Tech': 'badge-primary',
      'Finance': 'badge-success',
      'Healthcare': 'badge-info',
      'Auto': 'badge-warning',
      'Energy': 'badge-error',
      'IT': 'badge-accent',
      'Banking': 'badge-success',
      'Infrastructure': 'badge-warning',
      'FMCG': 'badge-info',
      'Engineering': 'badge-secondary',
      'Retail': 'badge-neutral',
      'Consumer': 'badge-ghost'
    }
    return colors[category] || 'badge-outline'
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Enhanced Market Selector */}
        <div className="flex justify-center">
          <div className="tabs tabs-boxed bg-base-300 p-1">
            <button
              type="button"
              className={`tab tab-lg ${market === 'US' ? 'tab-active bg-blue-500 text-white' : 'hover:bg-base-200'} transition-all duration-200`}
              onClick={() => setMarket('US')}
            >
              <Globe className="w-5 h-5 mr-2" />
              🇺🇸 US Market
              <span className="ml-2 badge badge-sm bg-blue-100 text-blue-800">NYSE • NASDAQ</span>
            </button>
            <button
              type="button"
              className={`tab tab-lg ${market === 'Indian' ? 'tab-active bg-orange-500 text-white' : 'hover:bg-base-200'} transition-all duration-200`}
              onClick={() => setMarket('Indian')}
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              🇮🇳 Indian Market
              <span className="ml-2 badge badge-sm bg-orange-100 text-orange-800">NSE • BSE</span>
            </button>
          </div>
        </div>

        {/* Enhanced Search Input */}
        <div className="relative">
          <div className="join w-full shadow-2xl">
            <div className="indicator join-item flex-1">
              <span className={`indicator-item badge ${market === 'US' ? 'badge-primary' : 'badge-warning'} badge-sm`}>
                {market} • Live Data
              </span>
              <input
                type="text"
                placeholder={market === 'US' 
                  ? 'Enter US stock symbol (e.g., AAPL, GOOGL, TSLA)' 
                  : 'Enter Indian stock symbol (e.g., RELIANCE, TCS, INFY)'
                }
                className="input input-bordered input-lg join-item w-full text-lg focus:ring-2 focus:ring-primary"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                onFocus={() => symbol.length > 1 && setShowSuggestions(true)}
              />
            </div>
            <button 
              type="submit" 
              className={`btn btn-lg join-item px-8 min-w-[120px] ${
                market === 'US' ? 'btn-primary' : 'btn-warning'
              } ${isLoading ? 'loading' : ''}`}
              disabled={isLoading || !symbol.trim()}
            >
              {!isLoading && <Search className="w-5 h-5 mr-2" />}
              {isLoading ? 'Analyzing...' : 'Analyze Stock'}
            </button>
          </div>

          {/* Enhanced Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-50 mt-2">
              <div className="bg-base-100 border border-base-300 rounded-xl shadow-2xl max-h-80 overflow-y-auto">
                <div className="p-3 border-b border-base-300 bg-base-200 rounded-t-xl">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Suggested {market} Stocks
                  </h4>
                </div>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    className="w-full p-4 text-left hover:bg-base-200 border-b border-base-300 last:border-b-0 transition-all duration-200 hover:shadow-md"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-bold text-lg text-primary">{suggestion.symbol}</span>
                          <span className={`badge ${getCategoryColor(suggestion.category)} badge-sm`}>
                            {suggestion.category}
                          </span>
                          <span className="text-xs text-base-content/60">{suggestion.marketCap}</span>
                        </div>
                        <div className="text-sm text-base-content/70 truncate">{suggestion.name}</div>
                      </div>
                      <ChevronDown className="w-4 h-4 text-base-content/40 rotate-270" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Search History */}
        {searchHistory.length > 0 && (
          <div className="text-center">
            <p className="text-sm text-base-content/60 mb-3 flex items-center justify-center gap-2">
              <Star className="w-4 h-4" />
              Recent Searches:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {searchHistory.map((search, index) => (
                <button
                  key={index}
                  type="button"
                  className="btn btn-xs btn-outline"
                  onClick={() => handleSuggestionClick({ symbol: search.symbol })}
                >
                  {search.symbol} ({search.market})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Popular Stocks */}
        <div className="text-center">
          <p className="text-sm text-base-content/60 mb-4 flex items-center justify-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Popular {market} Stocks:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {popularStocks[market].slice(0, 10).map((stock, index) => (
              <button
                key={index}
                type="button"
                className="btn btn-sm btn-outline hover:btn-primary transition-all duration-200 flex flex-col items-center p-3 h-auto"
                onClick={() => handleSuggestionClick(stock)}
              >
                <span className="font-bold">{stock.symbol}</span>
                <span className="text-xs opacity-70 truncate w-full">{stock.name.split(' ')[0]}</span>
                <span className={`badge ${getCategoryColor(stock.category)} badge-xs mt-1`}>
                  {stock.category}
               </span>
             </button>
           ))}
         </div>
       </div>

       {/* Market Stats */}
       <div className="grid grid-cols-2 gap-4 mt-6">
         <div className={`card ${market === 'US' ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200'} border`}>
           <div className="card-body p-4 text-center">
             <h4 className="font-semibold text-sm mb-2">
               {market === 'US' ? '🇺🇸 US Market Features' : '🇮🇳 Indian Market Features'}
             </h4>
             <div className="text-xs space-y-1">
               {market === 'US' ? (
                 <>
                   <div>• Real-time NYSE & NASDAQ data</div>
                   <div>• 25+ Technical indicators</div>
                   <div>• Comprehensive fundamentals</div>
                   <div>• SEC filing integration</div>
                 </>
               ) : (
                 <>
                   <div>• Live NSE & BSE data</div>
                   <div>• Screener.in integration</div>
                   <div>• Indian accounting standards</div>
                   <div>• Sector-specific analysis</div>
                 </>
               )}
             </div>
           </div>
         </div>
         
         <div className="card bg-base-100 border border-base-300">
           <div className="card-body p-4 text-center">
             <h4 className="font-semibold text-sm mb-2">
               🚀 Analysis Features
             </h4>
             <div className="text-xs space-y-1">
               <div>• AI-powered insights</div>
               <div>• 15+ Chart patterns</div>
               <div>• News sentiment analysis</div>
               <div>• Risk assessment</div>
             </div>
           </div>
         </div>
       </div>
     </form>
   </div>
 )
}