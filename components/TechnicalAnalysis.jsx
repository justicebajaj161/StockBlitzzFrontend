'use client'

import { Activity, TrendingUp, TrendingDown, AlertCircle, Target, Zap, BarChart3, PieChart } from 'lucide-react'

export default function TechnicalAnalysis({ technical, patterns }) {
  const formatValue = (value, decimals = 2) => {
    if (value === null || value === undefined || value === 'N/A') return 'N/A'
    if (typeof value === 'number') {
      return value.toFixed(decimals)
    }
    return value
  }

  const getRSISignal = (rsi) => {
    if (!rsi || rsi === 'N/A') return { signal: 'No Data', color: 'text-base-content', bgColor: 'bg-gray-100' }
    if (rsi > 70) return { signal: 'Overbought', color: 'text-red-600', bgColor: 'bg-red-100' }
    if (rsi < 30) return { signal: 'Oversold', color: 'text-green-600', bgColor: 'bg-green-100' }
    return { signal: 'Neutral', color: 'text-blue-600', bgColor: 'bg-blue-100' }
  }

  const getMACDSignal = (macd) => {
    if (!macd?.macd || !macd?.signal) return { signal: 'No Data', color: 'text-base-content', bgColor: 'bg-gray-100' }
    if (macd.macd > macd.signal) return { signal: 'Bullish', color: 'text-green-600', bgColor: 'bg-green-100' }
    return { signal: 'Bearish', color: 'text-red-600', bgColor: 'bg-red-100' }
  }

  const getSignalStrength = (value, thresholds) => {
    if (!value) return 'No Data'
    if (value > thresholds.strong) return 'Strong'
    if (value > thresholds.moderate) return 'Moderate'
    return 'Weak'
  }

  const getOverallSentiment = () => {
    const sentiment = technical?.overall_signal?.overall_sentiment || 'Neutral'
    const confidence = technical?.overall_signal?.confidence || 0
    
    if (sentiment === 'Bullish') {
      return {
        sentiment,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        borderColor: 'border-green-200',
        icon: TrendingUp,
        strength: confidence > 70 ? 'Strong' : confidence > 40 ? 'Moderate' : 'Weak'
      }
    } else if (sentiment === 'Bearish') {
      return {
        sentiment,
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        borderColor: 'border-red-200',
        icon: TrendingDown,
        strength: confidence > 70 ? 'Strong' : confidence > 40 ? 'Moderate' : 'Weak'
      }
    }
    
    return {
      sentiment: 'Neutral',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      borderColor: 'border-blue-200',
      icon: Activity,
      strength: 'Balanced'
    }
  }

  const overallSentiment = getOverallSentiment()
  const SentimentIcon = overallSentiment.icon

  return (
    <div className="space-y-6">
      {/* Overall Technical Summary */}
      <div className={`card shadow-xl border ${overallSentiment.borderColor} ${overallSentiment.bgColor}`}>
        <div className="card-body">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="card-title text-2xl mb-2 flex items-center gap-2">
                <SentimentIcon className="w-6 h-6" />
                Technical Overview
              </h2>
              <p className={`text-lg font-semibold ${overallSentiment.color}`}>
                {overallSentiment.sentiment} Signal ({overallSentiment.strength})
              </p>
              <p className="text-sm opacity-70">
                Based on {technical?.overall_signal?.total_signals || 0} indicators
              </p>
            </div>
            <div className="text-center">
              <div className={`text-4xl font-bold p-4 rounded-full ${overallSentiment.bgColor} ${overallSentiment.color} border-2 ${overallSentiment.borderColor}`}>
                {Math.round(technical?.overall_signal?.confidence || 0)}%
              </div>
              <p className="text-sm font-semibold mt-2">Confidence</p>
            </div>
          </div>
          
          {/* Signal Breakdown */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-2xl font-bold text-green-600">
                {technical?.overall_signal?.bullish_signals || 0}
              </p>
              <p className="text-sm text-green-700">Bullish Signals</p>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
              <p className="text-2xl font-bold text-red-600">
                {technical?.overall_signal?.bearish_signals || 0}
              </p>
              <p className="text-sm text-red-700">Bearish Signals</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-2xl font-bold text-blue-600">
                {technical?.overall_signal?.neutral_signals || 0}
              </p>
              <p className="text-sm text-blue-700">Neutral Signals</p>
            </div>
          </div>
        </div>
      </div>

      {/* Moving Averages */}
      <div className="card bg-base-100 shadow-xl border border-blue-200">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4 text-blue-800">
            <TrendingUp className="w-6 h-6" />
            📈 Moving Averages & Trend Analysis
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Short-term MAs */}
            <div className="space-y-3">
              <h4 className="font-semibold text-blue-700">Short-term</h4>
              
              <div className="stat bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="stat-title text-xs">SMA 5</div>
                <div className="stat-value text-sm text-blue-800">
                  ${formatValue(technical?.moving_averages?.sma_5)}
                </div>
              </div>
              
              <div className="stat bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="stat-title text-xs">SMA 10</div>
                <div className="stat-value text-sm text-blue-800">
                  ${formatValue(technical?.moving_averages?.sma_10)}
                </div>
              </div>
              
              <div className="stat bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="stat-title text-xs">SMA 20</div>
                <div className="stat-value text-sm text-blue-800">
                  ${formatValue(technical?.moving_averages?.sma_20)}
                </div>
              </div>
            </div>
            
            {/* Medium-term MAs */}
            <div className="space-y-3">
              <h4 className="font-semibold text-green-700">Medium-term</h4>
              
              <div className="stat bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="stat-title text-xs">SMA 50</div>
                <div className="stat-value text-sm text-green-800">
                  ${formatValue(technical?.moving_averages?.sma_50)}
                </div>
              </div>
              
              <div className="stat bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="stat-title text-xs">SMA 100</div>
                <div className="stat-value text-sm text-green-800">
                  ${formatValue(technical?.moving_averages?.sma_100)}
                </div>
              </div>
              
              <div className="stat bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="stat-title text-xs">EMA 50</div>
                <div className="stat-value text-sm text-green-800">
                  ${formatValue(technical?.moving_averages?.ema_50)}
                </div>
              </div>
            </div>
            
            {/* Long-term MAs */}
            <div className="space-y-3">
              <h4 className="font-semibold text-purple-700">Long-term</h4>
              
              <div className="stat bg-purple-50 border border-purple-200 rounded-lg p-3">
                <div className="stat-title text-xs">SMA 200</div>
                <div className="stat-value text-sm text-purple-800">
                  ${formatValue(technical?.moving_averages?.sma_200)}
                </div>
              </div>
              
              <div className="stat bg-purple-50 border border-purple-200 rounded-lg p-3">
                <div className="stat-title text-xs">EMA 200</div>
                <div className="stat-value text-sm text-purple-800">
                  ${formatValue(technical?.moving_averages?.ema_200)}
                </div>
              </div>
            </div>
            
            {/* EMAs */}
            <div className="space-y-3">
              <h4 className="font-semibold text-orange-700">Exponential MAs</h4>
              
              <div className="stat bg-orange-50 border border-orange-200 rounded-lg p-3">
                <div className="stat-title text-xs">EMA 12</div>
                <div className="stat-value text-sm text-orange-800">
                  ${formatValue(technical?.moving_averages?.ema_12)}
                </div>
              </div>
              
              <div className="stat bg-orange-50 border border-orange-200 rounded-lg p-3">
                <div className="stat-title text-xs">EMA 26</div>
                <div className="stat-value text-sm text-orange-800">
                  ${formatValue(technical?.moving_averages?.ema_26)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Momentum Oscillators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* RSI Analysis */}
        <div className="card bg-base-100 shadow-xl border border-green-200">
          <div className="card-body">
            <h3 className="card-title text-xl mb-4 text-green-800">
              <Zap className="w-5 h-5" />
              ⚡ RSI Analysis
            </h3>
            
            <div className="space-y-4">
              {/* RSI 14 (Primary) */}
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-green-800">RSI (14)</span>
                  <span className={`badge ${getRSISignal(technical?.rsi?.rsi_14).bgColor} ${getRSISignal(technical?.rsi?.rsi_14).color} border-0`}>
                    {getRSISignal(technical?.rsi?.rsi_14).signal}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-green-800">
                    {formatValue(technical?.rsi?.rsi_14)}
                  </span>
                  <div className="flex-1">
                    <progress 
                      className="progress progress-success w-full h-3" 
                      value={technical?.rsi?.rsi_14 || 50} 
                      max="100"
                    ></progress>
                    <div className="flex justify-between text-xs text-green-600 mt-1">
                      <span>Oversold (30)</span>
                      <span>Overbought (70)</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Additional RSI timeframes */}
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-xs text-green-600">RSI (9)</p>
                  <p className="font-bold text-green-800">{formatValue(technical?.rsi?.rsi_9)}</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-xs text-green-600">RSI (21)</p>
                  <p className="font-bold text-green-800">{formatValue(technical?.rsi?.rsi_21)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MACD Analysis */}
        <div className="card bg-base-100 shadow-xl border border-blue-200">
          <div className="card-body">
            <h3 className="card-title text-xl mb-4 text-blue-800">
              <BarChart3 className="w-5 h-5" />
              📊 MACD Analysis
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold text-blue-800">MACD Signal</span>
                  <span className={`badge ${getMACDSignal(technical?.macd).bgColor} ${getMACDSignal(technical?.macd).color} border-0`}>
                    {getMACDSignal(technical?.macd).signal}
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-2 bg-white rounded border border-blue-200">
                    <p className="text-xs text-blue-600">MACD</p>
                    <p className="font-bold text-blue-800">{formatValue(technical?.macd?.macd, 4)}</p>
                  </div>
                  <div className="p-2 bg-white rounded border border-blue-200">
                    <p className="text-xs text-blue-600">Signal</p>
                    <p className="font-bold text-blue-800">{formatValue(technical?.macd?.signal, 4)}</p>
                  </div>
                  <div className="p-2 bg-white rounded border border-blue-200">
                    <p className="text-xs text-blue-600">Histogram</p>
                    <p className={`font-bold ${technical?.macd?.histogram > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatValue(technical?.macd?.histogram, 4)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Indicators */}
      <div className="card bg-base-100 shadow-xl border border-purple-200">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4 text-purple-800">
            <Target className="w-6 h-6" />
            🎯 Advanced Technical Indicators
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Bollinger Bands */}
            <div className="space-y-3">
              <h4 className="font-semibold text-purple-700 border-b border-purple-200 pb-2">Bollinger Bands (20)</h4>
              <div className="space-y-2">
                <div className="flex justify-between p-2 bg-purple-50 rounded border border-purple-200">
                  <span className="text-sm text-purple-600">Upper Band</span>
                  <span className="font-semibold text-purple-800">
                    ${formatValue(technical?.bollinger_bands_20?.upper)}
                  </span>
                </div>
                <div className="flex justify-between p-2 bg-purple-50 rounded border border-purple-200">
                  <span className="text-sm text-purple-600">Middle Band</span>
                  <span className="font-semibold text-purple-800">
                    ${formatValue(technical?.bollinger_bands_20?.middle)}
                  </span>
                </div>
                <div className="flex justify-between p-2 bg-purple-50 rounded border border-purple-200">
                  <span className="text-sm text-purple-600">Lower Band</span>
                  <span className="font-semibold text-purple-800">
                    ${formatValue(technical?.bollinger_bands_20?.lower)}
                  </span>
                </div>
                <div className="text-center p-2 bg-purple-100 rounded border border-purple-300">
                  <span className="text-xs text-purple-600">Position: </span>
                  <span className="font-bold text-purple-800">
                    {formatValue(technical?.bollinger_bands_20?.position)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Stochastic Oscillator */}
            <div className="space-y-3">
              <h4 className="font-semibold text-indigo-700 border-b border-indigo-200 pb-2">Stochastic Oscillator</h4>
              <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-indigo-600">%K</span>
                  <span className="font-bold text-indigo-800">{formatValue(technical?.stochastic?.k)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-indigo-600">%D</span>
                  <span className="font-bold text-indigo-800">{formatValue(technical?.stochastic?.d)}</span>
                </div>
                <div className="text-center">
                  <span className={`badge ${
                    technical?.stochastic?.signal === 'Overbought' ? 'bg-red-100 text-red-600' :
                    technical?.stochastic?.signal === 'Oversold' ? 'bg-green-100 text-green-600' :
                    'bg-blue-100 text-blue-600'
                  } border-0`}>
                    {technical?.stochastic?.signal || 'Neutral'}
                  </span>
                </div>
              </div>
            </div>

            {/* ADX Trend Strength */}
            <div className="space-y-3">
              <h4 className="font-semibold text-orange-700 border-b border-orange-200 pb-2">ADX Trend Strength</h4>
              <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div className="text-center mb-3">
              <span className="text-3xl font-bold text-orange-800">{formatValue(technical?.adx?.adx)}</span>
                 <p className="text-sm text-orange-600">ADX Value</p>
               </div>
               <div className="space-y-2">
                 <div className="flex justify-between">
                   <span className="text-xs text-orange-600">DI+</span>
                   <span className="font-semibold text-green-600">{formatValue(technical?.adx?.di_plus)}</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-xs text-orange-600">DI-</span>
                   <span className="font-semibold text-red-600">{formatValue(technical?.adx?.di_minus)}</span>
                 </div>
               </div>
               <div className="text-center mt-2">
                 <span className={`badge ${
                   technical?.adx?.trend_strength === 'Strong' ? 'bg-green-100 text-green-600' :
                   technical?.adx?.trend_strength === 'Moderate' ? 'bg-yellow-100 text-yellow-600' :
                   'bg-red-100 text-red-600'
                 } border-0`}>
                   {technical?.adx?.trend_strength || 'Weak'} Trend
                 </span>
               </div>
             </div>
           </div>

           {/* Williams %R */}
           <div className="space-y-3">
             <h4 className="font-semibold text-pink-700 border-b border-pink-200 pb-2">Williams %R</h4>
             <div className="p-3 bg-pink-50 rounded-lg border border-pink-200">
               <div className="text-center mb-2">
                 <span className="text-2xl font-bold text-pink-800">
                   {formatValue(technical?.williams_r?.williams_r_14)}
                 </span>
               </div>
               <progress 
                 className="progress progress-secondary w-full h-2 mb-2" 
                 value={Math.abs(technical?.williams_r?.williams_r_14 || -50)} 
                 max="100"
               ></progress>
               <div className="text-center">
                 <span className={`badge ${
                   technical?.williams_r?.signal === 'Overbought' ? 'bg-red-100 text-red-600' :
                   technical?.williams_r?.signal === 'Oversold' ? 'bg-green-100 text-green-600' :
                   'bg-blue-100 text-blue-600'
                 } border-0`}>
                   {technical?.williams_r?.signal || 'Neutral'}
                 </span>
               </div>
             </div>
           </div>

           {/* CCI */}
           <div className="space-y-3">
             <h4 className="font-semibold text-teal-700 border-b border-teal-200 pb-2">Commodity Channel Index</h4>
             <div className="p-3 bg-teal-50 rounded-lg border border-teal-200">
               <div className="text-center mb-2">
                 <span className="text-2xl font-bold text-teal-800">
                   {formatValue(technical?.cci?.cci_20)}
                 </span>
               </div>
               <div className="text-center">
                 <span className={`badge ${
                   technical?.cci?.signal === 'Overbought' ? 'bg-red-100 text-red-600' :
                   technical?.cci?.signal === 'Oversold' ? 'bg-green-100 text-green-600' :
                   'bg-blue-100 text-blue-600'
                 } border-0`}>
                   {technical?.cci?.signal || 'Neutral'}
                 </span>
               </div>
             <div className="text-xs text-center text-teal-600 mt-1">
  {">100: Overbought | <-100: Oversold"}
</div>
             </div>
           </div>

           {/* Volume Analysis */}
           <div className="space-y-3">
             <h4 className="font-semibold text-emerald-700 border-b border-emerald-200 pb-2">Volume Analysis</h4>
             <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
               <div className="space-y-2">
                 <div className="flex justify-between">
                   <span className="text-sm text-emerald-600">Volume Ratio</span>
                   <span className="font-bold text-emerald-800">
                     {formatValue(technical?.volume_analysis?.volume_ratio)}x
                   </span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-sm text-emerald-600">Trend</span>
                   <span className={`badge ${
                     technical?.volume_analysis?.volume_trend === 'High' ? 'bg-red-100 text-red-600' :
                     'bg-blue-100 text-blue-600'
                   } border-0`}>
                     {technical?.volume_analysis?.volume_trend || 'Normal'}
                   </span>
                 </div>
                 <div className="text-center">
                   <span className="text-xs text-emerald-600">20-day Average</span>
                   <p className="font-semibold text-emerald-800">
                     {formatNumber(technical?.volume_analysis?.volume_sma_20)}
                   </p>
                 </div>
               </div>
             </div>
           </div>
         </div>
       </div>
     </div>

     {/* Support & Resistance Levels */}
     {technical?.fibonacci && (
       <div className="card bg-base-100 shadow-xl border border-yellow-200">
         <div className="card-body">
           <h2 className="card-title text-2xl mb-4 text-yellow-800">
             <Target className="w-6 h-6" />
             🎯 Fibonacci Retracement Levels
           </h2>
           
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
               <p className="text-sm text-yellow-600">23.6% Level</p>
               <p className="font-bold text-yellow-800">${formatValue(technical?.fibonacci?.level_23_6)}</p>
             </div>
             <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
               <p className="text-sm text-yellow-600">38.2% Level</p>
               <p className="font-bold text-yellow-800">${formatValue(technical?.fibonacci?.level_38_2)}</p>
             </div>
             <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
               <p className="text-sm text-yellow-600">50.0% Level</p>
               <p className="font-bold text-yellow-800">${formatValue(technical?.fibonacci?.level_50_0)}</p>
             </div>
             <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
               <p className="text-sm text-yellow-600">61.8% Level</p>
               <p className="font-bold text-yellow-800">${formatValue(technical?.fibonacci?.level_61_8)}</p>
             </div>
           </div>
           
           <div className="mt-4 p-3 bg-yellow-100 rounded-lg border border-yellow-300">
             <div className="flex justify-between">
               <span className="text-sm text-yellow-700">Recent High:</span>
               <span className="font-bold text-yellow-800">${formatValue(technical?.fibonacci?.recent_high)}</span>
             </div>
             <div className="flex justify-between">
               <span className="text-sm text-yellow-700">Recent Low:</span>
               <span className="font-bold text-yellow-800">${formatValue(technical?.fibonacci?.recent_low)}</span>
             </div>
           </div>
         </div>
       </div>
     )}

     {/* Chart Patterns */}
     {patterns && patterns.length > 0 && (
       <div className="card bg-base-100 shadow-xl border border-gray-200">
         <div className="card-body">
           <h2 className="card-title text-2xl mb-4">
             <AlertCircle className="w-6 h-6" />
             📈 Chart Patterns Detected
           </h2>
           
           {/* Pattern Summary */}
           <div className="grid grid-cols-3 gap-4 mb-6">
             <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
               <p className="text-2xl font-bold text-green-600">
                 {patterns.filter(p => p.type === 'Bullish').length}
               </p>
               <p className="text-sm text-green-700">Bullish Patterns</p>
             </div>
             <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
               <p className="text-2xl font-bold text-red-600">
                 {patterns.filter(p => p.type === 'Bearish').length}
               </p>
               <p className="text-sm text-red-700">Bearish Patterns</p>
             </div>
             <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
               <p className="text-2xl font-bold text-blue-600">
                 {patterns.filter(p => !['Bullish', 'Bearish'].includes(p.type)).length}
               </p>
               <p className="text-sm text-blue-700">Neutral Patterns</p>
             </div>
           </div>
           
           {/* Detailed Patterns */}
           <div className="space-y-4">
             {patterns.slice(0, 8).map((pattern, index) => (
               <div key={index} className={`alert shadow-lg border ${
                 pattern.type === 'Bullish' ? 'border-green-200 bg-green-50' :
                 pattern.type === 'Bearish' ? 'border-red-200 bg-red-50' :
                 'border-blue-200 bg-blue-50'
               }`}>
                 <div className="flex-1">
                   <div className="flex items-center gap-3">
                     {pattern.type === 'Bullish' ? (
                       <TrendingUp className="w-6 h-6 text-green-600" />
                     ) : pattern.type === 'Bearish' ? (
                       <TrendingDown className="w-6 h-6 text-red-600" />
                     ) : (
                       <Activity className="w-6 h-6 text-blue-600" />
                     )}
                     <div className="flex-1">
                       <h3 className={`font-bold text-lg ${
                         pattern.type === 'Bullish' ? 'text-green-800' :
                         pattern.type === 'Bearish' ? 'text-red-800' :
                         'text-blue-800'
                       }`}>
                         {pattern.pattern}
                       </h3>
                       <div className="flex items-center gap-4 text-sm mt-1">
                         <span className={`badge ${
                           pattern.type === 'Bullish' ? 'badge-success' :
                           pattern.type === 'Bearish' ? 'badge-error' :
                           'badge-info'
                         } badge-sm`}>
                           {pattern.type}
                         </span>
                         <span className={`badge ${
                           pattern.strength === 'Strong' ? 'badge-warning' :
                           pattern.strength === 'Medium' ? 'badge-primary' :
                           'badge-ghost'
                         } badge-sm`}>
                           {pattern.strength} Strength
                         </span>
                         <span className="text-gray-600">
                           {pattern.timeframe || pattern.date}
                         </span>
                         {pattern.confidence && (
                           <span className="badge badge-outline badge-sm">
                             {Math.round(pattern.confidence)}% confidence
                           </span>
                         )}
                       </div>
                       {(pattern.details || pattern.change || pattern.level) && (
                         <p className="text-sm text-gray-600 mt-1">
                           {pattern.details || pattern.change || pattern.level}
                         </p>
                       )}
                     </div>
                   </div>
                 </div>
               </div>
             ))}
           </div>
           
           {patterns.length > 8 && (
             <div className="text-center mt-4">
               <p className="text-sm text-gray-600">
                 Showing top 8 patterns out of {patterns.length} detected
               </p>
             </div>
           )}
         </div>
       </div>
     )}

     {/* Technical Analysis Summary */}
     <div className="card bg-gradient-to-r from-gray-50 to-base-100 shadow-xl border border-gray-200">
       <div className="card-body">
         <h2 className="card-title text-2xl mb-4">
           <PieChart className="w-6 h-6" />
           📋 Technical Analysis Summary
         </h2>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
           <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
             <h4 className="font-semibold text-gray-800 mb-2">Momentum</h4>
             <div className="space-y-1 text-sm">
               <div className="flex justify-between">
                 <span>RSI Signal:</span>
                 <span className={getRSISignal(technical?.rsi?.rsi_14).color}>
                   {getRSISignal(technical?.rsi?.rsi_14).signal}
                 </span>
               </div>
               <div className="flex justify-between">
                 <span>MACD Signal:</span>
                 <span className={getMACDSignal(technical?.macd).color}>
                   {getMACDSignal(technical?.macd).signal}
                 </span>
               </div>
               <div className="flex justify-between">
                 <span>Stochastic:</span>
                 <span>{technical?.stochastic?.signal || 'Neutral'}</span>
               </div>
             </div>
           </div>
           
           <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
             <h4 className="font-semibold text-gray-800 mb-2">Trend Analysis</h4>
             <div className="space-y-1 text-sm">
               <div className="flex justify-between">
                 <span>ADX Strength:</span>
                 <span>{technical?.adx?.trend_strength || 'N/A'}</span>
               </div>
               <div className="flex justify-between">
                 <span>MA Alignment:</span>
                 <span>{overallSentiment.sentiment}</span>
               </div>
               <div className="flex justify-between">
                 <span>Patterns:</span>
                 <span>{patterns?.length || 0} detected</span>
               </div>
             </div>
           </div>
           
           <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
             <h4 className="font-semibold text-gray-800 mb-2">Volatility</h4>
             <div className="space-y-1 text-sm">
               <div className="flex justify-between">
                 <span>ATR:</span>
                 <span>{formatValue(technical?.atr?.atr_14)}</span>
               </div>
               <div className="flex justify-between">
                 <span>ATR %:</span>
                 <span>{formatValue(technical?.atr?.atr_percentage)}%</span>
               </div>
               <div className="flex justify-between">
                 <span>BB Width:</span>
                 <span>{formatValue(technical?.bollinger_bands_20?.width)}%</span>
               </div>
             </div>
           </div>
           
           <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
             <h4 className="font-semibold text-gray-800 mb-2">Volume Profile</h4>
             <div className="space-y-1 text-sm">
               <div className="flex justify-between">
                 <span>Volume Ratio:</span>
                 <span>{formatValue(technical?.volume_analysis?.volume_ratio)}x</span>
               </div>
               <div className="flex justify-between">
                 <span>Volume Trend:</span>
                 <span>{technical?.volume_analysis?.volume_trend || 'Normal'}</span>
               </div>
               <div className="flex justify-between">
                 <span>Signal Strength:</span>
                 <span>{overallSentiment.strength}</span>
               </div>
             </div>
           </div>
         </div>
         
         {/* Overall Recommendation */}
         <div className="mt-6 p-4 bg-gradient-to-r from-base-200 to-base-300 rounded-lg border border-base-400">
           <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
             <Target className="w-5 h-5" />
             Technical Recommendation
           </h4>
           <p className={`text-lg font-bold ${overallSentiment.color}`}>
             {overallSentiment.sentiment} ({overallSentiment.strength}) - {Math.round(technical?.overall_signal?.confidence || 0)}% Confidence
           </p>
           <p className="text-sm text-gray-600 mt-1">
             Based on {technical?.overall_signal?.total_signals || 0} technical indicators and {patterns?.length || 0} chart patterns
           </p>
         </div>
       </div>
     </div>
   </div>
 )
}

function formatNumber(num) {
 if (!num || num === 'N/A' || num === 0) return 'N/A'
 if (Math.abs(num) >= 1e9) return (num / 1e9).toFixed(1) + 'B'
 if (Math.abs(num) >= 1e6) return (num / 1e6).toFixed(1) + 'M'
 if (Math.abs(num) >= 1e3) return (num / 1e3).toFixed(1) + 'K'
 return num.toLocaleString()
}
                  