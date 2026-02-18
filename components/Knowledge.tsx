import React, { useState, useEffect } from 'react';
import { Article } from '../types';
import { generateKnowledgeArticle } from '../services/geminiService';

// Simple AI icon for the card badge
const AiIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11.25l.6-1.2 1.2-.6-1.2-.6-.6-1.2-.6 1.2-1.2.6 1.2.6.6 1.2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.25 8.25l.4-.8.8-.4-.8-.4-.4-.8-.4.8-.8.4.8.4.4.8z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V7a2 2 0 012-2h6l2-2h2l-2 2z" />
    </svg>
);

const BookmarkIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
    </svg>
);


const mockArticles: Article[] = [
    { id: 1, title: 'Mastering International Trade Agreements', category: 'E-Learning', summary: 'An interactive module on navigating complex trade laws and leveraging them for business growth.', imageUrl: 'https://picsum.photos/seed/knowledge1/400/200' },
    { id: 2, title: 'The Future of Green Technology Investment', category: 'Whitepaper', summary: 'In-depth analysis of emerging trends and opportunities in the sustainable technology sector.', imageUrl: 'https://picsum.photos/seed/knowledge2/400/200' },
    { id: 3, title: 'Digital Marketing for SMEs in 2024', category: 'Article', summary: 'Best practices and actionable strategies for small and medium enterprises to enhance their online presence.', imageUrl: 'https://picsum.photos/seed/knowledge3/400/200' },
    { id: 4, title: 'New Government Regulation on Digital Tax', category: 'Regulation', summary: 'A comprehensive summary and breakdown of the latest tax regulations affecting digital businesses.', imageUrl: 'https://picsum.photos/seed/knowledge4/400/200' },
];

/**
 * Calculates the Levenshtein distance between two strings.
 * This is a measure of the difference between two sequences.
 * @param s1 The first string.
 * @param s2 The second string.
 * @returns The Levenshtein distance.
 */
const levenshteinDistance = (s1: string, s2: string): number => {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    const costs = new Array();
    for (let i = 0; i <= s1.length; i++) {
        let lastValue = i;
        for (let j = 0; j <= s2.length; j++) {
            if (i == 0) {
                costs[j] = j;
            } else {
                if (j > 0) {
                    let newValue = costs[j - 1];
                    if (s1.charAt(i - 1) != s2.charAt(j - 1)) {
                        newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                    }
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0)
            costs[s2.length] = lastValue;
    }
    return costs[s2.length];
};

/**
 * Performs a fuzzy search to check if a query matches a text.
 * It splits the query into tokens and checks if each token has a fuzzy match in the text.
 * @param query The search string.
 * @param text The text to search within.
 * @returns True if it's a match, false otherwise.
 */
const fuzzySearch = (query: string, text: string): boolean => {
    const queryTokens = query.toLowerCase().split(' ').filter(t => t);
    if (queryTokens.length === 0) return true;

    const textTokens = text.toLowerCase().split(/[\s,.\-_]+/);

    return queryTokens.every(qToken => {
        return textTokens.some(tToken => {
            // Allow more distance for longer words to be more forgiving.
            // e.g., length 1-4: 0 typos, 5-8: 1 typo, 9+: 2 typos
            const allowedDistance = Math.floor((qToken.length - 1) / 4);
            // Also check for prefix matching for "search-as-you-type" feel
            return tToken.startsWith(qToken) || levenshteinDistance(qToken, tToken) <= allowedDistance;
        });
    });
};


const ArticleCard: React.FC<{ article: Article; isSaved: boolean }> = ({ article, isSaved }) => {
    const priorityStyles: { [key in 'High' | 'Medium' | 'Low']: string } = {
        High: 'bg-red-500/20 text-red-300',
        Medium: 'bg-yellow-500/20 text-yellow-300',
        Low: 'bg-blue-500/20 text-blue-300',
    };
    
    return (
        <div className="bg-kadin-light-navy rounded-lg overflow-hidden border border-gray-700 transform hover:-translate-y-1 transition-transform duration-300 cursor-pointer hover:border-kadin-gold/50 group" onClick={() => alert(`Navigating to article: ${article.title}`)}>
            <div className="relative">
                <img src={article.imageUrl} alt={article.title} className="w-full h-40 object-cover"/>
                {article.category === 'AI Generated' && (
                    <div className="absolute top-2 right-2 flex items-center bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                        <AiIcon className="h-4 w-4 mr-1"/>
                        AI Generated
                    </div>
                )}
                 {isSaved && (
                    <div className="absolute top-2 left-2 flex items-center bg-green-500/20 text-green-300 px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                        <BookmarkIcon className="h-4 w-4 mr-1"/>
                        Saved
                    </div>
                )}
            </div>
            <div className="p-4">
                 <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-semibold ${article.category === 'AI Generated' ? 'text-blue-400 bg-blue-500/10' : 'text-kadin-gold bg-kadin-gold/10'} px-2 py-1 rounded-full`}>{article.category}</span>
                    {article.priority && (
                         <span className={`text-xs font-semibold px-2 py-1 rounded-full ${priorityStyles[article.priority]}`}>
                            {article.priority} Priority
                        </span>
                    )}
                </div>
                <h3 className="text-lg font-bold mt-2 text-kadin-white transition-colors duration-200 group-hover:text-kadin-gold">{article.title}</h3>
                <p className="text-sm mt-2 text-kadin-slate">{article.summary}</p>
            </div>
        </div>
    );
};


const Knowledge: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>(mockArticles);
    const [prompt, setPrompt] = useState('');
    const [audience, setAudience] = useState('SMEs');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [savedArticleIds, setSavedArticleIds] = useState<Set<number>>(new Set());
    const [lastGeneratedArticle, setLastGeneratedArticle] = useState<Article | null>(null);
    const [activeTab, setActiveTab] = useState('All');
    const [sortBy, setSortBy] = useState<'Default' | 'Priority'>('Default');
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery]);
    
    const examplePrompts = [
        'The future of renewable energy in Indonesia',
        'Impact of e-commerce on SMEs',
        'Strategies for digital transformation in manufacturing',
    ];

    const handleGenerate = async () => {
        setIsLoading(true);
        setError(null);
        setLastGeneratedArticle(null);
        try {
            const generatedContent = await generateKnowledgeArticle(prompt, audience);
            const newArticle: Article = {
                id: Date.now(),
                title: generatedContent.title,
                category: 'AI Generated',
                summary: generatedContent.summary,
                imageUrl: `https://picsum.photos/seed/ai${Date.now()}/400/200`,
            };
            setArticles(prevArticles => [newArticle, ...prevArticles]);
            setLastGeneratedArticle(newArticle);
            setPrompt('');
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = () => {
        if (!lastGeneratedArticle) return;
        setSavedArticleIds(prev => new Set(prev).add(lastGeneratedArticle.id));
        setLastGeneratedArticle(null);
    };

    const handleSetPriority = (articleId: number, priority: 'High' | 'Medium' | 'Low') => {
        setArticles(prevArticles =>
            prevArticles.map(article =>
                article.id === articleId ? { ...article, priority } : article
            )
        );
        if (lastGeneratedArticle && lastGeneratedArticle.id === articleId) {
            setLastGeneratedArticle(prev => prev ? { ...prev, priority } : null);
        }
    };

    const tabCategories = ['All', 'Saved', 'E-Learning', 'Articles', 'Whitepapers', 'Regulation', 'AI Generated'];
    
    const priorityOrder: { [key in 'High' | 'Medium' | 'Low']: number } = { 'High': 1, 'Medium': 2, 'Low': 3 };

    const displayedArticles = articles
        .filter(article => {
             // Filter by search query first
            if (debouncedQuery) {
                const searchableText = [article.title, article.summary, article.category].join(' ');
                if (!fuzzySearch(debouncedQuery, searchableText)) {
                    return false;
                }
            }
            // Then filter by tab
            if (activeTab === 'Saved') return savedArticleIds.has(article.id);
            if (activeTab === 'All') return true;
            return article.category === activeTab;
        })
        .sort((a, b) => {
            if (sortBy === 'Priority') {
                const priorityA = a.priority ? priorityOrder[a.priority] : 4;
                const priorityB = b.priority ? priorityOrder[b.priority] : 4;
                return priorityA - priorityB;
            }
            return 0; // Default sort is newest first, handled by prepending.
        });


    return (
        <div>
            <h2 className="text-3xl font-bold text-kadin-white mb-6">Knowledge & Learning</h2>
            
            <div className="bg-kadin-light-navy p-6 rounded-lg border border-gray-700 mb-8">
                <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 bg-kadin-navy p-3 rounded-full border border-kadin-gold/20">
                         <AiIcon className="h-8 w-8 text-kadin-gold" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-kadin-white">AI Content Generator</h3>
                        <p className="text-kadin-slate text-sm">
                            Generate a new article summary using AI based on a topic of your choice.
                        </p>
                    </div>
                </div>

                <div className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                            <label htmlFor="topic-prompt" className="block text-sm font-medium text-kadin-light-slate mb-1">Enter Topic</label>
                            <textarea
                                id="topic-prompt"
                                className="w-full bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm transition-colors"
                                rows={3}
                                placeholder="e.g., The impact of AI on the Indonesian logistics industry"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <label htmlFor="audience" className="block text-sm font-medium text-kadin-light-slate mb-1">Target Audience</label>
                            <select
                                id="audience"
                                value={audience}
                                onChange={(e) => setAudience(e.target.value)}
                                disabled={isLoading}
                                className="w-full bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm"
                            >
                                <option>SMEs</option>
                                <option>Executives</option>
                                <option>General Public</option>
                            </select>
                            <p className="text-xs text-kadin-slate mt-2">Helps the AI tailor the article's tone and focus.</p>
                        </div>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="text-xs font-medium text-kadin-slate self-center">
                            Or try an example:
                        </span>
                        {examplePrompts.map((p) => (
                            <button
                                key={p}
                                onClick={() => setPrompt(p)}
                                disabled={isLoading}
                                className="text-xs bg-kadin-navy hover:bg-kadin-gold hover:text-kadin-navy text-kadin-light-slate px-3 py-1 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {p}
                            </button>
                        ))}
                    </div>

                    {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
                    
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || !prompt.trim()}
                        className="mt-4 w-full md:w-auto bg-kadin-gold text-kadin-navy font-bold py-2 px-6 rounded-md hover:bg-yellow-400 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isLoading && (
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        {isLoading ? 'Generating...' : 'Generate Article'}
                    </button>
                </div>
                 {lastGeneratedArticle && (
                    <div className="mt-4 p-4 bg-kadin-navy rounded-md border border-kadin-gold/50">
                        <h4 className="font-bold text-kadin-white">Successfully Generated: <span className="text-kadin-gold">"{lastGeneratedArticle.title}"</span></h4>
                        <p className="text-sm text-kadin-slate mt-1">{lastGeneratedArticle.summary}</p>
                         <div className="flex flex-wrap items-center gap-4 mt-4">
                             <button 
                                onClick={handleSave} 
                                className="flex items-center bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-500 transition-colors"
                            >
                                <BookmarkIcon className="h-5 w-5 mr-2"/>
                                Save Article for Later
                            </button>
                            {!lastGeneratedArticle.priority && (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-kadin-light-slate">Set Priority:</span>
                                    <button onClick={() => handleSetPriority(lastGeneratedArticle.id, 'High')} className="text-xs font-bold py-1 px-3 rounded-full bg-red-500/20 text-red-300 hover:bg-red-500/40">High</button>
                                    <button onClick={() => handleSetPriority(lastGeneratedArticle.id, 'Medium')} className="text-xs font-bold py-1 px-3 rounded-full bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/40">Medium</button>
                                    <button onClick={() => handleSetPriority(lastGeneratedArticle.id, 'Low')} className="text-xs font-bold py-1 px-3 rounded-full bg-blue-500/20 text-blue-300 hover:bg-blue-500/40">Low</button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            
             <div className="bg-kadin-light-navy/50 p-4 rounded-lg border border-gray-700 mb-6 flex flex-col md:flex-row gap-4 items-center">
                <input 
                    type="text" 
                    placeholder="Search articles by keyword, title, or category..." 
                    className="flex-grow bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <div className="flex space-x-1 sm:space-x-4 border-b border-gray-700 overflow-x-auto pb-2 sm:pb-0 sm:border-b-0">
                    {tabCategories.map(tab => (
                         <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)} 
                            className={`py-2 px-3 sm:px-4 font-semibold transition-colors duration-200 text-sm whitespace-nowrap ${activeTab === tab ? 'text-kadin-gold border-b-2 border-kadin-gold' : 'text-kadin-slate hover:text-kadin-white'}`}
                        >
                            {tab}{tab === 'Saved' && ` (${savedArticleIds.size})`}
                        </button>
                    ))}
                </div>
                 <div className="mt-4 sm:mt-0">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as 'Default' | 'Priority')}
                        className="bg-kadin-navy p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm text-kadin-light-slate"
                    >
                        <option value="Default">Sort by Date</option>
                        <option value="Priority">Sort by Priority</option>
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedArticles.length > 0 ? (
                    displayedArticles.map(article => (
                        <ArticleCard key={article.id} article={article} isSaved={savedArticleIds.has(article.id)} />
                    ))
                ) : (
                    <div className="col-span-full text-center py-10 text-kadin-slate">
                        <p>No articles found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Knowledge;