'use client'

import { useState, useEffect } from 'react'
import SearchBar from '../components/SearchBar'
import StockOverview from '../components/StockOverview'
import FundamentalAnalysis from '../components/FundamentalAnalysis'
import TechnicalAnalysis from '../components/TechnicalAnalysis'
import AIInsights from '../components/Allnsights'
import NewsSection from '../components/NewsSection'
import LoadingSpinner from '../components/LoadingSpinner'
import { Sparkles, BarChart3, TrendingUp, Newspaper } from 'lucide-react'

export default function Home() {
  const [stockData, setStockData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [sessionId, setSessionId] = useState(null)
  const [activeTab, setActiveTab] = useState('fundamentals')

  useEffect(() => {
    createSession()
  }, [])

  const createSession = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/session', {
        method: 'POST'
      })
      const data = await response.json()
      setSessionId(data.session_id)
    } catch (err) {
      console.error('Failed to create session:', err)
    }
  }

  const handleSearch = async (symbol, market) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('http://localhost:8000/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          symbol,
          market,
          session_id: sessionId 
        }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Stock analysis failed')
      }
      
      const data = await response.json()
      setStockData(data)
      setActiveTab('fundamentals') // Reset to first tab
    } catch (err) {
      setError(err.message)
      setStockData(null)
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'fundamentals', label: 'Fundamentals', icon: BarChart3 },
    { id: 'technical', label: 'Technical', icon: TrendingUp },
    { id: 'ai', label: 'AI Insights', icon: Sparkles },
    { id: 'news', label: 'News', icon: Newspaper }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'fundamentals':
        return <FundamentalAnalysis fundamentals={stockData.fundamentals} market={stockData.market} />
      case 'technical':
        return <TechnicalAnalysis technical={stockData.technical_analysis} patterns={stockData.chart_patterns} />
      case 'ai':
        return <AIInsights aiAnalysis={stockData.ai_analysis} />
      case 'news':
        return <NewsSection news={stockData.news_sentiment} />
      default:
        return <FundamentalAnalysis fundamentals={stockData.fundamentals} market={stockData.market} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300">
      {/* Enhanced Hero Section */}
      <div className="hero min-h-[50vh] bg-gradient-to-br from-primary via-secondary to-accent relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-white rounded-full animate-bounce"></div>
          <div className="absolute bottom-32 left-1/3 w-16 h-16 bg-white rounded-full animate-ping"></div>
        </div>
        
        <div className="hero-content text-center relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-6xl font-bold text-white mb-6 bg-gradient-to-r from-white to-base-100 bg-clip-text text-transparent">
              StockBlitz
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Harness the power of AI for comprehensive stock analysis across US and Indian markets
            </p>
            <div className="stats stats-horizontal shadow-2xl mb-8 bg-white/10 backdrop-blur-sm">
              <div className="stat text-white">
                <div className="stat-title text-white/70">Markets</div>
                <div className="stat-value text-2xl">2</div>
                <div className="stat-desc text-white/60">US & Indian</div>
              </div>
              <div className="stat text-white">
                <div className="stat-title text-white/70">Data Sources</div>
                <div className="stat-value text-2xl">5+</div>
                <div className="stat-desc text-white/60">Real-time APIs</div>
              </div>
              <div className="stat text-white">
                <div className="stat-title text-white/70">AI Powered</div>
                <div className="stat-value text-2xl">GPT</div>
                <div className="stat-desc text-white/60">Advanced Analysis</div>
              </div>
            </div>
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <LoadingSpinner />
            <p className="text-lg text-base-content/70 mt-4">Analyzing stock data...</p>
          </div>
        )}
        
        {/* Error State */}
        {error && (
          <div className="alert alert-error max-w-2xl mx-auto shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-bold">Analysis Failed</h3>
              <div className="text-sm">{error}</div>
            </div>
          </div>
        )}
        
        {/* Results Section */}
        {stockData && !loading && (
          <div className="space-y-8 animate-fadeIn">
            {/* Stock Overview */}
            <div className="card bg-base-100 shadow-2xl">
              <StockOverview 
                companyInfo={stockData.company_info}
                priceData={stockData.price_data}
                market={stockData.market}
                dataSources={stockData.data_sources}
              />
            </div>
            
            {/* Enhanced Tab Navigation */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body p-0">
                <div className="tabs tabs-lifted tabs-lg">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        className={`tab tab-lifted ${activeTab === tab.id ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                      >
                        <Icon className="w-5 h-5 mr-2" />
                        {tab.label}
                      </button>
                    )
                  })}
                </div>
                
                {/* Tab Content */}
                <div className="p-8">
                  {renderTabContent()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features Section (shown when no stock is analyzed) */}
        {!stockData && !loading && !error && (
          <div className="py-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Comprehensive Stock Analysis</h2>
              <p className="text-xl text-base-content/70">Everything you need to make informed investment decisions</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Feature Cards */}
              <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="card-body text-center">
                  <BarChart3 className="w-12 h-12 mx-auto text-primary mb-4" />
                  <h3 className="card-title justify-center">Fundamental Analysis</h3>
                  <p className="text-sm text-base-content/70">
                    In-depth financial metrics, ratios, and company fundamentals
                  </p>
                </div>
              </div>
              
              <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="card-body text-center">
                  <TrendingUp className="w-12 h-12 mx-auto text-secondary mb-4" />
                  <h3 className="card-title justify-center">Technical Indicators</h3>
                  <p className="text-sm text-base-content/70">
                    RSI, MACD, Bollinger Bands, and chart pattern detection
                  </p>
                </div>
              </div>
              
              <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="card-body text-center">
                  <Sparkles className="w-12 h-12 mx-auto text-accent mb-4" />
                  <h3 className="card-title justify-center">AI Insights</h3>
                  <p className="text-sm text-base-content/70">
                    GPT-powered analysis with investment recommendations
                  </p>
                </div>
              </div>
              
              <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="card-body text-center">
                  <Newspaper className="w-12 h-12 mx-auto text-info mb-4" />
                  <h3 className="card-title justify-center">News & Sentiment</h3>
                  <p className="text-sm text-base-content/70">
                    Latest news with sentiment analysis for market context
                  </p>
                </div>
              </div>
            </div>
            
            {/* Supported Markets */}
            <div className="mt-20 text-center">
              <h3 className="text-2xl font-bold mb-8">Supported Markets</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl">
                  <div className="card-body">
                    <h4 className="card-title text-2xl">🇺🇸 US Market</h4>
                    <p>NASDAQ, NYSE, AMEX</p>
                    <p className="text-sm opacity-90">Real-time data via FMP API & Yahoo Finance</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {['AAPL', 'GOOGL', 'MSFT', 'TSLA'].map(symbol => (
                        <span key={symbol} className="badge badge-sm bg-white/20">{symbol}</span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-xl">
                  <div className="card-body">
                    <h4 className="card-title text-2xl">🇮🇳 Indian Market</h4>
                    <p>NSE, BSE</p>
                    <p className="text-sm opacity-90">Comprehensive data via Screener.in & Yahoo Finance</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {['RELIANCE', 'TCS', 'IREDA', 'IRCON'].map(symbol => (
                        <span key={symbol} className="badge badge-sm bg-white/20">{symbol}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}