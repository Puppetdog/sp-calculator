'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
        Form,
        FormControl,
        FormDescription,
        FormField,
        FormItem,
        FormLabel,
        FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
        Select,
        SelectContent,
        SelectItem,
        SelectTrigger,
        SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { addProgram } from "@/app/add-programs/actions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
const benefitConditionSchema = z.object({
        benefitType: z.enum(['cash', 'in-kind']),
        conditionField: z.string(),
        conditionOperator: z.enum(['>', '<', '>=', '<=', '===', '!==']),
        conditionValue: z.union([z.string(), z.number()]),
        benefitAmount: z.number().min(0),
});
const formSchema = z.object({
        programTitle: z.string().min(4, {
                message: "Program Title must be at least 4 characters long",
        }),
        responsibleOrganization: z.string().min(4, {
                message: "Responsible Organization must be at least 4 characters long",
        }),
        programDescription: z.string().min(4, {
                message: "Program description must be at least 4 characters long",
        }),
        ageMinimum: z.number().min(0, {
                message: "Minimum age must be 0 or greater",
        }),
        ageMaximum: z.number().max(150, {
                message: "Maximum age must be 150 or less",
        }),
        gender: z.enum(["1", "2", "3", "4"], {
                message: "Gender must be selected",
        }),
        numberOfDependents: z.number().min(0, {
                message: "Number of dependents must be 0 or greater",
        }),
        typeOfDependents: z.enum(["1", "2", "3"], {
                message: "Type of dependents must be selected",
        }),
        employmentStatus: z.enum(["1", "2", "3", "4", "5"], {
                message: "Employment status must be selected",
        }),
        disabilityStatus: z.enum(["1", "2", "3", "4"], {
                message: "Disability status must be selected",
        }),
        chronicIllnessStatus: z.enum(["1", "2", "3", "4"], {
                message: "Chronic illness status must be selected",
        }),
        householdSize: z.number().min(1, {
                message: "Household size must be at least 1",
        }),
        programCountry: z.enum(["1", "2", "3", "4", "5"], {
                message: "Country of residence must be selected",
        }),
        citizenshipRequired: z.boolean(),
        cashTransfer: z.boolean(),
        cashTransferMonthlyAmount: z.number().min(0).optional(),
        inKindTransfer: z.boolean(),
        inKindDollarValueAmt: z.number().min(0).optional(),
        benefitConditions: z.array(benefitConditionSchema).optional(),
})

export function AddProgramForm() {
        const form = useForm<z.infer<typeof formSchema>>({
                resolver: zodResolver(formSchema),
                defaultValues: {
                        ageMinimum: 0,
                        ageMaximum: 150,
                        numberOfDependents: 0,
                        householdSize: 1,
                        citizenshipRequired: false,
                        cashTransfer: false,
                        inKindTransfer: false,
                        benefitConditions: [],
                },
        })
        const { fields, append, remove } = useFieldArray({
                control: form.control,
                name: 'benefitConditions',
        });
        async function onSubmit(values: z.infer<typeof formSchema>) {
                try {
                        const result = await addProgram(values);

                        if (result.success) {
                                alert('Program added successfully!');
                                form.reset();
                        } else {
                                alert(result.error || 'Failed to add program');
                        }
                } catch (error) {
                        console.error('Error adding program:', error);
                        alert('Failed to add program. Please try again.');
                }
        }

        return (
                <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <Tabs defaultValue="general" className="w-full">
                                        <TabsList className="mb-4">
                                                <TabsTrigger value="general">General Information</TabsTrigger>
                                                <TabsTrigger value="eligibility">Eligibility Criteria</TabsTrigger>
                                                <TabsTrigger value="benefits">Benefit Conditions</TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="general">
                                                <div className="space-y-4">
                                                        {/* Program Title */}
                                                        <FormField
                                                                control={form.control}
                                                                name="programTitle"
                                                                render={({ field }) => (
                                                                        <FormItem>
                                                                                <FormLabel>Program Title</FormLabel>
                                                                                <FormControl>
                                                                                        <Input placeholder="Enter program title" {...field} />
                                                                                </FormControl>
                                                                                <FormMessage />
                                                                        </FormItem>
                                                                )}
                                                        />

                                                        {/* Responsible Organization */}
                                                        <FormField
                                                                control={form.control}
                                                                name="responsibleOrganization"
                                                                render={({ field }) => (
                                                                        <FormItem>
                                                                                <FormLabel>Responsible Organization</FormLabel>
                                                                                <FormControl>
                                                                                        <Input placeholder="Enter responsible organization" {...field} />
                                                                                </FormControl>
                                                                                <FormMessage />
                                                                        </FormItem>
                                                                )}
                                                        />

                                                        {/* Program Description */}
                                                        <FormField
                                                                control={form.control}
                                                                name="programDescription"
                                                                render={({ field }) => (
                                                                        <FormItem>
                                                                                <FormLabel>Program Description</FormLabel>
                                                                                <FormControl>
                                                                                        <Textarea
                                                                                                placeholder="Describe the program"
                                                                                                className="resize-none"
                                                                                                {...field}
                                                                                        />
                                                                                </FormControl>
                                                                                <FormMessage />
                                                                        </FormItem>
                                                                )}
                                                        />
                                                </div>
                                        </TabsContent>

                                        {/* Age Minimum and Maximum */}
                                        <TabsContent value="eligibility">
                                                <div className="space-y-6">
                                                        <FormField
                                                                control={form.control}
                                                                name="ageMinimum"
                                                                render={({ field }) => (
                                                                        <FormItem>
                                                                                <FormLabel>Minimum Age</FormLabel>
                                                                                <FormControl>
                                                                                        <Input
                                                                                                type="number"
                                                                                                {...field}
                                                                                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                                                                                        />
                                                                                </FormControl>
                                                                                <FormMessage />
                                                                        </FormItem>
                                                                )}
                                                        />

                                                        <FormField
                                                                control={form.control}
                                                                name="ageMaximum"
                                                                render={({ field }) => (
                                                                        <FormItem>
                                                                                <FormLabel>Maximum Age</FormLabel>
                                                                                <FormControl>
                                                                                        <Input
                                                                                                type="number"
                                                                                                {...field}
                                                                                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                                                                                        />
                                                                                </FormControl>
                                                                                <FormMessage />
                                                                        </FormItem>
                                                                )}
                                                        />
                                                </div>

                                                {/* Gender */}
                                                <FormField
                                                        control={form.control}
                                                        name="gender"
                                                        render={({ field }) => (
                                                                <FormItem>
                                                                        <FormLabel>Gender</FormLabel>
                                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                                <FormControl>
                                                                                        <SelectTrigger>
                                                                                                <SelectValue placeholder="Select gender" />
                                                                                        </SelectTrigger>
                                                                                </FormControl>
                                                                                <SelectContent>
                                                                                        <SelectItem value="1">Male</SelectItem>
                                                                                        <SelectItem value="2">Female</SelectItem>
                                                                                        <SelectItem value="3">Other</SelectItem>
                                                                                        <SelectItem value="4">Any</SelectItem>
                                                                                </SelectContent>
                                                                        </Select>
                                                                        <FormMessage />
                                                                </FormItem>
                                                        )}
                                                />

                                                {/* Number of Dependents */}
                                                <FormField
                                                        control={form.control}
                                                        name="numberOfDependents"
                                                        render={({ field }) => (
                                                                <FormItem>
                                                                        <FormLabel>Number of Dependents</FormLabel>
                                                                        <FormControl>
                                                                                <Input
                                                                                        type="number"
                                                                                        {...field}
                                                                                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                                                                                />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                </FormItem>
                                                        )}
                                                />

                                                {/* Type of Dependents */}
                                                <FormField
                                                        control={form.control}
                                                        name="typeOfDependents"
                                                        render={({ field }) => (
                                                                <FormItem>
                                                                        <FormLabel>Type of Dependents</FormLabel>
                                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                                <FormControl>
                                                                                        <SelectTrigger>
                                                                                                <SelectValue placeholder="Select type of dependents" />
                                                                                        </SelectTrigger>
                                                                                </FormControl>
                                                                                <SelectContent>
                                                                                        <SelectItem value="1">Children</SelectItem>
                                                                                        <SelectItem value="2">Elderly</SelectItem>
                                                                                        <SelectItem value="3">Mixed</SelectItem>
                                                                                </SelectContent>
                                                                        </Select>
                                                                        <FormMessage />
                                                                </FormItem>
                                                        )}
                                                />

                                                {/* Employment Status */}
                                                <FormField
                                                        control={form.control}
                                                        name="employmentStatus"
                                                        render={({ field }) => (
                                                                <FormItem>
                                                                        <FormLabel>Employment Status</FormLabel>
                                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                                <FormControl>
                                                                                        <SelectTrigger>
                                                                                                <SelectValue placeholder="Select employment status" />
                                                                                        </SelectTrigger>
                                                                                </FormControl>
                                                                                <SelectContent>
                                                                                        <SelectItem value="1">Unemployed</SelectItem>
                                                                                        <SelectItem value="2">Seasonally Employed</SelectItem>
                                                                                        <SelectItem value="3">Permanently Employed</SelectItem>
                                                                                        <SelectItem value="4">Self Employed</SelectItem>
                                                                                        <SelectItem value="5">Any</SelectItem>
                                                                                </SelectContent>
                                                                        </Select>
                                                                        <FormMessage />
                                                                </FormItem>
                                                        )}
                                                />

                                                {/* Disability Status */}
                                                <FormField
                                                        control={form.control}
                                                        name="disabilityStatus"
                                                        render={({ field }) => (
                                                                <FormItem>
                                                                        <FormLabel>Disability Status</FormLabel>
                                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                                <FormControl>
                                                                                        <SelectTrigger>
                                                                                                <SelectValue placeholder="Select disability status" />
                                                                                        </SelectTrigger>
                                                                                </FormControl>
                                                                                <SelectContent>
                                                                                        <SelectItem value="1">None</SelectItem>
                                                                                        <SelectItem value="2">Moderate</SelectItem>
                                                                                        <SelectItem value="3">Severe</SelectItem>
                                                                                        <SelectItem value="4">Any</SelectItem>
                                                                                </SelectContent>
                                                                        </Select>
                                                                        <FormMessage />
                                                                </FormItem>
                                                        )}
                                                />

                                                {/* Chronic Illness Status */}
                                                <FormField
                                                        control={form.control}
                                                        name="chronicIllnessStatus"
                                                        render={({ field }) => (
                                                                <FormItem>
                                                                        <FormLabel>Chronic Illness Status</FormLabel>
                                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                                <FormControl>
                                                                                        <SelectTrigger>
                                                                                                <SelectValue placeholder="Select chronic illness status" />
                                                                                        </SelectTrigger>
                                                                                </FormControl>
                                                                                <SelectContent>
                                                                                        <SelectItem value="1">None</SelectItem>
                                                                                        <SelectItem value="2">Moderate</SelectItem>
                                                                                        <SelectItem value="3">Severe</SelectItem>
                                                                                        <SelectItem value="4">Any</SelectItem>
                                                                                </SelectContent>
                                                                        </Select>
                                                                        <FormMessage />
                                                                </FormItem>
                                                        )}
                                                />

                                                {/* Household Size */}
                                                <FormField
                                                        control={form.control}
                                                        name="householdSize"
                                                        render={({ field }) => (
                                                                <FormItem>
                                                                        <FormLabel>Household Size</FormLabel>
                                                                        <FormControl>
                                                                                <Input
                                                                                        type="number"
                                                                                        {...field}
                                                                                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                                                                                />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                </FormItem>
                                                        )}
                                                />


                                                {/* Country of Residence */}
                                                <FormField
                                                        control={form.control}
                                                        name="programCountry"
                                                        render={({ field }) => (
                                                                <FormItem>
                                                                        <FormLabel>Country of Program</FormLabel>
                                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                                <FormControl>
                                                                                        <SelectTrigger>
                                                                                                <SelectValue placeholder="Select country of program" />
                                                                                        </SelectTrigger>
                                                                                </FormControl>
                                                                                <SelectContent>
                                                                                        <SelectItem value="1">Dominica</SelectItem>
                                                                                        <SelectItem value="2">Grenada</SelectItem>
                                                                                        <SelectItem value="3">Jamaica</SelectItem>
                                                                                        <SelectItem value="4">Saint Lucia</SelectItem>
                                                                                        <SelectItem value="5">Trinidad and Tobago</SelectItem>
                                                                                </SelectContent>
                                                                        </Select>
                                                                        <FormMessage />
                                                                </FormItem>
                                                        )}
                                                />

                                                {/* Residency Required */}
                                                <FormField
                                                        control={form.control}
                                                        name="citizenshipRequired"
                                                        render={({ field }) => (
                                                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                                                        <FormControl>
                                                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                                        </FormControl>
                                                                        <div className="space-y-1 leading-none">
                                                                                <FormLabel>Citizenship Required</FormLabel>
                                                                                <FormDescription>
                                                                                        Is citizenship in the country required for this program?
                                                                                </FormDescription>
                                                                        </div>
                                                                </FormItem>
                                                        )}
                                                />
                                        </TabsContent>

                                        <TabsContent value="benefits">
                                                <div className="space-y-6">
                                                        {/* Cash Transfer */}
                                                        <FormField
                                                                control={form.control}
                                                                name="cashTransfer"
                                                                render={({ field }) => (
                                                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                                                                <FormControl>
                                                                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                                                </FormControl>
                                                                                <div className="space-y-1 leading-none">
                                                                                        <FormLabel>Cash Transfer</FormLabel>
                                                                                        <FormDescription>
                                                                                                Does the program contain a Cash Transfer Benefit/Component?
                                                                                        </FormDescription>
                                                                                </div>
                                                                        </FormItem>
                                                                )}
                                                        />

                                                        {/* Cash Transfer Monthly Amount */}
                                                        {form.watch('cashTransfer') && (
                                                                <FormField
                                                                        control={form.control}
                                                                        name="cashTransferMonthlyAmount"
                                                                        render={({ field }) => (
                                                                                <FormItem>
                                                                                        <FormLabel>Cash Transfer Monthly Amount</FormLabel>
                                                                                        <FormControl>
                                                                                                <Input
                                                                                                        type="number"
                                                                                                        placeholder="Enter monthly amount"
                                                                                                        {...field}
                                                                                                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                                                                                />
                                                                                        </FormControl>
                                                                                        <FormMessage />
                                                                                </FormItem>
                                                                        )}
                                                                />
                                                        )}

                                                        {/* In-Kind Transfer */}
                                                        <FormField
                                                                control={form.control}
                                                                name="inKindTransfer"
                                                                render={({ field }) => (
                                                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                                                                <FormControl>
                                                                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                                                </FormControl>
                                                                                <div className="space-y-1 leading-none">
                                                                                        <FormLabel>In-Kind Transfer</FormLabel>
                                                                                        <FormDescription>
                                                                                                Does the program contain an In-Kind Benefit/Component?
                                                                                        </FormDescription>
                                                                                </div>
                                                                        </FormItem>
                                                                )}
                                                        />

                                                        {/* In-Kind Dollar Value Amount */}
                                                        {form.watch('inKindTransfer') && (
                                                                <FormField
                                                                        control={form.control}
                                                                        name="inKindDollarValueAmt"
                                                                        render={({ field }) => (
                                                                                <FormItem>
                                                                                        <FormLabel>In-Kind Dollar Value Amount</FormLabel>
                                                                                        <FormControl>
                                                                                                <Input
                                                                                                        type="number"
                                                                                                        placeholder="Enter dollar value amount"
                                                                                                        {...field}
                                                                                                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                                                                                />
                                                                                        </FormControl>
                                                                                        <FormMessage />
                                                                                </FormItem>
                                                                        )}
                                                                />
                                                        )}
                                                        {/* Benefit Conditions */}
                                                        <div>
                                                                <FormLabel>Benefit Conditions</FormLabel>
                                                                <FormDescription>
                                                                        Add conditions under which different benefit amounts are provided.
                                                                </FormDescription>

                                                                {fields.map((field, index) => (
                                                                        <div key={field.id} className="border p-4 mb-4">
                                                                                {/* Benefit Type */}
                                                                                <FormField
                                                                                        control={form.control}
                                                                                        name={`benefitConditions.${index}.benefitType`}
                                                                                        render={({ field }) => (
                                                                                                <FormItem>
                                                                                                        <FormLabel>Benefit Type</FormLabel>
                                                                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                                                                <FormControl>
                                                                                                                        <SelectTrigger>
                                                                                                                                <SelectValue placeholder="Select benefit type" />
                                                                                                                        </SelectTrigger>
                                                                                                                </FormControl>
                                                                                                                <SelectContent>
                                                                                                                        <SelectItem value="cash">Cash</SelectItem>
                                                                                                                        <SelectItem value="in-kind">In-Kind</SelectItem>
                                                                                                                </SelectContent>
                                                                                                        </Select>
                                                                                                        <FormMessage />
                                                                                                </FormItem>
                                                                                        )}
                                                                                />

                                                                                {/* Condition Field */}
                                                                                <FormField
                                                                                        control={form.control}
                                                                                        name={`benefitConditions.${index}.conditionField`}
                                                                                        render={({ field }) => (
                                                                                                <FormItem>
                                                                                                        <FormLabel>Condition Field</FormLabel>
                                                                                                        <FormControl>
                                                                                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                                                                        <SelectTrigger>
                                                                                                                                <SelectValue placeholder="Select condition field" />
                                                                                                                        </SelectTrigger>
                                                                                                                        <SelectContent>
                                                                                                                                <SelectItem value="householdSize">Household Size</SelectItem>
                                                                                                                                <SelectItem value="age">Age</SelectItem>
                                                                                                                                <SelectItem value="numberOfDependents">Number of Dependents</SelectItem>
                                                                                                                                {/* Add other fields as needed */}
                                                                                                                        </SelectContent>
                                                                                                                </Select>
                                                                                                        </FormControl>
                                                                                                        <FormMessage />
                                                                                                </FormItem>
                                                                                        )}
                                                                                />

                                                                                {/* Condition Operator */}
                                                                                <FormField
                                                                                        control={form.control}
                                                                                        name={`benefitConditions.${index}.conditionOperator`}
                                                                                        render={({ field }) => (
                                                                                                <FormItem>
                                                                                                        <FormLabel>Condition Operator</FormLabel>
                                                                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                                                                <FormControl>
                                                                                                                        <SelectTrigger>
                                                                                                                                <SelectValue placeholder="Select operator" />
                                                                                                                        </SelectTrigger>
                                                                                                                </FormControl>
                                                                                                                <SelectContent>
                                                                                                                        <SelectItem value=">">Greater Than</SelectItem>
                                                                                                                        <SelectItem value="<">Less Than</SelectItem>
                                                                                                                        <SelectItem value=">=">Greater Than or Equal (≥)</SelectItem>
                                                                                                                        <SelectItem value="<=">Less Than or Equal (≤)</SelectItem>
                                                                                                                        <SelectItem value="===">Equal (===)</SelectItem>
                                                                                                                        <SelectItem value="!=">Not Equal (!=)</SelectItem>
                                                                                                                </SelectContent>
                                                                                                        </Select>
                                                                                                        <FormMessage />
                                                                                                </FormItem>
                                                                                        )}
                                                                                />

                                                                                {/* Condition Value */}
                                                                                <FormField
                                                                                        control={form.control}
                                                                                        name={`benefitConditions.${index}.conditionValue`}
                                                                                        render={({ field }) => (
                                                                                                <FormItem>
                                                                                                        <FormLabel>Condition Value</FormLabel>
                                                                                                        <FormControl>
                                                                                                                <Input
                                                                                                                        placeholder="Enter value"
                                                                                                                        {...field}
                                                                                                                        onChange={(e) => field.onChange(e.target.value)}
                                                                                                                />
                                                                                                        </FormControl>
                                                                                                        <FormMessage />
                                                                                                </FormItem>
                                                                                        )}
                                                                                />

                                                                                {/* Benefit Amount */}
                                                                                <FormField
                                                                                        control={form.control}
                                                                                        name={`benefitConditions.${index}.benefitAmount`}
                                                                                        render={({ field }) => (
                                                                                                <FormItem>
                                                                                                        <FormLabel>Benefit Amount</FormLabel>
                                                                                                        <FormControl>
                                                                                                                <Input
                                                                                                                        type="number"
                                                                                                                        placeholder="Enter benefit amount"
                                                                                                                        {...field}
                                                                                                                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                                                                                                />
                                                                                                        </FormControl>
                                                                                                        <FormMessage />
                                                                                                </FormItem>
                                                                                        )}
                                                                                />

                                                                                {/* Remove Condition Button */}
                                                                                <Button
                                                                                        type="button"
                                                                                        variant="destructive"
                                                                                        onClick={() => remove(index)}
                                                                                        className="mt-2"
                                                                                >
                                                                                        Remove Condition
                                                                                </Button>
                                                                        </div>
                                                                ))}

                                                                {/* Add Condition Button */}
                                                                <Button
                                                                        type="button"
                                                                        onClick={() =>
                                                                                append({
                                                                                        benefitType: 'cash',
                                                                                        conditionField: '',
                                                                                        conditionOperator: '===',
                                                                                        conditionValue: '',
                                                                                        benefitAmount: 0,
                                                                                })
                                                                        }
                                                                >
                                                                        Add Benefit Condition
                                                                </Button>
                                                        </div>
                                                </div>

                                        </TabsContent>
                                </Tabs>
                                {/* Submit Button */}
                                <Button type="submit">Add Program</Button>
                        </form>
                </Form>
        )
}
