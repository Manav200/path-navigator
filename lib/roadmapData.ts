// lib/roadmapData.ts
// Comprehensive 3-Horizon Long-Term Career Progression Schemas
// Phase 4: Post-7-Day Advanced Roadmap Engine

export interface RoadmapMilestone {
  title: string;
  description: string;
  duration?: string;
}

export interface RoadmapHorizon {
  label: string;
  theme: string;
  icon: string;
  colorClass: string;
  milestones: RoadmapMilestone[];
  tools: string[];
  certifications: string[];
}

export interface CapstoneProject {
  title: string;
  description: string;
  deliverable: string;
  tags: string[];
}

export interface RegulatoryPrerequisite {
  body: string;
  requirement: string;
  isBlocking: boolean;
  notes?: string;
}

export interface CareerRoadmap {
  roleId: string;
  roleTitle: string;
  roleIcon: string;
  tagline: string;
  horizons: [RoadmapHorizon, RoadmapHorizon, RoadmapHorizon];
  regulatory: RegulatoryPrerequisite[];
  capstoneProjects: CapstoneProject[];
  salaryRange: { entry: string; mid: string; senior: string };
  topCompanies: string[];
}

// ─── Helper: Generic Tech Engineering Roadmap ─────────────────────────────────

function makeTechRoadmap(
  roleId: string, roleTitle: string, icon: string, tagline: string,
  h1Tools: string[], h1Certs: string[],
  h2Projects: string[], h3Focus: string[],
  capstones: CapstoneProject[],
  salary: CareerRoadmap["salaryRange"], companies: string[],
): CareerRoadmap {
  return {
    roleId, roleTitle, roleIcon: icon, tagline,
    horizons: [
      {
        label: "Next 3 Months", theme: "Core Foundations & Toolchain Mastery", icon: "🧱",
        colorClass: "from-violet-600 to-indigo-600",
        milestones: [
          { title: "Domain Fundamentals Deep-Dive", description: "Complete structured study of core concepts, algorithms, and frameworks relevant to your target role.", duration: "Weeks 1–4" },
          { title: "Toolchain Setup & First Projects", description: "Configure your environment and build 2–3 small working artefacts using primary tools.", duration: "Weeks 3–8" },
          { title: "Certification Sprint", description: "Enrol and complete at least one recognized industry certification to validate foundational skills.", duration: "Weeks 6–12" },
        ],
        tools: h1Tools, certifications: h1Certs,
      },
      {
        label: "3–6 Months", theme: "Portfolio Construction & Industry Exposure", icon: "🚀",
        colorClass: "from-cyan-600 to-teal-600",
        milestones: [
          { title: "Portfolio Capstone Build", description: "Develop 2–3 portfolio-quality projects that solve real problems with clean documentation and version control.", duration: "Months 3–4" },
          { title: "Open-Source Contributions", description: "Contribute meaningful pull requests to 1–2 active open-source repositories.", duration: "Month 4–5" },
          { title: "Internship / Freelance Engagement", description: "Secure a structured internship or paid freelance project to gain live team experience.", duration: "Month 5–6" },
          { title: `Domain Case Studies: ${h2Projects.join(", ")}`, description: "Build domain-specific case studies demonstrating applied problem-solving.", duration: "Months 4–6" },
        ],
        tools: h1Tools, certifications: [],
      },
      {
        label: "6–12 Months", theme: "Job Search, Networking & Career Launch", icon: "🎯",
        colorClass: "from-emerald-600 to-green-600",
        milestones: [
          { title: "Resume & LinkedIn Optimization", description: "Craft an ATS-optimised resume with quantified achievements and a keyword-rich LinkedIn profile.", duration: "Month 6" },
          { title: "Technical Interview Preparation", description: `Master domain interview formats: ${h3Focus.join(", ")}.`, duration: "Months 6–9" },
          { title: "Active Networking & Applications", description: "Attend 2–3 domain conferences, meetups, or online communities. Apply to target companies.", duration: "Months 7–12" },
        ],
        tools: [...h1Tools, "LinkedIn", "LeetCode / HackerRank"], certifications: [],
      },
    ],
    regulatory: [],
    capstoneProjects: capstones,
    salaryRange: salary,
    topCompanies: companies,
  };
}

// ─── 1. Software / Full-Stack Engineer ───────────────────────────────────────

export const SOFTWARE_ENGINEER_ROADMAP: CareerRoadmap = {
  roleId: "software-engineer", roleTitle: "Software / Full-Stack Engineer", roleIcon: "💻",
  tagline: "Build production systems end-to-end — from API design to scalable frontend delivery.",
  horizons: [
    {
      label: "Next 3 Months", theme: "DSA, Full-Stack Foundations & System Design", icon: "🧱",
      colorClass: "from-violet-600 to-indigo-600",
      milestones: [
        { title: "Data Structures & Algorithms Bootcamp", description: "Complete 60+ LeetCode/DSA problems covering arrays, trees, graphs, and dynamic programming.", duration: "Weeks 1–6" },
        { title: "Full-Stack Project: REST API + React App", description: "Build a complete CRUD application with Node/Express backend, PostgreSQL database, and React frontend.", duration: "Weeks 4–10" },
        { title: "System Design Primer", description: "Study HLD concepts: load balancing, caching, message queues, and CAP theorem.", duration: "Weeks 8–12" },
      ],
      tools: ["TypeScript", "React / Next.js", "Node.js", "PostgreSQL", "Docker", "Git"],
      certifications: ["AWS Certified Developer – Associate", "Google Cloud Professional Developer"],
    },
    {
      label: "3–6 Months", theme: "Portfolio Construction & Open Source", icon: "🚀",
      colorClass: "from-cyan-600 to-teal-600",
      milestones: [
        { title: "Production-Grade SaaS Project", description: "Build and deploy a multi-tenant SaaS with auth, billing, dashboards, and monitoring.", duration: "Months 3–4" },
        { title: "Open-Source Contribution", description: "Contribute to a well-known repo (e.g., shadcn/ui, Prisma, tRPC). Aim for 3+ merged PRs.", duration: "Month 4–5" },
        { title: "Internship / Contract Role", description: "Join a startup or agency for a 2–3 month engineering contract to gain real sprint experience.", duration: "Month 5–6" },
      ],
      tools: ["Redis", "Kubernetes", "CI/CD (GitHub Actions)", "Prometheus + Grafana"], certifications: [],
    },
    {
      label: "6–12 Months", theme: "Job Search, System Design & Offer", icon: "🎯",
      colorClass: "from-emerald-600 to-green-600",
      milestones: [
        { title: "Coding Interview Preparation", description: "Solve 150+ curated LeetCode problems. Practice mock interviews on Pramp or interviewing.io.", duration: "Months 6–8" },
        { title: "System Design Mock Interviews", description: "Practice designing Instagram, WhatsApp, and URL shortener at scale.", duration: "Months 7–9" },
        { title: "Target FAANG / Tier-1 Applications", description: "Apply to Google, Microsoft, Atlassian, Flipkart, Razorpay, Zepto.", duration: "Months 9–12" },
      ],
      tools: ["LeetCode", "Pramp", "System Design Primer (GitHub)"], certifications: [],
    },
  ],
  regulatory: [],
  capstoneProjects: [
    { title: "AI-Powered Task Manager SaaS", description: "Full-stack app with Next.js, Prisma, Groq AI API, Stripe billing, and real-time collaboration.", deliverable: "GitHub + Live Vercel Deploy", tags: ["Next.js", "AI", "SaaS"] },
    { title: "Distributed URL Shortener", description: "High-throughput URL shortener with Redis caching, analytics dashboard, and geo-routing.", deliverable: "GitHub + System Design Document", tags: ["System Design", "Redis", "Scalability"] },
    { title: "Real-Time Collaborative Code Editor", description: "Browser-based code IDE with WebSocket sync and language server protocol.", deliverable: "GitHub + Live Demo", tags: ["WebSockets", "Real-Time", "DevTools"] },
  ],
  salaryRange: { entry: "₹6–10 LPA", mid: "₹15–25 LPA", senior: "₹35–60 LPA+" },
  topCompanies: ["Google", "Microsoft", "Razorpay", "Flipkart", "Zepto", "Atlassian", "Thoughtworks"],
};

// ─── 2. AI / Machine Learning Engineer ───────────────────────────────────────

export const AI_ML_ROADMAP: CareerRoadmap = makeTechRoadmap(
  "ai-ml-engineer", "AI / Machine Learning Engineer", "🤖",
  "Design, train, and deploy intelligent systems that learn from data at scale.",
  ["Python", "PyTorch / TensorFlow", "Hugging Face", "MLflow", "FastAPI", "Jupyter"],
  ["AWS Machine Learning Specialty", "Google Professional ML Engineer", "Deep Learning Specialization (deeplearning.ai)"],
  ["Sentiment Analysis API", "Custom LLM Fine-Tuning", "Computer Vision Pipeline"],
  ["ML System Design", "Model Training & Evaluation", "Statistics & Probability"],
  [
    { title: "End-to-End NLP Sentiment Analysis API", description: "Train a BERT-based sentiment classifier, expose as FastAPI endpoint, and deploy on Hugging Face Spaces.", deliverable: "GitHub + Hugging Face Space", tags: ["NLP", "PyTorch", "FastAPI"] },
    { title: "Custom RAG Chatbot", description: "Build a Retrieval-Augmented Generation chatbot using LangChain and Pinecone over a custom knowledge base.", deliverable: "GitHub + Live Demo", tags: ["LLM", "RAG", "LangChain"] },
    { title: "MLOps Automated Pipeline", description: "Automated ML training, evaluation, and retraining pipeline using MLflow, DVC, and GitHub Actions.", deliverable: "GitHub + Architecture Diagram", tags: ["MLOps", "DevOps", "Automation"] },
  ],
  { entry: "₹8–14 LPA", mid: "₹20–35 LPA", senior: "₹45–80 LPA+" },
  ["Google DeepMind", "OpenAI", "Cohere", "Sarvam AI", "Krutrim", "Microsoft AI", "Amazon Science"],
);

// ─── 3. Data Scientist ────────────────────────────────────────────────────────

export const DATA_SCIENTIST_ROADMAP: CareerRoadmap = makeTechRoadmap(
  "data-scientist", "Data Scientist", "📊",
  "Translate raw data into business intelligence through statistical modelling and predictive analytics.",
  ["Python (Pandas, NumPy, SciPy)", "SQL", "Tableau / Power BI", "Scikit-learn", "Jupyter", "dbt"],
  ["Google Data Analytics Certificate", "IBM Data Science Professional", "Tableau Desktop Specialist"],
  ["Customer Churn Prediction", "Revenue Forecasting Dashboard", "A/B Test Analysis Report"],
  ["Statistics & Hypothesis Testing", "SQL Window Functions", "ML Model Selection & Bias"],
  [
    { title: "Customer Churn Prediction Model", description: "End-to-end churn prediction with feature engineering, XGBoost, SHAP explanations, and a Streamlit dashboard.", deliverable: "GitHub + Streamlit App", tags: ["ML", "XGBoost", "Streamlit"] },
    { title: "Revenue Forecasting Engine", description: "Time-series demand forecasting using Prophet and ARIMA on e-commerce sales data.", deliverable: "GitHub + Jupyter Notebook", tags: ["Forecasting", "Prophet", "Time-Series"] },
    { title: "A/B Test Analysis Platform", description: "Statistical framework for experiment design, power analysis, and Bayesian/Frequentist significance testing.", deliverable: "GitHub + Report PDF", tags: ["Statistics", "Experimentation", "Python"] },
  ],
  { entry: "₹6–12 LPA", mid: "₹16–28 LPA", senior: "₹30–55 LPA+" },
  ["Flipkart", "Swiggy", "Meesho", "McKinsey Analytics", "BCG Gamma", "Mu Sigma", "Fractal Analytics"],
);

// ─── 4. Cybersecurity & Cloud Engineer ───────────────────────────────────────

export const CYBERSECURITY_ROADMAP: CareerRoadmap = makeTechRoadmap(
  "cybersecurity-cloud-engineer", "Cybersecurity & Cloud Engineer", "🛡️",
  "Defend digital infrastructure through zero-trust architecture and cloud security engineering.",
  ["Kali Linux", "Wireshark", "Nmap", "AWS / GCP", "Terraform", "Splunk", "CrowdStrike"],
  ["CompTIA Security+", "AWS Security Specialty", "CEH (Certified Ethical Hacker)", "CCNA"],
  ["Home Lab Penetration Test Report", "Cloud IAM Audit", "Threat Modelling Exercise"],
  ["Network Protocols & Firewalls", "OWASP Top 10", "Cloud IAM Design", "Incident Response Playbooks"],
  [
    { title: "Home Lab Penetration Test Report", description: "Set up a vulnerable VM lab (DVWA, Metasploitable) and document a complete penetration test report with CVE mapping.", deliverable: "GitHub + PDF Report", tags: ["PenTest", "Kali Linux", "Ethical Hacking"] },
    { title: "Cloud Security Posture Audit Tool", description: "Automated AWS IAM policy analyser that flags over-privileged roles and misconfigurations.", deliverable: "GitHub + CLI Tool", tags: ["AWS", "IAM", "Security Automation"] },
    { title: "SIEM Dashboard", description: "Splunk or ELK-based SIEM ingesting simulated attack logs with custom detection rules.", deliverable: "GitHub + Demo Video", tags: ["SIEM", "Splunk", "Detection Engineering"] },
  ],
  { entry: "₹7–12 LPA", mid: "₹18–30 LPA", senior: "₹35–65 LPA+" },
  ["CERT-In empanelled firms", "TCS CyberSecurity", "Wipro CyberTransform", "Palo Alto Networks", "CrowdStrike India"],
);

// ─── 5. Electronics & Embedded Systems Engineer ──────────────────────────────

export const ECE_ROADMAP: CareerRoadmap = makeTechRoadmap(
  "electronics-embedded-engineer", "Electronics & Embedded Systems Engineer", "⚙️",
  "Design and program microcontrollers, IoT systems, and real-time embedded applications.",
  ["C / C++ Embedded", "Arduino / STM32", "FreeRTOS", "PCB Design (KiCad)", "MATLAB / Simulink"],
  ["ARM Cortex Certified Engineer", "GATE ECE (for PSU/R&D roles)", "Certified LabVIEW Associate Developer"],
  ["IoT Sensor Dashboard", "Motor Controller Firmware", "UART Communication Protocol Implementation"],
  ["Embedded C Coding", "RTOS Concepts", "Signal Processing", "Hardware Debugging"],
  [
    { title: "IoT Air Quality Monitor", description: "ESP32-based IoT device with MQTT connectivity, cloud dashboard, and threshold-based SMS alerts.", deliverable: "GitHub + Demo Video", tags: ["IoT", "ESP32", "MQTT"] },
    { title: "RTOS Motor Controller", description: "PID controller for a DC motor using FreeRTOS on STM32 with real-time telemetry logging.", deliverable: "GitHub + Wiring Diagram", tags: ["RTOS", "STM32", "Control Systems"] },
    { title: "Custom PCB Design", description: "Design, fabricate, and test a custom PCB for a specific embedded application (e.g., battery management system).", deliverable: "GitHub + Gerber Files + Photos", tags: ["PCB", "KiCad", "Hardware"] },
  ],
  { entry: "₹5–9 LPA", mid: "₹12–22 LPA", senior: "₹25–45 LPA+" },
  ["Texas Instruments India", "Qualcomm India", "Bosch Engineering", "ISRO", "DRDO", "Intel Bangalore"],
);

// ─── 6. Mechanical & Robotics Engineer ───────────────────────────────────────

export const MECHANICAL_ROADMAP: CareerRoadmap = makeTechRoadmap(
  "mechanical-robotics-engineer", "Mechanical & Robotics Engineer", "🦾",
  "Design physical systems, automate manufacturing, and build autonomous robotic platforms.",
  ["SOLIDWORKS / CATIA", "ANSYS FEA", "ROS / ROS2", "Python (for automation)", "MATLAB"],
  ["SOLIDWORKS CSWA / CSWP", "GATE Mechanical (for PSU)", "ROS Developer Certificate"],
  ["Robot Arm Simulation", "FEA Stress Analysis Report", "CNC G-Code Program"],
  ["Engineering Drawing & GD&T", "Kinematics & Dynamics", "Materials Science", "Control Theory"],
  [
    { title: "6-DOF Robot Arm Simulation", description: "Model a 6-DOF robot arm in ROS2 with URDF, implement inverse kinematics, and simulate pick-and-place tasks.", deliverable: "GitHub + Demo Video", tags: ["ROS2", "Robotics", "Kinematics"] },
    { title: "FEA Structural Analysis Case Study", description: "Complete FEA analysis on a mechanical component (e.g., drone frame) with ANSYS, including stress, deformation, and fatigue.", deliverable: "GitHub + Technical Report", tags: ["ANSYS", "FEA", "Structural Analysis"] },
    { title: "Autonomous Line-Following Robot", description: "PID-controlled line-following robot with computer vision using Raspberry Pi and OpenCV.", deliverable: "GitHub + Demo Video + BOM", tags: ["Robotics", "OpenCV", "PID Control"] },
  ],
  { entry: "₹5–8 LPA", mid: "₹10–20 LPA", senior: "₹22–40 LPA+" },
  ["Tata Motors", "Mahindra Advanced Design", "Bosch India", "ISRO", "L&T Engineering", "Ather Energy"],
);

// ─── 7. Civil & Structural Engineer ──────────────────────────────────────────

export const CIVIL_ROADMAP: CareerRoadmap = makeTechRoadmap(
  "civil-structural-engineer", "Civil & Structural Engineer", "🏗️",
  "Design safe and sustainable infrastructure — from high-rises to highways and water systems.",
  ["AutoCAD Civil 3D", "STAAD.Pro / ETABS", "Revit (BIM)", "SAP2000", "Primavera P6"],
  ["GATE Civil (mandatory for government/PSU roles)", "STAAD.Pro Certified", "AutoCAD Civil 3D Certification"],
  ["Structural Design of RCC Building", "Site Investigation Report", "BIM Model for Commercial Building"],
  ["RCC & Steel Design", "Soil Mechanics & Foundation", "Construction Project Management", "IS Code Compliance"],
  [
    { title: "RCC G+5 Residential Building Design", description: "Complete structural design of a G+5 building including beam, column, slab, and foundation per IS 456.", deliverable: "AutoCAD Drawings + Design Report", tags: ["RCC", "IS 456", "Structural Design"] },
    { title: "BIM Model for Commercial Complex", description: "Complete Building Information Model in Revit with clash detection, quantity take-off, and 4D simulation.", deliverable: "Revit Files + PDF Report", tags: ["BIM", "Revit", "4D Simulation"] },
    { title: "Highway Alignment Design", description: "10km highway corridor design using Civil 3D with horizontal/vertical alignment, cross-sections, and earthwork volumes.", deliverable: "AutoCAD Files + DWG Sheets", tags: ["Civil 3D", "Highway Design", "AutoCAD"] },
  ],
  { entry: "₹4–7 LPA", mid: "₹9–18 LPA", senior: "₹20–38 LPA+" },
  ["L&T Construction", "Shapoorji Pallonji", "NHAI", "DLF", "Afcons Infrastructure", "NCC Limited"],
);

// ─── 8. Doctor / Clinical Practitioner ───────────────────────────────────────

export const DOCTOR_ROADMAP: CareerRoadmap = {
  roleId: "doctor", roleTitle: "Doctor / Clinical Practitioner", roleIcon: "🩺",
  tagline: "Diagnose, treat, and advocate for patient health across specialties and settings.",
  horizons: [
    {
      label: "Next 3 Months", theme: "Residency Preparation & Clinical Consolidation", icon: "🧱",
      colorClass: "from-violet-600 to-indigo-600",
      milestones: [
        { title: "NEET PG Preparation", description: "Structured preparation for NEET PG across all 19 subjects. Target: 600+ score for MD/MS in a top institute.", duration: "Ongoing" },
        { title: "Clinical Case Logging", description: "Systematically log and document 50+ patient cases with DDx, investigations, and management plans.", duration: "Months 1–3" },
        { title: "BLS / ACLS Certification", description: "Complete Basic Life Support and Advanced Cardiac Life Support certifications (Indian Resuscitation Council).", duration: "Month 1–2" },
      ],
      tools: ["PrepLadder / Marrow", "UpToDate", "Medscape", "PubMed"],
      certifications: ["BLS (IRC)", "ACLS (IRC)", "NEET PG"],
    },
    {
      label: "3–6 Months", theme: "Specialty Selection & Research Publication", icon: "🚀",
      colorClass: "from-cyan-600 to-teal-600",
      milestones: [
        { title: "Specialty Elective Rotation", description: "Complete 4–6 week elective rotations in top 2–3 specialty choices to validate clinical interest.", duration: "Months 3–5" },
        { title: "First Clinical Research Paper", description: "Conduct and write up a case series or retrospective cohort study for PubMed-indexed journal submission.", duration: "Months 4–6" },
        { title: "Conference Presentation", description: "Present a clinical case or research poster at a national medical conference (AIIMS CME, APICON, etc.).", duration: "Month 5–6" },
      ],
      tools: ["SPSS / R", "Mendeley", "CONSORT checklist"], certifications: [],
    },
    {
      label: "6–12 Months", theme: "Residency Matching & Career Specialisation", icon: "🎯",
      colorClass: "from-emerald-600 to-green-600",
      milestones: [
        { title: "NEET PG Counselling & Seat Allotment", description: "Navigate NEET PG counselling through MCC, AIQ, and State Quota for MD/MS/DNB seat allocation.", duration: "Months 6–8" },
        { title: "Residency Onboarding & Specialty Deep-Dive", description: "Begin residency with a structured reading plan: Harrison's, specialty texts, and local protocols.", duration: "Months 8–12" },
        { title: "International Licensing Exploration (USMLE/PLAB)", description: "If targeting international practice: start USMLE Step 1 or PLAB 1 preparation.", duration: "Months 9–12" },
      ],
      tools: ["MCC Counselling Portal", "Amboss (USMLE Prep)", "UWORLD"], certifications: [],
    },
  ],
  regulatory: [
    { body: "National Medical Commission (NMC)", requirement: "MBBS degree + internship completion + State Medical Council registration", isBlocking: true, notes: "Mandatory for any clinical practice in India." },
    { body: "NEET PG (NBE)", requirement: "Qualifying NEET PG score for MD/MS/DNB post-graduate admissions", isBlocking: false, notes: "Required only for PG specialisation." },
    { body: "State Medical Council", requirement: "State registration certificate required for practicing in specific states", isBlocking: true },
    { body: "ECFMG (for USA)", requirement: "USMLE Steps 1, 2 CK + ECFMG certification for US residency", isBlocking: true, notes: "For Indian graduates targeting US practice." },
  ],
  capstoneProjects: [
    { title: "Clinical Case Series Publication", description: "Document and publish a 10-case series on an interesting clinical presentation with literature review.", deliverable: "PubMed-indexed journal submission", tags: ["Research", "Case Series", "Publication"] },
    { title: "Patient Education Digital Resource", description: "Create a multilingual patient education resource for a chronic condition prevalent in your community.", deliverable: "PDF / App / Website", tags: ["Health Education", "Patient Care", "Digital Health"] },
    { title: "QI Project: Sepsis Protocol Audit", description: "Design and execute a Quality Improvement project auditing sepsis bundle compliance in your hospital ward.", deliverable: "QI Report + Presentation", tags: ["Quality Improvement", "Sepsis", "Patient Safety"] },
  ],
  salaryRange: { entry: "₹6–10 LPA (House Officer)", mid: "₹12–25 LPA (Resident/Specialist)", senior: "₹30–80 LPA+ (Consultant)" },
  topCompanies: ["AIIMS", "Fortis Healthcare", "Apollo Hospitals", "Manipal Hospitals", "Narayana Health", "Government Medical Colleges"],
};

// ─── 9. Pharmacist ───────────────────────────────────────────────────────────

export const PHARMACIST_ROADMAP: CareerRoadmap = {
  roleId: "pharmacist", roleTitle: "Pharmacist / Pharmaceutical Analyst", roleIcon: "💊",
  tagline: "Ensure safe, effective, and rational use of medicines across clinical and industrial settings.",
  horizons: [
    {
      label: "Next 3 Months", theme: "Regulatory Compliance & Specialization Foundations", icon: "🧱",
      colorClass: "from-violet-600 to-indigo-600",
      milestones: [
        { title: "Pharmacy Council Registration", description: "Complete registration with the Pharmacy Council of India (PCI) or State Pharmacy Council.", duration: "Month 1" },
        { title: "Drug Information & Clinical Pharmacy Mastery", description: "Deep study of pharmacokinetics, drug interactions, and therapeutic drug monitoring.", duration: "Months 1–3" },
        { title: "GMP / GLP Certification", description: "Complete a Good Manufacturing Practice (GMP) and Good Laboratory Practice (GLP) certification course.", duration: "Month 2–3" },
      ],
      tools: ["Micromedex", "Clinical Pharmacology", "USP/IP", "ChemDraw"],
      certifications: ["GMP Certification (WHO GMP)", "Clinical Pharmacy Certificate (ISPOR)", "GPAT (M.Pharm Entrance)"],
    },
    {
      label: "3–6 Months", theme: "Industry or Clinical Track Specialisation", icon: "🚀",
      colorClass: "from-cyan-600 to-teal-600",
      milestones: [
        { title: "Pharmacovigilance Training", description: "Complete CIOMS/ICH pharmacovigilance training and understand MedWatch / VigiBase adverse event reporting.", duration: "Months 3–4" },
        { title: "R&D / QC Internship", description: "Secure internship in pharmaceutical R&D, Quality Control, or Regulatory Affairs.", duration: "Month 4–6" },
        { title: "Drug Regulatory Submission (CDSCO)", description: "Study CDSCO guidelines, CTD dossier preparation, and New Drug Application (NDA) process.", duration: "Months 5–6" },
      ],
      tools: ["SAS / R (clinical trials)", "LIMS", "Empower / LabX", "MedDRA"], certifications: [],
    },
    {
      label: "6–12 Months", theme: "Career Specialization & Industry Placement", icon: "🎯",
      colorClass: "from-emerald-600 to-green-600",
      milestones: [
        { title: "GPAT / GATE Pharmacy (for M.Pharm or PSU)", description: "Prepare for GPAT for PG admissions or GATE Pharmacy for PSUs like DRDO, CSIR.", duration: "Months 6–9" },
        { title: "Regulatory Affairs or Clinical Research Track", description: "Join a CRO or pharma firm in Regulatory Affairs, Medical Affairs, or Clinical Operations.", duration: "Months 8–12" },
        { title: "International Pharmacy Licensing (FPGEE for USA)", description: "If targeting USA: prepare for FPGEE and complete NABP MPJE for licensure.", duration: "Months 9–12" },
      ],
      tools: ["FDA IND/NDA Portal", "EMA Eudravigilance", "MedWatch", "VEEVA Vault"], certifications: [],
    },
  ],
  regulatory: [
    { body: "Pharmacy Council of India (PCI)", requirement: "B.Pharm degree + State Pharmacy Council registration", isBlocking: true, notes: "Cannot dispense or practice without registration." },
    { body: "Central Drugs Standard Control Organisation (CDSCO)", requirement: "Registration required for any drug testing laboratory or manufacturing facility", isBlocking: true },
    { body: "GPAT (NTA)", requirement: "For PG (M.Pharm) admissions in government/private pharmacy colleges", isBlocking: false },
    { body: "NABP (USA)", requirement: "FPGEE + TOEFL-iBT + NAPLEX + MPJE for pharmacist licensure in the USA", isBlocking: true, notes: "For Indian graduates pursuing USA pharmacy practice." },
  ],
  capstoneProjects: [
    { title: "Drug Interaction Checker Tool", description: "Clinical decision support tool that checks multi-drug regimens for major interactions using DrugBank API.", deliverable: "GitHub + Live Demo", tags: ["Clinical Pharmacy", "API", "Decision Support"] },
    { title: "Pharmacovigilance ADR Report Analysis", description: "Analyse 500+ ADR reports from VigiBase, classify by MedDRA SOC, and identify previously unreported signals.", deliverable: "GitHub + Analysis Report PDF", tags: ["Pharmacovigilance", "MedDRA", "Signal Detection"] },
    { title: "GMP Compliance Audit Checklist App", description: "Digital GMP audit checklist tool for pharmaceutical manufacturing with deviation tracking.", deliverable: "GitHub + App Demo", tags: ["GMP", "Regulatory", "Quality"] },
  ],
  salaryRange: { entry: "₹3–6 LPA", mid: "₹8–16 LPA", senior: "₹18–35 LPA+" },
  topCompanies: ["Sun Pharma", "Dr. Reddy's", "Cipla", "Lupin", "Biocon", "Divi's Laboratories", "Piramal Pharma"],
};

// ─── 10. Biotechnology & Genomic Researcher ──────────────────────────────────

export const BIOTECH_ROADMAP: CareerRoadmap = makeTechRoadmap(
  "biotech-genomics-researcher", "Biotechnology & Genomic Researcher", "🧬",
  "Decode the language of life — from genomic sequencing to CRISPR-based therapeutic design.",
  ["Python (BioPython)", "R / Bioconductor", "BLAST / HMMER", "Galaxy / Nextflow", "SPSS"],
  ["GATE Biotechnology / Life Sciences", "CSIR-NET Life Sciences", "Bioinformatics Certificate (EMBL)"],
  ["Variant Calling Pipeline", "CRISPR Target Identification", "Gene Expression Analysis"],
  ["Molecular Biology Fundamentals", "Bioinformatics Algorithms", "Research Paper Writing", "Lab Protocols"],
  [
    { title: "Variant Calling & Annotation Pipeline", description: "Complete NGS variant calling pipeline (FASTQ → VCF → Annotation) using BWA, GATK, and ANNOVAR.", deliverable: "GitHub + Pipeline Docs", tags: ["NGS", "GATK", "Bioinformatics"] },
    { title: "CRISPR Target Site Identification Tool", description: "Python tool that scans a given genomic sequence for CRISPR-Cas9 target sites with off-target scoring.", deliverable: "GitHub + Paper Draft", tags: ["CRISPR", "Python", "Genomics"] },
    { title: "Gene Expression Differential Analysis", description: "Bulk RNA-seq differential expression analysis using DESeq2, with pathway visualization and interpretation.", deliverable: "GitHub + Jupyter Notebook + PDF Report", tags: ["RNA-seq", "DESeq2", "R"] },
  ],
  { entry: "₹4–8 LPA", mid: "₹10–20 LPA", senior: "₹22–45 LPA+" },
  ["Strand Life Sciences", "MedGenome", "Biocon Research", "NCBS Bangalore", "IGIB Delhi", "InStem", "Thermo Fisher India"],
);

// ─── 11. Business Analyst ─────────────────────────────────────────────────────

export const BUSINESS_ANALYST_ROADMAP: CareerRoadmap = {
  roleId: "business-analyst", roleTitle: "Business Analyst", roleIcon: "📊",
  tagline: "Bridge the gap between business strategy and technical execution through data-driven insights.",
  horizons: [
    {
      label: "Next 3 Months", theme: "SQL, Data Visualization & Requirements Engineering", icon: "🧱",
      colorClass: "from-violet-600 to-indigo-600",
      milestones: [
        { title: "Advanced SQL Proficiency", description: "Master window functions, CTEs, recursive queries, and optimized joins via Mode Analytics or Stratascratch.", duration: "Weeks 1–6" },
        { title: "BI Tool Mastery", description: "Build 3 interactive dashboards in Tableau or Power BI using real datasets (sales, operations, finance).", duration: "Weeks 4–10" },
        { title: "Requirements Documentation Framework", description: "Learn BRD/FRD writing, use case diagrams, user stories, and acceptance criteria using industry templates.", duration: "Weeks 8–12" },
      ],
      tools: ["SQL (PostgreSQL)", "Tableau / Power BI", "Excel (Advanced)", "JIRA / Confluence", "Lucidchart"],
      certifications: ["CBAP (IIBA)", "PMI-PBA", "Tableau Desktop Specialist", "Google Data Analytics Certificate"],
    },
    {
      label: "3–6 Months", theme: "Portfolio Projects & Domain Specialisation", icon: "🚀",
      colorClass: "from-cyan-600 to-teal-600",
      milestones: [
        { title: "End-to-End Analytics Project", description: "Full BA project: problem framing, data collection, SQL analysis, dashboard, and executive summary.", duration: "Months 3–4" },
        { title: "Domain Vertical Specialisation", description: "Choose a vertical (FinTech, HealthTech, E-commerce, Supply Chain) and build 1 deep domain case study.", duration: "Months 4–5" },
        { title: "Internship / Junior BA Role", description: "Join a firm as a junior BA or data analyst intern to gain real sprint and stakeholder experience.", duration: "Month 5–6" },
      ],
      tools: ["Python (Pandas)", "dbt", "Amplitude / Mixpanel", "Miro"], certifications: [],
    },
    {
      label: "6–12 Months", theme: "Strategic Positioning & Senior BA Interview Prep", icon: "🎯",
      colorClass: "from-emerald-600 to-green-600",
      milestones: [
        { title: "Case Interview Preparation", description: "Practice 30+ business case interviews (market sizing, root cause analysis, profitability frameworks).", duration: "Months 6–8" },
        { title: "Leadership & Stakeholder Management", description: "Lead a cross-functional project end-to-end as the primary BA.", duration: "Months 8–10" },
        { title: "Target Consulting / Product Firms", description: "Apply to Deloitte, KPMG, EY, product analytics roles at Flipkart, Meesho, Zepto.", duration: "Months 9–12" },
      ],
      tools: ["Python A/B Testing", "SQL Optimization", "Case Interview Frameworks"], certifications: [],
    },
  ],
  regulatory: [],
  capstoneProjects: [
    { title: "E-Commerce Funnel Optimization Analysis", description: "Analyse a real e-commerce dataset, build a funnel from acquisition to purchase, identify drop-offs, and recommend optimizations.", deliverable: "GitHub + Tableau Dashboard + PDF Report", tags: ["SQL", "Funnel Analysis", "Tableau"] },
    { title: "Business Requirements Document (BRD)", description: "Complete BRD for a fictional FinTech product including use cases, data flow diagrams, and acceptance criteria.", deliverable: "PDF Document + Lucidchart Diagrams", tags: ["BRD", "Requirements", "FinTech"] },
    { title: "Market Expansion Case Study", description: "Data-driven market entry analysis for a hypothetical company entering a new geography with TAM/SAM sizing.", deliverable: "PDF Case Study + Excel Model", tags: ["Market Sizing", "Strategy", "Excel"] },
  ],
  salaryRange: { entry: "₹5–9 LPA", mid: "₹12–22 LPA", senior: "₹25–45 LPA+" },
  topCompanies: ["Deloitte", "Accenture", "Flipkart", "Meesho", "KPMG Advisory", "Capgemini", "EY GDS"],
};

// ─── 12. Product Manager ──────────────────────────────────────────────────────

export const PRODUCT_MANAGER_ROADMAP: CareerRoadmap = makeTechRoadmap(
  "product-manager", "Product Manager", "🗺️",
  "Define product vision, prioritize ruthlessly, and ship features that create real user and business value.",
  ["Notion / Confluence (PRD)", "Figma (wireframing)", "Amplitude / Mixpanel", "JIRA", "SQL (basic)", "Miro"],
  ["Google Project Management Certificate", "Pragmatic Institute PMC", "AIPMM CPM"],
  ["PRD for a Real Feature", "Go-to-Market Strategy Document", "Competitive Analysis Report"],
  ["Product Sense Case Studies", "Metric Definition & Estimation", "Technical Trade-off Interviews", "Behavioral STAR Format"],
  [
    { title: "Product Requirement Document (PRD)", description: "Complete PRD for a new feature in an existing product, including user stories, success metrics, and scope.", deliverable: "Notion Doc + Figma Wireframes", tags: ["PRD", "Product Strategy", "Figma"] },
    { title: "Product Teardown & Competitive Analysis", description: "Deep-dive teardown of 3 competing products with UX flow analysis, feature gap matrix, and positioning recommendations.", deliverable: "PDF Report + Slide Deck", tags: ["Competitive Analysis", "Product Strategy", "UX"] },
    { title: "Zero-to-One Product Concept", description: "Conceive, validate (mock user interviews), prototype, and present a new product concept addressing an unmet need.", deliverable: "Figma Prototype + Pitch Deck", tags: ["Product Discovery", "Figma", "Pitch"] },
  ],
  { entry: "₹8–14 LPA", mid: "₹18–32 LPA", senior: "₹35–65 LPA+" },
  ["Razorpay", "Zepto", "CRED", "PhonePe", "Meesho", "Google India", "Microsoft India"],
);

// ─── 13. Financial Analyst ───────────────────────────────────────────────────

export const FINANCIAL_ANALYST_ROADMAP: CareerRoadmap = {
  roleId: "financial-analyst", roleTitle: "Financial Analyst / Investment Specialist", roleIcon: "📈",
  tagline: "Build rigorous financial models, value companies, and drive capital allocation decisions.",
  horizons: [
    {
      label: "Next 3 Months", theme: "Financial Modeling & CFA Foundation", icon: "🧱",
      colorClass: "from-violet-600 to-indigo-600",
      milestones: [
        { title: "Financial Statement Analysis Mastery", description: "Deep study of income statements, balance sheets, and cash flows using real company annual reports.", duration: "Weeks 1–4" },
        { title: "DCF & Comparable Company Valuation", description: "Build from scratch: a 3-statement model, DCF model, and comparable company analysis in Excel.", duration: "Weeks 3–8" },
        { title: "CFA Level 1 Preparation", description: "Begin structured CFA Level 1 study covering Ethics, Equity, Fixed Income, and Financial Reporting & Analysis.", duration: "Weeks 1–12 (ongoing)" },
      ],
      tools: ["Microsoft Excel (advanced)", "Bloomberg Terminal", "Capital IQ / Refinitiv", "Python (yfinance)"],
      certifications: ["CFA Level 1 (CFA Institute)", "NSE Academy Financial Modeling Certificate", "NISM Series VIII (Equity Derivatives)"],
    },
    {
      label: "3–6 Months", theme: "Portfolio Projects & Domain Track Selection", icon: "🚀",
      colorClass: "from-cyan-600 to-teal-600",
      milestones: [
        { title: "Investment Research Report", description: "Write a buy/sell/hold equity research report on a listed Indian or US company with full DCF and risk factors.", duration: "Months 3–4" },
        { title: "Portfolio Simulation", description: "Manage a virtual portfolio using Sensibull or brokerage simulator, tracking performance vs Nifty.", duration: "Months 4–6" },
        { title: "Financial Internship", description: "Secure internship in Investment Banking, Equity Research, Private Equity, or Corporate Finance.", duration: "Month 5–6" },
      ],
      tools: ["Python (Pandas, Matplotlib)", "Excel VBA / Power Query", "SQL (for data pulls)"], certifications: [],
    },
    {
      label: "6–12 Months", theme: "Interview Prep & Domain Specialisation", icon: "🎯",
      colorClass: "from-emerald-600 to-green-600",
      milestones: [
        { title: "Technical Interview Preparation", description: "Master valuation, accounting adjustments, LBO modelling, and financial brain-teaser questions.", duration: "Months 6–8" },
        { title: "CFA Level 2 (if applicable)", description: "Continue CFA track — Level 2 covers advanced equity valuation, fixed income, and alternative investments.", duration: "Months 8–12" },
        { title: "Target Roles: ER, IB, PE, FP&A", description: "Apply to equity research at IIFL, Axis Capital, investment banks, or corporate FP&A roles.", duration: "Months 9–12" },
      ],
      tools: ["Wall Street Prep models", "Pitchbook", "Morningstar Direct"], certifications: [],
    },
  ],
  regulatory: [
    { body: "SEBI / NISM", requirement: "NISM Series I, V-A, or VIII certification required for advisory, distribution, or derivatives roles", isBlocking: true, notes: "SEBI mandates NISM certifications for registered investment advisers and dealers." },
    { body: "IRDAI", requirement: "IRDAI Agent / Broker license for insurance-linked investment advisory", isBlocking: true },
    { body: "CFA Institute", requirement: "CFA Charter — not legally required but de-facto standard for ER, PE, and HF roles", isBlocking: false, notes: "Global gold standard for investment management roles." },
  ],
  capstoneProjects: [
    { title: "Full Equity Research Report", description: "15-page initiating coverage report on a listed Indian mid-cap with DCF, Comps, risks, and 12-month price target.", deliverable: "PDF Report + Excel Model", tags: ["Equity Research", "DCF", "Valuation"] },
    { title: "Python Algorithmic Stock Screener", description: "Python screener that filters BSE/NSE stocks by valuation ratios, momentum, and quality factors.", deliverable: "GitHub + Jupyter Notebook", tags: ["Python", "Quant", "Stock Screening"] },
    { title: "LBO Model — Private Equity Case Study", description: "Complete leveraged buyout model for a hypothetical PE acquisition with IRR and MOIC returns analysis.", deliverable: "Excel Model + 2-pager Executive Summary", tags: ["LBO", "Private Equity", "Excel"] },
  ],
  salaryRange: { entry: "₹5–10 LPA", mid: "₹14–28 LPA", senior: "₹32–70 LPA+" },
  topCompanies: ["Goldman Sachs India", "Morgan Stanley", "Axis Capital", "IIFL Securities", "KKR India", "Sequoia Capital India", "Kotak Investment Banking"],
};

// ─── 14. Management Consultant ───────────────────────────────────────────────

export const MANAGEMENT_CONSULTANT_ROADMAP: CareerRoadmap = makeTechRoadmap(
  "management-consultant", "Management Consultant", "💼",
  "Solve complex business problems for C-suite clients using structured analytical frameworks and strategic insight.",
  ["PowerPoint / Google Slides", "Excel / Google Sheets", "Miro", "SQL (basic)", "Tableau"],
  ["PMP (PMI)", "Six Sigma Green Belt", "IBCS Certification (for data communication)"],
  ["Market Entry Case Study", "Cost Optimization Analysis", "Organizational Restructuring Plan"],
  ["Case Interview Frameworks (McKinsey, BCG, Bain)", "Market Sizing Estimations", "Fit Interview (STAR)", "Written Case Analysis"],
  [
    { title: "Market Entry Strategy Case Study", description: "Full consulting deliverable: market entry strategy for a hypothetical company entering the Indian EV market.", deliverable: "PDF Slide Deck (10 slides)", tags: ["Strategy", "Market Entry", "Consulting"] },
    { title: "Operational Efficiency Diagnostic", description: "Diagnose and propose solutions for a manufacturing company's operational bottlenecks using process mapping and lean tools.", deliverable: "Process Map + Recommendation Report", tags: ["Operations", "Lean", "Efficiency"] },
    { title: "Digital Transformation Roadmap", description: "3-year digital transformation roadmap for an MSME including technology selection, change management, and ROI projection.", deliverable: "PDF Roadmap + Excel Financial Model", tags: ["Digital Transformation", "Strategy", "Change Management"] },
  ],
  { entry: "₹10–18 LPA", mid: "₹22–40 LPA", senior: "₹50–100 LPA+" },
  ["McKinsey & Company", "BCG India", "Bain & Company", "Deloitte Consulting", "EY Parthenon", "Kearney", "Roland Berger India"],
);

// ─── 15. Digital Marketing & Growth Strategist ───────────────────────────────

export const DIGITAL_MARKETING_ROADMAP: CareerRoadmap = makeTechRoadmap(
  "digital-marketing-growth", "Digital Marketing & Growth Strategist", "📣",
  "Drive user acquisition, engagement, and revenue growth through data-driven digital marketing strategies.",
  ["Google Ads / Meta Ads Manager", "Google Analytics 4", "HubSpot CRM", "Canva", "Semrush / Ahrefs", "Mailchimp"],
  ["Google Ads Search Certification", "Meta Blueprint Certification", "HubSpot Marketing Certification", "Google Analytics 4 Certificate"],
  ["SEO Audit & Content Strategy", "Paid Ad Campaign with ₹5K Budget", "Email Drip Campaign"],
  ["Funnel Analytics & Attribution", "A/B Test Design & Analysis", "CAC / LTV Calculations", "SEO Technical Audit"],
  [
    { title: "90-Day SEO Content Strategy", description: "Keyword research, content calendar, 12+ SEO articles published, and organic traffic growth tracking.", deliverable: "SEMrush Report + Published Articles + Analytics", tags: ["SEO", "Content Marketing", "Analytics"] },
    { title: "Paid Acquisition Campaign Analysis", description: "Run a ₹5,000 Google/Meta ad campaign for a real or mock product, A/B test ad creatives, and report ROAS.", deliverable: "Campaign Report PDF + Dashboard", tags: ["Paid Ads", "A/B Testing", "ROAS"] },
    { title: "Growth Loop Design Document", description: "Complete growth loop for a SaaS product including acquisition, activation, retention, referral, and revenue levers.", deliverable: "Miro Board + PDF Strategy Doc", tags: ["Growth Hacking", "Product Growth", "Retention"] },
  ],
  { entry: "₹4–8 LPA", mid: "₹10–20 LPA", senior: "₹22–45 LPA+" },
  ["HUL", "Nykaa", "Myntra", "Cult.fit", "Wakefit", "dentsu India", "GroupM India"],
);

// ─── 16. UI/UX & Product Designer ────────────────────────────────────────────

export const UIUX_ROADMAP: CareerRoadmap = makeTechRoadmap(
  "ui-ux-product-designer", "UI/UX & Product Designer", "🎨",
  "Craft intuitive, delightful digital experiences through research-driven design and systematic thinking.",
  ["Figma", "Maze / UserTesting", "Miro", "Framer", "Principle (prototyping)", "Zeplin"],
  ["Google UX Design Certificate (Coursera)", "Interaction Design Foundation UX Certification", "NN/g UX Certification"],
  ["Mobile App Case Study", "Design System Documentation", "Usability Test Report"],
  ["Design Critique & Rationale", "Case Study Presentation", "Portfolio Walkthrough", "Figma Proficiency Challenge"],
  [
    { title: "End-to-End Mobile App Design Case Study", description: "Complete mobile app design (problem, research, wireframes, hi-fi prototype, usability testing, iterations).", deliverable: "Figma File + Case Study PDF", tags: ["UX Research", "Figma", "Mobile Design"] },
    { title: "Design System Library", description: "Comprehensive Figma design system with 50+ components, design tokens, and usage documentation.", deliverable: "Figma Community File + Documentation", tags: ["Design System", "Figma", "Component Library"] },
    { title: "Accessibility Audit & Redesign", description: "WCAG 2.1 AA audit of an existing app, document violations, and produce a complete compliant redesign.", deliverable: "Figma File + Audit Report PDF", tags: ["Accessibility", "WCAG", "Redesign"] },
  ],
  { entry: "₹5–10 LPA", mid: "₹14–25 LPA", senior: "₹28–55 LPA+" },
  ["Razorpay Design", "PhonePe Design", "CRED", "Dunzo", "Swiggy Design", "Atlassian", "Intuit India"],
);

// ─── 17. Lawyer / Corporate Legal Specialist ─────────────────────────────────

export const LAWYER_ROADMAP: CareerRoadmap = {
  roleId: "lawyer", roleTitle: "Lawyer / Corporate Legal Specialist", roleIcon: "⚖️",
  tagline: "Navigate complex legal landscapes — advising corporations on contracts, compliance, M&A, and dispute resolution.",
  horizons: [
    {
      label: "Next 3 Months", theme: "Bar Exam Preparation & Core Legal Mastery", icon: "🧱",
      colorClass: "from-violet-600 to-indigo-600",
      milestones: [
        { title: "All India Bar Examination (AIBE) Preparation", description: "Structured preparation for AIBE (Bar Council of India exam) covering Constitutional, Civil, Criminal, and Corporate law.", duration: "Ongoing" },
        { title: "Corporate Law Specialization", description: "Deep study of Companies Act 2013, SEBI Regulations, IBC 2016, and Contract Law through bare acts and case law.", duration: "Months 1–3" },
        { title: "Legal Research & Drafting Skills", description: "Master Indian Kanoon, Manupatra, and SCC Online research. Practice drafting NDAs, term sheets, and board resolutions.", duration: "Months 1–3" },
      ],
      tools: ["Indian Kanoon", "SCC Online / Manupatra", "MS Word (contract drafting)", "LexisNexis"],
      certifications: ["AIBE (Bar Council of India)", "Certificate in Corporate Law (NLSIU / NUJS)", "SEBI NISM Legal & Compliance Certification"],
    },
    {
      label: "3–6 Months", theme: "Internship & Transactional Experience", icon: "🚀",
      colorClass: "from-cyan-600 to-teal-600",
      milestones: [
        { title: "Law Firm Internship (Corporate / M&A)", description: "Complete 2–3 month internship at a Tier 1 Indian law firm (AZB, Trilegal, Khaitan & Co) in Corporate, M&A, or PE practice.", duration: "Months 3–5" },
        { title: "Transaction Document Drafting", description: "Draft, review, and negotiate SHA, SPA, NDA, and employment agreements under supervision.", duration: "Months 3–6" },
        { title: "Moot Court / Arbitration", description: "Participate in a national moot court competition or simulated international arbitration.", duration: "Months 4–6" },
      ],
      tools: ["DocuSign / Adobe Acrobat", "Relativity (eDiscovery)", "Contract lifecycle tools (Ironclad, Juro)"], certifications: [],
    },
    {
      label: "6–12 Months", theme: "Junior Associate Track & Specialisation", icon: "🎯",
      colorClass: "from-emerald-600 to-green-600",
      milestones: [
        { title: "AIBE Passing + Bar Enrollment", description: "Clear AIBE and complete enrollment with the Bar Council of the respective state to practice independently.", duration: "Month 6–8" },
        { title: "Junior Associate Application (Tier 1–2 Firms)", description: "Apply to AZB & Partners, Trilegal, Khaitan & Co., Cyril Amarchand Mangaldas, JSA.", duration: "Months 8–12" },
        { title: "LLM Consideration", description: "Evaluate LLM from NLUs, Oxford, NYU, or LSE for career acceleration into international arbitration or tech law.", duration: "Months 9–12" },
      ],
      tools: ["Bar Council of India AIBE Portal", "CAM Law Firm Job Portal", "Chambers & Partners Rankings"], certifications: [],
    },
  ],
  regulatory: [
    { body: "Bar Council of India (BCI)", requirement: "LLB / BA LLB degree (5-year) + AIBE clearance + State Bar Council enrollment", isBlocking: true, notes: "Cannot appear in court or give legal advice without BCI enrollment." },
    { body: "SEBI (for Capital Markets Practice)", requirement: "NISM Legal & Compliance / SEBI-registered investment adviser license for securities law roles", isBlocking: true },
    { body: "Solicitors Regulation Authority (UK)", requirement: "SQE 1 & 2 + qualifying work experience for England & Wales solicitor qualification", isBlocking: true, notes: "Required for those targeting UK legal practice." },
    { body: "State Bar (USA)", requirement: "LLM from ABA-accredited school + Bar Exam passage in target state (New York, California)", isBlocking: true, notes: "For Indian lawyers practicing in the USA." },
  ],
  capstoneProjects: [
    { title: "M&A Term Sheet & SHA Drafting", description: "Draft a complete term sheet and shareholders' agreement for a hypothetical VC investment round.", deliverable: "Word Document + Redline Commentary", tags: ["Corporate Law", "M&A", "Contract Drafting"] },
    { title: "Legal Compliance Audit Report", description: "Legal compliance audit for a hypothetical Indian startup covering FEMA, labour laws, IP registration, and data protection.", deliverable: "PDF Compliance Report", tags: ["Compliance", "Startup Law", "FEMA"] },
    { title: "Arbitration Case Brief", description: "2,000-word case brief arguing one side in a commercial dispute under the Arbitration & Conciliation Act 1996.", deliverable: "PDF Brief", tags: ["Arbitration", "Litigation", "Advocacy"] },
  ],
  salaryRange: { entry: "₹5–10 LPA (Tier 1 firm associate)", mid: "₹15–30 LPA (Senior Associate)", senior: "₹40–100 LPA+ (Partner track)" },
  topCompanies: ["AZB & Partners", "Trilegal", "Khaitan & Co.", "Cyril Amarchand Mangaldas", "JSA", "Shardul Amarchand Mangaldas", "Nishith Desai Associates"],
};

// ─── Master Registry ──────────────────────────────────────────────────────────

export const CAREER_ROADMAPS: Record<string, CareerRoadmap> = {
  "software-engineer":             SOFTWARE_ENGINEER_ROADMAP,
  "ai-ml-engineer":                AI_ML_ROADMAP,
  "data-scientist":                DATA_SCIENTIST_ROADMAP,
  "cybersecurity-cloud-engineer":  CYBERSECURITY_ROADMAP,
  "electronics-embedded-engineer": ECE_ROADMAP,
  "mechanical-robotics-engineer":  MECHANICAL_ROADMAP,
  "civil-structural-engineer":     CIVIL_ROADMAP,
  "doctor":                        DOCTOR_ROADMAP,
  "pharmacist":                    PHARMACIST_ROADMAP,
  "biotech-genomics-researcher":   BIOTECH_ROADMAP,
  "business-analyst":              BUSINESS_ANALYST_ROADMAP,
  "product-manager":               PRODUCT_MANAGER_ROADMAP,
  "financial-analyst":             FINANCIAL_ANALYST_ROADMAP,
  "management-consultant":         MANAGEMENT_CONSULTANT_ROADMAP,
  "digital-marketing-growth":      DIGITAL_MARKETING_ROADMAP,
  "ui-ux-product-designer":        UIUX_ROADMAP,
  "lawyer":                        LAWYER_ROADMAP,
};

export function getCareerRoadmap(roleId: string): CareerRoadmap | null {
  return CAREER_ROADMAPS[roleId] ?? null;
}

export function getAllRoadmapRoleIds(): string[] {
  return Object.keys(CAREER_ROADMAPS);
}
