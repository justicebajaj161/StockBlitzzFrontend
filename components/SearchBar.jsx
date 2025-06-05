'use client'

import { useState, useEffect } from 'react'
import { Search, TrendingUp, Globe, ChevronDown } from 'lucide-react'

export default function SearchBar({ onSearch }) {
  const [symbol, setSymbol] = useState('')
  const [market, setMarket] = useState('US')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const popularStocks = {
    US: [
      { symbol: 'AAPL', name: 'Apple Inc.', category: 'Tech' },
      { symbol: 'GOOGL', name: 'Alphabet Inc.', category: 'Tech' },
      { symbol: 'MSFT', name: 'Microsoft Corp.', category: 'Tech' },
      { symbol: 'TSLA', name: 'Tesla Inc.', category: 'Auto' },
      { symbol: 'NVDA', name: 'NVIDIA Corp.', category: 'Tech' },
      { symbol: 'JPM', name: 'JPMorgan Chase', category: 'Finance' },
      { symbol: 'JNJ', name: 'Johnson & Johnson', category: 'Healthcare' }
    ],
    Indian: [
      { symbol: 'RELIANCE', name: 'Reliance Industries', category: 'Energy' },
      { symbol: 'TCS', name: 'Tata Consultancy Services', category: 'IT' },
      { symbol: 'INFY', name: 'Infosys Limited', category: 'IT' },
      { symbol: 'HDFCBANK', name: 'HDFC Bank Limited', category: 'Banking' },
      { symbol: 'IREDA', name: 'Indian Renewable Energy Development Agency', category: 'Infrastructure' },
      { symbol: 'IRCON', name: 'IRCON International Limited', category: 'Infrastructure' },
      { symbol: 'RVNL', name: 'Rail Vikas Nigam Limited', category: 'Infrastructure' },
      { symbol: 'BAJFINANCE', name: 'Bajaj Finance Limited', category: 'Finance' }
    ]
  }

  useEffect(() => {
    if (symbol.length > 1) {
      const currentStocks = popularStocks[market] || []
      const filtered = currentStocks.filter(stock =>
        stock.symbol.toLowerCase().includes(symbol.toLowerCase()) ||
        stock.name.toLowerCase().includes(symbol.toLowerCase())
      )
      setSuggestions(filtered.slice(0, 5))
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
    onSearch(suggestion.symbol, market)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Market Selector */}
        <div className="flex justify-center">
          <div className="tabs tabs-boxed bg-base-300">
            <button
              type="button"
              className={`tab ${market === 'US' ? 'tab-active' : ''}`}
              onClick={() => setMarket('US')}
            >
              <Globe className="w-4 h-4 mr-2" />
              US Market
            </button>
            <button
              type="button"
              className={`tab ${market === 'Indian' ? 'tab-active' : ''}`}
              onClick={() => setMarket('Indian')}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Indian Market
            </button>
          </div>
        </div>

        {/* Search Input */}
<div className="relative flex justify-center">
  <div className="join w-full shadow-lg max-w-2xl"> {/* Added max-width and centered */}
    <div className="indicator join-item w-full"> {/* Added w-full */}
              <span className="indicator-item badge badge-primary badge-sm">
                {market}
              </span>
              <input
                type="text"
                placeholder={market === 'US' ? 'Enter symbol (e.g., AAPL, GOOGL)' : 'Enter symbol (e.g., RELIANCE, TCS)'}
                className="input input-bordered input-lg join-item flex-1 w-full"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                onFocus={() => symbol.length > 1 && setShowSuggestions(true)}
              />
            </div>
            <button 
              type="submit" 
              className={`btn btn-primary btn-lg join-item px-8 ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {!isLoading && <Search className="w-5 h-5 mr-2" />}
              {isLoading ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-50 mt-2">
              <div className="bg-base-100 border border-base-300 rounded-lg shadow-xl max-h-64 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    className="w-full p-3 text-left hover:bg-base-200 border-b border-base-300 last:border-b-0 transition-colors"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-primary">{suggestion.symbol}</div>
                        <div className="text-sm text-base-content/70">{suggestion.name}</div>
                      </div>
                      <div className="badge badge-outline badge-sm">{suggestion.category}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Popular Stocks */}
        <div className="text-center">
          <p className="text-sm text-base-content/60 mb-3">Popular {market} Stocks:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {popularStocks[market].slice(0, 6).map((stock, index) => (
              <button
                key={index}
                type="button"
                className="btn btn-sm btn-outline"
                onClick={() => handleSuggestionClick(stock)}
              >
                {stock.symbol}
              </button>
            ))}
          </div>
        </div>
      </form>
    </div>
  )
}