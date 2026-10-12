# PathNavigate - Product Architecture & Context Spec

## Overview
PathNavigate is an AI-driven career discovery and DAG-based experiential learning ecosystem built for Indian students and professionals. It diagnoses genuine psychological fit, suggests realistic domain pivots, and provides a 7-day interactive learning node graph with real workplace micro-tasks.

## Primary User Personas
1. School Students (Class 9th/10th or Class 11th/12th with Stream selection)
2. College Students (Branch selection based on Indian higher education options)
3. Working Professionals (Seeking domain pivots or upskilling)
4. Unemployed Youth (Looking for structured career launching)

## Launch Professions (Phase 1 Domain Scope)
1. Software Engineer
2. Business Analyst
3. Lawyer
4. Doctor
5. Pharmacist

## Tech Stack Rules
- Frontend: Next.js 14+ (App Router), TypeScript, Tailwind CSS, Shadcn UI
- Authentication: Firebase Auth (`firebase/auth`) — Google SSO + Anonymous/Guest Auth
- DAG Visualizer: @xyflow/react (React Flow)
- Backend API: FastAPI (Python) or Next.js Route Handlers
- AI Engine: Llama 3 (via Groq/Together AI API with JSON mode output)
- State Management: Zustand + Firebase Auth State Listener (`onAuthStateChanged`)

## Page Architecture
- `/login` - Simple Google Sign-In & Guest Login page
- `/` - Landing Page (with Auth check)
- `/onboarding` - Multi-step persona and education baseline selection (saves to Firebase User ID)
- `/assessment` - 7 psychological diagnostic questions
- `/results` - AI evaluation (Top 5 Careers + Pivot Recommendation)
- `/pathway/[roleId]` - Interactive 7-Day DAG Skill Tree & Micro-project workspace
- `/roadmap/[roleId]` - Post-7-day advanced career progression
## Expanded Domain Scope

### Engineering & Technology
- Software / Full-Stack Engineer
- AI / Machine Learning Engineer
- Data Scientist
- Cybersecurity & Cloud Engineer
- Electronics & Embedded Systems Engineer (ECE)
- Mechanical & Robotics Engineer
- Civil & Structural Engineer

### Healthcare & Life Sciences
- Doctor / Clinical Practitioner
- Pharmacist / Pharmaceutical Analyst
- Biotechnology & Genomic Researcher

### Business, Finance & Management
- Business Analyst
- Product Manager
- Financial Analyst / Investment Specialist
- Management Consultant
- Digital Marketing & Growth Strategist

### Creative, Design & Legal
- UI/UX & Product Designer
- Lawyer / Corporate Legal Specialist

## Extended Stack Rules
- Payments: Razorpay API / Webhooks
- Calendar Scheduling: Cal.com API / Google Calendar OAuth

## Extended Page Architecture
- `/mentors/[roleId]` - Role-specific Mentor Directory
- `/mentors/book/[mentorId]` - Booking & Razorpay Payment Checkout
- `/dashboard/sessions` - Student Scheduled & Past Sessions Management

## Tech Stack Rules & Authentication
- User Roles: `student` | `mentor` (stored in Firebase User Profile / Auth State)

## Page Architecture
- `/register` - Role selection ("Student" vs "Mentor") and dedicated signup flow
- `/register/mentor` - Detailed Mentor Verification & Credentials Form
- `/profile` - Universal Profile Management Workspace (allows editing profile data anytime)
- `/mentors/[roleId]` - Dynamic Mentor Directory (powered by registered mentors)