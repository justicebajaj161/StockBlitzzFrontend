'use client'

import { Activity, TrendingUp, BarChart3, Brain } from 'lucide-react'

export default function LoadingSpinner() {
  const steps = [
    { icon: Activity, label: 'Fetching market data', delay: '0s' },
    { icon: BarChart3, label: 'Analyzing fundamentals', delay: '0.5s' },
    { icon: TrendingUp, label: 'Computing technical indicators', delay: '1s' },
    { icon: Brain, label: 'Generating AI insights', delay: '1.5s' }
  ]

  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* Main Loading Animation */}
      <div className="relative mb-8">
        <div className="w-32 h-32 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-32 h-32 border-4 border-transparent border-b-secondary rounded-full animate-spin animate-reverse"></div>
        <div className="absolute inset-4 w-24 h-24 border-4 border-transparent border-r-accent rounded-full animate-spin"></div>
        
        {/* Center Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Activity className="w-8 h-8 text-primary animate-pulse" />
        </div>
      </div>

      {/* Loading Steps */}
      <div className="space-y-3 w-full max-w-md">
        {steps.map((step, index) => {
          const Icon = step.icon
          return (
            <div 
              key={index}
              className="flex items-center gap-3 p-3 bg-base-100 rounded-lg shadow-sm"
              style={{ animationDelay: step.delay }}
            >
              <div className="animate-pulse">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm text-base-content/70">{step.label}</span>
              <div className="ml-auto">
                <div className="w-2 h-2 bg-primary rounded-full animate-ping"></div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-md mt-6">
        <div className="w-full bg-base-300 rounded-full h-2">
          <div className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full animate-pulse" 
               style={{ width: '75%' }}></div>
        </div>
        <p className="text-center text-sm text-base-content/60 mt-2">
          This may take a few moments...
        </p>
      </div>
    </div>
  )
}