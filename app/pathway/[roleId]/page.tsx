// app/pathway/[roleId]/page.tsx
// Alexandria High-End Editorial - 7-Day Experiential Skill Tree Route (Server Component)

import PathwayClient from "@/components/dag/PathwayClient";

export const instant = false;

export default async function PathwayPage({
  params,
}: {
  params: Promise<{ roleId: string }>;
}) {
  const { roleId } = await params;
  return <PathwayClient roleId={roleId} />;
}
