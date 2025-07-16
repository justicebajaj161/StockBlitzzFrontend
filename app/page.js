'use client'

import { useState, useEffect } from 'react'
import SearchBar from '../components/SearchBar'
import StockOverview from '../components/StockOverview'
import FundamentalAnalysis from '../components/FundamentalAnalysis'
import TechnicalAnalysis from '../components/TechnicalAnalysis'
import AIInsights from '../components/Allnsights'
import NewsSection from '../components/NewsSection'
import StockChart from '../components/StockChart'
import LoadingSpinner from '../components/LoadingSpinner'
import { Sparkles, BarChart3, TrendingUp, Newspaper, Activity, Globe, Database, Target, Zap } from 'lucide-react'

export default function Home() {
  const [stockData, setStockData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [sessionId, setSessionId] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [analysisStats, setAnalysisStats] = useState(null)

  useEffect(() => {
    createSession()
  }, [])

  const createSession = async () => {
    try {
      const response = await fetch('https://stockblitzbackend.onrender.com/api/session', {
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
      const startTime = Date.now()
      
      const response = await fetch('https://stockblitzbackend.onrender.com/api/analyze', {
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
      const endTime = Date.now()
      
      // Calculate analysis statistics
      const fundamentalMetrics = data.fundamentals ? 
        Object.values(data.fundamentals).reduce((total, section) => 
          total + (typeof section === 'object' && section !== null ? Object.keys(section).length : 0), 0
        ) : 0
      
      const technicalIndicators = data.technical_analysis ? 
        Object.keys(data.technical_analysis).filter(key => data.technical_analysis[key] !== null).length : 0
      
      setAnalysisStats({
        analysisTime: ((endTime - startTime) / 1000).toFixed(1),
        fundamentalMetrics,
        technicalIndicators,
        chartPatterns: data.chart_patterns?.length || 0,
        newsArticles: data.news_sentiment?.articles?.length || 0,
        dataSources: data.data_sources?.length || 0,
        dataQuality: data.ai_analysis?.data_quality || 'medium'
      })
      
      setStockData(data)
      setActiveTab('overview')
    } catch (err) {
      setError(err.message)
      setStockData(null)
      setAnalysisStats(null)
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity, description: 'Company info & key metrics' },
    { id: 'chart', label: 'Chart', icon: TrendingUp, description: 'Price charts & trends' },
    { id: 'fundamentals', label: 'Fundamentals', icon: BarChart3, description: 'Financial analysis' },
    { id: 'technical', label: 'Technical', icon: Database, description: '25+ indicators' },
    { id: 'ai', label: 'AI Insights', icon: Sparkles, description: 'AI-powered analysis' },
    { id: 'news', label: 'News', icon: Newspaper, description: 'Sentiment analysis' }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <StockOverview 
          companyInfo={stockData.company_info}
          priceData={stockData.price_data}
          market={stockData.market}
          dataSources={stockData.data_sources}
        />
      case 'chart':
        return <StockChart 
          symbol={stockData.symbol}
          market={stockData.market}
          priceData={stockData.price_data}
          technicalData={stockData.technical_analysis}
        />
      case 'fundamentals':
        return <FundamentalAnalysis 
          fundamentals={stockData.fundamentals} 
          market={stockData.market} 
        />
      case 'technical':
        return <TechnicalAnalysis 
          technical={stockData.technical_analysis} 
          patterns={stockData.chart_patterns} 
        />
      case 'ai':
        return <AIInsights aiAnalysis={stockData.ai_analysis} />
      case 'news':
        return <NewsSection news={stockData.news_sentiment} />
      default:
        return <StockOverview 
          companyInfo={stockData.company_info}
          priceData={stockData.price_data}
          market={stockData.market}
          dataSources={stockData.data_sources}
        />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300">
      {/* Enhanced Hero Section */}
      <div className="hero min-h-[60vh] bg-gradient-to-br from-primary via-secondary to-accent relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-white rounded-full animate-bounce"></div>
          <div className="absolute bottom-32 left-1/3 w-16 h-16 bg-white rounded-full animate-ping"></div>
          <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-white rounded-full animate-pulse delay-1000"></div>
        </div>
        
        <div className="hero-content text-center relative z-10">
          <div className="max-w-4xl">
            <h1 className="text-7xl font-bold text-white mb-6 bg-gradient-to-r from-white to-base-100 bg-clip-text text-transparent">
              StockBlitz Pro
            </h1>
            <p className="text-2xl text-white/90 mb-8 leading-relaxed">
              Ultra-comprehensive stock analysis powered by AI with 25+ technical indicators and real-time market data
            </p>
            
            {/* Enhanced stats section */}
            <div className="stats stats-horizontal shadow-2xl mb-8 bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="stat text-white">
                <div className="stat-figure">
                  <Globe className="w-8 h-8" />
                </div>
                <div className="stat-title text-white/70">Markets</div>
                <div className="stat-value text-3xl">2</div>
                <div className="stat-desc text-white/60">US & Indian</div>
              </div>
              <div className="stat text-white">
                <div className="stat-figure">
                  <Database className="w-8 h-8" />
                </div>
                <div className="stat-title text-white/70">Data Sources</div>
                <div className="stat-value text-3xl">5+</div>
                <div className="stat-desc text-white/60">Real-time APIs</div>
              </div>
              <div className="stat text-white">
                <div className="stat-figure">
                  <Target className="w-8 h-8" />
                </div>
                <div className="stat-title text-white/70">Indicators</div>
                <div className="stat-value text-3xl">25+</div>
                <div className="stat-desc text-white/60">Technical Analysis</div>
              </div>
              <div className="stat text-white">
                <div className="stat-figure">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div className="stat-title text-white/70">AI Powered</div>
                <div className="stat-value text-3xl">GPT</div>
                <div className="stat-desc text-white/60">Advanced Analysis</div>
              </div>
            </div>
            
            <SearchBar onSearch={handleSearch} />
            
            {/* Analysis Performance Stats */}
            {analysisStats && (
              <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <p className="text-white/90 text-sm mb-2">Last Analysis Performance:</p>
                <div className="flex justify-center gap-4 text-white/80 text-xs">
                  <span>⚡ {analysisStats.analysisTime}s</span>
                  <span>📊 {analysisStats.fundamentalMetrics} metrics</span>
                  <span>📈 {analysisStats.technicalIndicators} indicators</span>
                  <span>🔍 {analysisStats.chartPatterns} patterns</span>
                  <span>📰 {analysisStats.newsArticles} articles</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <LoadingSpinner message="Performing ultra-comprehensive analysis..." />
            <div className="mt-8 p-4 bg-base-100 rounded-lg shadow-lg max-w-md">
              <h3 className="font-semibold text-center mb-2">Analysis in Progress</h3>
              <div className="text-sm text-base-content/70 space-y-1">
                <div>• Fetching real-time market data</div>
                <div>• Analyzing 25+ technical indicators</div>
                <div>• Processing fundamental metrics</div>
                <div>• Detecting chart patterns</div>
                <div>• Generating AI insights</div>
                <div>• Analyzing news sentiment</div>
              </div>
            </div>
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
              <div className="text-xs mt-1 opacity-70">Try a different symbol or check your internet connection</div>
            </div>
          </div>
        )}
        
        {/* Results Section */}
        {stockData && !loading && (
          <div className="space-y-8 animate-fadeIn">
            {/* Analysis Summary Card */}
            <div className="card bg-gradient-to-r from-base-100 to-base-200 shadow-2xl border border-base-300">
              <div className="card-body p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold">Analysis Complete</h2>
                    <p className="text-base-content/70">
                      Comprehensive analysis for {stockData.symbol} ({stockData.market} Market)
                    </p>
                  </div>
                  <div className="badge badge-success badge-lg">
                    <Zap className="w-4 h-4 mr-1" />
                    Live Data
                  </div>
                </div>
                
                {analysisStats && (
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    <div className="text-center p-3 bg-primary/10 rounded-lg border border-primary/20">
                      <div className="text-lg font-bold text-primary">{analysisStats.fundamentalMetrics}</div>
                      <div className="text-xs text-primary/70">Fundamental Metrics</div>
                    </div>
                    <div className="text-center p-3 bg-secondary/10 rounded-lg border border-secondary/20">
                      <div className="text-lg font-bold text-secondary">{analysisStats.technicalIndicators}</div>
                      <div className="text-xs text-secondary/70">Technical Indicators</div>
                    </div>
                    <div className="text-center p-3 bg-accent/10 rounded-lg border border-accent/20">
                      <div className="text-lg font-bold text-accent">{analysisStats.chartPatterns}</div>
                      <div className="text-xs text-accent/70">Chart Patterns</div>
                    </div>
                    <div className="text-center p-3 bg-info/10 rounded-lg border border-info/20">
                      <div className="text-lg font-bold text-info">{analysisStats.newsArticles}</div>
                      <div className="text-xs text-info/70">News Articles</div>
                    </div>
                    <div className="text-center p-3 bg-success/10 rounded-lg border border-success/20">
                      <div className="text-lg font-bold text-success">{analysisStats.dataSources}</div>
                      <div className="text-xs text-success/70">Data Sources</div>
                    </div>
                    <div className="text-center p-3 bg-warning/10 rounded-lg border border-warning/20">
                      <div className="text-lg font-bold text-warning">{analysisStats.analysisTime}s</div>
                      <div className="text-xs text-warning/70">Analysis Time</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Tab Navigation */}
            <div className="card bg-base-100 shadow-2xl border border-base-300">
              <div className="card-body p-0">
                <div className="tabs tabs-lifted tabs-lg bg-base-200">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        className={`tab tab-lifted relative group ${
                          activeTab === tab.id 
                            ? 'tab-active bg-base-100 border-base-300' 
                            : 'hover:bg-base-300/50'
                        } transition-all duration-200`}
                        onClick={() => setActiveTab(tab.id)}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="w-5 h-5" />
                          <div className="flex flex-col items-start">
                            <span className="font-semibold">{tab.label}</span>
                            <span className="text-xs opacity-70 hidden md:block">
                              {tab.description}
                            </span>
                          </div>
                        </div>
                        
                        {/* Active tab indicator */}
                        {activeTab === tab.id && (
                          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-primary rounded-t-full"></div>
                        )}
                      </button>
                    )
                  })}
                </div>
                
                {/* Tab Content */}
                <div className="p-8 min-h-[600px]">
                  <div className="animate-fadeIn">
                    {renderTabContent()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Features Section */}
        {!stockData && !loading && !error && (
          <div className="py-20">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Ultra-Comprehensive Stock Analysis
              </h2>
              <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
                Get professional-grade analysis with 25+ technical indicators, comprehensive fundamentals, 
                AI-powered insights, and real-time sentiment analysis - all in one platform
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="card bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="card-body text-center">
                  <BarChart3 className="w-16 h-16 mx-auto text-blue-600 mb-4" />
                  <h3 className="card-title justify-center text-blue-800">Ultra-Deep Fundamentals</h3>
                  <p className="text-sm text-blue-700">
                    100+ financial metrics, ratios, and comprehensive balance sheet analysis
                  </p>
                  <div className="mt-4 space-y-1 text-xs text-blue-600">
                    <div>• Income Statement Analysis</div>
                    <div>• Balance Sheet Metrics</div>
                    <div>• Cash Flow Analysis</div>
                    <div>• Valuation Ratios</div>
                  </div>
                </div>
              </div>
              
              <div className="card bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="card-body text-center">
                  <TrendingUp className="w-16 h-16 mx-auto text-green-600 mb-4" />
                  <h3 className="card-title justify-center text-green-800">25+ Technical Indicators</h3>
                  <p className="text-sm text-green-700">
                    Advanced technical analysis with RSI, MACD, Bollinger Bands, Fibonacci, and more
                  </p>
                  <div className="mt-4 space-y-1 text-xs text-green-600">
                    <div>• Momentum Oscillators</div>
                    <div>• Moving Averages</div>
                    <div>• Volume Indicators</div>
                    <div>• Chart Patterns</div>
                  </div>
                </div>
              </div>
              
              <div className="card bg-gradient-to-br from-purple-50 to-violet-100 border border-purple-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="card-body text-center">
                  <Sparkles className="w-16 h-16 mx-auto text-purple-600 mb-4" />
                  <h3 className="card-title justify-center text-purple-800">AI-Powered Insights</h3>
                  <p className="text-sm text-purple-700">
                    Advanced AI analysis with investment recommendations and risk assessment
                  </p>
                  <div className="mt-4 space-y-1 text-xs text-purple-600">
                    <div>• Investment Recommendations</div>
                    <div>• Risk Analysis</div>
                    <div>• Price Targets</div>
                    <div>• Market Commentary</div>
                  </div>
                </div>
              </div>
              
              <div className="card bg-gradient-to-br from-orange-50 to-yellow-100 border border-orange-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="card-body text-center">
                  <Newspaper className="w-16 h-16 mx-auto text-orange-600 mb-4" />
                  <h3 className="card-title justify-center text-orange-800">News Sentiment Analysis</h3>
                  <p className="text-sm text-orange-700">
                    Real-time news analysis with sentiment scoring and market impact assessment
                  </p>
                  <div className="mt-4 space-y-1 text-xs text-orange-600">
                    <div>• Sentiment Scoring</div>
                    <div>• News Impact Analysis</div>
                    <div>• Market Correlation</div>
                    <div>• Trend Detection</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Market Support Section */}
            <div className="mt-20 text-center">
              <h3 className="text-3xl font-bold mb-8">Multi-Market Support</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl">
                  <div className="card-body">
                    <h4 className="card-title text-3xl mb-4">🇺🇸 US Market</h4>
                    <div className="text-left space-y-2">
                      <p className="font-semibold">Exchanges: NASDAQ, NYSE, AMEX</p>
                      <p>Real-time data via Yahoo Finance & FMP API</p>
                      <p className="text-sm opacity-90">Comprehensive SEC filing integration</p>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-6">
                      {['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'NVDA', 'JPM'].map(symbol => (
                        <span key={symbol} className="badge badge-lg bg-white/20 text-white border-white/30">
                          {symbol}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-xl">
                  <div className="card-body">
                    <h4 className="card-title text-3xl mb-4">🇮🇳 Indian Market</h4>
                    <div className="text-left space-y-2">
                      <p className="font-semibold">Exchanges: NSE, BSE</p>
                      <p>Comprehensive data via Screener.in & Yahoo Finance</p>
                      <p className="text-sm opacity-90">Indian accounting standards support</p>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-6">
                      {['RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'IREDA', 'IRCON'].map(symbol => (
                        <span key={symbol} className="badge badge-lg bg-white/20 text-white border-white/30">
                          {symbol}
                        </span>
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