// components/HeroSection.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const HeroSection: React.FC = () => {
        const [isDarkMode, setIsDarkMode] = useState(false);
        const [activeTestimonial, setActiveTestimonial] = useState(0);

        // Testimonials data
        const testimonials = [
                { id: 1, text: "Transformed our workflow completely", author: "Sarah J." },
                { id: 2, text: "Incredible efficiency improvements", author: "Mike R." },
                { id: 3, text: "Best decision for our team", author: "Alex P." },
        ];

        // Typewriter effect
        const [text, setText] = useState('');
        const fullText = 'Social Protection Calculator';

        useEffect(() => {
                if (text.length < fullText.length) {
                        const timeout = setTimeout(() => {
                                setText(fullText.slice(0, text.length + 1));
                        }, 100);
                        return () => clearTimeout(timeout);
                }
        }, [text, fullText]);

        // Handle testimonial cycling
        useEffect(() => {
                const interval = setInterval(() => {
                        setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
                }, 5000); // Change testimonial every 5 seconds
                return () => clearInterval(interval);
        }, [testimonials.length]);

        return (
                <div className={`min-h-screen relative ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
                        <div className="absolute inset-0 z-0">
                                {/* Gradient background */}
                                <div className="w-full h-full bg-[linear-gradient(162deg,_rgba(241,241,241,1)_0%,_rgba(251,216,197,1)_39%,_rgba(248,180,217,1)_84%,_rgba(227,237,240,1)_100%)] animate-gradient-flow"></div>

                                {/* Grid overlay */}
                                <div
                                        className="absolute inset-0 pointer-events-none"
                                        style={{
                                                backgroundImage: `
                linear-gradient(0deg, rgba(255,255,255,0.5) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
                                                backgroundSize: '40px 40px', // Adjust the grid cell size as needed
                                        }}
                                ></div>
                        </div> {/* Gradient-to-White Transition */}
                        <div className="absolute bottom-0 w-full h-40 bg-gradient-to-b from-transparent via-white/50 to-white z-10"></div>
                        {/* Overlay for Dark Mode */}
                        <div className={`absolute inset-0 ${isDarkMode ? 'bg-black opacity-30' : 'bg-white opacity-20'} z-1 pointer-events-none`}></div>

                        {/* Main Hero Content */}
                        <div className="relative z-10 flex flex-col items-center justify-center h-full py-44 px-6 text-center">
                                {/* Typewriter Headline */}
                                <motion.h1
                                        className="text-5xl md:text-7xl font-bold mb-8"
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8 }}
                                >
                                        {text}
                                        <motion.span
                                                className="ml-1"
                                                animate={{ opacity: [1, 0] }}
                                                transition={{ duration: 0.5, repeat: Infinity }}
                                        >
                                                |
                                        </motion.span>
                                </motion.h1>

                                {/* Subheading */}
                                <motion.p
                                        className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-12"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.8 }}
                                >
                                        Predict possible benefits for your target demographic and find gaps in minimum subsistence benefits.
                                </motion.p>


                                {/* Scroll Indicator */}
                                <motion.div
                                        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                                        animate={{ y: [0, 10, 0] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                >
                                        <ChevronDown className="w-8 h-8 text-blue-500" />
                                </motion.div>
                        </div>
                </div>
        );
};

export default HeroSection;
