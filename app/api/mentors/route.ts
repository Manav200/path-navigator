// app/api/mentors/route.ts
// API route: GET /api/mentors?roleId=software-engineer&maxPrice=700&minExp=5
// Returns filtered mentor list from the vetted roster.

import { NextRequest, NextResponse } from "next/server";
import { MENTORS } from "@/lib/mentorData";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const roleId = searchParams.get("roleId");
  const maxPrice = searchParams.get("maxPrice");
  const minExp = searchParams.get("minExp");
  const company = searchParams.get("company");

  let mentors = [...MENTORS];

  if (roleId) {
    mentors = mentors.filter((m) => m.roleId === roleId);
  }
  if (maxPrice) {
    mentors = mentors.filter((m) => m.pricePerSession <= Number(maxPrice));
  }
  if (minExp) {
    mentors = mentors.filter((m) => m.experience >= Number(minExp));
  }
  if (company) {
    mentors = mentors.filter((m) =>
      m.company.toLowerCase().includes(company.toLowerCase())
    );
  }

  // Strip slot details from list view for performance
  const sanitized = mentors.map(({ slots: _slots, ...rest }) => rest);

  return NextResponse.json({ mentors: sanitized, total: sanitized.length });
}
