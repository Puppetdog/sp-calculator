"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from "next/navigation"
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const formSchema = z.object({
        age: z.string().min(1, { message: "Age must be more than zero" }),
        gender: z.string().min(1, { message: "Gender must be selected" }),
        numberOfDependents: z.string().min(0, { message: "Number of dependents must be entered" }),
        typeOfDependents: z.string().min(1, { message: "Type of dependents must be selected" }),
        employmentStatus: z.string().min(1, { message: "Employment status must be selected" }),
        disabilityStatus: z.string().min(1, { message: "Disability status must be selected" }),
        chronicIllnessStatus: z.string().min(1, { message: "Chronic illness status must be selected" }),
        householdSize: z.string().min(1, { message: "Household size must be entered" }),
        countryOfOrigin: z.string().min(1, { message: "Country of origin must be selected" }),
        countryOfResidence: z.string().min(1, { message: "Country of residence must be selected" }),
}).refine((data) => {
        const dependents = parseInt(data.numberOfDependents);
        const householdSize = parseInt(data.householdSize);
        return !isNaN(dependents) && !isNaN(householdSize) && householdSize >= dependents;
}, {
        message: "Household size must be greater than or equal to the number of dependents",
        path: ["householdSize"],
});

export function BenefitsQueryForm() {
        const form = useForm<z.infer<typeof formSchema>>({
                resolver: zodResolver(formSchema),
                defaultValues: {
                        age: "1",
                        numberOfDependents: "0",
                        householdSize: "1",
                },
        })
        const router = useRouter()

        function onSubmit(values: z.infer<typeof formSchema>) {
                router.push(`/benefit-displayer?${new URLSearchParams(values as Record<string, string>).toString()}`)
        }

        return (
                <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <Card>
                                        <CardHeader>
                                                <CardTitle>Beneficiary Information</CardTitle>
                                                <CardDescription>Enter the details of the potential beneficiary to calculate possible benefits.</CardDescription>
                                        </CardHeader>
                                        <CardContent className="grid gap-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <FormField
                                                                control={form.control}
                                                                name="age"
                                                                render={({ field }) => (
                                                                        <FormItem>
                                                                                <FormLabel>Age</FormLabel>
                                                                                <FormControl>
                                                                                        <Input type="number" placeholder="Enter age" {...field} />
                                                                                </FormControl>
                                                                                <FormMessage />
                                                                        </FormItem>
                                                                )}
                                                        />
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
                                                                                                <SelectItem value="4">Prefer not to say</SelectItem>
                                                                                        </SelectContent>
                                                                                </Select>
                                                                                <FormMessage />
                                                                        </FormItem>
                                                                )}
                                                        />
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <FormField
                                                                control={form.control}
                                                                name="numberOfDependents"
                                                                render={({ field }) => (
                                                                        <FormItem>
                                                                                <FormLabel>Number of Dependents</FormLabel>
                                                                                <FormControl>
                                                                                        <Input
                                                                                                type="number"
                                                                                                placeholder="Enter number"
                                                                                                {...field}
                                                                                                onChange={(e) => {
                                                                                                        field.onChange(e);
                                                                                                        const dependents = parseInt(e.target.value);
                                                                                                        const householdSize = parseInt(form.getValues("householdSize"));
                                                                                                        if (!isNaN(dependents) && !isNaN(householdSize) && dependents > householdSize) {
                                                                                                                form.setValue("householdSize", (dependents + 1).toString());
                                                                                                        }
                                                                                                }}
                                                                                        />
                                                                                </FormControl>
                                                                                <FormMessage />
                                                                        </FormItem>
                                                                )}
                                                        />
                                                        <FormField
                                                                control={form.control}
                                                                name="typeOfDependents"
                                                                render={({ field }) => (
                                                                        <FormItem>
                                                                                <FormLabel>Type of Dependents</FormLabel>
                                                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                                        <FormControl>
                                                                                                <SelectTrigger>
                                                                                                        <SelectValue placeholder="Select type" />
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
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <FormField
                                                                control={form.control}
                                                                name="employmentStatus"
                                                                render={({ field }) => (
                                                                        <FormItem>
                                                                                <FormLabel>Employment Status</FormLabel>
                                                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                                        <FormControl>
                                                                                                <SelectTrigger>
                                                                                                        <SelectValue placeholder="Select status" />
                                                                                                </SelectTrigger>
                                                                                        </FormControl>
                                                                                        <SelectContent>
                                                                                                <SelectItem value="1">Unemployed</SelectItem>
                                                                                                <SelectItem value="2">Seasonally Employed</SelectItem>
                                                                                                <SelectItem value="3">Permanently Employed</SelectItem>
                                                                                                <SelectItem value="4">Self Employed</SelectItem>
                                                                                        </SelectContent>
                                                                                </Select>
                                                                                <FormMessage />
                                                                        </FormItem>
                                                                )}
                                                        />
                                                        <FormField
                                                                control={form.control}
                                                                name="disabilityStatus"
                                                                render={({ field }) => (
                                                                        <FormItem>
                                                                                <FormLabel>Disability Status</FormLabel>
                                                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                                        <FormControl>
                                                                                                <SelectTrigger>
                                                                                                        <SelectValue placeholder="Select status" />
                                                                                                </SelectTrigger>
                                                                                        </FormControl>
                                                                                        <SelectContent>
                                                                                                <SelectItem value="1">None</SelectItem>
                                                                                                <SelectItem value="2">Moderate</SelectItem>
                                                                                                <SelectItem value="3">Severe</SelectItem>
                                                                                        </SelectContent>
                                                                                </Select>
                                                                                <FormMessage />
                                                                        </FormItem>
                                                                )}
                                                        />
                                                        <FormField
                                                                control={form.control}
                                                                name="chronicIllnessStatus"
                                                                render={({ field }) => (
                                                                        <FormItem>
                                                                                <FormLabel>Chronic Illness Status</FormLabel>
                                                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                                        <FormControl>
                                                                                                <SelectTrigger>
                                                                                                        <SelectValue placeholder="Select status" />
                                                                                                </SelectTrigger>
                                                                                        </FormControl>
                                                                                        <SelectContent>
                                                                                                <SelectItem value="1">None</SelectItem>
                                                                                                <SelectItem value="2">Moderate</SelectItem>
                                                                                                <SelectItem value="3">Severe</SelectItem>
                                                                                        </SelectContent>
                                                                                </Select>
                                                                                <FormMessage />
                                                                        </FormItem>
                                                                )}
                                                        />
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <FormField
                                                                control={form.control}
                                                                name="householdSize"
                                                                render={({ field }) => (
                                                                        <FormItem>
                                                                                <FormLabel>Household Size</FormLabel>
                                                                                <FormControl>
                                                                                        <Input
                                                                                                type="number"
                                                                                                placeholder="Enter size"
                                                                                                {...field}
                                                                                                onChange={(e) => {
                                                                                                        field.onChange(e);
                                                                                                        const householdSize = parseInt(e.target.value);
                                                                                                        const dependents = parseInt(form.getValues("numberOfDependents"));
                                                                                                        if (!isNaN(dependents) && !isNaN(householdSize) && householdSize < dependents) {
                                                                                                                form.setValue("numberOfDependents", e.target.value);
                                                                                                        }
                                                                                                }}
                                                                                        />
                                                                                </FormControl>
                                                                                <FormMessage />
                                                                        </FormItem>
                                                                )}
                                                        />
                                                        <FormField
                                                                control={form.control}
                                                                name="countryOfOrigin"
                                                                render={({ field }) => (
                                                                        <FormItem>
                                                                                <FormLabel>Country of Origin</FormLabel>
                                                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                                        <FormControl>
                                                                                                <SelectTrigger>
                                                                                                        <SelectValue placeholder="Select country" />
                                                                                                </SelectTrigger>
                                                                                        </FormControl>
                                                                                        <SelectContent>
                                                                                                <SelectItem value="1">Local</SelectItem>
                                                                                                <SelectItem value="2">Foreign</SelectItem>
                                                                                        </SelectContent>
                                                                                </Select>
                                                                                <FormMessage />
                                                                        </FormItem>
                                                                )}
                                                        />
                                                        <FormField
                                                                control={form.control}
                                                                name="countryOfResidence"
                                                                render={({ field }) => (
                                                                        <FormItem>
                                                                                <FormLabel>Country of Residence</FormLabel>
                                                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                                        <FormControl>
                                                                                                <SelectTrigger>
                                                                                                        <SelectValue placeholder="Select country" />
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
                                                </div>
                                        </CardContent>
                                </Card>
                                <Button type="submit" className="w-full">Calculate Benefits</Button>
                        </form>
                </Form>
        )
}
