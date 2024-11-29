'use client'

import * as React from "react"
import Link from "next/link"
import { Calculator } from "lucide-react"

import {
        NavigationMenu,
        NavigationMenuItem,
        NavigationMenuLink,
        NavigationMenuList,
        navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { SearchCommand } from "./SearchCommand"
import { ModeToggle } from "./mode-toggle"

export function SocialProtectionNavigation() {
        return (

                <nav className="flex justify-between items-center px-5 py-4 sticky top-0 w-full bg-gradient-to-b from-white/60 via-white/50 to-transparent backdrop-blur-md supports-[backdrop-filter]:bg-white/30 z-50 border-b border-transparent">
                        <Link href="/" className="text-xl font-bold flex items-center">
                                <Calculator className="mr-2" />
                                Social Protection Calculator
                        </Link>
                        <NavigationMenu>
                                <NavigationMenuList>
                                        <NavigationMenuItem>
                                                <Link href="/programs" legacyBehavior passHref>
                                                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                                                Current Programs
                                                        </NavigationMenuLink>
                                                </Link>
                                        </NavigationMenuItem>
                                </NavigationMenuList>
                        </NavigationMenu>
                        <div className="flex items-center space-x-4">
                                <SearchCommand />
                                <ModeToggle />
                        </div>
                </nav>
        )
}
