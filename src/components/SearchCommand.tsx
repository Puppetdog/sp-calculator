import * as React from "react"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
        CommandDialog,
        CommandEmpty,
        CommandGroup,
        CommandInput,
        CommandItem,
        CommandList,
} from "@/components/ui/command"

const links = [
        {
                group: "Pages",
                items: [
                        { name: "Home", href: "/" },
                        { name: "Estimate Benefits", href: "/estimate-benefits" },
                        { name: "Add Programs", href: "/add-programs" },
                        { name: "Benefit Displayer", href: "/benefit-displayer" },
                ],
        },
        {
                group: "Programs",
                items: [
                        { name: "Cash Transfer Program", href: "/programs/cash-transfer" },
                        { name: "Food Assistance", href: "/programs/food-assistance" },
                        { name: "Public Works", href: "/programs/public-works" },
                        { name: "Healthcare Subsidy", href: "/programs/healthcare-subsidy" },
                ],
        },
]

export function SearchCommand() {
        const [open, setOpen] = React.useState(false)
        const router = useRouter()

        React.useEffect(() => {
                const down = (e: KeyboardEvent) => {
                        if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                                e.preventDefault()
                                setOpen((open) => !open)
                        }
                }

                document.addEventListener("keydown", down)
                return () => document.removeEventListener("keydown", down)
        }, [])

        const runCommand = React.useCallback((command: () => unknown) => {
                setOpen(false)
                command()
        }, [])

        return (
                <>
                        <Button
                                variant="outline"
                                className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
                                onClick={() => setOpen(true)}
                        >
                                <Search className="h-4 w-4 xl:mr-2" aria-hidden="true" />
                                <span className="hidden xl:inline-flex">Search programs...</span>
                                <span className="sr-only">Search programs</span>
                                <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
                                        <span className="text-xs">⌘</span>K
                                </kbd>
                        </Button>
                        <CommandDialog open={open} onOpenChange={setOpen}>
                                <CommandInput placeholder="Search for pages or programs..." />
                                <CommandList>
                                        <CommandEmpty>No results found.</CommandEmpty>
                                        {links.map((section) => (
                                                <CommandGroup key={section.group} heading={section.group}>
                                                        {section.items.map((item) => (
                                                                <CommandItem
                                                                        key={item.href}
                                                                        onSelect={() => runCommand(() => router.push(item.href))}
                                                                >
                                                                        {item.name}
                                                                </CommandItem>
                                                        ))}
                                                </CommandGroup>
                                        ))}
                                </CommandList>
                        </CommandDialog>
                </>
        )
}
