import React, { useState } from 'react';
import { UserProfile, Page } from '../types';

interface EditProfileProps {
    user: UserProfile;
    setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
    setCurrentPage: (page: Page) => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ user, setUser, setCurrentPage }) => {
    const [formData, setFormData] = useState<UserProfile>(user);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleInterestsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setFormData(prev => ({ ...prev, interests: value.split(',').map(item => item.trim()) }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setUser(formData);
        setCurrentPage('Profile');
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-kadin-white mb-6">Edit Profile</h2>
            <div className="bg-kadin-light-navy p-8 rounded-lg border border-gray-700 max-w-3xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-kadin-light-slate mb-1">Full Name</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="w-full bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-kadin-light-slate mb-1">Role</label>
                            <input type="text" name="role" id="role" value={formData.role} onChange={handleChange} className="w-full bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm" />
                        </div>
                        <div>
                            <label htmlFor="company" className="block text-sm font-medium text-kadin-light-slate mb-1">Company</label>
                            <input type="text" name="company" id="company" value={formData.company} onChange={handleChange} className="w-full bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="industry" className="block text-sm font-medium text-kadin-light-slate mb-1">Industry</label>
                            <input type="text" name="industry" id="industry" value={formData.industry} onChange={handleChange} className="w-full bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm" />
                        </div>
                        <div>
                            <label htmlFor="region" className="block text-sm font-medium text-kadin-light-slate mb-1">Region</label>
                            <input type="text" name="region" id="region" value={formData.region} onChange={handleChange} className="w-full bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm" />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-kadin-light-slate mb-1">Bio</label>
                        <textarea name="bio" id="bio" rows={4} value={formData.bio || ''} onChange={handleChange} className="w-full bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm" />
                    </div>

                    <div>
                        <label htmlFor="interests" className="block text-sm font-medium text-kadin-light-slate mb-1">Interests (comma-separated)</label>
                        <input type="text" name="interests" id="interests" value={formData.interests.join(', ')} onChange={handleInterestsChange} className="w-full bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm" placeholder="e.g., AI, Fintech, SaaS" />
                    </div>
                    
                    <div className="flex justify-end space-x-4 pt-4 border-t border-gray-700">
                        <button type="button" onClick={() => setCurrentPage('Profile')} className="bg-gray-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-500 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="bg-kadin-gold text-kadin-navy font-bold py-2 px-6 rounded-lg hover:bg-yellow-400 transition-colors">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;
