// src/components/programs/search-bar.tsx
"use client"

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
        onSearchAction: (query: string) => void;
}

export function SearchBar({ onSearchAction }: SearchBarProps) {
        return (
                <div className="relative w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                                placeholder="Search programs..."
                                onChange={(e) => onSearchAction(e.target.value)}
                                className="pl-8"
                        />
                </div>
        );
}
