'use client';

import { useState, useCallback } from 'react';
import { 
  Sparkles, Github, Twitter, Linkedin, Zap, Clock, Coins, Copy, 
  Brain, ArrowRight, Server, Cpu, Shield, Globe, Code2, 
  Satellite, Orbit, ScanSearch, Binary, Network
} from 'lucide-react';

export default function Home() {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<{ posts: string[]; tokenUsage?: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setError(null);
    setResults(null);

    try {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, tone }),
  });

  const data = await response.json();
  if (!response.ok) {
    const errorMessage = typeof data.error === 'string' ? data.error : 'Neural network optimization required. Please try again.';
    throw new Error(errorMessage);
  }
  setResults(data);
} catch (err: unknown) {
  const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
  setError(errorMessage);
} finally {
  setIsGenerating(false);
}
  };

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-indigo-950 overflow-hidden">
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMEg0MFY0MEgweiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMWEzOGZmIiBzdHJva2Utb3BhY2l0eT0iMC4xIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=')] opacity-20"></div>
        
        
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="animate-orbit-slow">
            <Satellite className="w-4 h-4 text-blue-400/30" />
          </div>
          <div className="animate-orbit-medium" style={{ animationDelay: '-3s' }}>
            <Orbit className="w-3 h-3 text-indigo-400/20" />
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto p-4 md:p-8">
        {}
        <div className="text-center mb-20 mt-16 md:mt-24">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-blue-600/20 via-blue-500/30 to-indigo-600/20 rounded-3xl mb-8 shadow-2xl shadow-blue-500/10 border border-blue-500/20 backdrop-blur-xl">
            <div className="relative">
              <Sparkles className="h-12 w-12 text-blue-300 filter drop-shadow-lg" />
              <div className="absolute -inset-3 bg-blue-400/20 blur-xl rounded-full"></div>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-indigo-100 to-cyan-200 mb-6 filter drop-shadow-2xl">
            FORGE
            <span className="text-blue-400">AI</span>
          </h1>
          
          <div className="inline-flex items-center gap-3 bg-gray-900/50 border border-gray-700/30 px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/20"></div>
            <span className="text-sm text-gray-300">Generative AI Platform Online</span>
          </div>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Advanced neural networks engineered for <span className="text-blue-300">professional content creation</span>.
            Transform concepts into compelling narratives with enterprise-grade AI.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          
          <form
            onSubmit={handleSubmit}
            className="bg-gray-900/40 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 mb-20 border border-gray-700/30 relative overflow-hidden"
          >
            
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 blur-lg opacity-50"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <Cpu className="h-5 w-5 text-blue-400" />
                <label htmlFor="topic" className="block text-sm font-medium text-gray-300">
                  INPUT CONCEPT
                </label>
              </div>
              <input
                type="text"
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full p-5 bg-gray-800/30 border border-gray-700/50 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 focus:outline-none transition-all text-white placeholder-gray-500 text-lg shadow-inner backdrop-blur-sm"
                placeholder="Enter strategic concept or topic..."
                required
                disabled={isGenerating}
              />
            </div>

            <div className="relative z-10 mt-8">
              <div className="flex items-center gap-3 mb-2">
                <ScanSearch className="h-5 w-5 text-indigo-400" />
                <label htmlFor="tone" className="block text-sm font-medium text-gray-300">
                  OUTPUT CONFIGURATION
                </label>
              </div>
              <select
                id="tone"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full p-5 bg-gray-800/30 border border-gray-700/50 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 focus:outline-none transition-all text-white appearance-none shadow-inner backdrop-blur-sm"
                disabled={isGenerating}
              >
                <option value="professional"> Executive Professional</option>
                <option value="enthusiastic"> Visionary Leadership</option>
                <option value="casual"> Thought Leadership</option>
                <option value="witty"> Strategic Insight</option>
                <option value="inspirational"> Motivational Influence</option>
                <option value="storytelling"> Narrative Excellence</option>
                <option value="technical"> Technical Deep Dive</option>
              </select>
            </div>

            <div className="relative z-10 mt-12">
              <button
                type="submit"
                disabled={isGenerating || !topic}
                className="w-full py-5 px-8 bg-gradient-to-r from-blue-700/80 via-blue-600/80 to-indigo-700/80 hover:from-blue-600/90 hover:to-indigo-600/90 disabled:from-gray-800 disabled:to-gray-900 text-white font-semibold text-lg rounded-2xl shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 transform hover:-translate-y-1 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center gap-4 group relative overflow-hidden"
              >
                
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -inset-10 bg-gradient-to-r from-blue-500/10 via-transparent to-transparent transform rotate-45 translate-x-[-100px] group-hover:translate-x-[100px] transition-transform duration-1000"></div>
                
                {isGenerating ? (
                  <>
                    <div className="relative">
                      <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-white"></div>
                      <Binary className="h-4 w-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white" />
                    </div>
                    <span className="relative">Processing Neural Networks...</span>
                  </>
                ) : (
                  <>
                    <Brain className="h-7 w-7 relative group-hover:scale-110 transition-transform duration-300" />
                    <span className="relative">Initiate Content Generation</span>
                    <ArrowRight className="h-5 w-5 relative group-hover:translate-x-2 transition-transform duration-300" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>Enterprise Security</span>
                </div>
                <div className="flex items-center gap-2">
                  <Server className="h-4 w-4" />
                  <span>AI Cluster</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span>Global Network</span>
                </div>
              </div>
            </div>
          </form>

          
          {error && (
            <div className="bg-red-900/40 text-red-200 p-8 rounded-3xl shadow-2xl mb-16 border border-red-700/30 backdrop-blur-2xl relative overflow-hidden">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600/10 to-red-800/10 blur-lg opacity-30"></div>
              <div className="relative z-10">
                <p className="font-semibold mb-3 flex items-center gap-3">
                  <Zap className="h-5 w-5 text-red-400" />
                  System Optimization Required
                </p>
                <p className="text-red-300/90">{error}</p>
              </div>
            </div>
          )}

          
          {results && (
            <div className="space-y-16">
              <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 filter drop-shadow-lg">
                  Generation Complete
                </h2>
                <p className="text-gray-400 text-lg">Strategic content variations ready for deployment</p>

                {results.tokenUsage && (
                  <div className="inline-flex items-center gap-8 mt-8 text-sm text-gray-400 bg-gray-900/50 px-6 py-3 rounded-2xl backdrop-blur-xl border border-gray-700/30">
                    <div className="flex items-center gap-3">
                      <Clock size={18} className="text-blue-400" />
                      <span>{(results.tokenUsage / 100).toFixed(1)}s neural processing</span>
                    </div>
                    <div className="w-px h-6 bg-gray-700/50"></div>
                    <div className="flex items-center gap-3">
                      <Coins size={18} className="text-amber-400" />
                      <span>${(results.tokenUsage * 0.000002).toFixed(4)} compute cost</span>
                    </div>
                    <div className="w-px h-6 bg-gray-700/50"></div>
                    <div className="flex items-center gap-3">
                      <Network size={18} className="text-green-400" />
                      <span>{results.tokenUsage} tokens processed</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {results.posts.map((post, index) => (
                  <div
                    key={index}
                    className="bg-gray-900/40 backdrop-blur-2xl group hover:shadow-2xl border border-gray-700/30 rounded-3xl p-7 shadow-xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
                  >
                    
                    <div className="absolute -inset-1 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-6">
                        <span className="text-xs font-mono font-semibold px-3 py-1.5 bg-blue-900/30 text-blue-300 rounded-full border border-blue-700/30">
                          VARIANT 0{index + 1}
                        </span>
                        <button
                          onClick={() => copyToClipboard(post)}
                          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-300 transition-all duration-300 p-2 hover:bg-blue-900/30 rounded-lg backdrop-blur-sm"
                          title="Copy to strategic clipboard"
                        >
                          <Copy size={16} />
                        </button>
                      </div>
                      <p className="text-gray-200 whitespace-pre-wrap leading-relaxed text-sm font-light">
                        {post}
                      </p>
                      
                      <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-lg shadow-blue-500/30"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center pt-12">
                <button
                  onClick={handleSubmit}
                  className="py-4 px-10 bg-gradient-to-r from-blue-700/80 to-indigo-700/80 hover:from-blue-600/90 hover:to-indigo-600/90 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 transform hover:-translate-y-1 inline-flex items-center gap-3 group relative overflow-hidden"
                >
                  <div className="absolute -inset-5 bg-gradient-to-r from-blue-500/10 via-transparent to-transparent transform rotate-45 translate-x-[-100px] group-hover:translate-x-[100px] transition-transform duration-1000"></div>
                  <Sparkles className="h-5 w-5 relative group-hover:rotate-180 transition-transform duration-500" />
                  <span className="relative">Generate Enhanced Variations</span>
                </button>
              </div>
            </div>
          )}

          
          <footer className="text-center mt-32 mb-20 text-gray-500">
            <div className="inline-flex items-center gap-4 bg-gray-900/50 px-5 py-3 rounded-2xl mb-8 backdrop-blur-xl border border-gray-700/30">
              <Code2 className="h-5 w-5 text-blue-400" />
              <span className="text-sm">FORGE AI • Enterprise Ready</span>
            </div>
            <p className="mb-6 text-gray-600">Advanced neural content generation infrastructure</p>
            <div className="flex items-center justify-center gap-6">
              {[
      { Icon: Github, url: "https://github.com/LAKSHY-007" },
      { Icon: Linkedin, url: "https://www.linkedin.com/in/lpendharkar/" },
      { Icon: Twitter, url: "https://twitter.com" },
    ].map(({ Icon, url }, index) => (
                <a
                  key={index}
                  href={url}
                  className="text-gray-600 hover:text-blue-300 transition-all duration-500 p-3 hover:bg-blue-900/20 rounded-xl backdrop-blur-sm hover:scale-110"
                  aria-label={`Social media ${index}`}
                >
                  <Icon size={22} />
                </a>
              ))}
            </div>
          </footer>
        </div>
      </div>

      
      <style jsx>{`
        @keyframes orbit-slow {
          0% { transform: rotate(0deg) translateX(80px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(80px) rotate(-360deg); }
        }
        @keyframes orbit-medium {
          0% { transform: rotate(0deg) translateX(120px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(120px) rotate(-360deg); }
        }
        .animate-orbit-slow {
          animation: orbit-slow 20s linear infinite;
        }
        .animate-orbit-medium {
          animation: orbit-medium 15s linear infinite;
        }
      `}</style>
    </main>
  );
}