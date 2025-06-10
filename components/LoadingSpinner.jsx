'use client'

import { Activity, TrendingUp, BarChart3, Brain, Zap } from 'lucide-react'

export default function LoadingSpinner({ message = "Analyzing stock data..." }) {
  const steps = [
    { icon: Activity, label: 'Fetching market data', delay: '0s' },
    { icon: BarChart3, label: 'Analyzing fundamentals', delay: '0.5s' },
    { icon: TrendingUp, label: 'Computing technical indicators', delay: '1s' },
    { icon: Brain, label: 'Generating AI insights', delay: '1.5s' },
    { icon: Zap, label: 'Finalizing analysis', delay: '2s' }
  ]

  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* Enhanced Main Loading Animation */}
      <div className="relative mb-8">
        {/* Outer ring */}
        <div className="w-40 h-40 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        {/* Middle ring */}
        <div className="absolute inset-2 w-36 h-36 border-4 border-transparent border-b-secondary rounded-full animate-spin animate-reverse"></div>
        {/* Inner ring */}
        <div className="absolute inset-4 w-32 h-32 border-4 border-transparent border-r-accent rounded-full animate-spin"></div>
        {/* Center pulse */}
        <div className="absolute inset-8 w-24 h-24 bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse"></div>
        
        {/* Center Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Activity className="w-10 h-10 text-white animate-pulse" />
        </div>
      </div>

      {/* Enhanced Loading Steps */}
      <div className="space-y-3 w-full max-w-md">
        {steps.map((step, index) => {
          const Icon = step.icon
          return (
            <div 
              key={index}
              className="flex items-center gap-3 p-4 bg-base-100 rounded-xl shadow-sm border border-base-300 animate-slideInLeft"
              style={{ animationDelay: step.delay }}
            >
              <div className="animate-bounce" style={{ animationDelay: step.delay }}>
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-base-content/80">{step.label}</span>
              <div className="ml-auto flex space-x-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-ping" style={{ animationDelay: step.delay }}></div>
                <div className="w-2 h-2 bg-secondary rounded-full animate-ping" style={{ animationDelay: `calc(${step.delay} + 0.2s)` }}></div>
                <div className="w-2 h-2 bg-accent rounded-full animate-ping" style={{ animationDelay: `calc(${step.delay} + 0.4s)` }}></div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Enhanced Progress Bar */}
      <div className="w-full max-w-md mt-8">
        <div className="w-full bg-base-300 rounded-full h-3 overflow-hidden">
          <div className="bg-gradient-to-r from-primary via-secondary to-accent h-3 rounded-full animate-pulse progress-animated"></div>
        </div>
        <div className="flex justify-between text-xs text-base-content/60 mt-2">
          <span>Initializing...</span>
          <span className="animate-pulse">{message}</span>
          <span>Completing...</span>
        </div>
      </div>

      {/* Processing indicator */}
      <div className="mt-6 flex items-center gap-2 text-base-content/50">
        <div className="w-2 h-2 bg-primary rounded-full animate-ping"></div>
        <span className="text-sm">Processing financial data...</span>
      </div>
    </div>
  )
}