'use client'

import { motion } from "framer-motion";
import { StarfieldBackground } from "./ParticlesBackground";

// Hero Component
export const StarfieldHero: React.FC = () => {
        return (
                <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
                        {/* Particles Background */}
                        <StarfieldBackground />

                        {/* Content Container */}
                        <div className="relative z-10 text-center px-4">
                                <motion.h1
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                        className="text-5xl md:text-7xl font-bold text-white mb-6"
                                >
                                        Welcome to the Cosmos
                                </motion.h1>

                                <motion.p
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                                        className="text-xl text-white/80 mb-8 max-w-2xl mx-auto"
                                >
                                        Explore the infinite possibilities of our universe
                                </motion.p>

                                <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                                >
                                        <button
                                                className="px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/20 
                     rounded-lg text-white hover:bg-white/20 transition-colors"
                                        >
                                                Start Journey
                                        </button>
                                </motion.div>
                        </div>
                </div>
        );
};
