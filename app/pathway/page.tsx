"use client";

// app/pathway/page.tsx
// Redirect fallback to recommended role or default 'software-engineer'

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getAssessment } from "@/lib/userStore";
import { PROFESSION_SLUGS } from "@/lib/questions";

export default function PathwayIndexPage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const activeUid = user?.uid || "guest_uid";
    const assessment = getAssessment(activeUid);

    if (assessment?.evaluation?.recommendedRoleId) {
      router.replace(`/pathway/${assessment.evaluation.recommendedRoleId}`);
    } else if (assessment?.topCareers?.[0]) {
      const topRole = assessment.topCareers[0] as keyof typeof PROFESSION_SLUGS;
      const slug = PROFESSION_SLUGS[topRole] || "software-engineer";
      router.replace(`/pathway/${slug}`);
    } else {
      router.replace("/pathway/software-engineer");
    }
  }, [user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
      <div className="w-10 h-10 rounded-full border-2 border-[#094cb2] border-t-transparent animate-spin" />
    </div>
  );
}
