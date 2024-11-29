'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { FormSubmissionData } from '@/lib/types/forms';
import { formSchema } from '@/lib/types/forms';
import type { ProcessedProgramResponse, BenefitsGapResult } from '@/lib/actions';
import BasicInformationStep from './steps/BasicInformationStep';
import HouseholdInformationStep from './steps/HouseholdInformationStep';
import HealthStatusStep from './steps/HealthStatusStep';
import EmploymentInformationStep from './steps/EmploymentInformationStep';
import DocumentationStep from './steps/DocumentationStep';
import PreferencesStep from './steps/PreferencesStep';
import { AnimatePresence, motion } from 'framer-motion';

interface FormState {
        isSubmitting: boolean;
        error: string | null;
        results: {
                eligiblePrograms: ProcessedProgramResponse[];
                benefitsGap: BenefitsGapResult;
        } | null;
}

export function BenefitsQueryForm() {
        const [currentStep, setCurrentStep] = useState(0);
        const [formState, setFormState] = useState<FormState>({
                isSubmitting: false,
                error: null,
                results: null,
        });
        const router = useRouter();

        const form = useForm<FormSubmissionData>({
                resolver: zodResolver(formSchema),
                defaultValues: {
                        basic: {
                                age: '30',
                                gender: '1',
                                countryOfResidence: 'DM',
                                countryOfOrigin: '',
                        },
                        household: {
                                householdSize: '2',
                                numberOfDependents: '0',
                                typeOfDependents: '',
                                monthlyIncome: '0',
                                primaryIncomeName: '',
                                primaryIncomeRelation: '',
                        },
                        health: {
                                disabilityStatus: '1',
                                chronicIllnessStatus: '1',
                                disabilityType: '',
                                medicalDocumentation: false,
                                requiresContinuousCare: false,
                                registeredDisability: false,
                        },
                        employment: {
                                employmentStatus: '1',
                                employmentSector: '',
                                employmentType: '',
                                socialSecurityNumber: '',
                                monthsEmployed: '0',
                                seasonalWork: false,
                                employmentHistory: {
                                        lastEmployed: '',
                                        reasonForUnemployment: '',
                                        seekingWork: false,
                                },
                        },
                        documentation: {
                                hasValidID: false,
                                hasProofOfResidence: false,
                                hasIncomeDocuments: false,
                                hasSocialSecurityCard: false,
                                hasBankAccount: false,
                                hasUtilityBills: false,
                                hasPropertyDocuments: false,
                        },
                        preferences: {
                                includeInKindBenefits: true,
                                includeCashTransfers: true,
                                includeEmergencyAssistance: false,
                                preferredPaymentMethod: '',
                                languagePreference: '',
                                communicationPreference: '',
                        },
                },
        });

        const steps = [
                { id: 'basic', title: 'Basic Information', component: BasicInformationStep },
                { id: 'household', title: 'Household Information', component: HouseholdInformationStep },
                { id: 'health', title: 'Health Status', component: HealthStatusStep },
                { id: 'employment', title: 'Employment', component: EmploymentInformationStep },
                { id: 'documentation', title: 'Documentation', component: DocumentationStep },
                { id: 'preferences', title: 'Preferences', component: PreferencesStep },
        ];


        // Synchronous step navigation
        const handleStepCompletion = (direction: 'next' | 'previous') => {
                if (direction === 'previous') {
                        setCurrentStep(prev => Math.max(0, prev - 1));
                        return;
                }

                const currentStepId = steps[currentStep].id;
                const stepFields = [currentStepId] as const;

                // Synchronous validation
                const isStepValid = Object.keys(form.formState.errors).every(
                        key => !stepFields.includes(key as typeof stepFields[number])
                );

                if (isStepValid && currentStep < steps.length - 1) {
                        setCurrentStep(prev => prev + 1);
                }
        };
        const onSubmit = (data: FormSubmissionData) => {
                // Use the spread operator to maintain existing state
                setFormState(prev => ({
                        ...prev,  // Keep existing state
                        isSubmitting: true,
                        error: null,
                        // results stays unchanged from previous state
                }));

                try {
                        const params = new URLSearchParams();

                        Object.entries(data).forEach(([section, sectionData]) => {
                                Object.entries(sectionData).forEach(([key, value]) => {
                                        if (typeof value === 'object') {
                                                Object.entries(value).forEach(([nestedKey, nestedValue]) => {
                                                        params.append(
                                                                `${section}.${key}.${nestedKey}`,
                                                                String(nestedValue)
                                                        );
                                                });
                                        } else {
                                                params.append(`${section}.${key}`, String(value));
                                        }
                                });
                        });

                        router.push(`/benefit-displayer?${params.toString()}`);
                } catch (error) {
                        // Again, maintain existing state when setting error
                        setFormState(prev => ({
                                ...prev,
                                isSubmitting: false,
                                error: error instanceof Error ? error.message : 'An error occurred',
                                // results stays unchanged
                        }));
                }
        };

        // Render form
        return (
                <FormProvider {...form}>
                        <div className="max-w-2xl mx-auto space-y-6">
                                <Card className="p-6">
                                        <Progress
                                                value={(currentStep / (steps.length - 1)) * 100}
                                                className="mb-4"
                                        />

                                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                                {formState.error && (
                                                        <Alert variant="destructive">
                                                                <AlertDescription>{formState.error}</AlertDescription>
                                                        </Alert>
                                                )}

                                                {/* Current step component */}
                                                <AnimatePresence mode="wait">
                                                        <motion.div
                                                                key={steps[currentStep].id}
                                                                initial={{ opacity: 0, x: 0 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                exit={{ opacity: 0, x: 0 }}
                                                                transition={{ duration: 0.3 }}
                                                        >
                                                                {(() => {
                                                                        const StepComponent = steps[currentStep].component;
                                                                        return <StepComponent />;
                                                                })()}
                                                        </motion.div>
                                                </AnimatePresence>

                                                {/* Navigation buttons */}
                                                <div className="flex justify-between mt-6">
                                                        <Button
                                                                type="button"
                                                                variant="outline"
                                                                onClick={() => handleStepCompletion('previous')}
                                                                disabled={currentStep === 0 || formState.isSubmitting}
                                                        >
                                                                Previous
                                                        </Button>

                                                        <Button
                                                                type="button"  // Always 'button' to prevent unintended form submissions
                                                                onClick={() => {
                                                                        if (currentStep < steps.length - 1) {
                                                                                handleStepCompletion('next');
                                                                        } else {
                                                                                form.handleSubmit(onSubmit)();  // Manually submit the form
                                                                        }
                                                                }}
                                                                disabled={formState.isSubmitting}
                                                        >
                                                                {formState.isSubmitting ? (
                                                                        <>
                                                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                                Processing
                                                                        </>
                                                                ) : currentStep === steps.length - 1 ? (
                                                                        'Submit Application'
                                                                ) : (
                                                                        'Next'
                                                                )}
                                                        </Button>
                                                </div>
                                        </form>
                                </Card>

                                {/* Step counter */}
                                {currentStep > 0 && (
                                        <div className="text-sm text-muted-foreground text-center">
                                                Step {currentStep + 1} of {steps.length}
                                        </div>
                                )}
                        </div>
                </FormProvider>
        );
}
