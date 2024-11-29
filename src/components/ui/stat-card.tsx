// src/components/ui/stat-card.tsx
import { LucideIcon } from "lucide-react";
import { Card } from "./card";

interface StatCardProps {
        title: string;
        value: number | string;
        icon: LucideIcon;
        description?: string;
}

export function StatCard({ title, value, icon: Icon, description }: StatCardProps) {
        return (
                <Card className="overflow-hidden">
                        <div className="flex items-center gap-4 p-6">
                                <div className="rounded-full p-3 bg-primary/10">
                                        <Icon className="h-6 w-6 text-primary" />
                                </div>
                                <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">{title}</p>
                                        <p className="text-2xl font-bold">{value}</p>
                                        {description && (
                                                <p className="text-sm text-muted-foreground">{description}</p>
                                        )}
                                </div>
                        </div>
                </Card>
        );
}
