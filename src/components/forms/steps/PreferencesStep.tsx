
// components/forms/steps/PreferencesStep.tsx

import React from 'react';
import {
        FormField,
        FormItem,
        FormLabel,
        FormControl,
        FormDescription,
        FormMessage,
} from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { useFormContext } from 'react-hook-form';
import type { FormSubmissionData } from '@/lib/types/forms';

export default function PreferencesStep() {
        const { control } = useFormContext<FormSubmissionData>();

        return (
                <div className="space-y-6">
                        {/* Benefit Type Preferences Section */}
                        <Card>
                                <CardContent className="pt-6">
                                        <h3 className="text-lg font-semibold mb-4">Benefit Type Preferences</h3>
                                        <div className="space-y-4">
                                                {/* Cash Transfers */}
                                                <FormField
                                                        control={control}
                                                        name="preferences.includeCashTransfers"
                                                        render={({ field }) => (
                                                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                                                        <FormControl>
                                                                                <Checkbox
                                                                                        checked={field.value}
                                                                                        onCheckedChange={field.onChange}
                                                                                />
                                                                        </FormControl>
                                                                        <div className="space-y-1 leading-none">
                                                                                <FormLabel>Cash Transfers</FormLabel>
                                                                                <FormDescription>
                                                                                        Direct financial assistance through bank transfers or other payment methods
                                                                                </FormDescription>
                                                                        </div>
                                                                        <FormMessage />
                                                                </FormItem>
                                                        )}
                                                />

                                                {/* In-Kind Benefits */}
                                                <FormField
                                                        control={control}
                                                        name="preferences.includeInKindBenefits"
                                                        render={({ field }) => (
                                                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                                                        <FormControl>
                                                                                <Checkbox
                                                                                        checked={field.value}
                                                                                        onCheckedChange={field.onChange}
                                                                                />
                                                                        </FormControl>
                                                                        <div className="space-y-1 leading-none">
                                                                                <FormLabel>In-Kind Benefits</FormLabel>
                                                                                <FormDescription>
                                                                                        Non-cash assistance such as food supplies, housing assistance, or medical services
                                                                                </FormDescription>
                                                                        </div>
                                                                        <FormMessage />
                                                                </FormItem>
                                                        )}
                                                />

                                                {/* Emergency Assistance */}
                                                <FormField
                                                        control={control}
                                                        name="preferences.includeEmergencyAssistance"
                                                        render={({ field }) => (
                                                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                                                        <FormControl>
                                                                                <Checkbox
                                                                                        checked={field.value}
                                                                                        onCheckedChange={field.onChange}
                                                                                />
                                                                        </FormControl>
                                                                        <div className="space-y-1 leading-none">
                                                                                <FormLabel>Emergency Assistance</FormLabel>
                                                                                <FormDescription>
                                                                                        Short-term support for urgent needs or crisis situations
                                                                                </FormDescription>
                                                                        </div>
                                                                        <FormMessage />
                                                                </FormItem>
                                                        )}
                                                />
                                        </div>
                                </CardContent>
                        </Card>

                        {/* Communication Preferences Section */}
                        <Card>
                                <CardContent className="pt-6">
                                        <h3 className="text-lg font-semibold mb-4">Communication Preferences</h3>
                                        <div className="space-y-4">
                                                {/* Preferred Payment Method */}
                                                <FormField
                                                        control={control}
                                                        name="preferences.preferredPaymentMethod"
                                                        render={({ field }) => (
                                                                <FormItem>
                                                                        <FormLabel>Preferred Payment Method</FormLabel>
                                                                        <FormDescription>
                                                                                Select your preferred method for receiving benefits
                                                                        </FormDescription>
                                                                        <FormControl>
                                                                                <Select
                                                                                        onValueChange={field.onChange}
                                                                                        value={field.value}
                                                                                >
                                                                                        <SelectTrigger>
                                                                                                <SelectValue placeholder="Select payment method" />
                                                                                        </SelectTrigger>
                                                                                        <SelectContent>
                                                                                                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                                                                                <SelectItem value="mobile_money">Mobile Money</SelectItem>
                                                                                                <SelectItem value="cash_pickup">Cash Pickup</SelectItem>
                                                                                                <SelectItem value="prepaid_card">Prepaid Card</SelectItem>
                                                                                        </SelectContent>
                                                                                </Select>
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                </FormItem>
                                                        )}
                                                />

                                                {/* Preferred Communication Method */}
                                                <FormField
                                                        control={control}
                                                        name="preferences.communicationPreference"
                                                        render={({ field }) => (
                                                                <FormItem>
                                                                        <FormLabel>Preferred Communication Method</FormLabel>
                                                                        <FormDescription>
                                                                                Select how you would like to receive updates and notifications
                                                                        </FormDescription>
                                                                        <FormControl>
                                                                                <Select
                                                                                        onValueChange={field.onChange}
                                                                                        value={field.value}
                                                                                >
                                                                                        <SelectTrigger>
                                                                                                <SelectValue placeholder="Select communication method" />
                                                                                        </SelectTrigger>
                                                                                        <SelectContent>
                                                                                                <SelectItem value="email">Email</SelectItem>
                                                                                                <SelectItem value="sms">SMS</SelectItem>
                                                                                                <SelectItem value="phone">Phone Call</SelectItem>
                                                                                                <SelectItem value="post">Postal Mail</SelectItem>
                                                                                        </SelectContent>
                                                                                </Select>
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                </FormItem>
                                                        )}
                                                />

                                                {/* Preferred Language */}
                                                <FormField
                                                        control={control}
                                                        name="preferences.languagePreference"
                                                        render={({ field }) => (
                                                                <FormItem>
                                                                        <FormLabel>Preferred Language</FormLabel>
                                                                        <FormDescription>
                                                                                Select the language you prefer for communications
                                                                        </FormDescription>
                                                                        <FormControl>
                                                                                <Select
                                                                                        onValueChange={field.onChange}
                                                                                        value={field.value}
                                                                                >
                                                                                        <SelectTrigger>
                                                                                                <SelectValue placeholder="Select language" />
                                                                                        </SelectTrigger>
                                                                                        <SelectContent>
                                                                                                <SelectItem value="en">English</SelectItem>
                                                                                                <SelectItem value="es">Spanish</SelectItem>
                                                                                                <SelectItem value="fr">French</SelectItem>
                                                                                                <SelectItem value="pt">Portuguese</SelectItem>
                                                                                        </SelectContent>
                                                                                </Select>
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                </FormItem>
                                                        )}
                                                />
                                        </div>
                                </CardContent>
                        </Card>
                </div>
        )
}
