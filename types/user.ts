// types/user.ts
// Data types and Zod validation schemas for PathNavigate User Profiles (Student & Mentor).

import { z } from "zod";

export type UserRole = "student" | "mentor";

// ── Student Profile Schema & Types ──────────────────────────────────────────

export const studentProfileSchema = z.object({
  id: z.string().default("student_default"),
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Valid email address is required"),
  avatar: z.string().optional().default("ST"),
  bio: z.string().max(400, "Bio cannot exceed 400 characters").optional().default(""),
  degree: z.string().optional().default("B.Tech / Undergraduate"),
  stream: z.string().optional().default("Computer Science & Engineering"),
  institution: z.string().optional().default(""),
  targetRole: z.string().optional().default("Software Engineer"),
  interests: z.array(z.string()).default([]),
  assessmentScore: z.number().optional().default(88),
  completedTasks: z.number().optional().default(0),
});

export type StudentProfile = z.infer<typeof studentProfileSchema>;

// ── Mentor Registration & Profile Schemas ───────────────────────────────────

export const mentorRegistrationSchema = z.object({
  name: z.string().min(2, "Full Name is required"),
  email: z.string().email("Valid work or contact email is required"),
  googleEmail: z.string().email("Valid Google account email is required").optional().or(z.literal("")),
  googleMeetLink: z.string().optional().or(z.literal("")),
  designation: z.string().min(2, "Current Role / Designation is required"),
  company: z.string().min(2, "Current Company / Organization is required"),
  experienceYears: z.string().default("5-10 Years"),
  roleId: z.string().min(1, "Please choose your primary launch profession"),
  bio: z
    .string()
    .min(10, "Bio should be at least 10 characters")
    .max(800, "Bio cannot exceed 800 characters"),
  linkedIn: z
    .string()
    .min(3, "Please enter your LinkedIn profile URL or handle"),
  specializations: z
    .array(z.string())
    .min(1, "Please add at least one core skill or specialization"),
  pricePerSession: z
    .number({ error: "Session fee must be a number" })
    .min(0, "Session fee must be 0 or greater"),
  currency: z.enum(["INR", "USD"]).default("INR"),
  availabilitySlots: z
    .array(z.string())
    .default(["Sat Morning (9:00 AM – 1:00 PM)", "Sun Morning (9:00 AM – 1:00 PM)"]),
  isAcceptingBookings: z.boolean().default(true),
});

export type MentorRegistrationInput = z.infer<typeof mentorRegistrationSchema>;

export const mentorProfileSchema = mentorRegistrationSchema.extend({
  id: z.string(),
  avatar: z.string().default("ME"),
  credentialBadge: z.string(),
  rating: z.number().default(5.0),
  reviewCount: z.number().default(0),
  joinedAt: z.number().default(() => Date.now()),
});

export type MentorProfile = z.infer<typeof mentorProfileSchema>;
