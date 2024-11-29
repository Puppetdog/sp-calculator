'use client'
import React, { useState, useEffect } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { Engine, Container, ISourceOptions } from '@tsparticles/engine';

// Particles Background Component
export const StarfieldBackground: React.FC = () => {
        const [init, setInit] = useState(false);

        useEffect(() => {
                initParticlesEngine(async (engine: Engine) => {
                        await loadSlim(engine);
                }).then(() => {
                        setInit(true);
                });
        }, []);

        const particlesLoaded = async (container?: Container): Promise<void> => {
                console.log(container);
        };

        const options: ISourceOptions = {
                background: {
                        color: {
                                value: '#000033', // Deep blue background
                        },
                },
                fpsLimit: 60,
                interactivity: {
                        events: {
                                onHover: {
                                        enable: true,
                                        mode: 'grab', // Connects nearby stars on hover
                                },
                                onClick: {
                                        enable: true,
                                        mode: 'push', // Adds new stars on click
                                },
                        },
                        modes: {
                                grab: {
                                        distance: 140,
                                        links: {
                                                opacity: 0.2
                                        }
                                },
                                push: {
                                        quantity: 4
                                }
                        },
                },
                particles: {
                        color: {
                                value: "#ffffff"
                        },
                        links: {
                                color: "#ffffff",
                                distance: 150,
                                enable: true,
                                opacity: 0.1,
                                width: 1
                        },
                        move: {
                                direction: "none",
                                enable: true,
                                outModes: {
                                        default: "out"
                                },
                                random: true,
                                speed: 0.5,
                                straight: false
                        },
                        number: {
                                density: {
                                        enable: true,
                                },
                                value: 100
                        },
                        opacity: {
                                animation: {
                                        enable: true,
                                        speed: 1,
                                        sync: false,
                                },
                                value: { min: 0.1, max: 0.5 }
                        },
                        shape: {
                                type: "circle"
                        },
                        size: {
                                value: { min: 1, max: 3 },
                                animation: {
                                        enable: true,
                                        speed: 2,
                                        sync: false,
                                }
                        },
                        twinkle: {
                                particles: {
                                        enable: true,
                                        frequency: 0.05,
                                        opacity: 1
                                }
                        }
                },
                detectRetina: true,
        };

        return (
                <Particles
                        id="starfield-bg"
                        particlesLoaded={particlesLoaded}
                        options={options}
                        className="absolute inset-0 z-0"
                />
        );
};
