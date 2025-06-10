'use client'

import { TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3, Target, Shield, AlertTriangle, Award, Zap, Activity } from 'lucide-react'

export default function FundamentalAnalysis({ fundamentals, market }) {
  const formatNumber = (num) => {
    if (!num || num === 'N/A' || num === 0 || num === 0.0) return null
    if (typeof num === 'string' && (num.toLowerCase() === 'n/a' || num === '0' || num === '0.0')) return null
    if (typeof num === 'number' && Math.abs(num) < 0.001) return null
    
    if (Math.abs(num) >= 1e12) return (num / 1e12).toFixed(2) + 'T'
    if (Math.abs(num) >= 1e9) return (num / 1e9).toFixed(2) + 'B'
    if (Math.abs(num) >= 1e6) return (num / 1e6).toFixed(2) + 'M'
    if (Math.abs(num) >= 1e3) return (num / 1e3).toFixed(2) + 'K'
    return typeof num === 'number' ? num.toFixed(2) : num
  }

  const formatPercentage = (num) => {
    if (!num || num === 'N/A' || num === 0 || num === 0.0) return null
    if (typeof num === 'string' && (num.toLowerCase() === 'n/a' || num === '0')) return null
    
    const value = typeof num === 'number' ? num : parseFloat(num)
    if (isNaN(value) || Math.abs(value) < 0.001) return null
    
    return (value > 1 ? value.toFixed(2) : (value * 100).toFixed(2)) + '%'
  }

  const getHealthColor = (value, type = 'higher_better') => {
    if (!value || value === 'N/A' || value === 0) return 'text-base-content'
    const numValue = typeof value === 'number' ? value : parseFloat(value)
    if (isNaN(numValue)) return 'text-base-content'
    
    if (type === 'higher_better') {
      return numValue > 15 ? 'text-success' : numValue > 5 ? 'text-warning' : 'text-error'
    } else if (type === 'lower_better') {
      return numValue < 0.5 ? 'text-success' : numValue < 1 ? 'text-warning' : 'text-error'
    } else if (type === 'pe') {
      return numValue < 15 ? 'text-success' : numValue < 25 ? 'text-warning' : 'text-error'
    }
    return 'text-base-content'
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100'
    if (score >= 60) return 'text-blue-600 bg-blue-100'
    if (score >= 40) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  // Calculate overall health score
  const calculateHealthScore = (fundamentals, market) => {
    let score = 0
    let maxScore = 0

    if (market === 'Indian') {
      const ratios = fundamentals?.valuation_ratios || {}
      const prof = fundamentals?.profitability_ratios || {}
      const liq = fundamentals?.liquidity_ratios || {}
      const lev = fundamentals?.leverage_ratios || {}

      // Profitability (40% weight)
      if (prof.roe) { maxScore += 40; score += prof.roe > 15 ? 40 : prof.roe > 10 ? 30 : prof.roe > 5 ? 20 : 10 }
      
      // Liquidity (30% weight)
      if (liq.current_ratio) { maxScore += 30; score += liq.current_ratio > 2 ? 30 : liq.current_ratio > 1.5 ? 25 : liq.current_ratio > 1 ? 15 : 5 }
      
      // Leverage (30% weight)
      if (lev.debt_to_equity) { maxScore += 30; score += lev.debt_to_equity < 0.3 ? 30 : lev.debt_to_equity < 0.6 ? 25 : lev.debt_to_equity < 1 ? 15 : 5 }
    } else {
      const income = fundamentals?.income_statement || {}
      const balance = fundamentals?.balance_sheet || {}
      const ratios = fundamentals?.ratios || {}

      // Revenue growth (25% weight)
      if (income.revenue) { maxScore += 25; score += 25 }
      
      // Profitability (35% weight)
      if (ratios.returnOnEquity) { maxScore += 35; score += ratios.returnOnEquity > 0.15 ? 35 : ratios.returnOnEquity > 0.1 ? 25 : ratios.returnOnEquity > 0.05 ? 15 : 5 }
      
      // Financial health (40% weight)
      if (ratios.currentRatio) { maxScore += 40; score += ratios.currentRatio > 2 ? 40 : ratios.currentRatio > 1.5 ? 30 : ratios.currentRatio > 1 ? 20 : 10 }
    }

    return maxScore > 0 ? Math.round((score / maxScore) * 100) : 0
  }

  const healthScore = calculateHealthScore(fundamentals, market)

  // Render based on market type
  if (market === 'Indian') {
    return (
      <div className="space-y-6">
        {/* Health Score Card */}
        <div className="card bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-orange-800 mb-2">Financial Health Score</h3>
                <p className="text-orange-600">Based on key Indian market metrics</p>
              </div>
              <div className="text-center">
                <div className={`text-6xl font-bold p-4 rounded-full ${getScoreColor(healthScore)}`}>
                  {healthScore}
                </div>
                <p className="text-sm font-semibold mt-2">
                  {healthScore >= 80 ? 'Excellent' : healthScore >= 60 ? 'Good' : healthScore >= 40 ? 'Fair' : 'Poor'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Indian Market Valuation Ratios */}
        <div className="card bg-base-100 shadow-xl border border-orange-200">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4 text-orange-800">
              <Target className="w-6 h-6" />
              🇮🇳 Valuation Ratios
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* P/E Ratio */}
              {formatNumber(fundamentals?.valuation_ratios?.pe_ratio) && (
                <div className="stat bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
                  <div className="stat-title text-sm text-orange-600">P/E Ratio</div>
                  <div className={`stat-value text-xl ${getHealthColor(fundamentals?.valuation_ratios?.pe_ratio, 'pe')}`}>
                    {formatNumber(fundamentals?.valuation_ratios?.pe_ratio)}
                  </div>
                  <div className="stat-desc text-orange-500">
                    {fundamentals?.valuation_ratios?.pe_ratio < 15 ? 'Undervalued' : 
                     fundamentals?.valuation_ratios?.pe_ratio < 25 ? 'Fair Value' : 'Overvalued'}
                  </div>
                </div>
              )}
              {/* P/B Ratio */}
             {formatNumber(fundamentals?.valuation_ratios?.price_to_book) && (
               <div className="stat bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
                 <div className="stat-title text-sm text-yellow-600">P/B Ratio</div>
                 <div className="stat-value text-xl text-yellow-800">
                   {formatNumber(fundamentals?.valuation_ratios?.price_to_book)}
                 </div>
                 <div className="stat-desc text-yellow-500">Price to Book</div>
               </div>
             )}
             
             {/* Market Cap */}
             {formatNumber(fundamentals?.valuation_ratios?.market_cap) && (
               <div className="stat bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
                 <div className="stat-title text-sm text-green-600">Market Cap</div>
                 <div className="stat-value text-xl text-green-800">
                   ₹{formatNumber(fundamentals?.valuation_ratios?.market_cap)}
                 </div>
                 <div className="stat-desc text-green-500">
                   {fundamentals?.valuation_ratios?.market_cap > 2e12 ? 'Large Cap' : 
                    fundamentals?.valuation_ratios?.market_cap > 5e11 ? 'Mid Cap' : 'Small Cap'}
                 </div>
               </div>
             )}
             
             {/* EV/EBITDA */}
             {formatNumber(fundamentals?.valuation_ratios?.ev_ebitda) && (
               <div className="stat bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
                 <div className="stat-title text-sm text-blue-600">EV/EBITDA</div>
                 <div className="stat-value text-xl text-blue-800">
                   {formatNumber(fundamentals?.valuation_ratios?.ev_ebitda)}
                 </div>
                 <div className="stat-desc text-blue-500">Enterprise Multiple</div>
               </div>
             )}
           </div>
         </div>
       </div>

       {/* Indian Market Profitability Metrics */}
       <div className="card bg-base-100 shadow-xl border border-green-200">
         <div className="card-body">
           <h2 className="card-title text-2xl mb-4 text-green-800">
             <Award className="w-6 h-6" />
             💰 Profitability & Returns
           </h2>
           
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {/* ROE */}
             {formatPercentage(fundamentals?.profitability_ratios?.roe) && (
               <div className="stat bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
                 <div className="stat-title text-sm text-green-600">ROE</div>
                 <div className={`stat-value text-xl ${getHealthColor(fundamentals?.profitability_ratios?.roe)}`}>
                   {formatPercentage(fundamentals?.profitability_ratios?.roe)}
                 </div>
                 <div className="stat-desc text-green-500">Return on Equity</div>
               </div>
             )}
             
             {/* ROCE */}
             {formatPercentage(fundamentals?.profitability_ratios?.roce) && (
               <div className="stat bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
                 <div className="stat-title text-sm text-emerald-600">ROCE</div>
                 <div className={`stat-value text-xl ${getHealthColor(fundamentals?.profitability_ratios?.roce)}`}>
                   {formatPercentage(fundamentals?.profitability_ratios?.roce)}
                 </div>
                 <div className="stat-desc text-emerald-500">Return on Capital</div>
               </div>
             )}
             
             {/* Net Margin */}
             {formatPercentage(fundamentals?.profitability_ratios?.net_margin) && (
               <div className="stat bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
                 <div className="stat-title text-sm text-teal-600">Net Margin</div>
                 <div className={`stat-value text-xl ${getHealthColor(fundamentals?.profitability_ratios?.net_margin)}`}>
                   {formatPercentage(fundamentals?.profitability_ratios?.net_margin)}
                 </div>
                 <div className="stat-desc text-teal-500">Profit Efficiency</div>
               </div>
             )}
             
             {/* Operating Margin */}
             {formatPercentage(fundamentals?.profitability_ratios?.operating_margin) && (
               <div className="stat bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
                 <div className="stat-title text-sm text-cyan-600">Operating Margin</div>
                 <div className={`stat-value text-xl ${getHealthColor(fundamentals?.profitability_ratios?.operating_margin)}`}>
                   {formatPercentage(fundamentals?.profitability_ratios?.operating_margin)}
                 </div>
                 <div className="stat-desc text-cyan-500">Operational Efficiency</div>
               </div>
             )}
           </div>
         </div>
       </div>

       {/* Indian Market Financial Health */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* Liquidity Ratios */}
         <div className="card bg-base-100 shadow-xl border border-blue-200">
           <div className="card-body">
             <h3 className="card-title text-xl mb-4 text-blue-800">
               <Zap className="w-5 h-5" />
               💧 Liquidity Health
             </h3>
             <div className="space-y-3">
               {formatNumber(fundamentals?.liquidity_ratios?.current_ratio) && (
                 <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                   <span className="font-medium text-blue-700">Current Ratio</span>
                   <span className={`font-bold text-lg ${getHealthColor(fundamentals?.liquidity_ratios?.current_ratio)}`}>
                     {formatNumber(fundamentals?.liquidity_ratios?.current_ratio)}
                   </span>
                 </div>
               )}
               
               {formatNumber(fundamentals?.liquidity_ratios?.quick_ratio) && (
                 <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                   <span className="font-medium text-blue-700">Quick Ratio</span>
                   <span className={`font-bold text-lg ${getHealthColor(fundamentals?.liquidity_ratios?.quick_ratio)}`}>
                     {formatNumber(fundamentals?.liquidity_ratios?.quick_ratio)}
                   </span>
                 </div>
               )}
               
               {formatNumber(fundamentals?.liquidity_ratios?.working_capital) && (
                 <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                   <span className="font-medium text-blue-700">Working Capital</span>
                   <span className="font-bold text-lg text-blue-800">
                     ₹{formatNumber(fundamentals?.liquidity_ratios?.working_capital)}
                   </span>
                 </div>
               )}
             </div>
           </div>
         </div>

         {/* Leverage Ratios */}
         <div className="card bg-base-100 shadow-xl border border-red-200">
           <div className="card-body">
             <h3 className="card-title text-xl mb-4 text-red-800">
               <Shield className="w-5 h-5" />
               ⚖️ Leverage Analysis
             </h3>
             <div className="space-y-3">
               {formatNumber(fundamentals?.leverage_ratios?.debt_to_equity) && (
                 <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
                   <span className="font-medium text-red-700">Debt to Equity</span>
                   <span className={`font-bold text-lg ${getHealthColor(fundamentals?.leverage_ratios?.debt_to_equity, 'lower_better')}`}>
                     {formatNumber(fundamentals?.leverage_ratios?.debt_to_equity)}
                   </span>
                 </div>
               )}
               
               {formatNumber(fundamentals?.leverage_ratios?.interest_coverage) && (
                 <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
                   <span className="font-medium text-red-700">Interest Coverage</span>
                   <span className={`font-bold text-lg ${getHealthColor(fundamentals?.leverage_ratios?.interest_coverage)}`}>
                     {formatNumber(fundamentals?.leverage_ratios?.interest_coverage)}x
                   </span>
                 </div>
               )}
               
               {formatNumber(fundamentals?.leverage_ratios?.debt_to_assets) && (
                 <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
                   <span className="font-medium text-red-700">Debt to Assets</span>
                   <span className={`font-bold text-lg ${getHealthColor(fundamentals?.leverage_ratios?.debt_to_assets, 'lower_better')}`}>
                     {formatNumber(fundamentals?.leverage_ratios?.debt_to_assets)}
                   </span>
                 </div>
               )}
             </div>
           </div>
         </div>
       </div>

       {/* Growth Metrics */}
       {fundamentals?.growth_metrics && Object.keys(fundamentals.growth_metrics).length > 0 && (
         <div className="card bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 shadow-xl">
           <div className="card-body">
             <h3 className="card-title text-xl mb-4 text-purple-800">
               <TrendingUp className="w-5 h-5" />
               📈 Growth Trajectory
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               {formatPercentage(fundamentals?.growth_metrics?.revenue_growth_3yr) && (
                 <div className="text-center p-4 bg-white rounded-lg border border-purple-200 shadow-md">
                   <p className="text-sm text-purple-600 mb-1">Revenue Growth (3Y)</p>
                   <p className={`font-bold text-xl ${getHealthColor(fundamentals?.growth_metrics?.revenue_growth_3yr)}`}>
                     {formatPercentage(fundamentals?.growth_metrics?.revenue_growth_3yr)}
                   </p>
                   <p className="text-xs text-purple-500">CAGR</p>
                 </div>
               )}
               
               {formatPercentage(fundamentals?.growth_metrics?.profit_growth_3yr) && (
                 <div className="text-center p-4 bg-white rounded-lg border border-purple-200 shadow-md">
                   <p className="text-sm text-purple-600 mb-1">Profit Growth (3Y)</p>
                   <p className={`font-bold text-xl ${getHealthColor(fundamentals?.growth_metrics?.profit_growth_3yr)}`}>
                     {formatPercentage(fundamentals?.growth_metrics?.profit_growth_3yr)}
                   </p>
                   <p className="text-xs text-purple-500">CAGR</p>
                 </div>
               )}
               
               {formatPercentage(fundamentals?.growth_metrics?.eps_growth_3yr) && (
                 <div className="text-center p-4 bg-white rounded-lg border border-purple-200 shadow-md">
                   <p className="text-sm text-purple-600 mb-1">EPS Growth (3Y)</p>
                   <p className={`font-bold text-xl ${getHealthColor(fundamentals?.growth_metrics?.eps_growth_3yr)}`}>
                     {formatPercentage(fundamentals?.growth_metrics?.eps_growth_3yr)}
                   </p>
                   <p className="text-xs text-purple-500">CAGR</p>
                 </div>
               )}
             </div>
           </div>
         </div>
       )}

       {/* Per Share Data */}
       {fundamentals?.per_share_data && Object.keys(fundamentals.per_share_data).length > 0 && (
         <div className="card bg-base-100 shadow-xl border border-indigo-200">
           <div className="card-body">
             <h3 className="card-title text-xl mb-4 text-indigo-800">
               <DollarSign className="w-5 h-5" />
               💎 Per Share Metrics
             </h3>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {formatNumber(fundamentals?.per_share_data?.eps) && (
                 <div className="text-center p-4 bg-indigo-50 rounded-lg border border-indigo-200 shadow-md">
                   <p className="text-sm text-indigo-600 mb-1">EPS</p>
                   <p className="font-bold text-lg text-indigo-800">
                     ₹{formatNumber(fundamentals?.per_share_data?.eps)}
                   </p>
                 </div>
               )}
               
               {formatNumber(fundamentals?.per_share_data?.book_value_per_share) && (
                 <div className="text-center p-4 bg-indigo-50 rounded-lg border border-indigo-200 shadow-md">
                   <p className="text-sm text-indigo-600 mb-1">Book Value</p>
                   <p className="font-bold text-lg text-indigo-800">
                     ₹{formatNumber(fundamentals?.per_share_data?.book_value_per_share)}
                   </p>
                 </div>
               )}
               
               {formatNumber(fundamentals?.per_share_data?.sales_per_share) && (
                 <div className="text-center p-4 bg-indigo-50 rounded-lg border border-indigo-200 shadow-md">
                   <p className="text-sm text-indigo-600 mb-1">Sales per Share</p>
                   <p className="font-bold text-lg text-indigo-800">
                     ₹{formatNumber(fundamentals?.per_share_data?.sales_per_share)}
                   </p>
                 </div>
               )}
               
               {formatPercentage(fundamentals?.per_share_data?.dividend_yield) && (
                 <div className="text-center p-4 bg-indigo-50 rounded-lg border border-indigo-200 shadow-md">
                   <p className="text-sm text-indigo-600 mb-1">Dividend Yield</p>
                   <p className="font-bold text-lg text-success">
                     {formatPercentage(fundamentals?.per_share_data?.dividend_yield)}
                   </p>
                 </div>
               )}
             </div>
           </div>
         </div>
       )}

       {/* Quarterly Results */}
       {fundamentals?.quarterly_results && fundamentals.quarterly_results.length > 0 && (
         <div className="card bg-base-100 shadow-xl border border-gray-200">
           <div className="card-body">
             <h3 className="card-title text-xl mb-4">
               <BarChart3 className="w-5 h-5" />
               📊 Quarterly Performance
             </h3>
             
             <div className="overflow-x-auto">
               <table className="table table-zebra table-sm">
                 <thead>
                   <tr className="bg-base-200">
                     {fundamentals.quarterly_results[0] && Object.keys(fundamentals.quarterly_results[0]).slice(0, 6).map(key => (
                       <th key={key} className="capitalize font-semibold">
                         {key.replace(/_/g, ' ')}
                       </th>
                     ))}
                   </tr>
                 </thead>
                 <tbody>
                   {fundamentals.quarterly_results.slice(0, 4).map((quarter, index) => (
                     <tr key={index} className="hover:bg-base-50">
                       {Object.values(quarter).slice(0, 6).map((value, idx) => (
                         <td key={idx} className="font-mono text-sm">
                           {value || 'N/A'}
                         </td>
                       ))}
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           </div>
         </div>
       )}
     </div>
   )
 }

 // US Market Fundamentals with Enhanced UI
 return (
   <div className="space-y-6">
     {/* Health Score Card for US */}
     <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 shadow-xl">
       <div className="card-body">
         <div className="flex items-center justify-between">
           <div>
             <h3 className="text-2xl font-bold text-blue-800 mb-2">Financial Health Score</h3>
             <p className="text-blue-600">Based on key US market metrics</p>
           </div>
           <div className="text-center">
             <div className={`text-6xl font-bold p-4 rounded-full ${getScoreColor(healthScore)}`}>
               {healthScore}
             </div>
             <p className="text-sm font-semibold mt-2">
               {healthScore >= 80 ? 'Excellent' : healthScore >= 60 ? 'Good' : healthScore >= 40 ? 'Fair' : 'Poor'}
             </p>
           </div>
         </div>
       </div>
     </div>

     {/* US Income Statement */}
     <div className="card bg-base-100 shadow-xl border border-blue-200">
       <div className="card-body">
         <h2 className="card-title text-2xl mb-4 text-blue-800">
           <DollarSign className="w-6 h-6" />
           🇺🇸 Income Statement
         </h2>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* Revenue Section */}
           <div className="space-y-4">
             <h4 className="font-semibold text-lg text-blue-700 border-b border-blue-200 pb-2">Revenue & Growth</h4>
             
             {formatNumber(fundamentals?.income_statement?.total_revenue) && (
               <div className="stat bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 shadow-md">
                 <div className="stat-title text-blue-600">Total Revenue</div>
                 <div className="stat-value text-2xl text-blue-800">
                   ${formatNumber(fundamentals?.income_statement?.total_revenue)}
                 </div>
                 <div className="stat-desc text-blue-500">
                   {fundamentals?.profitability_metrics?.quarterly_revenue_growth && (
                     <span className={fundamentals.profitability_metrics.quarterly_revenue_growth > 0 ? 'text-success' : 'text-error'}>
                       {fundamentals.profitability_metrics.quarterly_revenue_growth > 0 ? '+' : ''}{(fundamentals.profitability_metrics.quarterly_revenue_growth * 100).toFixed(2)}% QoQ
                     </span>
                   )}
                 </div>
               </div>
             )}
             
             {formatNumber(fundamentals?.income_statement?.gross_profit) && (
               <div className="stat bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 shadow-md">
                 <div className="stat-title text-green-600">Gross Profit</div>
                 <div className="stat-value text-2xl text-green-800">
                   ${formatNumber(fundamentals?.income_statement?.gross_profit)}
                 </div>
                 <div className="stat-desc text-green-500">
                   Margin: {formatPercentage(fundamentals?.ratios?.gross_margin) || 'N/A'}
                 </div>
               </div>
             )}
           </div>

           {/* Profitability Section */}
           <div className="space-y-4">
             <h4 className="font-semibold text-lg text-green-700 border-b border-green-200 pb-2">Profitability</h4>
             
             {formatNumber(fundamentals?.income_statement?.net_income) && (
               <div className="stat bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-4 shadow-md">
                 <div className="stat-title text-emerald-600">Net Income</div>
                 <div className="stat-value text-2xl text-emerald-800">
                   ${formatNumber(fundamentals?.income_statement?.net_income)}
                 </div>
                 <div className="stat-desc text-emerald-500">
                   {fundamentals?.profitability_metrics?.quarterly_earnings_growth && (
                     <span className={fundamentals.profitability_metrics.quarterly_earnings_growth > 0 ? 'text-success' : 'text-error'}>
                       {fundamentals.profitability_metrics.quarterly_earnings_growth > 0 ? '+' : ''}{(fundamentals.profitability_metrics.quarterly_earnings_growth * 100).toFixed(2)}% QoQ
                     </span>
                   )}
                 </div>
               </div>
             )}
             
             {formatNumber(fundamentals?.income_statement?.operating_income) && (
               <div className="stat bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200 rounded-lg p-4 shadow-md">
                 <div className="stat-title text-teal-600">Operating Income</div>
                 <div className="stat-value text-2xl text-teal-800">
                   ${formatNumber(fundamentals?.income_statement?.operating_income)}
                 </div>
                 <div className="stat-desc text-teal-500">
                   Margin: {formatPercentage(fundamentals?.ratios?.operating_margin) || 'N/A'}
                 </div>
               </div>
             )}
           </div>
         </div>
       </div>
     </div>

     {/* US Balance Sheet */}
     <div className="card bg-base-100 shadow-xl border border-green-200">
       <div className="card-body">
         <h2 className="card-title text-2xl mb-4 text-green-800">
           <BarChart3 className="w-6 h-6" />
           🏦 Balance Sheet Strength
         </h2>
         
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {/* Assets */}
           <div className="space-y-3">
             <h4 className="font-semibold text-lg text-green-700 border-b border-green-200 pb-2">Assets</h4>
             
             {formatNumber(fundamentals?.balance_sheet?.total_assets) && (
               <div className="stat bg-green-50 border border-green-200 rounded-lg p-3">
                 <div className="stat-title text-sm text-green-600">Total Assets</div>
                 <div className="stat-value text-lg text-green-800">
                   ${formatNumber(fundamentals?.balance_sheet?.total_assets)}
                 </div>
               </div>
             )}
             
             {formatNumber(fundamentals?.balance_sheet?.total_cash) && (
               <div className="stat bg-green-50 border border-green-200 rounded-lg p-3">
                 <div className="stat-title text-sm text-green-600">Total Cash</div>
                 <div className="stat-value text-lg text-green-800">
                   ${formatNumber(fundamentals?.balance_sheet?.total_cash)}
                 </div>
               </div>
             )}
           </div>

           {/* Liabilities */}
           <div className="space-y-3">
             <h4 className="font-semibold text-lg text-red-700 border-b border-red-200 pb-2">Liabilities</h4>
             
             {formatNumber(fundamentals?.balance_sheet?.total_liabilities) && (
               <div className="stat bg-red-50 border border-red-200 rounded-lg p-3">
                 <div className="stat-title text-sm text-red-600">Total Liabilities</div>
                 <div className="stat-value text-lg text-red-800">
                   ${formatNumber(fundamentals?.balance_sheet?.total_liabilities)}
                 </div>
               </div>
             )}
             
             {formatNumber(fundamentals?.balance_sheet?.total_debt) && (
               <div className="stat bg-red-50 border border-red-200 rounded-lg p-3">
                 <div className="stat-title text-sm text-red-600">Total Debt</div>
                 <div className="stat-value text-lg text-red-800">
                   ${formatNumber(fundamentals?.balance_sheet?.total_debt)}
                 </div>
               </div>
             )}
           </div>

           {/* Equity */}
           <div className="space-y-3">
             <h4 className="font-semibold text-lg text-blue-700 border-b border-blue-200 pb-2">Equity</h4>
             
             {formatNumber(fundamentals?.balance_sheet?.stockholder_equity) && (
               <div className="stat bg-blue-50 border border-blue-200 rounded-lg p-3">
                 <div className="stat-title text-sm text-blue-600">Stockholder Equity</div>
                 <div className="stat-value text-lg text-blue-800">
                   ${formatNumber(fundamentals?.balance_sheet?.stockholder_equity)}
                 </div>
               </div>
             )}
             
             {/* Debt to Equity Calculation */}
             {fundamentals?.balance_sheet?.total_debt && fundamentals?.balance_sheet?.stockholder_equity && (
               <div className="stat bg-blue-50 border border-blue-200 rounded-lg p-3">
                 <div className="stat-title text-sm text-blue-600">Debt to Equity</div>
                 <div className={`stat-value text-lg ${getHealthColor((fundamentals.balance_sheet.total_debt / fundamentals.balance_sheet.stockholder_equity), 'lower_better')}`}>
                   {(fundamentals.balance_sheet.total_debt / fundamentals.balance_sheet.stockholder_equity).toFixed(2)}
                 </div>
               </div>
             )}
           </div>
         </div>
       </div>
     </div>

     {/* US Valuation & Performance Metrics */}
     <div className="card bg-base-100 shadow-xl border border-purple-200">
       <div className="card-body">
         <h2 className="card-title text-2xl mb-4 text-purple-800">
           <PieChart className="w-6 h-6" />
           📊 Valuation & Performance Metrics
         </h2>
         
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {/* P/E Ratio */}
           {formatNumber(fundamentals?.valuation_metrics?.trailing_pe) && (
             <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200 shadow-md hover:shadow-lg transition-shadow">
               <p className="text-sm text-purple-600 mb-1">P/E Ratio</p>
               <p className={`font-bold text-xl ${getHealthColor(fundamentals?.valuation_metrics?.trailing_pe, 'pe')}`}>
                 {formatNumber(fundamentals?.valuation_metrics?.trailing_pe)}
               </p>
               <p className="text-xs text-purple-500">
                 Fwd: {formatNumber(fundamentals?.valuation_metrics?.forward_pe) || 'N/A'}
               </p>
             </div>
           )}
           
           {/* P/B Ratio */}
           {formatNumber(fundamentals?.valuation_metrics?.price_to_book) && (
             <div className="text-center p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg border border-pink-200 shadow-md hover:shadow-lg transition-shadow">
               <p className="text-sm text-pink-600 mb-1">P/B Ratio</p>
               <p className="font-bold text-xl text-pink-800">
                 {formatNumber(fundamentals?.valuation_metrics?.price_to_book)}
               </p>
               <p className="text-xs text-pink-500">Price to Book</p>
             </div>
           )}
           
           {/* ROE */}
           {formatPercentage(fundamentals?.profitability_metrics?.return_on_equity) && (
             <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200 shadow-md hover:shadow-lg transition-shadow">
               <p className="text-sm text-green-600 mb-1">ROE</p>
               <p className={`font-bold text-xl ${getHealthColor(fundamentals?.profitability_metrics?.return_on_equity)}`}>
                 {formatPercentage(fundamentals?.profitability_metrics?.return_on_equity)}
               </p>
               <p className="text-xs text-green-500">Return on Equity</p>
             </div>
           )}
           
           {/* Current Ratio */}
           {formatNumber(fundamentals?.liquidity_metrics?.current_ratio) && (
             <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 shadow-md hover:shadow-lg transition-shadow">
               <p className="text-sm text-blue-600 mb-1">Current Ratio</p>
               <p className={`font-bold text-xl ${getHealthColor(fundamentals?.liquidity_metrics?.current_ratio)}`}>
                 {formatNumber(fundamentals?.liquidity_metrics?.current_ratio)}
               </p>
               <p className="text-xs text-blue-500">Liquidity Health</p>
             </div>
           )}
           
           {/* Enterprise Value */}
           {formatNumber(fundamentals?.valuation_metrics?.enterprise_value) && (
             <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border border-indigo-200 shadow-md hover:shadow-lg transition-shadow">
               <p className="text-sm text-indigo-600 mb-1">Enterprise Value</p>
               <p className="font-bold text-xl text-indigo-800">
                 ${formatNumber(fundamentals?.valuation_metrics?.enterprise_value)}
               </p>
               <p className="text-xs text-indigo-500">Total Company Value</p>
             </div>
           )}
           
           {/* Market Cap */}
           {formatNumber(fundamentals?.valuation_metrics?.market_cap) && (
             <div className="text-center p-4 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg border border-teal-200 shadow-md hover:shadow-lg transition-shadow">
               <p className="text-sm text-teal-600 mb-1">Market Cap</p>
               <p className="font-bold text-xl text-teal-800">
                 ${formatNumber(fundamentals?.valuation_metrics?.market_cap)}
               </p>
               <p className="text-xs text-teal-500">
                 {fundamentals?.valuation_metrics?.market_cap > 2e11 ? 'Large Cap' : 
                  fundamentals?.valuation_metrics?.market_cap > 2e10 ? 'Mid Cap' : 'Small Cap'}
               </p>
             </div>
           )}
           
           {/* PEG Ratio */}
           {formatNumber(fundamentals?.valuation_metrics?.peg_ratio) && (
             <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200 shadow-md hover:shadow-lg transition-shadow">
               <p className="text-sm text-yellow-600 mb-1">PEG Ratio</p>
               <p className="font-bold text-xl text-yellow-800">
                 {formatNumber(fundamentals?.valuation_metrics?.peg_ratio)}
               </p>
               <p className="text-xs text-yellow-500">
                 {fundamentals?.valuation_metrics?.peg_ratio < 1 ? 'Undervalued' : 
                  fundamentals?.valuation_metrics?.peg_ratio < 2 ? 'Fair' : 'Overvalued'}
               </p>
             </div>
           )}
           
           {/* Free Cash Flow */}
           {formatNumber(fundamentals?.cash_flow?.free_cash_flow) && (
             <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg border border-emerald-200 shadow-md hover:shadow-lg transition-shadow">
               <p className="text-sm text-emerald-600 mb-1">Free Cash Flow</p>
               <p className="font-bold text-xl text-emerald-800">
                 ${formatNumber(fundamentals?.cash_flow?.free_cash_flow)}
               </p>
               <p className="text-xs text-emerald-500">Cash Generation</p>
             </div>
           )}
         </div>
       </div>
     </div>

     {/* US Financial Health Summary */}
     <div className="card bg-base-100 shadow-xl border border-gray-200">
       <div className="card-body">
         <h2 className="card-title text-2xl mb-4">
           <Shield className="w-6 h-6" />
           🏥 Financial Health Summary
         </h2>
         
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {/* Profitability Score */}
           <div className="alert border border-green-200 bg-green-50">
             <div className="flex-1">
               <Award className="w-6 h-6 text-green-600" />
               <div>
                 <h3 className="font-bold text-green-800">Profitability Score</h3>
                 <div className="text-sm text-green-700">
                   <div className="flex justify-between">
                     <span>ROE:</span>
                     <span className="font-semibold">{formatPercentage(fundamentals?.profitability_metrics?.return_on_equity) || 'N/A'}</span>
                   </div>
                   <div className="flex justify-between">
                     <span>Net Margin:</span>
                     <span className="font-semibold">{formatPercentage(fundamentals?.profitability_metrics?.profit_margin) || 'N/A'}</span>
                   </div>
                   <div className="flex justify-between">
                     <span>Operating Margin:</span>
                     <span className="font-semibold">{formatPercentage(fundamentals?.profitability_metrics?.operating_margin) || 'N/A'}</span>
                   </div>
                 </div>
               </div>
             </div>
           </div>
           
           {/* Liquidity Score */}
           <div className="alert border border-blue-200 bg-blue-50">
             <div className="flex-1">
               <Zap className="w-6 h-6 text-blue-600" />
               <div>
                 <h3 className="font-bold text-blue-800">Liquidity Score</h3>
                 <div className="text-sm text-blue-700">
                   <div className="flex justify-between">
                     <span>Current Ratio:</span>
                     <span className="font-semibold">{formatNumber(fundamentals?.liquidity_metrics?.current_ratio) || 'N/A'}</span>
                   </div>
                   <div className="flex justify-between">
                     <span>Quick Ratio:</span>
                     <span className="font-semibold">{formatNumber(fundamentals?.ratios?.quick_ratio) || 'N/A'}</span>
                   </div>
                   <div className="flex justify-between">
                     <span>Cash Position:</span>
                     <span className="font-semibold">${formatNumber(fundamentals?.balance_sheet?.total_cash) || 'N/A'}</span>
                   </div>
                 </div>
               </div>
             </div>
           </div>
           
           {/* Valuation Score */}
           <div className="alert border border-purple-200 bg-purple-50">
             <div className="flex-1">
               <Target className="w-6 h-6 text-purple-600" />
               <div>
                 <h3 className="font-bold text-purple-800">Valuation Score</h3>
                 <div className="text-sm text-purple-700">
                   <div className="flex justify-between">
                     <span>P/E Ratio:</span>
                     <span className="font-semibold">{formatNumber(fundamentals?.valuation_metrics?.trailing_pe) || 'N/A'}</span>
                   </div>
                   <div className="flex justify-between">
                     <span>P/B Ratio:</span>
                     <span className="font-semibold">{formatNumber(fundamentals?.valuation_metrics?.price_to_book) || 'N/A'}</span>
                   </div>
                   <div className="flex justify-between">
                     <span>PEG Ratio:</span>
                     <span className="font-semibold">{formatNumber(fundamentals?.valuation_metrics?.peg_ratio) || 'N/A'}</span>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         </div>
         
         {/* Overall Assessment */}
         <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-base-100 rounded-lg border border-gray-200">
           <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
             <Activity className="w-5 h-5" />
             Overall Financial Assessment
           </h4>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
             <div>
               <span className="font-medium">Revenue Base:</span>
               <span className="ml-2">
                 {fundamentals?.income_statement?.total_revenue > 1e10 ? 'Large Scale' : 
                  fundamentals?.income_statement?.total_revenue > 1e9 ? 'Mid Scale' : 'Small Scale'}
               </span>
             </div>
             <div>
               <span className="font-medium">Growth Stage:</span>
               <span className="ml-2">
                 {fundamentals?.profitability_metrics?.quarterly_revenue_growth > 0.2 ? 'High Growth' : 
                  fundamentals?.profitability_metrics?.quarterly_revenue_growth > 0.05 ? 'Moderate Growth' : 'Mature'}
               </span>
             </div>
             <div>
               <span className="font-medium">Financial Strength:</span>
               <span className="ml-2">
                 {healthScore >= 80 ? 'Very Strong' : healthScore >= 60 ? 'Strong' : healthScore >= 40 ? 'Moderate' : 'Weak'}
               </span>
             </div>
             <div>
               <span className="font-medium">Investment Grade:</span>
               <span className="ml-2">
                 {healthScore >= 70 ? 'Investment Grade' : healthScore >= 50 ? 'Speculative Grade' : 'High Risk'}
               </span>
             </div>
           </div>
         </div>
       </div>
     </div>
   </div>
 )
}