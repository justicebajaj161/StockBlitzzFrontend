'use client'

import { useState, useEffect } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import { Activity, TrendingUp, Volume2, Calendar } from 'lucide-react'
import 'chartjs-adapter-date-fns'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
)

export default function StockChart({ symbol, market, priceData }) {
  const [chartType, setChartType] = useState('price')
  const [timeRange, setTimeRange] = useState('6M')
  const [chartData, setChartData] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (symbol) {
      fetchChartData()
    }
  }, [symbol, timeRange, chartType])

  const fetchChartData = async () => {
    setLoading(true)
    try {
      // This would typically fetch historical data from your backend
      // For now, we'll generate mock data based on current price
      const mockData = generateMockData(priceData?.current_price || 100, timeRange)
      setChartData(mockData)
    } catch (error) {
      console.error('Error fetching chart data:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateMockData = (currentPrice, range) => {
    const periods = {
      '1M': 30,
      '3M': 90,
      '6M': 180,
      '1Y': 365,
      '2Y': 730
    }

    const days = periods[range] || 180
    const data = []
    const volumeData = []
    let price = currentPrice * 0.8 // Start 20% lower
    
    for (let i = days; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      
      // Add some volatility
      const change = (Math.random() - 0.5) * 0.04 * price
      price += change
      
      // Ensure we end near current price
      if (i < 10) {
        const targetDiff = (currentPrice - price) / 10
        price += targetDiff
      }

      data.push({
        x: date.toISOString().split('T')[0],
        y: Math.max(price, 0)
      })

      volumeData.push({
        x: date.toISOString().split('T')[0],
        y: Math.floor(Math.random() * 10000000) + 1000000
      })
    }

    return { priceData: data, volumeData }
  }

  const getPriceChartConfig = () => ({
    data: {
      datasets: [
        {
          label: `${symbol} Price`,
          data: chartData?.priceData || [],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: `${symbol} Stock Price - ${timeRange}`,
        },
      },
      scales: {
        x: {
          type: 'time',
          time: {
            unit: timeRange === '1M' ? 'day' : timeRange === '1Y' || timeRange === '2Y' ? 'month' : 'week',
          },
        },
        y: {
          beginAtZero: false,
          title: {
            display: true,
            text: 'Price ($)',
          },
        },
      },
    },
  })

  const getVolumeChartConfig = () => ({
    data: {
      datasets: [
        {
          label: `${symbol} Volume`,
          data: chartData?.volumeData || [],
          backgroundColor: 'rgba(34, 197, 94, 0.6)',
          borderColor: 'rgb(34, 197, 94)',
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: `${symbol} Trading Volume - ${timeRange}`,
        },
      },
      scales: {
        x: {
          type: 'time',
          time: {
            unit: timeRange === '1M' ? 'day' : timeRange === '1Y' || timeRange === '2Y' ? 'month' : 'week',
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Volume',
          },
        },
      },
    },
  })

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <h2 className="card-title text-2xl">
            <Activity className="w-6 h-6" />
            Stock Chart Analysis
          </h2>
          
          {/* Chart Controls */}
          <div className="flex flex-wrap gap-2">
            {/* Chart Type Toggle */}
            <div className="btn-group">
              <button
                className={`btn btn-sm ${chartType === 'price' ? 'btn-active' : 'btn-outline'}`}
                onClick={() => setChartType('price')}
              >
                <TrendingUp className="w-4 h-4 mr-1" />
                Price
              </button>
              <button
                className={`btn btn-sm ${chartType === 'volume' ? 'btn-active' : 'btn-outline'}`}
                onClick={() => setChartType('volume')}
              >
                <Volume2 className="w-4 h-4 mr-1" />
                Volume
              </button>
            </div>
            
            {/* Time Range Selector */}
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-sm btn-outline">
                <Calendar className="w-4 h-4 mr-1" />
                {timeRange}
              </label>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-32">
                {['1M', '3M', '6M', '1Y', '2Y'].map((range) => (
                  <li key={range}>
                    <button
                      className={timeRange === range ? 'active' : ''}
                      onClick={() => setTimeRange(range)}
                    >
                      {range}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Chart Area */}
        <div className="min-h-[400px] flex items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center gap-4">
              <span className="loading loading-spinner loading-lg"></span>
              <p className="text-base-content/60">Loading chart data...</p>
            </div>
          ) : chartData ? (
            <div className="w-full h-96">
              {chartType === 'price' ? (
                <Line {...getPriceChartConfig()} />
              ) : (
                <Bar {...getVolumeChartConfig()} />
              )}
            </div>
          ) : (
            <div className="text-center">
              <p className="text-base-content/60">No chart data available</p>
              <button 
                className="btn btn-primary btn-sm mt-2"
                onClick={fetchChartData}
              >
                Load Chart Data
              </button>
            </div>
          )}
        </div>

        {/* Chart Insights */}
        {chartData && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="stat bg-base-200 rounded-lg">
              <div className="stat-title">Current Price</div>
              <div className="stat-value text-primary">
                ${priceData?.current_price?.toFixed(2) || 'N/A'}
              </div>
              <div className="stat-desc">
                {priceData?.change_percent > 0 ? '↗︎' : '↘︎'} 
                {priceData?.change_percent?.toFixed(2) || '0'}% today
              </div>
            </div>
            
            <div className="stat bg-base-200 rounded-lg">
              <div className="stat-title">Day Range</div>
              <div className="stat-value text-lg">
                ${priceData?.low?.toFixed(2) || 'N/A'}
              </div>
              <div className="stat-desc">
                to ${priceData?.high?.toFixed(2) || 'N/A'}
              </div>
            </div>
            
            <div className="stat bg-base-200 rounded-lg">
              <div className="stat-title">Volume</div>
              <div className="stat-value text-lg">
                {priceData?.volume ? (priceData.volume / 1000000).toFixed(1) + 'M' : 'N/A'}
              </div>
              <div className="stat-desc">Shares traded</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}