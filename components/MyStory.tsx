
import React, { useState } from 'react';
import { MyStoryPost } from '../types';
import { generateStoryDraft } from '../services/geminiService';

const mockStories: MyStoryPost[] = [
    {
        id: 1,
        title: 'From a Garage Startup to a Global Exporter: My 10-Year Journey',
        author: 'Siti Aminah',
        authorAvatar: 'https://picsum.photos/id/1014/40/40',
        imageUrl: 'https://picsum.photos/seed/story1/400/250',
        summary: 'How we navigated market challenges, secured our first international contract, and scaled our operations from the ground up.',
        tags: ['Startup Journey', 'Export', 'Growth'],
        date: 'Oct 20, 2024'
    },
    {
        id: 2,
        title: 'Pivoting to Sustainability: How We Transformed Our Business Model',
        author: 'David Lee',
        authorAvatar: 'https://picsum.photos/id/1013/40/40',
        imageUrl: 'https://picsum.photos/seed/story2/400/250',
        summary: 'A look into our difficult but rewarding decision to adopt green technology, leading to new markets and a stronger brand.',
        tags: ['Innovation', 'Sustainability', 'Manufacturing'],
        date: 'Oct 12, 2024'
    },
    {
        id: 3,
        title: 'Securing Series A Funding: Lessons from the Pitch Deck to the Boardroom',
        author: 'Budi Santoso',
        authorAvatar: 'https://picsum.photos/100',
        imageUrl: 'https://picsum.photos/seed/story3/400/250',
        summary: 'An honest breakdown of the fundraising process, including the mistakes made and the strategies that ultimately succeeded.',
        tags: ['Investment', 'Fintech', 'Startup Journey'],
        date: 'Sep 30, 2024'
    },
    {
        id: 4,
        title: 'Building a Resilient Team Through Economic Downturn',
        author: 'Rina Hartono',
        authorAvatar: 'https://picsum.photos/id/1012/40/40',
        imageUrl: 'https://picsum.photos/seed/story4/400/250',
        summary: 'Leadership strategies that helped us maintain morale, avoid layoffs, and emerge stronger from the pandemic-induced crisis.',
        tags: ['Leadership', 'Team Building', 'Resilience'],
        date: 'Sep 18, 2024'
    },
];

const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const AiIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11.25l.6-1.2 1.2-.6-1.2-.6-.6-1.2-.6 1.2-1.2.6 1.2.6.6 1.2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.25 8.25l.4-.8.8-.4-.8-.4-.4-.8-.4.8-.8.4.8.4.4.8z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V7a2 2 0 012-2h6l2-2h2l-2 2z" />
    </svg>
);


const StoryCard: React.FC<{ story: MyStoryPost; onDelete: (id: number) => void; }> = ({ story, onDelete }) => (
    <div className="relative bg-kadin-light-navy rounded-lg overflow-hidden border border-gray-700 flex flex-col transform hover:-translate-y-1 transition-transform duration-300 cursor-pointer hover:border-kadin-gold/50 group" onClick={() => alert(`Navigating to story: ${story.title}`)}>
        <button
            onClick={(e) => {
                e.stopPropagation();
                onDelete(story.id);
            }}
            className="absolute top-2 right-2 z-10 p-2 bg-kadin-navy/50 rounded-full text-kadin-slate hover:bg-red-500/80 hover:text-kadin-white opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Delete story"
        >
            <TrashIcon className="h-4 w-4" />
        </button>
        <img src={story.imageUrl} alt={story.title} className="w-full h-40 object-cover" />
        <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-lg font-bold text-kadin-white transition-colors duration-200 group-hover:text-kadin-gold">{story.title}</h3>
            <p className="text-sm mt-2 text-kadin-slate flex-grow">{story.summary}</p>
            <div className="flex flex-wrap gap-1 mt-4">
                {story.tags.map(tag => (
                    <span key={tag} className="text-xs bg-gray-700 text-kadin-light-slate px-2 py-1 rounded-full">{tag}</span>
                ))}
            </div>
            <div className="flex items-center mt-4 pt-4 border-t border-gray-700">
                <img src={story.authorAvatar} alt={story.author} className="h-8 w-8 rounded-full mr-3"/>
                <div>
                    <p className="text-sm font-semibold text-kadin-white">{story.author}</p>
                    <p className="text-xs text-kadin-slate">{story.date}</p>
                </div>
            </div>
        </div>
    </div>
);

interface StoryEditorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    newStory: { title: string; summary: string; tags: string; };
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    imagePreview: string | null;
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    errors: { title?: string; tags?: string };
}

const StoryEditorModal: React.FC<StoryEditorModalProps> = ({ isOpen, onClose, onSubmit, newStory, handleInputChange, imagePreview, handleImageChange, errors }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-kadin-light-navy rounded-lg border border-gray-700 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={onSubmit} noValidate>
                    <div className="p-6">
                        <div className="flex justify-between items-start">
                            <h2 className="text-2xl font-bold text-kadin-white">Share Your Story</h2>
                            <button type="button" onClick={onClose} className="text-kadin-slate hover:text-kadin-white">
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="mt-6 space-y-4">
                            <div>
                                <label htmlFor="image-upload" className="block text-sm font-medium text-kadin-light-slate mb-1">Cover Image</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
                                    <div className="space-y-1 text-center">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="mx-auto h-40 w-auto rounded-md" />
                                        ) : (
                                            <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                        <div className="flex text-sm text-kadin-slate justify-center">
                                            <label htmlFor="image-upload" className="relative cursor-pointer bg-kadin-navy rounded-md font-medium text-kadin-gold hover:text-yellow-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-kadin-gold focus-within:ring-offset-kadin-light-navy px-2">
                                                <span>Upload a file</span>
                                                <input id="image-upload" name="image-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                                            </label>
                                        </div>
                                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-kadin-light-slate mb-1">Title</label>
                                <input 
                                    type="text" 
                                    name="title" 
                                    id="title" 
                                    value={newStory.title} 
                                    onChange={handleInputChange} 
                                    className={`w-full bg-kadin-navy p-3 rounded-md focus:outline-none text-sm transition-all ${errors.title ? 'ring-2 ring-red-500' : 'focus:ring-1 focus:ring-kadin-gold'}`} 
                                />
                                {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
                            </div>
                            <div>
                                <label htmlFor="summary" className="block text-sm font-medium text-kadin-light-slate mb-1">Summary</label>
                                <textarea 
                                    name="summary" 
                                    id="summary" 
                                    rows={4} 
                                    required 
                                    value={newStory.summary} 
                                    onChange={handleInputChange} 
                                    className="w-full bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm" 
                                />
                            </div>
                            <div>
                                <label htmlFor="tags" className="block text-sm font-medium text-kadin-light-slate mb-1">Tags (comma separated)</label>
                                <input 
                                    type="text" 
                                    name="tags" 
                                    id="tags" 
                                    value={newStory.tags} 
                                    onChange={handleInputChange} 
                                    className={`w-full bg-kadin-navy p-3 rounded-md focus:outline-none text-sm transition-all ${errors.tags ? 'ring-2 ring-red-500' : 'focus:ring-1 focus:ring-kadin-gold'}`} 
                                    placeholder="e.g., Startup, Growth, Innovation" 
                                />
                                {errors.tags && <p className="text-red-400 text-xs mt-1">{errors.tags}</p>}
                            </div>
                        </div>
                    </div>
                    <div className="bg-kadin-navy p-4 flex justify-end space-x-3 rounded-b-lg">
                        <button type="button" onClick={onClose} className="bg-gray-600 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-500 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="bg-kadin-gold text-kadin-navy font-bold py-2 px-4 rounded-md hover:bg-yellow-400 transition-colors disabled:bg-gray-500" disabled={!newStory.title || !newStory.summary || !imagePreview}>
                            Publish Story
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-kadin-light-navy rounded-lg border border-gray-700 shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <div className="p-6">
                    <h2 className="text-xl font-bold text-kadin-white">Confirm Deletion</h2>
                    <p className="mt-2 text-kadin-slate">Are you sure you want to delete this story? This action cannot be undone.</p>
                </div>
                <div className="bg-kadin-navy p-4 flex justify-end space-x-3 rounded-b-lg">
                    <button onClick={onClose} className="bg-gray-600 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-500 transition-colors">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-500 transition-colors">
                        Delete Story
                    </button>
                </div>
            </div>
        </div>
    );
};

const MyStory: React.FC = () => {
    const [stories, setStories] = useState<MyStoryPost[]>(mockStories);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newStory, setNewStory] = useState({ title: '', summary: '', tags: '' });
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ title?: string; tags?: string }>({});
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [storyToDelete, setStoryToDelete] = useState<number | null>(null);
    
    // AI Story Generator State
    const [aiTopic, setAiTopic] = useState('');
    const [aiAudience, setAiAudience] = useState('Fellow Members');
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiError, setAiError] = useState<string | null>(null);
    const [generatedStory, setGeneratedStory] = useState<{ title: string; summary: string; tags: string[] } | null>(null);


    const handleCloseModal = () => {
        setIsModalOpen(false);
        setNewStory({ title: '', summary: '', tags: '' });
        setImagePreview(null);
        setErrors({});
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewStory(s => ({ ...s, [name]: value }));
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name as keyof typeof errors];
                return newErrors;
            });
        }
    };

    const handleStorySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const validationErrors: { title?: string; tags?: string } = {};

        if (!newStory.title.trim()) {
            validationErrors.title = 'Title field cannot be empty.';
        }

        if (!newStory.tags.trim()) {
            validationErrors.tags = 'Tags field cannot be empty.';
        } else {
            const tagRegex = /^[a-zA-Z0-9,\s]*$/;
            if (!tagRegex.test(newStory.tags)) {
                validationErrors.tags = 'Tags can only contain letters, numbers, and commas.';
            }
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});

        const newPost: MyStoryPost = {
            id: Date.now(),
            title: newStory.title,
            summary: newStory.summary,
            tags: newStory.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
            imageUrl: imagePreview!,
            author: 'Budi Santoso', // Mocked: would come from logged-in user
            authorAvatar: 'https://picsum.photos/100', // Mocked
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        };

        setStories(prevStories => [newPost, ...prevStories]);
        handleCloseModal();
    };

    const openDeleteModal = (id: number) => {
        setStoryToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setStoryToDelete(null);
        setIsDeleteModalOpen(false);
    };

    const confirmDelete = () => {
        if (storyToDelete !== null) {
            setStories(prevStories => prevStories.filter(story => story.id !== storyToDelete));
        }
        closeDeleteModal();
    };

    const handleGenerateStory = async () => {
        if (!aiTopic.trim()) return;
        setIsGenerating(true);
        setAiError(null);
        setGeneratedStory(null);
        try {
            const draft = await generateStoryDraft(aiTopic, aiAudience);
            setGeneratedStory(draft);
        } catch (e: any) {
            setAiError(e.message);
        } finally {
            setIsGenerating(false);
        }
    };

    const handlePublishGeneratedStory = () => {
        if (!generatedStory) return;

        const newPost: MyStoryPost = {
            id: Date.now(),
            title: generatedStory.title,
            summary: generatedStory.summary,
            tags: generatedStory.tags,
            imageUrl: `https://picsum.photos/seed/ai${Date.now()}/400/250`,
            author: 'Budi Santoso (AI Assisted)',
            authorAvatar: 'https://picsum.photos/100',
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        };

        setStories(prev => [newPost, ...prev]);
        setGeneratedStory(null);
        setAiTopic('');
    };


    const featuredStory = stories[0];

    return (
        <div>
            <h2 className="text-3xl font-bold text-kadin-white mb-2">My Story: Journeys of KADIN Members</h2>
            <p className="text-kadin-light-slate mb-6">
                Be inspired by the personal stories of success, resilience, and innovation from fellow entrepreneurs.
            </p>

            {/* AI Story Generator */}
            <div className="bg-kadin-light-navy p-6 rounded-lg border border-gray-700 mb-8">
                 <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 bg-kadin-navy p-3 rounded-full border border-kadin-gold/20">
                         <AiIcon className="h-8 w-8 text-kadin-gold" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-kadin-white">AI Story Generator</h3>
                        <p className="text-kadin-slate text-sm">
                           Need inspiration? Generate a story draft with AI based on your topic.
                        </p>
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        <label htmlFor="ai-topic" className="block text-sm font-medium text-kadin-light-slate mb-1">Enter your topic or experience</label>
                        <textarea
                            id="ai-topic"
                            rows={2}
                            className="w-full bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm"
                            placeholder="e.g., How I expanded my business into Southeast Asia"
                            value={aiTopic}
                            onChange={(e) => setAiTopic(e.target.value)}
                            disabled={isGenerating}
                        />
                    </div>
                    <div>
                        <label htmlFor="ai-audience" className="block text-sm font-medium text-kadin-light-slate mb-1">Target Audience</label>
                        <select
                            id="ai-audience"
                            value={aiAudience}
                            onChange={(e) => setAiAudience(e.target.value)}
                            disabled={isGenerating}
                            className="w-full bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm"
                        >
                            <option>Fellow Members</option>
                            <option>Investors</option>
                            <option>General Public</option>
                        </select>
                    </div>
                </div>
                <button
                    onClick={handleGenerateStory}
                    disabled={isGenerating || !aiTopic.trim()}
                    className="mt-4 w-full md:w-auto bg-kadin-gold text-kadin-navy font-bold py-2 px-6 rounded-md hover:bg-yellow-400 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {isGenerating && (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    )}
                    {isGenerating ? 'Generating...' : 'Generate Draft'}
                </button>

                {aiError && <p className="text-red-400 text-sm mt-2">{aiError}</p>}

                {generatedStory && (
                    <div className="mt-4 p-4 bg-kadin-navy rounded-md border border-kadin-gold/50">
                        <h4 className="font-bold text-kadin-white">Generated Draft:</h4>
                        <h5 className="text-xl font-bold text-kadin-gold mt-2">{generatedStory.title}</h5>
                        <p className="text-sm text-kadin-slate mt-2 whitespace-pre-wrap">{generatedStory.summary}</p>
                        <div className="flex flex-wrap gap-2 mt-3">
                            {generatedStory.tags.map(tag => (
                                <span key={tag} className="text-xs bg-gray-700 text-kadin-light-slate px-2 py-1 rounded-full">{tag}</span>
                            ))}
                        </div>
                        <button
                            onClick={handlePublishGeneratedStory}
                            className="mt-4 bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-500 transition-colors"
                        >
                            Publish This Story
                        </button>
                    </div>
                )}
            </div>

            {/* Featured Story */}
            {featuredStory && (
                <div className="relative mb-10 group cursor-pointer" onClick={() => alert(`Navigating to story: ${featuredStory.title}`)}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            openDeleteModal(featuredStory.id);
                        }}
                        className="absolute top-4 right-4 z-20 p-2 bg-kadin-navy/50 rounded-full text-kadin-slate hover:bg-red-500/80 hover:text-kadin-white opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Delete featured story"
                    >
                        <TrashIcon className="h-5 w-5" />
                    </button>
                    <div className="relative rounded-lg overflow-hidden border border-transparent hover:border-kadin-gold/50 transition-all duration-300">
                        <img src={featuredStory.imageUrl} alt={featuredStory.title} className="w-full h-80 object-cover"/>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-8 text-white">
                            <span className="text-sm font-semibold bg-kadin-gold text-kadin-navy px-3 py-1 rounded-full">Featured Story</span>
                            <h3 className="text-3xl font-bold mt-4 transition-colors duration-200 group-hover:text-kadin-gold">{featuredStory.title}</h3>
                            <p className="mt-2 max-w-2xl">{featuredStory.summary}</p>
                             <div className="flex items-center mt-4">
                                <img src={featuredStory.authorAvatar} alt={featuredStory.author} className="h-10 w-10 rounded-full mr-3 border-2 border-kadin-gold"/>
                                <div>
                                    <p className="text-md font-semibold">{featuredStory.author}</p>
                                    <p className="text-sm opacity-80">{featuredStory.date}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Controls */}
            <div className="bg-kadin-light-navy/50 p-4 rounded-lg border border-gray-700 mb-8 flex flex-col md:flex-row gap-4 items-center">
                <input type="text" placeholder="Search stories by keyword, author, or tag..." className="flex-grow bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm w-full"/>
                <select className="bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm w-full md:w-auto">
                    <option>All Industries</option>
                    <option>Technology</option>
                    <option>Manufacturing</option>
                    <option>Agriculture</option>
                </select>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="w-full md:w-auto bg-kadin-gold text-kadin-navy font-bold py-3 px-6 rounded-md hover:bg-yellow-400 transition-colors inline-flex items-center justify-center"
                >
                    <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Share Your Story
                </button>
            </div>

            {/* Story Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stories.slice(1).map(story => (
                    <StoryCard key={story.id} story={story} onDelete={openDeleteModal} />
                ))}
            </div>
            
            <StoryEditorModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleStorySubmit}
                newStory={newStory}
                handleInputChange={handleInputChange}
                imagePreview={imagePreview}
                handleImageChange={handleImageChange}
                errors={errors}
            />

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onConfirm={confirmDelete}
            />
        </div>
    );
};

export default MyStory;