'use client'

import { Newspaper, ExternalLink, Clock, TrendingUp, TrendingDown, Activity } from 'lucide-react'

export default function NewsSection({ news }) {
  const getTimeAgo = (date) => {
    const now = new Date()
    const newsDate = new Date(date)
    const diffInHours = Math.floor((now - newsDate) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours} hours ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays === 1) return 'Yesterday'
    if (diffInDays < 7) return `${diffInDays} days ago`
    return `${Math.floor(diffInDays / 7)} weeks ago`
  }

  const getSentimentColor = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return 'text-green-600 bg-green-100 border-green-200'
      case 'negative':
        return 'text-red-600 bg-red-100 border-red-200'
      case 'neutral':
      default:
        return 'text-blue-600 bg-blue-100 border-blue-200'
    }
  }

  const getSentimentIcon = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return TrendingUp
      case 'negative':
        return TrendingDown
      case 'neutral':
      default:
        return Activity
    }
  }

  const overallSentiment = news?.overall_sentiment || 'Neutral'
  const sentimentScore = news?.sentiment_score || 0
  const SentimentIcon = getSentimentIcon(overallSentiment)

  return (
    <div className="space-y-6">
      {/* News Sentiment Overview */}
      <div className="card bg-base-100 shadow-xl border border-gray-200">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4 flex items-center gap-2">
            <Newspaper className="w-6 h-6" />
            📰 News Sentiment Analysis
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Overall Sentiment */}
            <div className={`p-6 rounded-lg border-2 ${getSentimentColor(overallSentiment)}`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold">Overall Sentiment</h3>
                  <p className="text-sm opacity-80">Based on {news?.news_count || 0} articles</p>
                </div>
                <SentimentIcon className="w-12 h-12" />
              </div>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold">{overallSentiment}</span>
                <div className="flex-1">
                  <div className="text-sm mb-1">Sentiment Score</div>
                  <progress 
                    className={`progress w-full h-3 ${
                      overallSentiment === 'Positive' ? 'progress-success' :
                      overallSentiment === 'Negative' ? 'progress-error' :
                      'progress-info'
                    }`}
                    value={Math.abs(sentimentScore)} 
                    max="100"
                  ></progress>
                  <div className="text-xs text-center mt-1">
                    {sentimentScore > 0 ? '+' : ''}{sentimentScore.toFixed(1)}
                  </div>
                </div>
              </div>
            </div>

            {/* Sentiment Breakdown */}
            <div className="space-y-3">
              <h3 className="text-xl font-bold">Sentiment Breakdown</h3>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-2xl font-bold text-green-600">
                    {news?.positive_news || 0}
                  </div>
                  <div className="text-sm text-green-700">Positive</div>
                </div>
                
                <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="text-2xl font-bold text-red-600">
                    {news?.negative_news || 0}
                  </div>
                  <div className="text-sm text-red-700">Negative</div>
                </div>
                
                <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600">
                    {news?.neutral_news || 0}
                  </div>
                  <div className="text-sm text-blue-700">Neutral</div>
                </div>
              </div>
              
              {/* Data Sources */}
              <div className="mt-4">
                <h4 className="font-semibold text-sm mb-2">News Sources:</h4>
                <div className="flex flex-wrap gap-2">
                  {news?.sources?.map((source, index) => (
                    <span key={index} className="badge badge-outline badge-sm">
                      {source}
                    </span>
                  )) || (
                    <span className="badge badge-outline badge-sm">Multiple Sources</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* News Articles */}
      <div className="card bg-base-100 shadow-xl border border-gray-200">
        <div className="card-body">
          <h3 className="card-title text-xl mb-4">Latest News Articles</h3>
          
          {news?.articles && news.articles.length > 0 ? (
            <div className="space-y-4">
              {news.articles.map((article, index) => {
                const ArticleSentimentIcon = getSentimentIcon(article.sentiment)
                
                return (
                  <div key={index} className="card bg-base-50 border border-base-300 hover:shadow-lg transition-shadow">
                    <div className="card-body p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg line-clamp-2 mb-2">
                            {article.title}
                          </h4>
                          <p className="text-sm text-base-content/70 line-clamp-3 mb-3">
                            {article.text || article.summary}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-xs text-base-content/60">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{getTimeAgo(article.publishedDate)}</span>
                              </div>
                              {article.site && (
                                <>
                                  <span>•</span>
                                  <span className="badge badge-ghost badge-xs">{article.site}</span>
                                </>
                              )}
                              {article.sentiment && (
                                <>
                                  <span>•</span>
                                  <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${getSentimentColor(article.sentiment)}`}>
                                    <ArticleSentimentIcon className="w-3 h-3" />
                                    <span>{article.sentiment}</span>
                                  </div>
                                </>
                              )}
                            </div>
                            
                            {article.url && article.url !== '#' && (
                              <a 
                                href={article.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="btn btn-xs btn-ghost hover:btn-primary"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Newspaper className="w-16 h-16 mx-auto text-base-content/30 mb-4" />
              <p className="text-base-content/60 mb-2">No recent news available</p>
              <p className="text-sm text-base-content/50">Check back later for updates</p>
            </div>
          )}
        </div>
      </div>

      {/* News Analysis Insights */}
      <div className="card bg-gradient-to-r from-base-100 to-base-200 shadow-xl border border-gray-200">
        <div className="card-body">
          <h3 className="card-title text-xl mb-4">📊 News Analysis Insights</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-2">Coverage Volume</h4>
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {news?.news_count || 0}
              </div>
              <div className="text-sm text-gray-600">
                Articles analyzed
              </div>
            </div>
            
            <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-2">Sentiment Ratio</h4>
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {news?.positive_news && news?.negative_news 
                  ? (news.positive_news / Math.max(news.negative_news, 1)).toFixed(1) + ':1'
                  : 'N/A'
                }
              </div>
              <div className="text-sm text-gray-600">
                Positive to Negative
              </div>
            </div>
            
            <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-2">Market Impact</h4>
              <div className={`text-2xl font-bold mb-1 ${
                Math.abs(sentimentScore) > 50 ? 'text-orange-600' :
                Math.abs(sentimentScore) > 25 ? 'text-yellow-600' :
                'text-green-600'
              }`}>
                {Math.abs(sentimentScore) > 50 ? 'High' :
                 Math.abs(sentimentScore) > 25 ? 'Medium' :
                 'Low'
                }
              </div>
              <div className="text-sm text-gray-600">
                Sentiment Impact
              </div>
            </div>
          </div>
          
          {/* News Summary */}
          <div className="mt-6 p-4 bg-base-200 rounded-lg border border-base-300">
            <h4 className="font-semibold mb-2">📝 News Summary</h4>
            <p className="text-sm text-base-content/80">
              {news?.overall_sentiment === 'Positive' 
                ? 'Recent news coverage shows a positive sentiment with more favorable coverage and analyst opinions. This could indicate growing investor confidence and potential upward price momentum.'
               : news?.overall_sentiment === 'Negative'
               ? 'Recent news coverage shows a negative sentiment with more critical coverage and concerns. This could indicate declining investor confidence and potential downward price pressure.'
               : 'Recent news coverage shows a balanced sentiment with mixed opinions from analysts and media. Market participants may be taking a wait-and-see approach.'
             }
           </p>
           
           {/* Investment Implications */}
           <div className="mt-3 p-3 bg-white rounded border border-gray-200">
             <h5 className="font-semibold text-sm mb-2">💡 Investment Implications:</h5>
             <ul className="text-xs space-y-1 text-base-content/70">
               <li>• News sentiment can be a leading indicator of price movements</li>
               <li>• {news?.overall_sentiment === 'Positive' ? 'Positive sentiment may support current valuation levels' : 
                     news?.overall_sentiment === 'Negative' ? 'Negative sentiment may create downward pressure on prices' :
                     'Neutral sentiment suggests fundamentals may drive price action'}</li>
               <li>• Consider news sentiment alongside technical and fundamental analysis</li>
               <li>• Monitor for sudden sentiment shifts that could indicate trend reversals</li>
             </ul>
           </div>
         </div>
       </div>
     </div>
   </div>
 )
}