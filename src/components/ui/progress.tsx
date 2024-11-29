// components/ui/progress.tsx

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const MotionIndicator = motion(ProgressPrimitive.Indicator);

const Progress = React.forwardRef<
        React.ElementRef<typeof ProgressPrimitive.Root>,
        React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
        <ProgressPrimitive.Root
                ref={ref}
                className={cn(
                        "relative h-2 w-full overflow-hidden rounded-full bg-gray-200", // Adjust bg color as needed
                        className
                )}
                value={value}
                {...props}
        >
                <MotionIndicator
                        className="h-full w-full bg-gradient-to-r from-purple-400 via-indigo-500 to-red-500 bg-[length:200%_200%] shadow-lg"
                        style={{ width: `${value}%` }}
                        animate={{
                                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                        }}
                        transition={{
                                repeat: Infinity,
                                duration: 3,
                                ease: "linear",
                        }}
                />
        </ProgressPrimitive.Root>
));

Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
