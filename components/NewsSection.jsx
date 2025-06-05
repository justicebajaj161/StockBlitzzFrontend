'use client'

import { Newspaper, ExternalLink, Clock } from 'lucide-react'

export default function NewsSection({ news }) {
  const getTimeAgo = (date) => {
    const now = new Date()
    const newsDate = new Date(date)
    const diffInHours = Math.floor((now - newsDate) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours} hours ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays === 1) return 'Yesterday'
    return `${diffInDays} days ago`
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-4">
          <Newspaper className="w-6 h-6" />
          Latest News & Sentiment
        </h2>
        
        {/* Overall Sentiment */}
        <div className="alert mb-6">
          <div>
            <h3 className="font-bold">Overall Market Sentiment</h3>
            <p className="text-sm">
              {news?.overall_sentiment || 'Neutral'} - Based on recent news analysis
            </p>
          </div>
        </div>
        
        {/* News Articles */}
        {news?.articles && news.articles.length > 0 ? (
          <div className="space-y-4">
            {news.articles.map((article, index) => (
              <div key={index} className="card bg-base-200">
                <div className="card-body p-4">
                  <h3 className="font-semibold text-sm line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-xs text-base-content/70 line-clamp-2 mt-1">
                    {article.text || article.summary}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2 text-xs text-base-content/60">
                      <Clock className="w-3 h-3" />
                      <span>{getTimeAgo(article.publishedDate)}</span>
                      {article.site && (
                        <>
                          <span>•</span>
                          <span>{article.site}</span>
                        </>
                      )}
                    </div>
                    <a 
                      href={article.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-xs btn-ghost"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-base-content/60">No recent news available</p>
        )}
      </div>
    </div>
  )
}