
// components/forms/steps/HealthStatusStep.tsx
import React, { useEffect } from 'react';
import {
        FormField,
        FormItem,
        FormLabel,
        FormControl,
        FormMessage,
        FormDescription,
} from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { motion, AnimatePresence } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import type { FormSubmissionData } from '@/lib/types/forms';

const conditionalVariants = {
        hidden: { opacity: 0, height: 0, overflow: 'hidden' },
        visible: { opacity: 1, height: 'auto', overflow: 'hidden' },
        exit: { opacity: 0, height: 0, overflow: 'hidden' },
};

export default function HealthStatusStep() {
        const { control, watch, setValue } = useFormContext<FormSubmissionData>();

        // Watch the disability status for conditional rendering
        const disabilityStatus = watch('health.disabilityStatus');
        const hasDisability = disabilityStatus !== '1'; // Assuming '1' is "No Disability"

        // Handle side effects when disability status changes
        useEffect(() => {
                if (!hasDisability) {
                        // Reset conditional fields when no disability
                        setValue('health.requiresContinuousCare', false);
                        setValue('health.registeredDisability', false);
                }
        }, [hasDisability, setValue]);

        return (
                <div className="space-y-4">
                        <FormField
                                control={control}
                                name="health.disabilityStatus"
                                render={({ field }) => (
                                        <FormItem>
                                                <FormLabel>Disability Status</FormLabel>
                                                <FormDescription>
                                                        Select your current disability status.
                                                </FormDescription>
                                                <FormControl>
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                                <SelectTrigger>
                                                                        <SelectValue placeholder="Select disability status" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                        <SelectItem value="1">No Disability</SelectItem>
                                                                        <SelectItem value="2">Mild Disability</SelectItem>
                                                                        <SelectItem value="3">Moderate Disability</SelectItem>
                                                                        <SelectItem value="4">Severe Disability</SelectItem>
                                                                </SelectContent>
                                                        </Select>
                                                </FormControl>
                                                <FormMessage />
                                        </FormItem>
                                )}
                        />

                        <FormField
                                control={control}
                                name="health.chronicIllnessStatus"
                                render={({ field }) => (
                                        <FormItem>
                                                <FormLabel>Chronic Illness Status</FormLabel>
                                                <FormDescription>
                                                        Select your chronic illness status.
                                                </FormDescription>
                                                <FormControl>
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                                <SelectTrigger>
                                                                        <SelectValue placeholder="Select chronic illness status" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                        <SelectItem value="1">No Chronic Illness</SelectItem>
                                                                        <SelectItem value="2">Managed Chronic Condition</SelectItem>
                                                                        <SelectItem value="3">Severe Chronic Condition</SelectItem>
                                                                        <SelectItem value="4">Multiple Chronic Conditions</SelectItem>
                                                                </SelectContent>
                                                        </Select>
                                                </FormControl>
                                                <FormMessage />
                                        </FormItem>
                                )}
                        />

                        {/* AnimatePresence handles the mounting and unmounting animations */}
                        <AnimatePresence>
                                {hasDisability && (
                                        <motion.div
                                                key="disabilityDetails"
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                variants={conditionalVariants}
                                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                        >
                                                <FormField
                                                        control={control}
                                                        name="health.requiresContinuousCare"
                                                        render={({ field }) => (
                                                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                                                        <FormControl>
                                                                                <Checkbox
                                                                                        checked={field.value}
                                                                                        onCheckedChange={field.onChange}
                                                                                />
                                                                        </FormControl>
                                                                        <div className="space-y-1 leading-none">
                                                                                <FormLabel>Requires Continuous Care</FormLabel>
                                                                                <FormDescription>
                                                                                        Check if regular medical attention or assistance is needed.
                                                                                </FormDescription>
                                                                        </div>
                                                                        <FormMessage />
                                                                </FormItem>
                                                        )}
                                                />
                                                <div className='py-2'></div>
                                                <FormField
                                                        control={control}
                                                        name="health.registeredDisability"
                                                        render={({ field }) => (
                                                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                                                        <FormControl>
                                                                                <Checkbox
                                                                                        checked={field.value}
                                                                                        onCheckedChange={field.onChange}
                                                                                />
                                                                        </FormControl>
                                                                        <div className="space-y-1 leading-none">
                                                                                <FormLabel>Registered Disability</FormLabel>
                                                                                <FormDescription>
                                                                                        Check if disability is officially registered with authorities.
                                                                                </FormDescription>
                                                                        </div>
                                                                        <FormMessage />
                                                                </FormItem>
                                                        )}
                                                />
                                        </motion.div>
                                )}
                        </AnimatePresence>
                </div>
        );
}
