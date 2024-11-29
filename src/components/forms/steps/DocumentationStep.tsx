// components/forms/steps/DocumentationStep.tsx
import React from 'react';
import {
        FormField,
        FormItem,
        FormLabel,
        FormControl,
        FormDescription,
        FormMessage,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { useFormContext } from 'react-hook-form';
import type { FormSubmissionData } from '@/lib/types/forms';

export default function DocumentationStep() {
        const { control } = useFormContext<FormSubmissionData>();

        return (
                <div className="space-y-4">
                        <div className="text-sm text-muted-foreground mb-4">
                                Please indicate which documents you currently have available:
                        </div>

                        <FormField
                                control={control}
                                name="documentation.hasValidID"
                                render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                                <FormControl>
                                                        <Checkbox
                                                                checked={field.value}
                                                                onCheckedChange={field.onChange}
                                                        />
                                                </FormControl>
                                                <div className="space-y-1 leading-none">
                                                        <FormLabel>Valid Government ID</FormLabel>
                                                        <FormDescription>
                                                                National ID, passport, or drivers license
                                                        </FormDescription>
                                                </div>
                                                <FormMessage />
                                        </FormItem>
                                )}
                        />

                        <FormField
                                control={control}
                                name="documentation.hasProofOfResidence"
                                render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                                <FormControl>
                                                        <Checkbox
                                                                checked={field.value}
                                                                onCheckedChange={field.onChange}
                                                        />
                                                </FormControl>
                                                <div className="space-y-1 leading-none">
                                                        <FormLabel>Proof of Residence</FormLabel>
                                                        <FormDescription>
                                                                Utility bill, lease agreement, or official correspondence
                                                        </FormDescription>
                                                </div>
                                                <FormMessage />
                                        </FormItem>
                                )}
                        />

                        <FormField
                                control={control}
                                name="documentation.hasIncomeDocuments"
                                render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                                <FormControl>
                                                        <Checkbox
                                                                checked={field.value}
                                                                onCheckedChange={field.onChange}
                                                        />
                                                </FormControl>
                                                <div className="space-y-1 leading-none">
                                                        <FormLabel>Income Documentation</FormLabel>
                                                        <FormDescription>
                                                                Pay stubs, tax returns, or employment letter
                                                        </FormDescription>
                                                </div>
                                                <FormMessage />
                                        </FormItem>
                                )}
                        />

                        <FormField
                                control={control}
                                name="documentation.hasBankAccount"
                                render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                                <FormControl>
                                                        <Checkbox
                                                                checked={field.value}
                                                                onCheckedChange={field.onChange}
                                                        />
                                                </FormControl>
                                                <div className="space-y-1 leading-none">
                                                        <FormLabel>Bank Account</FormLabel>
                                                        <FormDescription>
                                                                Active bank account for receiving benefits
                                                        </FormDescription>
                                                </div>
                                                <FormMessage />
                                        </FormItem>
                                )}
                        />
                </div>
        );
}
