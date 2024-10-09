import { BenefitsQueryForm } from "@/components/forms/BenefitsQuery";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
        return (
                <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-b from-background to-secondary/20">
                        <div className="max-w-5xl w-full space-y-12 [background-size:59px_60px] bg-[radial-gradient(circle,_#000000_1px,_rgba(0,0,0,0)_1px)]">
                                <section className="flex flex-col gap-10 items-center justify-between">
                                        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                                                Social Protection Calculator
                                        </h1>
                                        <p className="text-xl text-muted-foreground max-w-[700px] mx-auto">
                                                Predict possible benefits for your target demographic and find gaps in minimum subsistence benefits.
                                        </p>
                                </section>

                                <Card className="w-full">
                                        <CardHeader>
                                                <CardTitle>Estimate Benefits</CardTitle>
                                                <CardDescription>Enter demographic information to calculate potential benefits.</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                                <BenefitsQueryForm />
                                        </CardContent>
                                </Card>

                                <section className="grid gap-6 sm:grid-cols-2">
                                        <Card>
                                                <CardHeader>
                                                        <CardTitle>Add Programs</CardTitle>
                                                        <CardDescription>Contribute to the social protection catalogue.</CardDescription>
                                                </CardHeader>
                                                <CardContent>
                                                        <Link href="/add-programs" passHref>
                                                                <Button className="w-full">Add New Program</Button>
                                                        </Link>
                                                </CardContent>
                                        </Card>

                                </section>
                        </div>
                </main>
        );
}
