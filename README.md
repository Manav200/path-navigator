# PathNavigate — Alexandria Curated Career Discovery & 1:1 Mentorship Ecosystem

<p align="center">
  <strong>AI-powered career diagnostic assessment, interactive 7-day DAG skill trees, and a vetted 1:1 mentorship marketplace with atomic slot locking and Razorpay payment integration.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.4-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TailwindCSS-v4-38bdf8?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Razorpay-Gateway-02042b?style=for-the-badge&logo=razorpay" alt="Razorpay" />
  <img src="https://img.shields.io/badge/Firebase-Auth-ffca28?style=for-the-badge&logo=firebase" alt="Firebase" />
  <img src="https://img.shields.io/badge/Groq-Llama%203-f55036?style=for-the-badge" alt="Groq" />
</p>

---

## 🌟 Key Highlights & Features

### 1. 🧠 AI Psychometric fit & Career Pivot Engine
- 7-question psychometric diagnostic assessment evaluating cognitive traits, risk tolerance, and analytical preference.
- Powered by **Llama 3** (via Groq Cloud SDK) returning structured JSON recommendations with role match scores and actionable pivot roadmaps.

### 2. 🌳 7-Day Experiential DAG Skill Trees
- Directed Acyclic Graph (DAG) interactive learning node visualizer built using **`@xyflow/react`** (React Flow).
- Daily experiential micro-tasks and industry project nodes across 5 launch professions:
  - Software / Full-Stack Engineer
  - Business Analyst / Corporate Strategist
  - Lawyer / Corporate Legal Specialist
  - Doctor / Clinical Practitioner
  - Pharmacist / Pharmaceutical Analyst

### 3. 🛡️ Atomic Concurrency Slot-Locking Engine
- **Double-Booking Prevention**: High-concurrency mutex engine ([`lib/slotLockEngine.ts`](file:///c:/Users/Lenovo/OneDrive/Desktop/PathNavigate/lib/slotLockEngine.ts)) guaranteeing atomic reservation locks across concurrent checkouts.
- **10-Minute Lock Protection**: Temporarily reserves a selected time slot while candidate completes Razorpay payment, automatically returning HTTP `409 Conflict` if another candidate attempts checkout.
- Automatic expiration and seamless lock handover.

### 4. 💳 Razorpay Payment Gateway Integration
- **Server SDK**: Initialized via [`lib/razorpay.ts`](file:///c:/Users/Lenovo/OneDrive/Desktop/PathNavigate/lib/razorpay.ts) with full type-safety.
- **Orders API**: [`app/api/checkout/create-order/route.ts`](file:///c:/Users/Lenovo/OneDrive/Desktop/PathNavigate/app/api/checkout/create-order/route.ts) creates compliant Razorpay Orders with session metadata.
- **Cryptographic Signature Verification**: [`app/api/checkout/verify/route.ts`](file:///c:/Users/Lenovo/OneDrive/Desktop/PathNavigate/app/api/checkout/verify/route.ts) performs constant-time HMAC-SHA256 signature verification.
- **Webhook Handler**: [`app/api/checkout/webhook/route.ts`](file:///c:/Users/Lenovo/OneDrive/Desktop/PathNavigate/app/api/checkout/webhook/route.ts) processes asynchronous `payment.captured` and `order.paid` events.
- **Client Checkout**: [`components/checkout/RazorpayCheckoutButton.tsx`](file:///c:/Users/Lenovo/OneDrive/Desktop/PathNavigate/components/checkout/RazorpayCheckoutButton.tsx) dynamically loads `checkout.js` with an editorial brand overlay and sandbox simulator.

### 5. 📅 Google Meet & Calendar Integration
- Live video meetings generated and attributed to the mentor's authenticated Google Account.
- One-click synchronized Google Calendar invitation link (`calendar.google.com/calendar/render?action=TEMPLATE...`) pre-populated with mentor, student, and Google Meet room details.

### 6. 👤 Dual Persona & Universal Profile Workspace
- Dedicated **Student** and **Mentor** profiles managed via Zustand store ([`store/useAuthUserStore.ts`](file:///c:/Users/Lenovo/OneDrive/Desktop/PathNavigate/store/useAuthUserStore.ts)).
- Dynamic mentor onboarding form ([`/register/mentor`](file:///c:/Users/Lenovo/OneDrive/Desktop/PathNavigate/app/register/mentor/page.tsx)) and unified profile workspace ([`/profile`](file:///c:/Users/Lenovo/OneDrive/Desktop/PathNavigate/app/profile/page.tsx)).
- Dedicated host dashboards for candidate sessions ([`/dashboard/sessions`](file:///c:/Users/Lenovo/OneDrive/Desktop/PathNavigate/app/dashboard/sessions/page.tsx) and [`/dashboard/mentor/sessions`](file:///c:/Users/Lenovo/OneDrive/Desktop/PathNavigate/app/dashboard/mentor/sessions/page.tsx)).

---

## 🏗️ Architecture & Directory Layout

```
PathNavigate/
├── app/
│   ├── api/
│   │   ├── calendar/google-meet/     # Google Calendar API integration endpoint
│   │   ├── checkout/
│   │   │   ├── create-order/         # Atomic lock & Razorpay Order creation
│   │   │   ├── lock-slot/            # Concurrency slot mutex validation
│   │   │   ├── verify/               # Server-side HMAC-SHA256 signature verifier
│   │   │   └── webhook/              # Razorpay payment.captured & order.paid webhook
│   │   └── mentors/register/         # Mentor verification & directory ingestion
│   ├── dashboard/
│   │   ├── sessions/                 # Student session management & meet launcher
│   │   └── mentor/sessions/          # Mentor host workspace & agenda notes
│   ├── mentors/
│   │   ├── [roleId]/                 # Filterable role-specific mentor directory
│   │   └── book/[mentorId]/          # Slot selection & Razorpay checkout
│   ├── pathway/[roleId]/             # 7-day DAG interactive learning node tree
│   ├── profile/                      # Universal student/mentor profile management
│   ├── register/mentor/              # Detailed mentor verification onboarding
│   ├── layout.tsx                    # Root editorial layout & navigation
│   └── page.tsx                      # Platform landing page & assessment CTA
├── components/
│   ├── checkout/
│   │   └── RazorpayCheckoutButton.tsx # Client component with dynamic checkout.js loader
│   ├── mentors/
│   │   └── SlotGrid.tsx              # Interactive slot grid with real-time lock status
│   └── pathway/                      # DAG node graph components (@xyflow/react)
├── lib/
│   ├── mentorData.ts                 # Mentor roster, pricing helpers & calendar link engine
│   ├── razorpay.ts                   # Razorpay SDK instance & HMAC verifiers
│   └── slotLockEngine.ts             # Mutex lock engine with 10-minute expirations
├── store/
│   └── useAuthUserStore.ts           # Zustand store for profiles & authentication
├── types/
│   ├── razorpay.d.ts                 # Global TypeScript definitions for Razorpay SDK
│   └── user.ts                       # Zod validation schemas for student/mentor profiles
├── .env.example                      # Environment variables template
├── CONTEXT.md                        # Product architecture specification
└── README.md                         # Project documentation
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.17+ or v20+ recommended
- **npm**: v9+ (or pnpm / yarn)

### 2. Clone the Repository
```bash
git clone https://github.com/Manav200/path-navigator.git
cd path-navigator
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Copy `.env.example` to create your local `.env.local`:
```bash
cp .env.example .env.local
```

Open `.env.local` and add your credentials:
```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project

# Groq (AI Diagnostics)
GROQ_API_KEY=gsk_your_groq_key

# Razorpay (Payment Gateway)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_or_live_key
RAZORPAY_KEY_SECRET=your_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

### 5. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚡ Razorpay Setup & Webhooks

### A. Testing Locally with Webhooks
Since Razorpay's servers need a publicly accessible HTTPS endpoint to deliver webhooks, use **localtunnel** or **ngrok**:

```bash
# Using localtunnel (no sign-up required)
npx localtunnel --port 3000
```
This generates a public forwarding URL (e.g. `https://your-tunnel.loca.lt`).

### B. Setting Webhook in Razorpay Dashboard
1. Log in to your [Razorpay Dashboard](https://dashboard.razorpay.com/) (Test or Live mode).
2. Go to **Settings** → **Webhooks** → **+ Add New Webhook**.
3. Fill in:
   - **Webhook URL**: `https://your-tunnel.loca.lt/api/checkout/webhook` *(or `https://yourdomain.com/api/checkout/webhook` in production)*
   - **Secret**: Set a secure secret string (and paste the identical value into `RAZORPAY_WEBHOOK_SECRET` in `.env.local`).
   - **Active Events**:
     - `payment.captured`
     - `order.paid`
4. Click **Create Webhook**.

---

## 🧪 Verification & Type-Check

To verify complete TypeScript type safety across all routes and components:
```bash
npx tsc --noEmit
```

To build for production:
```bash
npm run build
```

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.
