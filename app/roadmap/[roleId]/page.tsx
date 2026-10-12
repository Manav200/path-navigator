// app/roadmap/[roleId]/page.tsx
// Alexandria High-End Editorial - Long-Term Career Progression Roadmap Page (Server Component)

import RoadmapClient from "@/components/roadmap/RoadmapClient";

export const instant = false;

export default async function RoadmapPage({
  params,
}: {
  params: Promise<{ roleId: string }>;
}) {
  const { roleId } = await params;
  return <RoadmapClient roleId={roleId} />;
}
