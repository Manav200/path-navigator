// store/useAuthUserStore.ts
// Zustand store managing user roles, profiles, and persistence for PathNavigate.
// Supports both Student and Mentor profiles with localStorage persistence.

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  UserRole,
  StudentProfile,
  MentorProfile,
  MentorRegistrationInput,
} from "@/types/user";
import { saveRegisteredMentor, Mentor } from "@/lib/mentorData";

interface AuthUserState {
  role: UserRole;
  isAuthenticated: boolean;
  studentProfile: StudentProfile;
  mentorProfile: MentorProfile | null;

  // Actions
  setRole: (role: UserRole) => void;
  updateStudentProfile: (partial: Partial<StudentProfile>) => void;
  updateMentorProfile: (partial: Partial<MentorProfile>) => void;
  registerMentor: (data: MentorRegistrationInput) => MentorProfile;
  logout: () => void;
}

const DEFAULT_STUDENT: StudentProfile = {
  id: "student_default_01",
  name: "Aarav Mehta",
  email: "aarav.mehta@university.edu",
  avatar: "AM",
  bio: "Final-year computer science undergrad focused on scalable cloud architecture, backend systems, and high-performance computing.",
  degree: "B.Tech Computer Science",
  stream: "Distributed Systems & Cloud",
  institution: "IIT Delhi",
  targetRole: "Software Engineer",
  interests: ["Distributed Systems", "Full-Stack Architecture", "System Design", "AI Models"],
  assessmentScore: 92,
  completedTasks: 4,
};

export const DEFAULT_MENTOR: MentorProfile = {
  id: "mentor_default_01",
  name: "Dr. Vikram Patel",
  email: "vikram.patel@lead.com",
  googleEmail: "vikram.patel.mentorship@gmail.com",
  googleMeetLink: "https://meet.google.com/new",
  avatar: "VP",
  designation: "VP of Engineering",
  company: "Razorpay",
  credentialBadge: "Razorpay · 10+ Years",
  experienceYears: "10+ Years",
  roleId: "software-engineer",
  bio: "12+ years building low-latency payment infrastructure and engineering teams.",
  linkedIn: "https://linkedin.com/in/vikrampatel",
  specializations: ["System Design", "Distributed Systems", "Payments Architecture"],
  pricePerSession: 799,
  currency: "INR",
  availabilitySlots: [
    "Sat Morning (9:00 AM – 1:00 PM)",
    "Sun Morning (9:00 AM – 1:00 PM)",
  ],
  isAcceptingBookings: true,
  rating: 5.0,
  reviewCount: 0,
  joinedAt: Date.now(),
};

export const useAuthUserStore = create<AuthUserState>()(
  persist(
    (set, get) => ({
      role: "student",
      isAuthenticated: true,
      studentProfile: DEFAULT_STUDENT,
      mentorProfile: DEFAULT_MENTOR,

      setRole: (role: UserRole) => {
        set({ role });
      },

      updateStudentProfile: (partial: Partial<StudentProfile>) => {
        set((state) => ({
          studentProfile: {
            ...(state.studentProfile || DEFAULT_STUDENT),
            ...partial,
          },
        }));
      },

      updateMentorProfile: (partial: Partial<MentorProfile>) => {
        set((state) => {
          const base = state.mentorProfile || DEFAULT_MENTOR;
          const updated: MentorProfile = {
            ...base,
            ...partial,
            credentialBadge:
              partial.company && partial.experienceYears
                ? `${partial.company} · ${partial.experienceYears}`
                : base.credentialBadge,
          };

          // Also update in registered mentor database if ID exists
          const mentorCard: Mentor = {
            id: updated.id,
            roleId: updated.roleId || "software-engineer",
            name: updated.name,
            avatar: updated.avatar || "ME",
            designation: updated.designation,
            company: updated.company,
            credentialBadge: updated.credentialBadge,
            bio: updated.bio,
            experience: parseInt(updated.experienceYears) || 5,
            specializations: updated.specializations || ["System Design"],
            pricePerSession: updated.pricePerSession,
            rating: updated.rating || 5.0,
            reviewCount: updated.reviewCount || 0,
            matchScore: 95,
            slots: [],
            languages: ["English", "Hindi"],
            linkedIn: updated.linkedIn,
            email: updated.email,
            googleEmail: updated.googleEmail || updated.email,
            googleMeetLink: updated.googleMeetLink || "https://meet.google.com/new",
          };
          saveRegisteredMentor(mentorCard);

          return { mentorProfile: updated, role: "mentor" };
        });
      },

      registerMentor: (data: MentorRegistrationInput) => {
        const initials = data.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2) || "ME";

        const expNum = parseInt(data.experienceYears) || 5;
        const mentorId = `mentor_reg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

        const profile: MentorProfile = {
          ...data,
          id: mentorId,
          avatar: initials,
          credentialBadge: `${data.company} · ${data.experienceYears}`,
          googleEmail: data.googleEmail || data.email,
          googleMeetLink: data.googleMeetLink || "https://meet.google.com/new",
          rating: 5.0,
          reviewCount: 0,
          joinedAt: Date.now(),
        };

        // Sync with public mentor directory
        const mentorCard: Mentor = {
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
          matchScore: 95,
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

        saveRegisteredMentor(mentorCard);

        set({
          role: "mentor",
          isAuthenticated: true,
          mentorProfile: profile,
        });

        return profile;
      },

      logout: () => {
        set({
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "pathnavigate_user_auth_v1",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
