'use client'

import { Activity, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react'

export default function TechnicalAnalysis({ technical, patterns }) {
  const getRSISignal = (rsi) => {
    if (!rsi) return { signal: 'Neutral', color: 'text-base-content' }
    if (rsi > 70) return { signal: 'Overbought', color: 'text-error' }
    if (rsi < 30) return { signal: 'Oversold', color: 'text-success' }
    return { signal: 'Neutral', color: 'text-base-content' }
  }

  const getMACDSignal = (macd) => {
    if (!macd?.macd || !macd?.signal) return { signal: 'Neutral', color: 'text-base-content' }
    if (macd.macd > macd.signal) return { signal: 'Bullish', color: 'text-success' }
    return { signal: 'Bearish', color: 'text-error' }
  }

  return (
    <div className="space-y-6">
      {/* Technical Indicators */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">
            <Activity className="w-6 h-6" />
            Technical Indicators
          </h2>
          
          {/* Moving Averages */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Moving Averages</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 bg-base-200 rounded-lg">
                <span className="text-sm">SMA 20</span>
                <span className="font-semibold">${technical?.sma_20?.toFixed(2) || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-base-200 rounded-lg">
                <span className="text-sm">SMA 50</span>
                <span className="font-semibold">${technical?.sma_50?.toFixed(2) || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-base-200 rounded-lg">
                <span className="text-sm">SMA 200</span>
                <span className="font-semibold">${technical?.sma_200?.toFixed(2) || 'N/A'}</span>
              </div>
            </div>
          </div>
          
          {/* RSI */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">RSI (14)</h3>
            <div className="p-4 bg-base-200 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-2xl font-bold">{technical?.rsi?.toFixed(2) || 'N/A'}</span>
                <span className={`badge ${getRSISignal(technical?.rsi).color}`}>
                  {getRSISignal(technical?.rsi).signal}
                </span>
              </div>
              <progress 
                className="progress progress-primary w-full" 
                value={technical?.rsi || 50} 
                max="100"
              ></progress>
            </div>
          </div>
          
          {/* MACD */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">MACD</h3>
            <div className="p-4 bg-base-200 rounded-lg">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-xs text-base-content/60">MACD</p>
                  <p className="font-semibold">{technical?.macd?.macd?.toFixed(3) || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-base-content/60">Signal</p>
                  <p className="font-semibold">{technical?.macd?.signal?.toFixed(3) || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-base-content/60">Histogram</p>
                  <p className="font-semibold">{technical?.macd?.histogram?.toFixed(3) || 'N/A'}</p>
                </div>
              </div>
              <div className="mt-2 text-center">
                <span className={`badge ${getMACDSignal(technical?.macd).color}`}>
                  {getMACDSignal(technical?.macd).signal}
                </span>
              </div>
            </div>
          </div>
          
          {/* Bollinger Bands */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Bollinger Bands</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 bg-base-200 rounded-lg">
                <span className="text-sm">Upper Band</span>
                <span className="font-semibold">${technical?.bollinger_bands?.upper?.toFixed(2) || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-base-200 rounded-lg">
                <span className="text-sm">Middle Band</span>
                <span className="font-semibold">${technical?.bollinger_bands?.middle?.toFixed(2) || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-base-200 rounded-lg">
                <span className="text-sm">Lower Band</span>
                <span className="font-semibold">${technical?.bollinger_bands?.lower?.toFixed(2) || 'N/A'}</span>
              </div>
            </div>
          </div>
          
          {/* ADX */}
          <div>
            <h3 className="font-semibold mb-3">ADX (Trend Strength)</h3>
            <div className="p-4 bg-base-200 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">{technical?.adx?.toFixed(2) || 'N/A'}</span>
                <span className="badge">
                  {technical?.adx > 50 ? 'Strong Trend' : technical?.adx > 25 ? 'Moderate Trend' : 'Weak Trend'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Patterns */}
      {patterns && patterns.length > 0 && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">
              <AlertCircle className="w-6 h-6" />
              Chart Patterns Detected
            </h2>
            
            <div className="space-y-3">
              {patterns.map((pattern, index) => (
                <div key={index} className="alert shadow-lg">
                  <div>
                    {pattern.type === 'Bullish' ? (
                      <TrendingUp className="w-6 h-6 text-success" />
                    ) : (
                      <TrendingDown className="w-6 h-6 text-error" />
                    )}
                    <div>
                      <h3 className="font-bold">{pattern.pattern}</h3>
                      <div className="text-xs">
                        Type: <span className={pattern.type === 'Bullish' ? 'text-success' : 'text-error'}>
                          {pattern.type}
                        </span> • Strength: {pattern.strength}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}