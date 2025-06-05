'use client'

import { TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3, Target, Shield } from 'lucide-react'

export default function FundamentalAnalysis({ fundamentals, market }) {
  const formatNumber = (num) => {
    if (!num || num === 'N/A') return 'N/A'
    if (Math.abs(num) >= 1e9) return (num / 1e9).toFixed(2) + 'B'
    if (Math.abs(num) >= 1e6) return (num / 1e6).toFixed(2) + 'M'
    if (Math.abs(num) >= 1e3) return (num / 1e3).toFixed(2) + 'K'
    return typeof num === 'number' ? num.toFixed(2) : num
  }

  const formatPercentage = (num) => {
    if (!num || num === 'N/A') return 'N/A'
    const value = typeof num === 'number' ? num : parseFloat(num)
    return isNaN(value) ? 'N/A' : (value > 1 ? value.toFixed(2) : (value * 100).toFixed(2)) + '%'
  }

  const getHealthColor = (value, type = 'higher_better') => {
    if (!value || value === 'N/A') return 'text-base-content'
    const numValue = typeof value === 'number' ? value : parseFloat(value)
    if (isNaN(numValue)) return 'text-base-content'
    
    if (type === 'higher_better') {
      return numValue > 15 ? 'text-success' : numValue > 5 ? 'text-warning' : 'text-error'
    } else {
      return numValue < 0.5 ? 'text-success' : numValue < 1 ? 'text-warning' : 'text-error'
    }
  }

  // Render based on market type
  if (market === 'Indian') {
    return (
      <div className="space-y-6">
        {/* Indian Market Key Ratios */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">
              <Target className="w-6 h-6" />
              Key Financial Ratios
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="stat bg-base-200 rounded-lg p-4">
                <div className="stat-title text-sm">P/E Ratio</div>
                <div className={`stat-value text-xl ${getHealthColor(fundamentals?.key_ratios?.pe_ratio, 'pe')}`}>
                  {formatNumber(fundamentals?.key_ratios?.pe_ratio)}
                </div>
                <div className="stat-desc">Price to Earnings</div>
              </div>
              
              <div className="stat bg-base-200 rounded-lg p-4">
                <div className="stat-title text-sm">Book Value</div>
                <div className="stat-value text-xl">
                  ₹{formatNumber(fundamentals?.key_ratios?.book_value)}
                </div>
                <div className="stat-desc">Per Share</div>
              </div>
              
              <div className="stat bg-base-200 rounded-lg p-4">
                <div className="stat-title text-sm">ROE</div>
                <div className={`stat-value text-xl ${getHealthColor(fundamentals?.key_ratios?.roe)}`}>
                  {formatPercentage(fundamentals?.key_ratios?.roe)}
                </div>
                <div className="stat-desc">Return on Equity</div>
              </div>
              
              <div className="stat bg-base-200 rounded-lg p-4">
                <div className="stat-title text-sm">ROCE</div>
                <div className={`stat-value text-xl ${getHealthColor(fundamentals?.key_ratios?.roce)}`}>
                  {formatPercentage(fundamentals?.key_ratios?.roce)}
                </div>
                <div className="stat-desc">Return on Capital</div>
              </div>
              
              <div className="stat bg-base-200 rounded-lg p-4">
                <div className="stat-title text-sm">Debt to Equity</div>
                <div className={`stat-value text-xl ${getHealthColor(fundamentals?.key_ratios?.debt_to_equity, 'lower_better')}`}>
                  {formatNumber(fundamentals?.key_ratios?.debt_to_equity)}
                </div>
                <div className="stat-desc">Leverage Ratio</div>
              </div>
              
              <div className="stat bg-base-200 rounded-lg p-4">
                <div className="stat-title text-sm">Dividend Yield</div>
                <div className="stat-value text-xl text-success">
                  {formatPercentage(fundamentals?.key_ratios?.dividend_yield)}
                </div>
                <div className="stat-desc">Annual Dividend</div>
              </div>
              
              <div className="stat bg-base-200 rounded-lg p-4">
                <div className="stat-title text-sm">Market Cap</div>
                <div className="stat-value text-xl">
                  ₹{formatNumber(fundamentals?.key_ratios?.market_cap)}
                </div>
                <div className="stat-desc">Total Value</div>
              </div>
              
              <div className="stat bg-base-200 rounded-lg p-4">
                <div className="stat-title text-sm">P/B Ratio</div>
                <div className="stat-value text-xl">
                  {formatNumber(fundamentals?.key_ratios?.price_to_book)}
                </div>
                <div className="stat-desc">Price to Book</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quarterly Results */}
        {fundamentals?.quarterly_results && fundamentals.quarterly_results.length > 0 && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">
                <BarChart3 className="w-6 h-6" />
                Quarterly Performance
              </h2>
              
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      {fundamentals.quarterly_results[0] && Object.keys(fundamentals.quarterly_results[0]).map(key => (
                        <th key={key} className="capitalize">
                          {key.replace(/_/g, ' ')}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {fundamentals.quarterly_results.slice(0, 4).map((quarter, index) => (
                      <tr key={index}>
                        {Object.values(quarter).map((value, idx) => (
                          <td key={idx} className="font-mono">
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

        {/* Annual Financials */}
        {fundamentals?.annual_financials && Object.keys(fundamentals.annual_financials).length > 0 && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">
                <DollarSign className="w-6 h-6" />
                Annual Financials
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(fundamentals.annual_financials).map(([key, value]) => (
                  <div key={key} className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title text-sm capitalize">
                      {key.replace(/_/g, ' ')}
                    </div>
                    <div className="stat-value text-lg">
                      {value || 'N/A'}
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

  // US Market Fundamentals
  return (
    <div className="space-y-6">
      {/* Income Statement */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">
            <DollarSign className="w-6 h-6" />
            Income Statement
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="stat bg-base-200 rounded-lg">
              <div className="stat-title">Revenue</div>
              <div className="stat-value text-2xl">${formatNumber(fundamentals?.income_statement?.revenue)}</div>
              <div className="stat-desc">
                {fundamentals?.income_statement?.revenueGrowth && (
                  <span className={fundamentals.income_statement.revenueGrowth > 0 ? 'text-success' : 'text-error'}>
                    {fundamentals.income_statement.revenueGrowth > 0 ? '+' : ''}{(fundamentals.income_statement.revenueGrowth * 100).toFixed(2)}% YoY
                  </span>
                )}
              </div>
            </div>
            
            <div className="stat bg-base-200 rounded-lg">
              <div className="stat-title">Net Income</div>
              <div className="stat-value text-2xl">${formatNumber(fundamentals?.income_statement?.netIncome)}</div>
              <div className="stat-desc">
                {fundamentals?.income_statement?.netIncomeGrowth && (
                  <span className={fundamentals.income_statement.netIncomeGrowth > 0 ? 'text-success' : 'text-error'}>
                    {fundamentals.income_statement.netIncomeGrowth > 0 ? '+' : ''}{(fundamentals.income_statement.netIncomeGrowth * 100).toFixed(2)}% YoY
                  </span>
                )}
              </div>
            </div>
            
            <div className="stat bg-base-200 rounded-lg">
              <div className="stat-title">Gross Profit Margin</div>
              <div className="stat-value text-2xl">
                {fundamentals?.income_statement?.grossProfitRatio ? 
                  (fundamentals.income_statement.grossProfitRatio * 100).toFixed(2) + '%' : 'N/A'}
              </div>
            </div>
            
            <div className="stat bg-base-200 rounded-lg">
              <div className="stat-title">Operating Margin</div>
              <div className="stat-value text-2xl">
                {fundamentals?.income_statement?.operatingIncomeRatio ? 
                  (fundamentals.income_statement.operatingIncomeRatio * 100).toFixed(2) + '%' : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Balance Sheet */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">
            <BarChart3 className="w-6 h-6" />
            Balance Sheet
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="stat bg-base-200 rounded-lg">
              <div className="stat-title">Total Assets</div>
              <div className="stat-value text-2xl">${formatNumber(fundamentals?.balance_sheet?.totalAssets)}</div>
            </div>
            
            <div className="stat bg-base-200 rounded-lg">
              <div className="stat-title">Total Liabilities</div>
              <div className="stat-value text-2xl">${formatNumber(fundamentals?.balance_sheet?.totalLiabilities)}</div>
            </div>
            
            <div className="stat bg-base-200 rounded-lg">
              <div className="stat-title">Total Equity</div>
              <div className="stat-value text-2xl">${formatNumber(fundamentals?.balance_sheet?.totalStockholdersEquity)}</div>
            </div>
            
            <div className="stat bg-base-200 rounded-lg">
              <div className="stat-title">Debt to Equity</div>
              <div className="stat-value text-2xl">
                {fundamentals?.balance_sheet?.totalDebt && fundamentals?.balance_sheet?.totalStockholdersEquity ? 
                  (fundamentals.balance_sheet.totalDebt / fundamentals.balance_sheet.totalStockholdersEquity).toFixed(2) : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">
            <PieChart className="w-6 h-6" />
            Key Metrics & Ratios
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm text-base-content/60">ROE</p>
              <p className={`font-bold text-xl ${getHealthColor(fundamentals?.ratios?.returnOnEquity)}`}>
                {fundamentals?.ratios?.returnOnEquity ? 
                  (fundamentals.ratios.returnOnEquity * 100).toFixed(2) + '%' : 'N/A'}
              </p>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-base-content/60">ROA</p>
              <p className={`font-bold text-xl ${getHealthColor(fundamentals?.ratios?.returnOnTangibleAssets)}`}>
                {fundamentals?.ratios?.returnOnTangibleAssets ? 
                  (fundamentals.ratios.returnOnTangibleAssets * 100).toFixed(2) + '%' : 'N/A'}
              </p>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <p className="text-sm text-base-content/60">Current Ratio</p>
              <p className={`font-bold text-xl ${getHealthColor(fundamentals?.ratios?.currentRatio)}`}>
                {fundamentals?.ratios?.currentRatio?.toFixed(2) || 'N/A'}
              </p>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <p className="text-sm text-base-content/60">Quick Ratio</p>
              <p className={`font-bold text-xl ${getHealthColor(fundamentals?.ratios?.quickRatio)}`}>
                {fundamentals?.ratios?.quickRatio?.toFixed(2) || 'N/A'}
              </p>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-sm text-base-content/60">P/E Ratio</p>
              <p className="font-bold text-xl">
                {fundamentals?.ratios?.priceEarningsRatio?.toFixed(2) || 'N/A'}
              </p>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm text-base-content/60">P/B Ratio</p>
              <p className="font-bold text-xl">
                {fundamentals?.ratios?.priceToBookRatio?.toFixed(2) || 'N/A'}
              </p>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
              <p className="text-sm text-base-content/60">EPS</p>
              <p className="font-bold text-xl">
                ${fundamentals?.income_statement?.eps?.toFixed(2) || 'N/A'}
              </p>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20 rounded-lg border border-teal-200 dark:border-teal-800">
              <p className="text-sm text-base-content/60">Free Cash Flow</p>
              <p className="font-bold text-xl">
                ${formatNumber(fundamentals?.cash_flow?.freeCashFlow)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Health Summary */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">
            <Shield className="w-6 h-6" />
            Financial Health Summary
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="alert alert-info">
              <div>
                <h3 className="font-bold">Profitability</h3>
                <div className="text-sm">
                  ROE: {fundamentals?.ratios?.returnOnEquity ? 
                    (fundamentals.ratios.returnOnEquity * 100).toFixed(1) + '%' : 'N/A'}
                  <br />
                  Net Margin: {fundamentals?.income_statement?.netIncomeRatio ? 
                    (fundamentals.income_statement.netIncomeRatio * 100).toFixed(1) + '%' : 'N/A'}
                </div>
              </div>
            </div>
            
            <div className="alert alert-warning">
              <div>
                <h3 className="font-bold">Liquidity</h3>
                <div className="text-sm">
                  Current Ratio: {fundamentals?.ratios?.currentRatio?.toFixed(2) || 'N/A'}
                  <br />
                  Quick Ratio: {fundamentals?.ratios?.quickRatio?.toFixed(2) || 'N/A'}
                </div>
              </div>
            </div>
            
            <div className="alert alert-success">
              <div>
                <h3 className="font-bold">Valuation</h3>
                <div className="text-sm">
                  P/E: {fundamentals?.ratios?.priceEarningsRatio?.toFixed(1) || 'N/A'}
                  <br />
                  P/B: {fundamentals?.ratios?.priceToBookRatio?.toFixed(1) || 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}