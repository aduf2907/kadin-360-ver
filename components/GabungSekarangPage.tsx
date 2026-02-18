import React, { useState } from 'react';
import { Page } from '../types';

interface GabungSekarangPageProps {
    setCurrentPage: (page: Page) => void;
}

const GabungSekarangPage: React.FC<GabungSekarangPageProps> = ({ setCurrentPage }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        idNumber: '',
        companyName: '',
        industry: '',
        region: '',
        kadinId: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real application, you would handle form validation and submission here.
        console.log('Registration Data:', formData);
        alert('Thank you for registering! (This is a demo)');
        // Redirect to dashboard after successful registration
        setCurrentPage('Dashboard');
    };

    const provinces = [
        "Aceh", "Bali", "Banten", "Bengkulu", "DI Yogyakarta", "DKI Jakarta", "Gorontalo", "Jambi", "Jawa Barat", "Jawa Tengah", "Jawa Timur", 
        "Kalimantan Barat", "Kalimantan Selatan", "Kalimantan Tengah", "Kalimantan Timur", "Kalimantan Utara", 
        "Kepulauan Bangka Belitung", "Kepulauan Riau", "Lampung", "Maluku", "Maluku Utara", "Nusa Tenggara Barat", "Nusa Tenggara Timur", 
        "Papua", "Papua Barat", "Papua Barat Daya", "Papua Pegunungan", "Papua Selatan", "Papua Tengah", 
        "Riau", "Sulawesi Barat", "Sulawesi Selatan", "Sulawesi Tengah", "Sulawesi Tenggara", "Sulawesi Utara", 
        "Sumatera Barat", "Sumatera Selatan", "Sumatera Utara", "Luar Negeri"
    ];

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4">
            <div className="max-w-2xl w-full mx-auto">
                <div className="bg-kadin-light-navy p-8 rounded-xl shadow-2xl border border-gray-700">
                    <h2 className="text-3xl font-bold text-center text-kadin-white mb-2">
                        Bergabung dengan <span className="text-kadin-gold">KADIN 360</span>
                    </h2>
                    <p className="text-center text-kadin-slate mb-8">
                        Buat akun Anda untuk mulai berkolaborasi dan mengembangkan bisnis.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div>
                                <label htmlFor="fullName" className="block text-sm font-medium text-kadin-light-slate mb-1">Nama Lengkap</label>
                                <input type="text" name="fullName" id="fullName" required value={formData.fullName} onChange={handleChange} className="w-full bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-kadin-light-slate mb-1">Alamat Email</label>
                                <input type="email" name="email" id="email" required value={formData.email} onChange={handleChange} className="w-full bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm" />
                            </div>
                            <div>
                                <label htmlFor="phoneNumber" className="block text-sm font-medium text-kadin-light-slate mb-1">No. Telepon</label>
                                <input type="tel" name="phoneNumber" id="phoneNumber" required value={formData.phoneNumber} onChange={handleChange} className="w-full bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm" />
                            </div>
                            <div>
                                <label htmlFor="idNumber" className="block text-sm font-medium text-kadin-light-slate mb-1">No. KTP</label>
                                <input type="text" name="idNumber" id="idNumber" required value={formData.idNumber} onChange={handleChange} className="w-full bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm" />
                            </div>
                             <div>
                                <label htmlFor="companyName" className="block text-sm font-medium text-kadin-light-slate mb-1">Nama Perusahaan</label>
                                <input type="text" name="companyName" id="companyName" required value={formData.companyName} onChange={handleChange} className="w-full bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm" />
                            </div>
                            <div>
                                <label htmlFor="kadinId" className="block text-sm font-medium text-kadin-light-slate mb-1">Nomor Anggota KADIN (Opsional)</label>
                                <input type="text" name="kadinId" id="kadinId" value={formData.kadinId} onChange={handleChange} className="w-full bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm" />
                            </div>
                             <div>
                                <label htmlFor="industry" className="block text-sm font-medium text-kadin-light-slate mb-1">Industri</label>
                                <select name="industry" id="industry" required value={formData.industry} onChange={handleChange} className="w-full bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm">
                                    <option value="">Pilih Industri</option>
                                    <option>Technology</option>
                                    <option>Agriculture</option>
                                    <option>Manufacturing</option>
                                    <option>F&B</option>
                                </select>
                            </div>
                             <div>
                                <label htmlFor="region" className="block text-sm font-medium text-kadin-light-slate mb-1">Region</label>
                                <select name="region" id="region" required value={formData.region} onChange={handleChange} className="w-full bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm">
                                    <option value="">Pilih Provinsi</option>
                                    {provinces.map(province => (
                                        <option key={province} value={province}>{province}</option>
                                    ))}
                                </select>
                            </div>
                             <div>
                                <label htmlFor="password" className="block text-sm font-medium text-kadin-light-slate mb-1">Kata Sandi</label>
                                <input type="password" name="password" id="password" required value={formData.password} onChange={handleChange} className="w-full bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm" />
                            </div>
                             <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-kadin-light-slate mb-1">Konfirmasi Kata Sandi</label>
                                <input type="password" name="confirmPassword" id="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} className="w-full bg-kadin-navy p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-kadin-gold text-sm" />
                            </div>
                        </div>

                        <div className="text-xs text-kadin-slate text-center">
                            Dengan membuat akun, Anda menyetujui <a href="#" className="text-kadin-gold hover:underline">Ketentuan Layanan</a> dan <a href="#" className="text-kadin-gold hover:underline">Kebijakan Privasi</a> kami.
                        </div>

                        <div>
                            <button type="submit" className="w-full bg-kadin-gold text-kadin-navy font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors text-lg">
                                Buat Akun
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <p className="text-kadin-slate">
                            Sudah punya akun? <a onClick={() => {}} className="font-semibold text-kadin-gold hover:underline cursor-pointer">Masuk di sini</a>
                        </p>
                        <p className="mt-4 text-kadin-slate">
                            <a onClick={() => setCurrentPage('Beranda')} className="font-semibold text-kadin-gold hover:underline cursor-pointer inline-flex items-center">
                                &larr; Kembali ke Beranda
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GabungSekarangPage;