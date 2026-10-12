// app/mentors/[roleId]/page.tsx
// Alexandria High-End Editorial — Role-Specific Mentor Directory
// "Editorial Access — Connect 1:1 with Senior Practitioners"

// useParams() reads URL data only available at request time, so this route
// cannot be instant. Exporting `instant = false` opts it out of that validation.
export const instant = false;

import { Suspense } from "react";
import MentorDirectoryClient from "./MentorDirectoryClient";

export default function MentorDirectoryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 rounded-full border-2 border-[#094cb2]/30 border-t-[#094cb2] animate-spin mx-auto" />
            <p className="font-sans text-sm text-slate-500">Loading mentors…</p>
          </div>
        </div>
      }
    >
      <MentorDirectoryClient />
    </Suspense>
  );
}

