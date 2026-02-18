import React, { useState, useEffect } from 'react';
import { Page } from '../types';

interface PromoCarouselProps {
    setCurrentPage: (page: Page) => void;
}

const slides = [
    {
        title: 'Exclusive Partner Offers',
        description: 'Discover special discounts and benefits from our verified KADIN partners to support your business operations.',
        buttonText: 'Explore Mitra KADIN',
        page: 'Mitra KADIN' as Page,
        imageUrl: 'https://picsum.photos/seed/promo1/1200/400'
    },
    {
        title: 'Join Our Next Program: Digital Upskilling',
        description: 'Enhance your team\'s digital capabilities with our upcoming masterclass on AI integration and data analytics.',
        buttonText: 'View Knowledge Hub',
        page: 'Knowledge' as Page,
        imageUrl: 'https://picsum.photos/seed/promo2/1200/400'
    },
    {
        title: 'Become a Part of KADIN 360',
        description: 'Not a member yet? Register now to unlock a world of networking, collaboration, and business growth opportunities.',
        buttonText: 'Gabung Sekarang',
        page: 'Gabung Sekarang' as Page,
        imageUrl: 'https://picsum.photos/seed/promo3/1200/400'
    }
];

const PromoCarousel: React.FC<PromoCarouselProps> = ({ setCurrentPage }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToNext = () => {
        const isLastSlide = currentIndex === slides.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };
    
    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToSlide = (slideIndex: number) => {
        setCurrentIndex(slideIndex);
    };

    useEffect(() => {
        const slider = setInterval(() => {
            goToNext();
        }, 7000); // Change slide every 7 seconds
        return () => clearInterval(slider);
    }, [currentIndex]);

    return (
        <div className="h-[400px] w-full m-auto relative group">
            <div className="relative h-full">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <img src={slide.imageUrl} className="w-full h-full object-cover" alt={`Slide ${index + 1}`} />
                        <div className="absolute inset-0 bg-black/60"></div>
                    </div>
                ))}
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-white z-10 w-full px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-kadin-white [text-shadow:0_2px_4px_rgb(0_0_0_/_50%)]">
                    {slides[currentIndex].title}
                </h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-kadin-light-slate [text-shadow:0_1px_3px_rgb(0_0_0_/_50%)]">
                    {slides[currentIndex].description}
                </p>
                <button
                    onClick={() => setCurrentPage(slides[currentIndex].page)}
                    className="mt-8 bg-kadin-gold text-kadin-navy font-bold py-3 px-8 rounded-lg hover:bg-yellow-400 transition-colors text-md"
                >
                    {slides[currentIndex].buttonText}
                </button>
            </div>
            
            {/* Left Arrow */}
            <div className="hidden group-hover:block absolute top-1/2 -translate-y-1/2 left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer z-10" onClick={goToPrevious}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </div>
            {/* Right Arrow */}
            <div className="hidden group-hover:block absolute top-1/2 -translate-y-1/2 right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer z-10" onClick={goToNext}>
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </div>
            
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex justify-center space-x-2 z-10">
                {slides.map((slide, slideIndex) => (
                    <div
                        key={slideIndex}
                        onClick={() => goToSlide(slideIndex)}
                        className={`cursor-pointer h-3 w-3 rounded-full transition-all duration-300 ${currentIndex === slideIndex ? 'bg-kadin-gold w-6' : 'bg-white/50'}`}
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default PromoCarousel;