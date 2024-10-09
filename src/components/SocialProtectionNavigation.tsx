'use client'

import * as React from "react"
import Link from "next/link"
import { Calculator, Search } from "lucide-react"

import {
        NavigationMenu,
        NavigationMenuItem,
        NavigationMenuLink,
        NavigationMenuList,
        NavigationMenuTrigger,
        NavigationMenuContent,
        navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { SearchCommand } from "./SearchCommand"
import { ModeToggle } from "./mode-toggle"

type Program = {
        title: string;
        slug: string;
}

type NavigationMenuProps = {
        programs: Program[];
}

const mainPages: { href: string, title: string }[] = [
        { title: 'Add Programs', href: '/add-programs' },
]

export function SocialProtectionNavigation({ programs }: NavigationMenuProps) {
        return (
                <nav className="flex justify-between items-center px-5 py-4 sticky top-0 w-full bg-background">
                        <Link href="/" className="text-xl font-bold flex items-center">
                                <Calculator className="mr-2" />
                                Social Protection Calculator
                        </Link>
                        <NavigationMenu>
                                <NavigationMenuList>
                                        {mainPages.map((page) => (
                                                <NavigationMenuItem key={page.title}>
                                                        <Link href={page.href} legacyBehavior passHref>
                                                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                                                        {page.title}
                                                                </NavigationMenuLink>
                                                        </Link>
                                                </NavigationMenuItem>
                                        ))}
                                        <NavigationMenuItem>
                                                <NavigationMenuTrigger>Programs</NavigationMenuTrigger>
                                                <NavigationMenuContent>
                                                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                                                {programs.map((program) => (
                                                                        <ListItem
                                                                                key={program.slug}
                                                                                title={program.title}
                                                                                href={`/programs/${program.slug}`}
                                                                        >
                                                                                View details for {program.title}
                                                                        </ListItem>
                                                                ))}
                                                        </ul>
                                                </NavigationMenuContent>
                                        </NavigationMenuItem>
                                </NavigationMenuList>
                        </NavigationMenu>
                        <div className="flex items-center space-x-4">
                                <SearchCommand />
                                <Link href="https://github.com/your-repo" target="_blank" rel="noopener noreferrer">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
                                </Link>
                                <ModeToggle />
                        </div>
                </nav>
        )
}

const ListItem = React.forwardRef<
        React.ElementRef<"a">,
        React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
        return (
                <li>
                        <NavigationMenuLink asChild>
                                <a
                                        ref={ref}
                                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                        {...props}
                                >
                                        <div className="text-sm font-medium leading-none">{title}</div>
                                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                                {children}
                                        </p>
                                </a>
                        </NavigationMenuLink>
                </li>
        )
})
ListItem.displayName = "ListItem"
