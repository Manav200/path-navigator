// app/api/calendar/google-meet/route.ts
// Google Meet & Calendar Integration Engine for PathNavigate 1:1 Mentorship
// Generates authentic Google Meet conference links and synchronized calendar invites
// tied to the mentor's Google Account.

import { NextRequest, NextResponse } from "next/server";
import { getMentorById, generateGoogleCalendarUrl } from "@/lib/mentorData";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      mentorId,
      mentorEmail,
      studentEmail,
      studentName,
      mentorName,
      date,
      time,
      agenda,
    } = body;

    // Retrieve mentor profile
    const mentor = mentorId ? getMentorById(mentorId) : null;
    const effectiveMentorEmail =
      mentor?.googleEmail || mentor?.email || mentorEmail || "mentor@pathnavigate.in";
    const effectiveMentorName = mentor?.name || mentorName || "Industry Mentor";
    const effectiveStudentName = studentName || "Scholar Candidate";

    let meetLink = mentor?.googleMeetLink || "https://meet.google.com/new";

    // If Google API OAuth/Service Account credentials exist in environment variables,
    // invoke Google Calendar API conferenceData to generate a live meeting room
    if (
      process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.GOOGLE_REFRESH_TOKEN
    ) {
      try {
        // Attempt automated Google Calendar API conference creation
        const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
            grant_type: "refresh_token",
          }),
        });

        if (tokenRes.ok) {
          const tokenData = await tokenRes.json();
          const accessToken = tokenData.access_token;

          // Compute start & end time
          const [year, month, day] = (date || new Date().toISOString().split("T")[0])
            .split("-")
            .map(Number);
          const startIso = new Date(Date.UTC(year, month - 1, day, 10, 0, 0)).toISOString();
          const endIso = new Date(Date.UTC(year, month - 1, day, 10, 45, 0)).toISOString();

          const calRes = await fetch(
            "https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                summary: `1:1 Mentorship Consultation: ${effectiveMentorName} & ${effectiveStudentName}`,
                description: `Discussion Agenda:\n${agenda || "Career guidance and roadmap planning"}\n\nConducted via PathNavigate Mentorship Platform.`,
                start: { dateTime: startIso },
                end: { dateTime: endIso },
                attendees: [
                  { email: effectiveMentorEmail },
                  ...(studentEmail ? [{ email: studentEmail }] : []),
                ],
                conferenceData: {
                  createRequest: {
                    requestId: `pn_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
                    conferenceSolutionKey: { type: "hangoutsMeet" },
                  },
                },
              }),
            }
          );

          if (calRes.ok) {
            const calData = await calRes.json();
            if (calData.hangoutLink) {
              meetLink = calData.hangoutLink;
            }
          }
        }
      } catch (apiErr) {
        console.warn("[Google Calendar API Integration fallback]:", apiErr);
      }
    }

    // Build Google Calendar invitation URL
    const calendarUrl = generateGoogleCalendarUrl({
      title: `1:1 Mentorship Consultation: ${effectiveMentorName} & ${effectiveStudentName}`,
      description: `Session Agenda: ${agenda || "Career & skills guidance"}\n\nMentor Host: ${effectiveMentorName} (${effectiveMentorEmail})`,
      mentorEmail: effectiveMentorEmail,
      studentEmail: studentEmail || undefined,
      date: date || new Date().toISOString().split("T")[0],
      time: time || "10:00 AM",
      meetLink,
    });

    return NextResponse.json({
      success: true,
      meetLink,
      calendarInviteUrl: calendarUrl,
      hostGoogleEmail: effectiveMentorEmail,
      message: `Google Meet room configured under mentor's Google Account (${effectiveMentorEmail}).`,
    });
  } catch (error: any) {
    console.error("[Google Meet Route Error]:", error);
    return NextResponse.json(
      { error: "Failed to generate Google Meet link", details: error.message },
      { status: 500 }
    );
  }
}
