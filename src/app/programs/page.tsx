
// src/app/programs/page.tsx
import { listEnhancedPrograms } from "@/lib/actions";
import { ProgramsPageContent } from "@/components/programs/programs-page-content";

export const runtime = 'edge';

export default async function ProgramsPage() {
        // Fetch data server-side
        const programs = await listEnhancedPrograms();

        return (
                <ProgramsPageContent programs={programs} />
        );
}
