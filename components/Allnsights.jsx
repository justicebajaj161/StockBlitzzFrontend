'use client'

import { Brain, TrendingUp, Shield, Target } from 'lucide-react'

export default function AIInsights({ aiAnalysis }) {
  if (!aiAnalysis?.analysis) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">
            <Brain className="w-6 h-6" />
            AI Analysis
          </h2>
          <p className="text-base-content/60">No AI analysis available</p>
        </div>
      </div>
    )
  }

  // Parse the AI analysis text into sections
  const parseAnalysis = (text) => {
    const sections = {
      recommendation: '',
      strengths: [],
      weaknesses: [],
      risks: '',
      targets: {},
      strategy: ''
    }

    // This is a simple parser - in production, you'd want more robust parsing
    const lines = text.split('\n')
    let currentSection = ''

    lines.forEach(line => {
      if (line.includes('recommendation') || line.includes('Buy') || line.includes('Sell') || line.includes('Hold')) {
        currentSection = 'recommendation'
      } else if (line.includes('strength') || line.includes('Strength')) {
        currentSection = 'strengths'
      } else if (line.includes('weakness') || line.includes('Weakness')) {
        currentSection = 'weaknesses'
      } else if (line.includes('risk') || line.includes('Risk')) {
        currentSection = 'risks'
      } else if (line.includes('target') || line.includes('Target')) {
        currentSection = 'targets'
      } else if (line.includes('strategy') || line.includes('Strategy')) {
        currentSection = 'strategy'
      }

      // Add content to appropriate section
      if (line.trim()) {
        switch(currentSection) {
          case 'recommendation':
            sections.recommendation += line + ' '
            break
          case 'strengths':
            if (line.includes('-') || line.includes('•')) {
              sections.strengths.push(line.replace(/[-•]/g, '').trim())
            }
            break
          case 'weaknesses':
            if (line.includes('-') || line.includes('•')) {
              sections.weaknesses.push(line.replace(/[-•]/g, '').trim())
            }
            break
          case 'risks':
            sections.risks += line + ' '
            break
          case 'strategy':
            sections.strategy += line + ' '
            break
        }
      }
    })

    return sections
  }

  const analysis = parseAnalysis(aiAnalysis.analysis)

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-4">
          <Brain className="w-6 h-6" />
          AI-Powered Analysis
        </h2>
        
        {/* Recommendation Badge */}
        <div className="alert alert-info mb-6">
          <TrendingUp className="w-6 h-6" />
          <div>
            <h3 className="font-bold">AI Recommendation</h3>
            <p className="text-sm">{analysis.recommendation || aiAnalysis.analysis.slice(0, 200)}</p>
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {analysis.strengths.length > 0 && (
            <div className="bg-success/10 p-4 rounded-lg">
              <h3 className="font-semibold text-success mb-2">Key Strengths</h3>
              <ul className="list-disc list-inside space-y-1">
                {analysis.strengths.slice(0, 3).map((strength, i) => (
                  <li key={i} className="text-sm">{strength}</li>
                ))}
              </ul>
            </div>
          )}
          
          {analysis.weaknesses.length > 0 && (
            <div className="bg-error/10 p-4 rounded-lg">
              <h3 className="font-semibold text-error mb-2">Key Weaknesses</h3>
              <ul className="list-disc list-inside space-y-1">
                {analysis.weaknesses.slice(0, 3).map((weakness, i) => (
                  <li key={i} className="text-sm">{weakness}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Risk Assessment */}
        {analysis.risks && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5" />
              <h3 className="font-semibold">Risk Assessment</h3>
            </div>
            <p className="text-sm text-base-content/80">{analysis.risks}</p>
          </div>
        )}

        {/* Strategy */}
        {analysis.strategy && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5" />
              <h3 className="font-semibold">Investment Strategy</h3>
            </div>
            <p className="text-sm text-base-content/80">{analysis.strategy}</p>
          </div>
        )}

        {/* Full Analysis Text */}
        <div className="collapse collapse-arrow bg-base-200 mt-6">
          <input type="checkbox" />
          <div className="collapse-title font-medium">
            View Full AI Analysis
          </div>
          <div className="collapse-content">
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap text-sm">{aiAnalysis.analysis}</pre>
            </div>
          </div>
        </div>

        {/* Timestamp */}
        <div className="text-xs text-base-content/50 mt-4">
          Analysis generated at: {new Date(aiAnalysis.timestamp).toLocaleString()}
        </div>
      </div>
    </div>
  )
}