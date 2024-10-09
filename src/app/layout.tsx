import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SocialProtectionNavigation } from "@/components/SocialProtectionNavigation";
import { Suspense } from "react";

const geistSans = localFont({
        src: "./fonts/GeistVF.woff",
        variable: "--font-geist-sans",
        weight: "100 900",
});
const geistMono = localFont({
        src: "./fonts/GeistMonoVF.woff",
        variable: "--font-geist-mono",
        weight: "100 900",
});

export const metadata: Metadata = {
        title: "Social Protection Calculator",
        description: "Predict benificiary benefits",
};

export default function RootLayout({
        children,
}: Readonly<{
        children: React.ReactNode;
}>) {
        const programs = [
                { title: 'Cash Transfer Program', slug: 'cash-transfer' },
                { title: 'Food Assistance', slug: 'food-assistance' },
                // Add more programs as needed
        ]
        return (
                <html lang="en">
                        <body
                                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                        >
                                <SocialProtectionNavigation programs={programs} />
                                <Suspense>
                                        {children}
                                </Suspense>
                        </body>
                </html>
        );
}
