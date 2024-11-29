// src/components/benefits/progress-animation.tsx
"use client"

import { useEffect, useState } from 'react';
import { Progress } from "@/components/ui/progress";

interface ProgressAnimationProps {
        value: number;
}

export function ProgressAnimation({ value }: ProgressAnimationProps) {
        const [shouldAnimate, setShouldAnimate] = useState(false);

        useEffect(() => {
                setShouldAnimate(true);
        }, []);

        return (
                <Progress
                        value={value}
                        className={`transition-all duration-1000 ${shouldAnimate ? 'opacity-100' : 'opacity-0'}`}
                />
        );
}
