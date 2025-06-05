'use client'

import { TrendingUp, TrendingDown, Activity, Globe, Database, Clock } from 'lucide-react'

export default function StockOverview({ companyInfo, priceData, market, dataSources }) {
  const isPositive = priceData?.change_percent > 0
  
  const formatNumber = (num, decimals = 2) => {
    if (!num || num === 'N/A') return 'N/A'
    if (Math.abs(num) >= 1e9) return (num / 1e9).toFixed(decimals) + 'B'
    if (Math.abs(num) >= 1e6) return (num / 1e6).toFixed(decimals) + 'M'
    if (Math.abs(num) >= 1e3) return (num / 1e3).toFixed(decimals) + 'K'
    return num.toFixed(decimals)
  }

  const getMarketBadgeColor = (market) => {
    return market === 'Indian' ? 'badge-warning' : 'badge-info'
  }

  return (
    <div className="card-body">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div className="flex items-start gap-4">
          {companyInfo?.image && (
            <div className="avatar">
              <div className="w-20 h-20 rounded-xl bg-base-200 p-2">
                <img 
                  src={companyInfo.image} 
                  alt={companyInfo.companyName}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl font-bold">{companyInfo?.companyName || 'Company Name'}</h2>
              <div className={`badge ${getMarketBadgeColor(market)} badge-lg`}>
                <Globe className="w-3 h-3 mr-1" />
                {market}
              </div>
            </div>
            <div className="flex items-center gap-4 text-base-content/70 mb-2">
              <span className="font-mono font-semibold">{companyInfo?.symbol}</span>
              {companyInfo?.exchangeShortName && (
                <>
                  <span>•</span>
                  <span>{companyInfo.exchangeShortName}</span>
                </>
              )}
            </div>
            {companyInfo?.sector && (
              <div className="flex items-center gap-2 mb-3">
                <span className="badge badge-outline">{companyInfo.sector}</span>
                {companyInfo?.industry && (
                  <span className="badge badge-ghost">{companyInfo.industry}</span>
                )}
              </div>
            )}
            {/* Data Sources */}
            <div className="flex items-center gap-2 text-sm">
              <Database className="w-4 h-4" />
              <span className="text-base-content/60">Data from:</span>
              {dataSources?.map((source, index) => (
                <span key={index} className="badge badge-sm badge-outline">
                  {source}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        {/* Price Section */}
        <div className="stats shadow-lg bg-base-200">
          <div className="stat">
            <div className="stat-title">Current Price</div>
            <div className="stat-value text-primary text-3xl">
              ${priceData?.current_price?.toFixed(2) || 'N/A'}
            </div>
            <div className="stat-desc flex items-center gap-2">
              {isPositive ? (
                <TrendingUp className="w-4 h-4 text-success" />
              ) : (
                <TrendingDown className="w-4 h-4 text-error" />
              )}
              <span className={isPositive ? 'text-success font-semibold' : 'text-error font-semibold'}>
                {priceData?.change?.toFixed(2) || '0.00'} ({priceData?.change_percent?.toFixed(2) || '0.00'}%)
              </span>
            </div>
            <div className="stat-desc flex items-center gap-1 mt-1">
              <Clock className="w-3 h-3" />
              <span className="text-xs">Real-time data</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="divider my-6"></div>
      
      {/* Trading Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="stat bg-base-200 rounded-lg p-4">
          <div className="stat-title text-sm">Volume</div>
          <div className="stat-value text-lg">
            {priceData?.volume ? formatNumber(priceData.volume) : 'N/A'}
          </div>
          <div className="stat-desc">Daily</div>
        </div>
        
        <div className="stat bg-base-200 rounded-lg p-4">
          <div className="stat-title text-sm">Day Range</div>
          <div className="stat-value text-lg">
            ${priceData?.low?.toFixed(2) || 'N/A'}
          </div>
          <div className="stat-desc">
            to ${priceData?.high?.toFixed(2) || 'N/A'}
          </div>
        </div>
        
        <div className="stat bg-base-200 rounded-lg p-4">
          <div className="stat-title text-sm">Open</div>
          <div className="stat-value text-lg">
            ${priceData?.open?.toFixed(2) || 'N/A'}
          </div>
          <div className="stat-desc">Today</div>
        </div>
        
        <div className="stat bg-base-200 rounded-lg p-4">
          <div className="stat-title text-sm">Previous Close</div>
          <div className="stat-value text-lg">
            ${((priceData?.current_price || 0) - (priceData?.change || 0)).toFixed(2)}
          </div>
          <div className="stat-desc">Last session</div>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-base-content/60 mb-1">Market Cap</p>
          <p className="font-bold text-lg">
            ${formatNumber(companyInfo?.mktCap || companyInfo?.marketCap)}
          </p>
        </div>
        
        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg border border-green-200 dark:border-green-800">
          <p className="text-sm text-base-content/60 mb-1">P/E Ratio</p>
          <p className="font-bold text-lg">
            {companyInfo?.pe?.toFixed(2) || 'N/A'}
          </p>
        </div>
        
        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg border border-purple-200 dark:border-purple-800">
          <p className="text-sm text-base-content/60 mb-1">Beta</p>
          <p className="font-bold text-lg">
            {companyInfo?.beta?.toFixed(2) || 'N/A'}
          </p>
        </div>
        
        <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg border border-orange-200 dark:border-orange-800">
          <p className="text-sm text-base-content/60 mb-1">Dividend Yield</p>
          <p className="font-bold text-lg">
            {companyInfo?.dividendYield 
              ? (companyInfo.dividendYield * 100).toFixed(2) + '%'
              : companyInfo?.lastDiv 
                ? (companyInfo.lastDiv * 100).toFixed(2) + '%'
                : '0.00%'
            }
          </p>
        </div>
      </div>
      
      {/* Company Description */}
      {companyInfo?.description && (
        <>
          <div className="divider"></div>
          <div className="prose max-w-none">
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              About {companyInfo.companyName}
            </h3>
            <p className="text-sm leading-relaxed text-base-content/80">
              {companyInfo.description.length > 500 
                ? `${companyInfo.description.substring(0, 500)}...` 
                : companyInfo.description
              }
            </p>
            {companyInfo?.website && (
              <div className="mt-3">
                <a 
                  href={companyInfo.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-outline"
                >
                  Visit Website
                </a>
              </div>
            )}
          </div>
        </>
      )}
      
      {/* Market Status Indicator */}
      <div className="mt-4 flex justify-end">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <span className="text-xs text-base-content/60">Market Data Active</span>
        </div>
      </div>
    </div>
  )
}