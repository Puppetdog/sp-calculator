
// components/forms/steps/BasicInformationStep.tsx
import React from 'react';
import {
        FormField,
        FormItem,
        FormLabel,
        FormControl,
        FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
        Select,
        SelectContent,
        SelectItem,
        SelectTrigger,
        SelectValue,
} from '@/components/ui/select';
import { useFormContext } from 'react-hook-form';
import type { FormSubmissionData } from '@/lib/types/forms';

export default function BasicInformationStep() {
        const { control } = useFormContext<FormSubmissionData>();

        return (
                <div className="space-y-4">
                        <FormField
                                control={control}
                                name="basic.age"
                                render={({ field }) => (
                                        <FormItem>
                                                <FormLabel>Age</FormLabel>
                                                <FormControl>
                                                        <Input type="number" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                        </FormItem>
                                )}
                        />

                        <FormField
                                control={control}
                                name="basic.gender"
                                render={({ field }) => (
                                        <FormItem>
                                                <FormLabel>Gender</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                        <FormControl>
                                                                <SelectTrigger>
                                                                        <SelectValue placeholder="Select gender" />
                                                                </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                                <SelectItem value="1">Male</SelectItem>
                                                                <SelectItem value="2">Female</SelectItem>
                                                                <SelectItem value="3">Other</SelectItem>
                                                        </SelectContent>
                                                </Select>
                                                <FormMessage />
                                        </FormItem>
                                )}
                        />

                        <FormField
                                control={control}
                                name="basic.countryOfResidence"
                                render={({ field }) => (
                                        <FormItem>
                                                <FormLabel>Country of Residence</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                        <FormControl>
                                                                <SelectTrigger>
                                                                        <SelectValue placeholder="Select country" />
                                                                </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                                <SelectItem value="DM">Dominica</SelectItem>
                                                                <SelectItem value="2">Grenada</SelectItem>
                                                                <SelectItem value="3">Jamaica</SelectItem>
                                                                <SelectItem value="4">Saint Lucia</SelectItem>
                                                                <SelectItem value="TT">Trinidad</SelectItem>
                                                        </SelectContent>
                                                </Select>
                                                <FormMessage />
                                        </FormItem>
                                )}
                        />
                </div>
        );
}
