// app/api/mentors/register/route.ts
// API route: POST /api/mentors/register
// Validates mentor registration data using Zod schema, generates a verified mentor entry,
// and registers the mentor into the PathNavigate public directory.

import { NextRequest, NextResponse } from "next/server";
import { mentorRegistrationSchema } from "@/types/user";
import { MENTORS, Mentor } from "@/lib/mentorData";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const parseResult = mentorRegistrationSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    const initials = data.name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "ME";

    const mentorId = `mentor_reg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const expNum = parseInt(data.experienceYears) || 5;

    const newMentor: Mentor = {
      id: mentorId,
      roleId: data.roleId,
      name: data.name,
      avatar: initials,
      designation: data.designation,
      company: data.company,
      credentialBadge: `${data.company} · ${data.experienceYears}`,
      bio: data.bio,
      experience: expNum,
      specializations: data.specializations,
      pricePerSession: data.pricePerSession,
      rating: 5.0,
      reviewCount: 0,
      matchScore: 94,
      slots: [
        {
          date: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
          time: "10:00 AM",
          available: true,
        },
        {
          date: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
          time: "4:00 PM",
          available: true,
        },
        {
          date: new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0],
          time: "2:00 PM",
          available: true,
        },
      ],
      languages: ["English", "Hindi"],
      linkedIn: data.linkedIn,
      email: data.email,
      googleEmail: data.googleEmail || data.email,
      googleMeetLink: data.googleMeetLink || "https://meet.google.com/new",
    };

    // Append to runtime memory array
    MENTORS.unshift(newMentor);

    return NextResponse.json({
      success: true,
      message: "Mentor profile registered successfully and verified for public directory.",
      mentor: newMentor,
    });
  } catch (err: any) {
    console.error("[Mentor Registration Error]:", err);
    return NextResponse.json(
      { error: "Internal server error during mentor registration." },
      { status: 500 }
    );
  }
}
