import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
        Tooltip,
        TooltipContent,
        TooltipProvider,
        TooltipTrigger,
} from "@/components/ui/tooltip"
import { ExternalLink, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import HeroSection from "@/components/HeroCalculator"
import { BenefitsQueryForm } from "@/components/forms/BenefitsQuery"

export const runtime = 'edge'
const sponsors = [
        {
                name: "Catholic Relief Services",
                logo: "/crs.png",
                website: "https://www.crs.org",
                description: "Catholic Relief Services is the official international humanitarian agency of the United States Catholic community. CRS works to assist impoverished and disadvantaged people worldwide.",
                category: "Lead Partner",
                initiatives: [
                        "Emergency Response",
                        "Agriculture",
                        "Health",
                        "Education"
                ]
        },
        {
                name: "Collaborative Cash Delivery Network",
                logo: "/ccd.jpg",
                website: "https://www.ccdnetwork.org",
                description: "The Collaborative Cash Delivery Network is a consortium of leading international NGOs working together to deliver cash assistance more efficiently and effectively to people affected by crisis.",
                category: "Technical Partner",
                initiatives: [
                        "Cash Transfer Programs",
                        "Digital Payments",
                        "Program Coordination",
                        "Local Partnerships"
                ]
        },
        {
                name: "Caritas Antilles",
                logo: "/caritas.jpg",
                website: "https://www.caritasantilles.org",
                description: "Caritas Antilles serves the Caribbean region through social service programs, disaster response, and community development initiatives.",
                category: "Implementing Agency",
                initiatives: [
                        "Social Services",
                        "Disaster Response",
                        "Community Development",
                        "Pastoral Care"
                ]
        }
]
export default function Home() {
        return (
                <main className="flex flex-col min-h-screen bg-gradient-to-b from-background to-secondary/20 m-0 p-0">
                        <HeroSection />
                        <div className="flex-1 p-24">

                                <Card className="w-full">
                                        <CardHeader>
                                                <CardTitle>Estimate Benefits</CardTitle>
                                                <CardDescription>Enter demographic information to calculate potential benefits.</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                                <BenefitsQueryForm />
                                        </CardContent>
                                </Card>

                        </div>

                        {/* Sponsor Footer */}
                        <footer className="w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                                <div className="container mx-auto py-12 px-4">
                                        <div className="flex flex-col items-center gap-8">
                                                <div className="text-center">
                                                        <h2 className="text-2xl font-bold tracking-tight">Our Partners</h2>
                                                        <p className="text-muted-foreground mt-2">
                                                                Making social protection accessible through collaboration
                                                        </p>
                                                </div>

                                                <TooltipProvider>
                                                        <div className="grid gap-8 md:grid-cols-3">
                                                                {sponsors.map((sponsor, index) => (
                                                                        <div
                                                                                key={sponsor.name}
                                                                                className={cn(
                                                                                        "relative group p-6 rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-lg",
                                                                                        "animate-in slide-in-from-bottom-4",
                                                                                        "hover:scale-[1.02]"
                                                                                )}
                                                                                style={{
                                                                                        animationDelay: `${index * 150}ms`,
                                                                                        animationFillMode: "backwards"
                                                                                }}
                                                                        >
                                                                                <div className="absolute -top-3 left-4 px-2 py-1 bg-primary/10 rounded-full text-xs font-medium">
                                                                                        {sponsor.category}
                                                                                </div>

                                                                                <div className="flex flex-col items-center gap-4">
                                                                                        <Link
                                                                                                href={sponsor.website}
                                                                                                target="_blank"
                                                                                                rel="noopener noreferrer"
                                                                                                className="relative group/logo"
                                                                                        >
                                                                                                <div className="relative overflow-hidden rounded-lg p-4">
                                                                                                        <img
                                                                                                                src={sponsor.logo}
                                                                                                                alt={sponsor.name}
                                                                                                                className="h-16 w-auto object-contain transition-transform duration-300 group-hover/logo:scale-110"
                                                                                                        />
                                                                                                        <div className="absolute inset-0 bg-gradient-to-t from-background/10 to-transparent opacity-0 transition-opacity duration-300 group-hover/logo:opacity-100" />
                                                                                                </div>

                                                                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover/logo:opacity-100">
                                                                                                        <span className="text-sm font-medium flex items-center gap-1">
                                                                                                                Visit Website <ExternalLink className="h-3 w-3" />
                                                                                                        </span>
                                                                                                </div>
                                                                                        </Link>

                                                                                        <div className="space-y-2 text-center">
                                                                                                <h3 className="font-semibold">{sponsor.name}</h3>
                                                                                                <p className="text-sm text-muted-foreground">
                                                                                                        {sponsor.description}
                                                                                                </p>
                                                                                        </div>

                                                                                        <div className="w-full">
                                                                                                <Tooltip>
                                                                                                        <TooltipTrigger asChild>
                                                                                                                <div className="flex items-center gap-2 text-sm text-muted-foreground cursor-help">
                                                                                                                        <Info className="h-4 w-4" />
                                                                                                                        Key Initiatives
                                                                                                                </div>
                                                                                                        </TooltipTrigger>
                                                                                                        <TooltipContent side="bottom" className="max-w-[300px]">
                                                                                                                <ul className="list-disc pl-4 space-y-1">
                                                                                                                        {sponsor.initiatives.map((initiative) => (
                                                                                                                                <li key={initiative}>{initiative}</li>
                                                                                                                        ))}
                                                                                                                </ul>
                                                                                                        </TooltipContent>
                                                                                                </Tooltip>

                                                                                                <div className="mt-2 flex flex-wrap gap-2">
                                                                                                        {sponsor.initiatives.map((initiative) => (
                                                                                                                <span
                                                                                                                        key={initiative}
                                                                                                                        className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium transition-colors hover:bg-primary/20"
                                                                                                                >
                                                                                                                        {initiative}
                                                                                                                </span>
                                                                                                        ))}
                                                                                                </div>
                                                                                        </div>
                                                                                </div>
                                                                        </div>
                                                                ))}
                                                        </div>
                                                </TooltipProvider>

                                                <div className="flex flex-col items-center gap-4 mt-8 text-center">
                                                        <div className="h-px w-full max-w-md bg-border" />
                                                        <p className="text-sm text-muted-foreground">
                                                                Together, we are strengthening social protection systems across the Caribbean
                                                        </p>
                                                        <div className="text-xs text-muted-foreground">
                                                                © 2024 Social Protection Calculator. All rights reserved.
                                                        </div>
                                                </div>
                                        </div>
                                </div>
                        </footer>
                </main >
        )
}
