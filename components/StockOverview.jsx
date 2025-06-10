'use client'

import { TrendingUp, TrendingDown, Activity, Globe, Database, Clock, Star, Award, AlertTriangle, Target } from 'lucide-react'

export default function StockOverview({ companyInfo, priceData, market, dataSources }) {
  const isPositive = priceData?.change_percent > 0
  
  const formatNumber = (num, decimals = 2) => {
    if (!num || num === 'N/A' || num === 0) return 'N/A'
    if (Math.abs(num) >= 1e12) return (num / 1e12).toFixed(decimals) + 'T'
    if (Math.abs(num) >= 1e9) return (num / 1e9).toFixed(decimals) + 'B'
    if (Math.abs(num) >= 1e6) return (num / 1e6).toFixed(decimals) + 'M'
    if (Math.abs(num) >= 1e3) return (num / 1e3).toFixed(decimals) + 'K'
    return num.toFixed(decimals)
  }

  const formatCurrency = (num, currency = market === 'Indian' ? '₹' : '$') => {
    if (!num || num === 'N/A' || num === 0) return 'N/A'
    return `${currency}${formatNumber(num)}`
  }

  const getMarketBadgeColor = (market) => {
    return market === 'Indian' ? 'badge-warning' : 'badge-info'
  }

  const getPriceChangeColor = (change) => {
    if (change > 5) return 'text-green-600 bg-green-50'
    if (change > 0) return 'text-green-500 bg-green-50'
    if (change < -5) return 'text-red-600 bg-red-50'
    if (change < 0) return 'text-red-500 bg-red-50'
    return 'text-gray-600 bg-gray-50'
  }

  const getPerformanceRating = (priceData) => {
    const vs52High = priceData?.price_vs_52w_high || 0
    if (vs52High > -5) return { rating: 'Excellent', color: 'text-green-600', icon: Award }
    if (vs52High > -15) return { rating: 'Good', color: 'text-blue-600', icon: Star }
    if (vs52High > -30) return { rating: 'Fair', color: 'text-yellow-600', icon: Target }
    return { rating: 'Poor', color: 'text-red-600', icon: AlertTriangle }
  }

  const performance = getPerformanceRating(priceData)
  const PerformanceIcon = performance.icon

  return (
    <div className="space-y-6">
      {/* Enhanced Header Section */}
      <div className="card bg-gradient-to-r from-base-100 to-base-200 shadow-xl">
        <div className="card-body">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex items-start gap-4 flex-1">
              {companyInfo?.image && (
                <div className="avatar">
                  <div className="w-24 h-24 rounded-xl bg-base-200 p-3 shadow-lg">
                    <img 
                      src={companyInfo.image} 
                      alt={companyInfo.companyName}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {companyInfo?.companyName || 'Company Name'}
                  </h2>
                  <div className={`badge ${getMarketBadgeColor(market)} badge-lg shadow-md`}>
                    <Globe className="w-3 h-3 mr-1" />
                    {market}
                  </div>
                  <div className={`badge badge-outline ${performance.color}`}>
                    <PerformanceIcon className="w-3 h-3 mr-1" />
                    {performance.rating}
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-base-content/70 mb-3">
                  <span className="font-mono font-bold text-lg">{companyInfo?.symbol}</span>
                  {companyInfo?.exchangeShortName && (
                    <>
                      <span>•</span>
                      <span className="badge badge-ghost">{companyInfo.exchangeShortName}</span>
                    </>
                  )}
                  {companyInfo?.currency && (
                    <>
                      <span>•</span>
                      <span className="text-sm">{companyInfo.currency}</span>
                    </>
                  )}
                </div>
                
                {(companyInfo?.sector || companyInfo?.industry) && (
                  <div className="flex items-center gap-2 mb-4">
                    {companyInfo?.sector && (
                      <span className="badge badge-primary badge-lg">{companyInfo.sector}</span>
                    )}
                    {companyInfo?.industry && (
                      <span className="badge badge-secondary">{companyInfo.industry}</span>
                    )}
                    {companyInfo?.country && (
                      <span className="badge badge-outline">{companyInfo.country}</span>
                    )}
                  </div>
                )}
                
                {/* Enhanced Data Sources */}
                <div className="flex items-center gap-2 text-sm">
                  <Database className="w-4 h-4" />
                  <span className="text-base-content/60">Data Sources:</span>
                  {dataSources?.map((source, index) => (
                    <span key={index} className="badge badge-sm badge-outline capitalize">
                      {source}
                    </span>
                  ))}
                  <span className="badge badge-sm badge-success">Live</span>
                </div>
              </div>
            </div>
            
            {/* Enhanced Price Section */}
            <div className="stats shadow-2xl bg-base-100 border border-base-300">
              <div className="stat">
                <div className="stat-title flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Current Price
                </div>
                <div className="stat-value text-4xl font-bold text-primary">
                  {market === 'Indian' ? '₹' : '$'}{priceData?.current_price?.toFixed(2) || 'N/A'}
                </div>
                <div className="stat-desc">
                  <div className={`flex items-center gap-2 p-2 rounded-lg ${getPriceChangeColor(priceData?.change_percent)}`}>
                    {isPositive ? (
                      <TrendingUp className="w-5 h-5" />
                    ) : (
                      <TrendingDown className="w-5 h-5" />
                    )}
                    <span className="font-bold text-lg">
                      {priceData?.change?.toFixed(2) || '0.00'} ({priceData?.change_percent?.toFixed(2) || '0.00'}%)
                    </span>
                  </div>
                  <div className="mt-2 text-xs opacity-70">
                    Previous: {market === 'Indian' ? '₹' : '$'}{priceData?.previous_close?.toFixed(2) || 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced Trading Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat bg-base-100 rounded-xl shadow-lg border border-base-300 p-4 hover:shadow-xl transition-shadow">
          <div className="stat-title text-sm">Day's Volume</div>
          <div className="stat-value text-xl text-primary">
            {priceData?.volume ? formatNumber(priceData.volume) : 'N/A'}
          </div>
          <div className="stat-desc">
            Avg: {priceData?.avg_volume_30d ? formatNumber(priceData.avg_volume_30d) : 'N/A'}
          </div>
        </div>
        
        <div className="stat bg-base-100 rounded-xl shadow-lg border border-base-300 p-4 hover:shadow-xl transition-shadow">
          <div className="stat-title text-sm">Day's Range</div>
          <div className="stat-value text-xl text-secondary">
            {market === 'Indian' ? '₹' : '$'}{priceData?.low?.toFixed(2) || 'N/A'}
          </div>
          <div className="stat-desc">
            to {market === 'Indian' ? '₹' : '$'}{priceData?.high?.toFixed(2) || 'N/A'}
          </div>
        </div>
        
        <div className="stat bg-base-100 rounded-xl shadow-lg border border-base-300 p-4 hover:shadow-xl transition-shadow">
          <div className="stat-title text-sm">52W High</div>
          <div className="stat-value text-xl text-success">
            {market === 'Indian' ? '₹' : '$'}{priceData?.high_52_week?.toFixed(2) || 'N/A'}
          </div>
          <div className="stat-desc text-success">
            {priceData?.price_vs_52w_high ? `${priceData.price_vs_52w_high.toFixed(1)}% from high` : 'N/A'}
          </div>
        </div>
        
        <div className="stat bg-base-100 rounded-xl shadow-lg border border-base-300 p-4 hover:shadow-xl transition-shadow">
          <div className="stat-title text-sm">52W Low</div>
          <div className="stat-value text-xl text-error">
            {market === 'Indian' ? '₹' : '$'}{priceData?.low_52_week?.toFixed(2) || 'N/A'}
          </div>
          <div className="stat-desc text-error">
            {priceData?.price_vs_52w_low ? `+${priceData.price_vs_52w_low.toFixed(1)}% from low` : 'N/A'}
          </div>
        </div>
      </div>
      
      {/* Market-Specific Key Metrics */}
      {market === 'Indian' ? (
        /* Indian Market Metrics */
        <div className="card bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-200 shadow-xl">
          <div className="card-body">
            <h3 className="card-title text-xl mb-4 text-orange-800">
              🇮🇳 Indian Market Key Metrics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-white rounded-lg border border-orange-200 shadow-md hover:shadow-lg transition-shadow">
                <p className="text-sm text-orange-600 mb-1">Market Cap</p>
                <p className="font-bold text-lg text-orange-800">
                  {formatCurrency(companyInfo?.marketCap, '₹')}
                </p>
                <p className="text-xs text-orange-500">
                  {companyInfo?.marketCap > 2e12 ? 'Large Cap' : companyInfo?.marketCap > 5e11 ? 'Mid Cap' : 'Small Cap'}
                </p>
              </div>
              
              <div className="text-center p-4 bg-white rounded-lg border border-green-200 shadow-md hover:shadow-lg transition-shadow">
                <p className="text-sm text-green-600 mb-1">P/E Ratio</p>
                <p className="font-bold text-lg text-green-800">
                  {companyInfo?.pe?.toFixed(2) || 'N/A'}
                </p>
                <p className="text-xs text-green-500">
                  {companyInfo?.pe < 15 ? 'Undervalued' : companyInfo?.pe < 25 ? 'Fair' : 'Expensive'}
                </p>
              </div>
              
              <div className="text-center p-4 bg-white rounded-lg border border-blue-200 shadow-md hover:shadow-lg transition-shadow">
                <p className="text-sm text-blue-600 mb-1">Book Value</p>
                <p className="font-bold text-lg text-blue-800">
                  ₹{companyInfo?.bookValue?.toFixed(2) || 'N/A'}
                </p>
                <p className="text-xs text-blue-500">Per Share</p>
              </div>
              
              <div className="text-center p-4 bg-white rounded-lg border border-purple-200 shadow-md hover:shadow-lg transition-shadow">
                <p className="text-sm text-purple-600 mb-1">Dividend Yield</p>
                <p className="font-bold text-lg text-purple-800">
                  {companyInfo?.dividendYield 
                    ? (companyInfo.dividendYield * 100).toFixed(2) + '%'
                    : '0.00%'
                  }
                </p>
                <p className="text-xs text-purple-500">Annual</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* US Market Metrics */
        <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 shadow-xl">
          <div className="card-body">
            <h3 className="card-title text-xl mb-4 text-blue-800">
              🇺🇸 US Market Key Metrics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-white rounded-lg border border-blue-200 shadow-md hover:shadow-lg transition-shadow">
                <p className="text-sm text-blue-600 mb-1">Market Cap</p>
                <p className="font-bold text-lg text-blue-800">
                  {formatCurrency(companyInfo?.mktCap)}
                </p>
                <p className="text-xs text-blue-500">
                  {companyInfo?.mktCap > 2e11 ? 'Large Cap' : companyInfo?.mktCap > 2e10 ? 'Mid Cap' : 'Small Cap'}
                </p>
              </div>
              
              <div className="text-center p-4 bg-white rounded-lg border border-green-200 shadow-md hover:shadow-lg transition-shadow">
                <p className="text-sm text-green-600 mb-1">P/E Ratio</p>
                <p className="font-bold text-lg text-green-800">
                  {companyInfo?.pe?.toFixed(2) || 'N/A'}
                </p>
                <p className="text-xs text-green-500">
                  Forward: {companyInfo?.forwardPE?.toFixed(2) || 'N/A'}
                </p>
              </div>
              
              <div className="text-center p-4 bg-white rounded-lg border border-purple-200 shadow-md hover:shadow-lg transition-shadow">
                <p className="text-sm text-purple-600 mb-1">Beta</p>
                <p className="font-bold text-lg text-purple-800">
                  {companyInfo?.beta?.toFixed(2) || 'N/A'}
                </p>
                <p className="text-xs text-purple-500">
                  {companyInfo?.beta > 1.5 ? 'High Risk' : companyInfo?.beta > 1 ? 'Market Risk' : 'Low Risk'}
                </p>
              </div>
              
              <div className="text-center p-4 bg-white rounded-lg border border-orange-200 shadow-md hover:shadow-lg transition-shadow">
                <p className="text-sm text-orange-600 mb-1">Dividend Yield</p>
                <p className="font-bold text-lg text-orange-800">
                  {companyInfo?.dividendYield 
                    ? (companyInfo.dividendYield * 100).toFixed(2) + '%'
                    : companyInfo?.lastDiv 
                      ? (companyInfo.lastDiv * 100).toFixed(2) + '%'
                      : '0.00%'
                  }
                </p>
                <p className="text-xs text-orange-500">
                  Annual Rate: ${companyInfo?.lastDiv?.toFixed(2) || '0.00'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Enhanced Company Description */}
      {companyInfo?.description && (
        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body">
            <h3 className="card-title text-xl mb-4 flex items-center gap-2">
              <Activity className="w-6 h-6" />
              About {companyInfo.companyName}
            </h3>
            
            {/* Company Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {companyInfo?.employees && (
                <div className="stat bg-base-200 rounded-lg p-3">
                  <div className="stat-title text-xs">Employees</div>
                  <div className="stat-value text-sm">{formatNumber(companyInfo.employees)}</div>
                </div>
              )}
              {companyInfo?.website && (
                <div className="stat bg-base-200 rounded-lg p-3">
                  <div className="stat-title text-xs">Website</div>
                  <div className="stat-value text-sm">
                    <a 
                      href={companyInfo.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="link link-primary text-xs"
                    >
                      Visit Site
                    </a>
                  </div>
                </div>
              )}
              <div className="stat bg-base-200 rounded-lg p-3">
                <div className="stat-title text-xs">Exchange</div>
                <div className="stat-value text-sm">{companyInfo?.exchange || companyInfo?.exchangeShortName || 'N/A'}</div>
              </div>
              <div className="stat bg-base-200 rounded-lg p-3">
                <div className="stat-title text-xs">Currency</div>
                <div className="stat-value text-sm">{companyInfo?.currency || (market === 'Indian' ? 'INR' : 'USD')}</div>
              </div>
            </div>
            
            <div className="prose max-w-none">
              <p className="text-sm leading-relaxed text-base-content/80">
                {companyInfo.description.length > 600 
                  ? `${companyInfo.description.substring(0, 600)}...` 
                  : companyInfo.description
                }
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Market Status Indicator */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
          <span className="text-sm text-base-content/60">Live Market Data</span>
        </div>
        <div className="text-xs text-base-content/50">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  )
}