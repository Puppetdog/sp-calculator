
// components/ui/progress.tsx

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// Create a motion-enhanced version of ProgressPrimitive.Indicator
const MotionIndicator = motion(ProgressPrimitive.Indicator);

// Define the Progress component with forwarded ref
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
                        className="h-full bg-gradient-to-r from-purple-400 via-indigo-500 to-red-500 bg-[length:200%_200%] shadow-lg"
                        // Remove the static width style
                        // style={{ width: `${value}%` }}

                        // Define the animated properties
                        animate={{
                                width: `${value}%`, // Animate width based on the value prop
                                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"], // Existing background animation
                        }}
                        initial={{ width: 0 }} // Start with width 0 on mount
                        transition={{
                                width: {
                                        duration: 0.5, // Duration for width animation
                                        ease: "easeInOut",
                                },
                                backgroundPosition: {
                                        repeat: Infinity, // Loop the background animation
                                        duration: 3,
                                        ease: "linear",
                                },
                        }}
                />
        </ProgressPrimitive.Root>
));

Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
