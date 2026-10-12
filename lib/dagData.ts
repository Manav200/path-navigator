// lib/dagData.ts
// Graph Schemas, DAG Topologies & 7-Day Micro-Task Specs for 5 Launch Professions

export type WidgetType =
  // Original 5 hand-crafted widgets
  | "se_logic"
  | "ba_sql"
  | "law_clause"
  | "doc_diag"
  | "pharm_audit"
  // Expanded domain category widgets
  | "tech_logic"    // Generic engineering code/logic fixer
  | "data_query"    // Data query / chart inspector
  | "design_flow"   // Wireframe / user-flow auditor
  | "case_strategy";// Case strategy / clause auditor

export interface DAGNodeData {
  id: string;
  day: number;
  title: string;
  subtitle: string;
  description: string;
  keyConcepts: string[];
  prerequisites: string[]; // dependent node IDs
  widgetType: WidgetType;
  taskInstructions: string;
  taskPayload: any;
  [key: string]: any;
}

export interface DAGGraphRole {
  roleId: string;
  roleTitle: string;
  roleIcon: string;
  overview: string;
  nodes: {
    id: string;
    position: { x: number; y: number };
    data: DAGNodeData;
  }[];
  edges: {
    id: string;
    source: string;
    target: string;
  }[];
}

// ─── 1. SOFTWARE ENGINEER DAG ────────────────────────────────────────────────
const SOFTWARE_ENGINEER_GRAPH: DAGGraphRole = {
  roleId: "software-engineer",
  roleTitle: "Software Engineer",
  roleIcon: "💻",
  overview: "7-Day experiential journey through production system architecture, API fault tolerance, SQL optimization, and distributed micro-tasks.",
  nodes: [
    {
      id: "se-day-1",
      position: { x: 250, y: 30 },
      data: {
        id: "se-day-1",
        day: 1,
        title: "API Gateway & Payload Parsing",
        subtitle: "Foundational Paradigm",
        description: "Deconstruct how production HTTP requests are ingested, validated, and normalized before reaching business services.",
        keyConcepts: ["REST Contracts", "Schema Validation", "HTTP Status Semantics", "Zero-Trust Payload Ingestion"],
        prerequisites: [],
        widgetType: "se_logic",
        taskInstructions: "Debug the incoming JSON payload validation schema. Fix the missing authentication header key and correct the rate-limit threshold.",
        taskPayload: {
          buggyCode: `// API Gateway Ingestion Guard\nfunction validateRequest(req) {\n  if (!req.headers["x-api-key"]) return { valid: false, code: 401 };\n  // BUG: Threshold check is inverse\n  if (req.rateLimitCount > 100) return { valid: false, code: 429 };\n  return { valid: true, code: 200 };\n}`,
          correctAnswer: "429",
          challengeType: "fix_logic",
        },
      },
    },
    {
      id: "se-day-2",
      position: { x: 250, y: 170 },
      data: {
        id: "se-day-2",
        day: 2,
        title: "Algorithmic State & Cache Invalidation",
        subtitle: "Core Analytical Method",
        description: "Master LRU cache strategies and race-condition prevention under high-concurrency loads.",
        keyConcepts: ["Cache-Aside Pattern", "LRU Eviction", "Atomicity", "TTL Calibration"],
        prerequisites: ["se-day-1"],
        widgetType: "se_logic",
        taskInstructions: "Identify the stale cache read bug in the distributed Redis synchronization snippet and apply the cache-invalidation hook.",
        taskPayload: {
          buggyCode: `function getProduct(productId) {\n  const cached = cache.get(productId);\n  if (cached) return cached;\n  const fresh = db.find(productId);\n  cache.set(productId, fresh, { ttl: 60 });\n  return fresh;\n}`,
          correctAnswer: "ttl",
          challengeType: "cache_ttl",
        },
      },
    },
    {
      id: "se-day-3",
      position: { x: 90, y: 320 },
      data: {
        id: "se-day-3",
        day: 3,
        title: "Database Query Optimization & Indexing",
        subtitle: "Specialized Tooling Path A",
        description: "Analyze query execution plans (EXPLAIN ANALYZE), eliminate sequential full-table scans, and create composite B-tree indexes.",
        keyConcepts: ["B-Tree Indexes", "Execution Plans", "N+1 Query Elimination", "Connection Pooling"],
        prerequisites: ["se-day-2"],
        widgetType: "se_logic",
        taskInstructions: "Select the optimal composite index columns for a slow customer transaction lookup filtering by `tenant_id` and sorted by `created_at`.",
        taskPayload: {
          query: "SELECT * FROM transactions WHERE tenant_id = 't_99' ORDER BY created_at DESC LIMIT 20;",
          correctAnswer: "(tenant_id, created_at)",
          challengeType: "indexing",
        },
      },
    },
    {
      id: "se-day-4",
      position: { x: 410, y: 320 },
      data: {
        id: "se-day-4",
        day: 4,
        title: "Event-Driven Asynchronous Queues",
        subtitle: "Specialized Tooling Path B",
        description: "Design decoupled producer-consumer architectures using message brokers and dead-letter queues (DLQs).",
        keyConcepts: ["Pub/Sub Semantics", "Idempotency Keys", "Dead Letter Queues", "At-Least-Once Delivery"],
        prerequisites: ["se-day-2"],
        widgetType: "se_logic",
        taskInstructions: "Configure the retry backoff and idempotency check to avoid duplicate billing charges on network timeouts.",
        taskPayload: {
          correctAnswer: "idempotency_key",
          challengeType: "idempotency",
        },
      },
    },
    {
      id: "se-day-5",
      position: { x: 250, y: 470 },
      data: {
        id: "se-day-5",
        day: 5,
        title: "Resilience & Circuit Breaking",
        subtitle: "Cross-functional Problem Solving",
        description: "Protect downstream microservices from cascading failures using adaptive circuit breakers and fallback defaults.",
        keyConcepts: ["Hystrix Patterns", "Threshold Tripping", "Half-Open Probing", "Graceful Degradation"],
        prerequisites: ["se-day-3", "se-day-4"],
        widgetType: "se_logic",
        taskInstructions: "Set the failure rate threshold percentage that should trip the circuit into an OPEN state during payment provider outages.",
        taskPayload: {
          correctAnswer: "50",
          challengeType: "circuit_breaker",
        },
      },
    },
    {
      id: "se-day-6",
      position: { x: 250, y: 610 },
      data: {
        id: "se-day-6",
        day: 6,
        title: "Security Hardening & Zero-Day Patching",
        subtitle: "Real-world Edge Case Handling",
        description: "Diagnose and patch cross-site scripting (XSS), SQL injection, and insecure direct object reference (IDOR) vulnerabilities.",
        keyConcepts: ["OWASP Top 10", "Parameterized Queries", "CSP Directives", "RBAC Enforcement"],
        prerequisites: ["se-day-5"],
        widgetType: "se_logic",
        taskInstructions: "Prevent SQL injection by converting a vulnerable raw string concatenation query into a parameterized prepared statement.",
        taskPayload: {
          correctAnswer: "parameterized",
          challengeType: "sql_injection",
        },
      },
    },
    {
      id: "se-day-7",
      position: { x: 250, y: 750 },
      data: {
        id: "se-day-7",
        day: 7,
        title: "High-Throughput Checkout Architecture",
        subtitle: "Mini Capstone Work Simulation",
        description: "Simulate a live production flash sale deployment handling 50,000 req/sec with zero downtime.",
        keyConcepts: ["Distributed Locks", "Autoscaling Policies", "Telemetry & Distributed Tracing", "Zero Downtime Deployments"],
        prerequisites: ["se-day-6"],
        widgetType: "se_logic",
        taskInstructions: "Execute end-to-end load validation: Verify Redis distributed locking logic and deploy production readiness seal.",
        taskPayload: {
          correctAnswer: "redlock",
          challengeType: "capstone",
        },
      },
    },
  ],
  edges: [
    { id: "e-se-1-2", source: "se-day-1", target: "se-day-2" },
    { id: "e-se-2-3", source: "se-day-2", target: "se-day-3" },
    { id: "e-se-2-4", source: "se-day-2", target: "se-day-4" },
    { id: "e-se-3-5", source: "se-day-3", target: "se-day-5" },
    { id: "e-se-4-5", source: "se-day-4", target: "se-day-5" },
    { id: "e-se-5-6", source: "se-day-5", target: "se-day-6" },
    { id: "e-se-6-7", source: "se-day-6", target: "se-day-7" },
  ],
};

// ─── 2. BUSINESS ANALYST DAG ─────────────────────────────────────────────────
const BUSINESS_ANALYST_GRAPH: DAGGraphRole = {
  roleId: "business-analyst",
  roleTitle: "Business Analyst",
  roleIcon: "📊",
  overview: "7-Day experiential roadmap exploring business KPI trees, SQL cohort modeling, customer churn diagnostics, and executive decision decks.",
  nodes: [
    {
      id: "ba-day-1",
      position: { x: 250, y: 30 },
      data: {
        id: "ba-day-1",
        day: 1,
        title: "North Star Metric & KPI Decomposition",
        subtitle: "Foundational Paradigm",
        description: "Breakdown complex business revenues into underlying leading and lagging indicators using issue trees.",
        keyConcepts: ["North Star Framework", "MECE Decomposition", "Leading vs Lagging KPIs", "Unit Economics"],
        prerequisites: [],
        widgetType: "ba_sql",
        taskInstructions: "Identify the leading indicator driving the 18% decline in quarterly Gross Merchandise Value (GMV).",
        taskPayload: {
          scenario: "E-Commerce marketplace quarterly GMV drop analysis",
          options: ["Cart Abandonment Rate", "Employee Headcount", "Office Lease Cost", "Server Uptime"],
          correctAnswer: "Cart Abandonment Rate",
        },
      },
    },
    {
      id: "ba-day-2",
      position: { x: 250, y: 170 },
      data: {
        id: "ba-day-2",
        day: 2,
        title: "SQL Aggregate Synthesis & Window Functions",
        subtitle: "Core Analytical Method",
        description: "Write production queries calculating Month-over-Month (MoM) growth rates and running customer lifetime spend.",
        keyConcepts: ["Window Functions (PARTITION BY)", "GROUP BY Aggregates", "HAVING Filters", "Self-Joins"],
        prerequisites: ["ba-day-1"],
        widgetType: "ba_sql",
        taskInstructions: "Select the correct SQL query clause to calculate the 30-day rolling average order value per user.",
        taskPayload: {
          options: [
            "AVG(amount) OVER (PARTITION BY user_id ORDER BY order_date ROWS BETWEEN 29 PRECEDING AND CURRENT ROW)",
            "SELECT user_id, AVG(amount) GROUP BY user_id WHERE days <= 30",
            "SUM(amount) / COUNT(order_date) HAVING user_id > 100",
            "RANK() OVER (ORDER BY amount DESC)",
          ],
          correctAnswer: "AVG(amount) OVER (PARTITION BY user_id ORDER BY order_date ROWS BETWEEN 29 PRECEDING AND CURRENT ROW)",
        },
      },
    },
    {
      id: "ba-day-3",
      position: { x: 90, y: 320 },
      data: {
        id: "ba-day-3",
        day: 3,
        title: "User Retention Cohort Heatmaps",
        subtitle: "Specialized Tooling Path A",
        description: "Construct triangular user retention matrices to spot churn drop-offs across onboarding cycles.",
        keyConcepts: ["Cohort Analysis", "Day-30 Retention", "LTV:CAC Ratios", "Activation Curves"],
        prerequisites: ["ba-day-2"],
        widgetType: "ba_sql",
        taskInstructions: "Analyze the cohort heatmap data table and pinpoint which acquisition channel is causing negative ROI.",
        taskPayload: {
          options: ["Organic Search (82% D30)", "Referrals (74% D30)", "Paid Social Ads (12% D30)", "Direct Traffic (68% D30)"],
          correctAnswer: "Paid Social Ads (12% D30)",
        },
      },
    },
    {
      id: "ba-day-4",
      position: { x: 410, y: 320 },
      data: {
        id: "ba-day-4",
        day: 4,
        title: "Price Elasticity & Revenue Modeling",
        subtitle: "Specialized Tooling Path B",
        description: "Build financial sensitivity models estimating demand volume changes under differential pricing tiers.",
        keyConcepts: ["Price Elasticity Coefficients", "Break-even Analysis", "Contribution Margin", "Sensitivity Tables"],
        prerequisites: ["ba-day-2"],
        widgetType: "ba_sql",
        taskInstructions: "Given an elasticity of -1.4, calculate if a 10% price increase will increase or decrease overall gross profit.",
        taskPayload: {
          options: ["Decrease Total Profit (Elastic Demand)", "Increase Total Profit (Inelastic Demand)", "No change", "Double Profit"],
          correctAnswer: "Decrease Total Profit (Elastic Demand)",
        },
      },
    },
    {
      id: "ba-day-5",
      position: { x: 250, y: 470 },
      data: {
        id: "ba-day-5",
        day: 5,
        title: "A/B Testing Hypothesis Calibration",
        subtitle: "Cross-functional Problem Solving",
        description: "Formulate statistical null hypotheses, sample size power calculations, and p-value confidence intervals.",
        keyConcepts: ["Z-Score / P-Value Significance", "Minimum Detectable Effect (MDE)", "Type I & II Errors", "Sample Sizing"],
        prerequisites: ["ba-day-3", "ba-day-4"],
        widgetType: "ba_sql",
        taskInstructions: "Evaluate the A/B test results: Conversion Variant B is 4.2% vs Control 3.8% with p = 0.02. Does it pass the alpha = 0.05 threshold?",
        taskPayload: {
          options: ["Yes, statistically significant (p < 0.05), roll out Variant B", "No, fail to reject null hypothesis", "Inconclusive, test needs 10 more years", "Reject because p is too low"],
          correctAnswer: "Yes, statistically significant (p < 0.05), roll out Variant B",
        },
      },
    },
    {
      id: "ba-day-6",
      position: { x: 250, y: 610 },
      data: {
        id: "ba-day-6",
        day: 6,
        title: "Funnel Churn Diagnostics & Root Cause",
        subtitle: "Real-world Edge Case Handling",
        description: "Drill down through multi-step onboarding funnels to isolate localized friction spikes across devices and geographies.",
        keyConcepts: ["Micro-conversion Drops", "Segment Drift", "Device Parity Testing", "Behavioral Tagging"],
        prerequisites: ["ba-day-5"],
        widgetType: "ba_sql",
        taskInstructions: "A 40% drop-off occurs on Step 3 for Android devices only in Tier 2 Indian cities. What is the root cause?",
        taskPayload: {
          options: ["High latency OTP verification gateway failure on low-bandwidth networks", "Users dislike Android", "Payment gateway is too fast", "Desktop browser cache"],
          correctAnswer: "High latency OTP verification gateway failure on low-bandwidth networks",
        },
      },
    },
    {
      id: "ba-day-7",
      position: { x: 250, y: 750 },
      data: {
        id: "ba-day-7",
        day: 7,
        title: "Executive Strategic Roadmap Proposal",
        subtitle: "Mini Capstone Work Simulation",
        description: "Synthesize quantitative findings into an actionable 3-slide executive recommendation for the CEO.",
        keyConcepts: ["Pyramid Principle", "Data Storytelling", "Capital Allocation Priority", "Scenario Forecasting"],
        prerequisites: ["ba-day-6"],
        widgetType: "ba_sql",
        taskInstructions: "Synthesize the 3 priority growth initiatives ranked by ROI and implementation feasibility.",
        taskPayload: {
          options: ["Optimize Tier-2 Android OTP flow & recalibrate Paid Social Ads", "Fire sales team and double prices", "Switch completely to cryptocurrency", "Wait another year"],
          correctAnswer: "Optimize Tier-2 Android OTP flow & recalibrate Paid Social Ads",
        },
      },
    },
  ],
  edges: [
    { id: "e-ba-1-2", source: "ba-day-1", target: "ba-day-2" },
    { id: "e-ba-2-3", source: "ba-day-2", target: "ba-day-3" },
    { id: "e-ba-2-4", source: "ba-day-2", target: "ba-day-4" },
    { id: "e-ba-3-5", source: "ba-day-3", target: "ba-day-5" },
    { id: "e-ba-4-5", source: "ba-day-4", target: "ba-day-5" },
    { id: "e-ba-5-6", source: "ba-day-5", target: "ba-day-6" },
    { id: "e-ba-6-7", source: "ba-day-6", target: "ba-day-7" },
  ],
};

// ─── 3. LAWYER DAG ───────────────────────────────────────────────────────────
const LAWYER_GRAPH: DAGGraphRole = {
  roleId: "lawyer",
  roleTitle: "Lawyer",
  roleIcon: "⚖️",
  overview: "7-Day experiential roadmap covering contract drafting, statutory interpretation, dispute resolution, and courtroom oral argument synthesis.",
  nodes: [
    {
      id: "law-day-1",
      position: { x: 250, y: 30 },
      data: {
        id: "law-day-1",
        day: 1,
        title: "Indian Contract Act & Valid Agreements",
        subtitle: "Foundational Paradigm",
        description: "Examine Section 10 of Indian Contract Act 1872: free consent, lawful consideration, competent parties, and legality of object.",
        keyConcepts: ["Offer & Acceptance", "Section 10 Essentials", "Void vs Voidable", "Quasi-Contracts"],
        prerequisites: [],
        widgetType: "law_clause",
        taskInstructions: "Audit the contract preamble: Identify which clause renders the agreement void ab initio under Indian law.",
        taskPayload: {
          options: ["Clause 4: Complete restraint on marriage or trade (Section 27)", "Clause 1: 30-day payment term", "Clause 2: Jurisdiction in New Delhi", "Clause 3: English language communication"],
          correctAnswer: "Clause 4: Complete restraint on marriage or trade (Section 27)",
        },
      },
    },
    {
      id: "law-day-2",
      position: { x: 250, y: 170 },
      data: {
        id: "law-day-2",
        day: 2,
        title: "Indemnity, Liability & Force Majeure",
        subtitle: "Core Analytical Method",
        description: "Draft balanced indemnification thresholds, consequential damage carve-outs, and pandemic/act-of-god clauses.",
        keyConcepts: ["Indemnity Caps", "Carve-outs for Gross Negligence", "Force Majeure Protocols", "Liquidated Damages (Sec 74)"],
        prerequisites: ["law-day-1"],
        widgetType: "law_clause",
        taskInstructions: "A vendor contract includes uncapped consequential damages against your client. Select the necessary redline amendment.",
        taskPayload: {
          options: ["Insert mutual cap equal to 12 months fees and exclude indirect/consequential damages", "Accept uncapped damages", "Remove jurisdiction clause", "Double the fees"],
          correctAnswer: "Insert mutual cap equal to 12 months fees and exclude indirect/consequential damages",
        },
      },
    },
    {
      id: "law-day-3",
      position: { x: 90, y: 320 },
      data: {
        id: "law-day-3",
        day: 3,
        title: "Intellectual Property & Licensing Rights",
        subtitle: "Specialized Tooling Path A",
        description: "Protect client copyrights, patents, and trade secrets in cross-border software and media transfer agreements.",
        keyConcepts: ["Work Made for Hire", "IP Assignment vs License", "Moral Rights (Sec 57)", "Territorial Restraints"],
        prerequisites: ["law-day-2"],
        widgetType: "law_clause",
        taskInstructions: "Ensure client retains full ownership of custom source code written by an external vendor agency.",
        taskPayload: {
          options: ["Explicit irrevocable worldwide assignment of all foreground IP upon payment", "Non-exclusive revocable license", "Oral understanding", "Vendor retains all copyright"],
          correctAnswer: "Explicit irrevocable worldwide assignment of all foreground IP upon payment",
        },
      },
    },
    {
      id: "law-day-4",
      position: { x: 410, y: 320 },
      data: {
        id: "law-day-4",
        day: 4,
        title: "Arbitration & Dispute Resolution Clauses",
        subtitle: "Specialized Tooling Path B",
        description: "Draft valid arbitration agreements under the Arbitration and Conciliation Act 1996 with seat, venue, and governing law.",
        keyConcepts: ["Seat vs Venue", "Sole Arbitrator Appointment", "Interim Relief (Sec 9)", "Fast-Track Procedures"],
        prerequisites: ["law-day-2"],
        widgetType: "law_clause",
        taskInstructions: "Select the clause that avoids jurisdictional conflicts between Bombay High Court and Delhi High Court.",
        taskPayload: {
          options: ["Exclusive juridical seat designated in New Delhi under Indian Arbitration Act", "Venue only without specifying seat", "Parties can sue in any world court", "No arbitration clause"],
          correctAnswer: "Exclusive juridical seat designated in New Delhi under Indian Arbitration Act",
        },
      },
    },
    {
      id: "law-day-5",
      position: { x: 250, y: 470 },
      data: {
        id: "law-day-5",
        day: 5,
        title: "Statutory Interpretation & Precedent Synthesis",
        subtitle: "Cross-functional Problem Solving",
        description: "Apply the Golden Rule and Mischief Rule of statutory construction using Supreme Court of India constitutional bench precedents.",
        keyConcepts: ["Ratio Decidendi vs Obiter Dicta", "Literal vs Purposive Rule", "Stare Decisis", "Harmonious Construction"],
        prerequisites: ["law-day-3", "law-day-4"],
        widgetType: "law_clause",
        taskInstructions: "When interpreting Section 138 Negotiable Instruments Act, which Supreme Court doctrine governs cheque dishonor timelines?",
        taskPayload: {
          options: ["Strict adherence to statutory notice period of 15 days from receipt", "Cheque is valid forever", "No notice required", "Verbal notice suffices"],
          correctAnswer: "Strict adherence to statutory notice period of 15 days from receipt",
        },
      },
    },
    {
      id: "law-day-6",
      position: { x: 250, y: 610 },
      data: {
        id: "law-day-6",
        day: 6,
        title: "Cross-Examination & Evidentiary Proof",
        subtitle: "Real-world Edge Case Handling",
        description: "Admissibility of electronic evidence under Section 65B of Indian Evidence Act / Bharatiya Sakshya Adhiniyam.",
        keyConcepts: ["Sec 65B Mandatory Certificate", "Chain of Custody", "Hearsay Exceptions", "Leading Questions"],
        prerequisites: ["law-day-5"],
        widgetType: "law_clause",
        taskInstructions: "Opposing counsel presents WhatsApp printouts without a Section 65B certificate. Formulate your primary legal objection.",
        taskPayload: {
          options: ["Inadmissible secondary electronic record without valid accompanying Section 65B certificate", "Allow as absolute truth", "Ask for handwritten WhatsApp", "Object to paper color"],
          correctAnswer: "Inadmissible secondary electronic record without valid accompanying Section 65B certificate",
        },
      },
    },
    {
      id: "law-day-7",
      position: { x: 250, y: 750 },
      data: {
        id: "law-day-7",
        day: 7,
        title: "High Court Commercial Division Oral Arguments",
        subtitle: "Mini Capstone Work Simulation",
        description: "Present oral arguments securing an urgent ad-interim injunction restraining breach of trade secret confidentiality.",
        keyConcepts: ["Prima Facie Case", "Balance of Convenience", "Irreparable Injury Test", "Ad-Interim Restraint"],
        prerequisites: ["law-day-6"],
        widgetType: "law_clause",
        taskInstructions: "Satisfy all 3 prongs for grant of ad-interim injunction before the Commercial Bench.",
        taskPayload: {
          options: ["Demonstrate prima facie case, balance of convenience, and irreparable injury", "Request damages only", "Ask the court to decide next decade", "Claim copyright on public data"],
          correctAnswer: "Demonstrate prima facie case, balance of convenience, and irreparable injury",
        },
      },
    },
  ],
  edges: [
    { id: "e-law-1-2", source: "law-day-1", target: "law-day-2" },
    { id: "e-law-2-3", source: "law-day-2", target: "law-day-3" },
    { id: "e-law-2-4", source: "law-day-2", target: "law-day-4" },
    { id: "e-law-3-5", source: "law-day-3", target: "law-day-5" },
    { id: "e-law-4-5", source: "law-day-4", target: "law-day-5" },
    { id: "e-law-5-6", source: "law-day-5", target: "law-day-6" },
    { id: "e-law-6-7", source: "law-day-6", target: "law-day-7" },
  ],
};

// ─── 4. DOCTOR DAG ───────────────────────────────────────────────────────────
const DOCTOR_GRAPH: DAGGraphRole = {
  roleId: "doctor",
  roleTitle: "Doctor",
  roleIcon: "🩺",
  overview: "7-Day experiential journey through emergency clinical triage, diagnostic laboratory interpretation, cardiovascular cases, and medical ethics.",
  nodes: [
    {
      id: "doc-day-1",
      position: { x: 250, y: 30 },
      data: {
        id: "doc-day-1",
        day: 1,
        title: "Emergency ABCDE Triage & Vital Signs",
        subtitle: "Foundational Paradigm",
        description: "Assess critical patients using systematic Airway, Breathing, Circulation, Disability, and Exposure protocols.",
        keyConcepts: ["ABCDE Protocol", "Hypovolemic Shock Vitals", "Glasgow Coma Scale", "Emergency Stabilization"],
        prerequisites: [],
        widgetType: "doc_diag",
        taskInstructions: "A 48-year-old patient presents with BP 80/50, HR 125, cold extremities, and tachypnea. Identify the immediate primary intervention.",
        taskPayload: {
          vitals: "BP 80/50 mmHg, HR 125 bpm, RR 26/min, SpO2 93%",
          options: ["Secure large-bore IV access & initiate rapid crystalloid fluid resuscitation", "Send for non-urgent MRI", "Discharge with oral paracetamol", "Wait for routine blood test"],
          correctAnswer: "Secure large-bore IV access & initiate rapid crystalloid fluid resuscitation",
        },
      },
    },
    {
      id: "doc-day-2",
      position: { x: 250, y: 170 },
      data: {
        id: "doc-day-2",
        day: 2,
        title: "Complete Blood Count & Metabolic Calibration",
        subtitle: "Core Analytical Method",
        description: "Interpret hematological differentials, liver enzymes, and renal function markers (Creatinine, Electrolytes).",
        keyConcepts: ["Microcytic vs Macrocytic Anemia", "Electrolyte Imbalances", "Serum Creatinine / eGFR", "Infection Markers (CRP, TLC)"],
        prerequisites: ["doc-day-1"],
        widgetType: "doc_diag",
        taskInstructions: "Patient labs show Hb 7.2 g/dL, MCV 68 fL (low), Ferritin low. Diagnose the primary hematological disorder.",
        taskPayload: {
          options: ["Iron Deficiency Microcytic Anemia", "Vitamin B12 Megaloblastic Anemia", "Aplastic Anemia", "Acute Leukemia"],
          correctAnswer: "Iron Deficiency Microcytic Anemia",
        },
      },
    },
    {
      id: "doc-day-3",
      position: { x: 90, y: 320 },
      data: {
        id: "doc-day-3",
        day: 3,
        title: "12-Lead Electrocardiogram (ECG) Analysis",
        subtitle: "Specialized Tooling Path A",
        description: "Diagnose acute ST-elevation myocardial infarction (STEMI), arrhythmias, and bundle branch blocks.",
        keyConcepts: ["ST-Elevation in Leads II, III, aVF", "Troponin Biomarkers", "Door-to-Balloon Time", "Dual Antiplatelet Therapy"],
        prerequisites: ["doc-day-2"],
        widgetType: "doc_diag",
        taskInstructions: "ECG demonstrates 3mm ST elevation in Leads II, III, and aVF with reciprocal depressions in I and aVL. Diagnose the affected coronary territory.",
        taskPayload: {
          options: ["Acute Inferior Wall STEMI (Right Coronary Artery)", "Anterior Wall Infarction", "Benign Early Repolarization", "Normal ECG"],
          correctAnswer: "Acute Inferior Wall STEMI (Right Coronary Artery)",
        },
      },
    },
    {
      id: "doc-day-4",
      position: { x: 410, y: 320 },
      data: {
        id: "doc-day-4",
        day: 4,
        title: "Chest Radiography & Pulmonary Syndromes",
        subtitle: "Specialized Tooling Path B",
        description: "Differentiate lobar consolidation, pleural effusion, and pneumothorax on posteroanterior (PA) chest radiographs.",
        keyConcepts: ["Silhouette Sign", "Costophrenic Angle Blunting", "Tension Pneumothorax Decompression", "Community Acquired Pneumonia"],
        prerequisites: ["doc-day-2"],
        widgetType: "doc_diag",
        taskInstructions: "Chest X-ray shows homogeneous opacity obliterating right costophrenic angle with a meniscus sign. What is the diagnosis?",
        taskPayload: {
          options: ["Right-sided Pleural Effusion", "Pneumothorax with absent lung markings", "Normal lung parenchyma", "Foreign body in esophagus"],
          correctAnswer: "Right-sided Pleural Effusion",
        },
      },
    },
    {
      id: "doc-day-5",
      position: { x: 250, y: 470 },
      data: {
        id: "doc-day-5",
        day: 5,
        title: "Antimicrobial Stewardship & Infection Control",
        subtitle: "Cross-functional Problem Solving",
        description: "Prescribe empirical antibiotics based on culture sensitivities while curbing multi-drug resistant pathogens.",
        keyConcepts: ["Broad vs Narrow Spectrum", "Hospital Acquired Pneumonia (HAP)", "Renal Dose Adjustments", "C. diff Prevention"],
        prerequisites: ["doc-day-3", "doc-day-4"],
        widgetType: "doc_diag",
        taskInstructions: "A patient with severe pneumonia and impaired GFR requires antibiotic dosage adjustment. Which principle must be applied?",
        taskPayload: {
          options: ["Calculate creatinine clearance and adjust hydrophilic antibiotic dose (e.g. Vancomycin/Aminoglycosides)", "Maintain toxic dose unchanged", "Stop all antibiotics immediately", "Give 10x higher dose"],
          correctAnswer: "Calculate creatinine clearance and adjust hydrophilic antibiotic dose (e.g. Vancomycin/Aminoglycosides)",
        },
      },
    },
    {
      id: "doc-day-6",
      position: { x: 250, y: 610 },
      data: {
        id: "doc-day-6",
        day: 6,
        title: "Neurological Stroke Protocol & Time-Windows",
        subtitle: "Real-world Edge Case Handling",
        description: "Conduct FAST examination, differentiate ischemic vs hemorrhagic stroke on NCCT head, and administer thrombolysis within 4.5 hours.",
        keyConcepts: ["Non-Contrast CT Head", "tPA / Thrombolytic Window", "Contraindications to Thrombolysis", "NIH Stroke Scale"],
        prerequisites: ["doc-day-5"],
        widgetType: "doc_diag",
        taskInstructions: "Acute onset hemiparesis 2 hours ago. NCCT brain rules out hemorrhage. Patient has no active bleed. What is the gold standard therapy?",
        taskPayload: {
          options: ["Immediate IV Thrombolysis (r-tPA) within the 4.5-hour therapeutic window", "Wait 48 hours for observation", "High dose blood thinners without scanning", "Immediate discharge"],
          correctAnswer: "Immediate IV Thrombolysis (r-tPA) within the 4.5-hour therapeutic window",
        },
      },
    },
    {
      id: "doc-day-7",
      position: { x: 250, y: 750 },
      data: {
        id: "doc-day-7",
        day: 7,
        title: "ICU Multidisciplinary Grand Round Simulation",
        subtitle: "Mini Capstone Work Simulation",
        description: "Manage a multi-organ dysfunction case integrating sepsis guidelines, mechanical ventilation, and empathetic family counseling.",
        keyConcepts: ["Septic Shock Surviving Sepsis Bundle", "Inotropic Support (Noradrenaline)", "Informed Consent", "Empathetic Communication"],
        prerequisites: ["doc-day-6"],
        widgetType: "doc_diag",
        taskInstructions: "Execute full Sepsis-3 resuscitation bundle within 1 hour: Blood cultures, broad antibiotics, IV crystalloids, and lactate clearance.",
        taskPayload: {
          options: ["Execute Surviving Sepsis 1-hour bundle with noradrenaline titration for MAP >= 65 mmHg", "Give sleeping pills", "Do nothing", "Order non-urgent clinic review"],
          correctAnswer: "Execute Surviving Sepsis 1-hour bundle with noradrenaline titration for MAP >= 65 mmHg",
        },
      },
    },
  ],
  edges: [
    { id: "e-doc-1-2", source: "doc-day-1", target: "doc-day-2" },
    { id: "e-doc-2-3", source: "doc-day-2", target: "doc-day-3" },
    { id: "e-doc-2-4", source: "doc-day-2", target: "doc-day-4" },
    { id: "e-doc-3-5", source: "doc-day-3", target: "doc-day-5" },
    { id: "e-doc-4-5", source: "doc-day-4", target: "doc-day-5" },
    { id: "e-doc-5-6", source: "doc-day-5", target: "doc-day-6" },
    { id: "e-doc-6-7", source: "doc-day-6", target: "doc-day-7" },
  ],
};

// ─── 5. PHARMACIST DAG ───────────────────────────────────────────────────────
const PHARMACIST_GRAPH: DAGGraphRole = {
  roleId: "pharmacist",
  roleTitle: "Pharmacist",
  roleIcon: "💊",
  overview: "7-Day experiential roadmap exploring drug formulations, pharmacokinetics, hazardous drug-drug interactions, and clinical dispensing safety.",
  nodes: [
    {
      id: "pharm-day-1",
      position: { x: 250, y: 30 },
      data: {
        id: "pharm-day-1",
        day: 1,
        title: "Pharmacokinetics: ADME Principles",
        subtitle: "Foundational Paradigm",
        description: "Calculate drug Absorption, Distribution, Metabolism, and Excretion parameters: half-life, bio-availability, and volume of distribution.",
        keyConcepts: ["First-Pass Metabolism", "Bio-availability (F)", "Plasma Half-life (t1/2)", "Steady-State Concentration"],
        prerequisites: [],
        widgetType: "pharm_audit",
        taskInstructions: "A drug has an elimination half-life of 6 hours. Calculate how many hours are required to reach 95% steady-state concentration (4 to 5 half-lives).",
        taskPayload: {
          options: ["24 to 30 hours", "6 hours", "12 hours", "100 hours"],
          correctAnswer: "24 to 30 hours",
        },
      },
    },
    {
      id: "pharm-day-2",
      position: { x: 250, y: 170 },
      data: {
        id: "pharm-day-2",
        day: 2,
        title: "Drug-Drug Interaction & CYP450 Enzymes",
        subtitle: "Core Analytical Method",
        description: "Identify hazardous interactions caused by Cytochrome P450 enzyme inducers and inhibitors (e.g. Warfarin + Clarithromycin).",
        keyConcepts: ["CYP3A4 / CYP2C9 Enzymes", "Enzyme Inhibition vs Induction", "Narrow Therapeutic Index", "INR Monitoring"],
        prerequisites: ["pharm-day-1"],
        widgetType: "pharm_audit",
        taskInstructions: "A patient on Warfarin is prescribed Clarithromycin (a potent CYP3A4 inhibitor). What lethal risk must the pharmacist flag?",
        taskPayload: {
          options: ["Severe bleeding hemorrhage due to elevated active Warfarin levels", "Reduced efficacy of Warfarin leading to clot", "Zero interaction", "Instant cure"],
          correctAnswer: "Severe bleeding hemorrhage due to elevated active Warfarin levels",
        },
      },
    },
    {
      id: "pharm-day-3",
      position: { x: 90, y: 320 },
      data: {
        id: "pharm-day-3",
        day: 3,
        title: "Pediatric & Geriatric Dose Calibration",
        subtitle: "Specialized Tooling Path A",
        description: "Apply Young's, Dilling's, and Clark's rules to calculate accurate milligram-per-kilogram doses for neonates and elderly patients.",
        keyConcepts: ["mg/kg Body Weight Sizing", "Body Surface Area (BSA)", "Cockcroft-Gault Equation", "Immature Hepatic Clearance"],
        prerequisites: ["pharm-day-2"],
        widgetType: "pharm_audit",
        taskInstructions: "Calculate the single dose of Amoxicillin (20 mg/kg/dose) for a 15 kg child.",
        taskPayload: {
          options: ["300 mg per dose", "100 mg per dose", "500 mg per dose", "1500 mg per dose"],
          correctAnswer: "300 mg per dose",
        },
      },
    },
    {
      id: "pharm-day-4",
      position: { x: 410, y: 320 },
      data: {
        id: "pharm-day-4",
        day: 4,
        title: "Formulation Chemistry & Stability Testing",
        subtitle: "Specialized Tooling Path B",
        description: "Design sustained-release matrix tablets, excipient compatibility protocols, and accelerated shelf-life stability tests.",
        keyConcepts: ["Hydrophilic Matrix Tablets", "Accelerated ICH Stability (40C/75% RH)", "Polymorphism", "Dissolution Profiling"],
        prerequisites: ["pharm-day-2"],
        widgetType: "pharm_audit",
        taskInstructions: "Which excipient is universally utilized as an enteric coating polymer to resist gastric acid in delayed-release aspirin?",
        taskPayload: {
          options: ["Cellulose Acetate Phthalate (CAP)", "Pure Water", "Simple Sucrose syrup", "Calcium carbonate"],
          correctAnswer: "Cellulose Acetate Phthalate (CAP)",
        },
      },
    },
    {
      id: "pharm-day-5",
      position: { x: 250, y: 470 },
      data: {
        id: "pharm-day-5",
        day: 5,
        title: "Chemotherapy Compounding & Sterile Protocols",
        subtitle: "Cross-functional Problem Solving",
        description: "Operate Class II Type B2 biological safety cabinets for hazardous cytotoxic antineoplastic reconstitution.",
        keyConcepts: ["Laminar Air Flow (ISO Class 5)", "Closed System Drug Transfer (CSTD)", "Spill Kits", "Cleanroom Gowning"],
        prerequisites: ["pharm-day-3", "pharm-day-4"],
        widgetType: "pharm_audit",
        taskInstructions: "To prepare cytotoxic Cisplatin infusions safely, which engineering control is mandatory to protect the compounding pharmacist?",
        taskPayload: {
          options: ["Negative-pressure Class II Type B2 Biological Safety Cabinet vented 100% outdoors", "Open benchtop under ceiling fan", "Kitchen microwave", "Standard laminar flow cabinet with recirculating air"],
          correctAnswer: "Negative-pressure Class II Type B2 Biological Safety Cabinet vented 100% outdoors",
        },
      },
    },
    {
      id: "pharm-day-6",
      position: { x: 250, y: 610 },
      data: {
        id: "pharm-day-6",
        day: 6,
        title: "Therapeutic Drug Monitoring (TDM)",
        subtitle: "Real-world Edge Case Handling",
        description: "Measure peak and trough serum concentrations for narrow therapeutic index drugs (Digoxin, Gentamicin, Lithium).",
        keyConcepts: ["Trough Concentration Sampling", "Ototoxicity & Nephrotoxicity", "Area Under the Curve (AUC)", "Dose Individualization"],
        prerequisites: ["pharm-day-5"],
        widgetType: "pharm_audit",
        taskInstructions: "A patient on Gentamicin shows an elevated trough level of 3.2 mcg/mL (safe target < 1 mcg/mL). What action must the pharmacist recommend?",
        taskPayload: {
          options: ["Extend the dosing interval to allow complete renal clearance and prevent nephrotoxicity", "Increase dose frequency to every 2 hours", "Double the dose immediately", "Ignore the lab result"],
          correctAnswer: "Extend the dosing interval to allow complete renal clearance and prevent nephrotoxicity",
        },
      },
    },
    {
      id: "pharm-day-7",
      position: { x: 250, y: 750 },
      data: {
        id: "pharm-day-7",
        day: 7,
        title: "Hospital Clinical Pharmacy Formulary Audit",
        subtitle: "Mini Capstone Work Simulation",
        description: "Conduct a comprehensive pharmacovigilance safety audit on polypharmacy prescriptions for an intensive care ward.",
        keyConcepts: ["Medication Reconciliation", "Pharmacovigilance (ADR Reporting)", "Cost-Effectiveness Pharmacoeconomics", "Zero-Defect Dispensing"],
        prerequisites: ["pharm-day-6"],
        widgetType: "pharm_audit",
        taskInstructions: "Final Audit: Intercept polypharmacy conflict between ACE Inhibitors + Potassium-Sparing Diuretics + Potassium supplements.",
        taskPayload: {
          options: ["Flag fatal risk of severe Hyperkalemia cardiac arrest and recommend stopping K+ supplement", "Approve all 3 medications together", "Add another potassium tablet", "No intervention needed"],
          correctAnswer: "Flag fatal risk of severe Hyperkalemia cardiac arrest and recommend stopping K+ supplement",
        },
      },
    },
  ],
  edges: [
    { id: "e-pharm-1-2", source: "pharm-day-1", target: "pharm-day-2" },
    { id: "e-pharm-2-3", source: "pharm-day-2", target: "pharm-day-3" },
    { id: "e-pharm-2-4", source: "pharm-day-2", target: "pharm-day-4" },
    { id: "e-pharm-3-5", source: "pharm-day-3", target: "pharm-day-5" },
    { id: "e-pharm-4-5", source: "pharm-day-4", target: "pharm-day-5" },
    { id: "e-pharm-5-6", source: "pharm-day-5", target: "pharm-day-6" },
    { id: "e-pharm-6-7", source: "pharm-day-6", target: "pharm-day-7" },
  ],
};

// ─── Map of all 5 hand-crafted DAG graphs by roleId ─────────────────────────
export const ROLE_DAG_GRAPHS: Record<string, DAGGraphRole> = {
  "software-engineer": SOFTWARE_ENGINEER_GRAPH,
  "business-analyst": BUSINESS_ANALYST_GRAPH,
  "lawyer": LAWYER_GRAPH,
  "doctor": DOCTOR_GRAPH,
  "pharmacist": PHARMACIST_GRAPH,
};

// ─── Domain Category Classifier ──────────────────────────────────────────────

export type DomainCategory =
  | "Tech & Engineering"
  | "Data & Finance"
  | "Design & Product"
  | "Healthcare & Science"
  | "Legal & Consulting";

const ROLE_DOMAIN_MAP: Record<string, DomainCategory> = {
  "software-engineer":             "Tech & Engineering",
  "ai-ml-engineer":                "Tech & Engineering",
  "cybersecurity-cloud-engineer":  "Tech & Engineering",
  "electronics-embedded-engineer": "Tech & Engineering",
  "mechanical-robotics-engineer":  "Tech & Engineering",
  "civil-structural-engineer":     "Tech & Engineering",
  "data-scientist":                "Data & Finance",
  "business-analyst":              "Data & Finance",
  "financial-analyst":             "Data & Finance",
  "digital-marketing-growth":      "Data & Finance",
  "ui-ux-product-designer":        "Design & Product",
  "product-manager":               "Design & Product",
  "doctor":                        "Healthcare & Science",
  "pharmacist":                    "Healthcare & Science",
  "biotech-genomics-researcher":   "Healthcare & Science",
  "lawyer":                        "Legal & Consulting",
  "management-consultant":         "Legal & Consulting",
};

export function getDomainCategory(roleId: string): DomainCategory {
  return ROLE_DOMAIN_MAP[roleId] ?? "Tech & Engineering";
}

// ─── Role metadata for generated DAGs ────────────────────────────────────────

const ROLE_META: Record<string, { title: string; icon: string; overview: string }> = {
  "ai-ml-engineer":              { title: "AI / Machine Learning Engineer",           icon: "🤖", overview: "7-Day hands-on journey through ML pipeline design, feature engineering, model training, and production MLOps deployment." },
  "data-scientist":              { title: "Data Scientist",                            icon: "📊", overview: "7-Day experiential path through EDA, statistical modelling, predictive inference, and dashboard storytelling." },
  "cybersecurity-cloud-engineer":{ title: "Cybersecurity & Cloud Engineer",           icon: "🛡️", overview: "7-Day immersion in zero-trust architecture, threat modelling, cloud IAM hardening, and incident response simulation." },
  "electronics-embedded-engineer":{ title: "Electronics & Embedded Systems Engineer", icon: "⚙️", overview: "7-Day embedded sprint covering microcontroller programming, signal processing, RTOS, and IoT protocol design." },
  "mechanical-robotics-engineer":{ title: "Mechanical & Robotics Engineer",           icon: "🦾", overview: "7-Day simulation of mechanical design, kinematics modelling, ROS robotics stack, and manufacturing validation." },
  "civil-structural-engineer":   { title: "Civil & Structural Engineer",              icon: "🏗️", overview: "7-Day structural analysis sprint covering load calculations, blueprint reading, material selection, and safety compliance." },
  "financial-analyst":           { title: "Financial Analyst / Investment Specialist",icon: "📈", overview: "7-Day deep dive into financial modelling, DCF valuation, portfolio risk analytics, and investment thesis construction." },
  "product-manager":             { title: "Product Manager",                          icon: "🗺️", overview: "7-Day product sprint: user research, PRD drafting, OKR definition, roadmap prioritisation, and go-to-market planning." },
  "management-consultant":       { title: "Management Consultant",                    icon: "💼", overview: "7-Day consulting simulation: hypothesis-driven problem solving, MECE structuring, case presentation, and stakeholder management." },
  "digital-marketing-growth":    { title: "Digital Marketing & Growth Strategist",    icon: "📣", overview: "7-Day growth boot camp: funnel analytics, A/B test design, SEO/SEM strategy, conversion optimisation, and campaign ROI reporting." },
  "ui-ux-product-designer":      { title: "UI/UX & Product Designer",                 icon: "🎨", overview: "7-Day design sprint from empathy mapping and wireframing through high-fidelity prototyping, usability testing, and design-system docs." },
  "biotech-genomics-researcher": { title: "Biotechnology & Genomic Researcher",       icon: "🧬", overview: "7-Day journey from PCR protocols and sequence alignment through variant calling and CRISPR target validation." },
};

// ─── DAG Template Builder: Tech & Engineering ─────────────────────────────────

function buildTechEngineeringDAG(roleId: string): DAGGraphRole {
  const meta = ROLE_META[roleId] ?? { title: roleId, icon: "⚙️", overview: "7-Day engineering micro-project pathway." };
  const p = roleId.slice(0, 4);
  return {
    roleId,
    roleTitle: meta.title,
    roleIcon: meta.icon,
    overview: meta.overview,
    nodes: [
      {
        id: `${p}-day-1`, position: { x: 250, y: 30 },
        data: { id: `${p}-day-1`, day: 1, title: "System Architecture Foundations", subtitle: "Foundational Paradigm",
          description: "Deconstruct the domain's core system architecture, component responsibilities, and data-flow contracts.",
          keyConcepts: ["Component Design", "Separation of Concerns", "Interface Contracts", "Dependency Inversion"],
          prerequisites: [], widgetType: "tech_logic",
          taskInstructions: "Identify the architectural anti-pattern in the provided diagram and propose the correct decoupled structure.",
          taskPayload: { correctAnswer: "decoupled", challengeType: "architecture" } },
      },
      {
        id: `${p}-day-2`, position: { x: 250, y: 170 },
        data: { id: `${p}-day-2`, day: 2, title: "Algorithm Logic & Complexity Optimisation", subtitle: "Core Analytical Method",
          description: "Master fundamental algorithmic patterns and optimise time/space complexity for domain-specific problem classes.",
          keyConcepts: ["Big-O Analysis", "Greedy vs DP", "Recursion Trees", "Space-Time Tradeoff"],
          prerequisites: [`${p}-day-1`], widgetType: "tech_logic",
          taskInstructions: "Optimise the provided O(n²) algorithm to O(n log n) by applying the correct data structure.",
          taskPayload: { correctAnswer: "sort", challengeType: "optimise_algo" } },
      },
      {
        id: `${p}-day-3`, position: { x: 90, y: 320 },
        data: { id: `${p}-day-3`, day: 3, title: "API & Protocol Interactivity", subtitle: "Specialised Tooling Path A",
          description: "Design and validate domain-specific API contracts, protocol semantics, and data-interchange schemas.",
          keyConcepts: ["REST / gRPC", "Schema Validation", "Idempotency", "Error Propagation"],
          prerequisites: [`${p}-day-2`], widgetType: "tech_logic",
          taskInstructions: "Fix the broken API response contract: correct the missing status code and the malformed payload schema.",
          taskPayload: { correctAnswer: "422", challengeType: "api_contract" } },
      },
      {
        id: `${p}-day-4`, position: { x: 410, y: 320 },
        data: { id: `${p}-day-4`, day: 4, title: "Edge-Case Debugging & Fault Isolation", subtitle: "Specialised Tooling Path B",
          description: "Systematically isolate failure modes, edge-case regressions, and boundary violations using structured debugging.",
          keyConcepts: ["Boundary Testing", "Root Cause Analysis", "Fault Injection", "Observability Hooks"],
          prerequisites: [`${p}-day-2`], widgetType: "tech_logic",
          taskInstructions: "Trace the root cause of the intermittent null-pointer exception and apply the defensive guard.",
          taskPayload: { correctAnswer: "null-check", challengeType: "debug_edge" } },
      },
      {
        id: `${p}-day-5`, position: { x: 250, y: 470 },
        data: { id: `${p}-day-5`, day: 5, title: "Integration & Cross-Functional Validation", subtitle: "Cross-functional Problem Solving",
          description: "Validate end-to-end integration between domain sub-systems and cross-functional service dependencies.",
          keyConcepts: ["Integration Testing", "Contract Verification", "Regression Suites", "CI Pipeline Gates"],
          prerequisites: [`${p}-day-3`, `${p}-day-4`], widgetType: "tech_logic",
          taskInstructions: "Configure the integration test harness to verify both the happy path and the failure rollback scenario.",
          taskPayload: { correctAnswer: "rollback", challengeType: "integration" } },
      },
      {
        id: `${p}-day-6`, position: { x: 250, y: 610 },
        data: { id: `${p}-day-6`, day: 6, title: "Security Hardening & Compliance Audit", subtitle: "Real-world Edge Case Handling",
          description: "Identify and patch domain-specific security vulnerabilities, enforce access controls, and validate compliance posture.",
          keyConcepts: ["Least Privilege", "Input Sanitisation", "Audit Logging", "Compliance Checklists"],
          prerequisites: [`${p}-day-5`], widgetType: "tech_logic",
          taskInstructions: "Patch the privilege escalation vector by enforcing role-based access control on the identified endpoint.",
          taskPayload: { correctAnswer: "rbac", challengeType: "security" } },
      },
      {
        id: `${p}-day-7`, position: { x: 250, y: 750 },
        data: { id: `${p}-day-7`, day: 7, title: "Mini Capstone: Production Deployment Sprint", subtitle: "Mini Capstone Work Simulation",
          description: "Simulate a real deployment scenario end-to-end: design, build, validate, and ship a production-grade domain artefact.",
          keyConcepts: ["Production Readiness", "Load Testing", "Rollback Strategies", "Post-deployment Monitoring"],
          prerequisites: [`${p}-day-6`], widgetType: "tech_logic",
          taskInstructions: "Execute the final deployment checklist: verify artefact build, health probes, and production seal.",
          taskPayload: { correctAnswer: "deployed", challengeType: "capstone" } },
      },
    ],
    edges: [
      { id: `e-${p}-1-2`, source: `${p}-day-1`, target: `${p}-day-2` },
      { id: `e-${p}-2-3`, source: `${p}-day-2`, target: `${p}-day-3` },
      { id: `e-${p}-2-4`, source: `${p}-day-2`, target: `${p}-day-4` },
      { id: `e-${p}-3-5`, source: `${p}-day-3`, target: `${p}-day-5` },
      { id: `e-${p}-4-5`, source: `${p}-day-4`, target: `${p}-day-5` },
      { id: `e-${p}-5-6`, source: `${p}-day-5`, target: `${p}-day-6` },
      { id: `e-${p}-6-7`, source: `${p}-day-6`, target: `${p}-day-7` },
    ],
  };
}

// ─── DAG Template Builder: Data & Finance ────────────────────────────────────

function buildDataFinanceDAG(roleId: string): DAGGraphRole {
  const meta = ROLE_META[roleId] ?? { title: roleId, icon: "📊", overview: "7-Day data and finance micro-project pathway." };
  const p = roleId.slice(0, 4);
  return {
    roleId,
    roleTitle: meta.title,
    roleIcon: meta.icon,
    overview: meta.overview,
    nodes: [
      {
        id: `${p}-day-1`, position: { x: 250, y: 30 },
        data: { id: `${p}-day-1`, day: 1, title: "Dataset Inspection & Profiling", subtitle: "Foundational Paradigm",
          description: "Perform comprehensive EDA: detect null distributions, outlier bands, and schema mismatches.",
          keyConcepts: ["EDA", "Null Handling", "Distribution Analysis", "Schema Validation"],
          prerequisites: [], widgetType: "data_query",
          taskInstructions: "Identify the column with the highest null-rate and the outlier that would skew the mean by >15%.",
          taskPayload: { correctAnswer: "outlier", challengeType: "eda" } },
      },
      {
        id: `${p}-day-2`, position: { x: 250, y: 170 },
        data: { id: `${p}-day-2`, day: 2, title: "SQL / Data Cleaning Pipeline", subtitle: "Core Analytical Method",
          description: "Design idempotent SQL pipelines to clean, deduplicate, and normalise domain-specific datasets at scale.",
          keyConcepts: ["CTEs", "Window Functions", "Deduplication", "Type Casting"],
          prerequisites: [`${p}-day-1`], widgetType: "data_query",
          taskInstructions: "Fix the SQL window function to correctly calculate 7-day rolling revenue without double-counting refunds.",
          taskPayload: { correctAnswer: "partition by", challengeType: "sql_window" } },
      },
      {
        id: `${p}-day-3`, position: { x: 90, y: 320 },
        data: { id: `${p}-day-3`, day: 3, title: "Metric Modelling & KPI Definition", subtitle: "Specialised Tooling Path A",
          description: "Define, validate, and baseline north-star metrics, leading indicators, and lagging KPIs for domain performance.",
          keyConcepts: ["North-Star Metric", "Leading vs Lagging", "OKRs", "Variance Attribution"],
          prerequisites: [`${p}-day-2`], widgetType: "data_query",
          taskInstructions: "Select the most appropriate north-star metric for the given business scenario and justify with variance breakdown.",
          taskPayload: { correctAnswer: "retention", challengeType: "kpi_model" } },
      },
      {
        id: `${p}-day-4`, position: { x: 410, y: 320 },
        data: { id: `${p}-day-4`, day: 4, title: "Trend Analysis & Forecasting", subtitle: "Specialised Tooling Path B",
          description: "Apply time-series decomposition, seasonality isolation, and regression-based forecasting for domain demand signals.",
          keyConcepts: ["Time-Series Decomposition", "ARIMA", "Seasonality Adjustment", "Confidence Intervals"],
          prerequisites: [`${p}-day-2`], widgetType: "data_query",
          taskInstructions: "Identify the seasonal peak and provide the corrected trend forecast after removing the holiday anomaly.",
          taskPayload: { correctAnswer: "seasonal", challengeType: "forecast" } },
      },
      {
        id: `${p}-day-5`, position: { x: 250, y: 470 },
        data: { id: `${p}-day-5`, day: 5, title: "Segmentation & Cohort Analysis", subtitle: "Cross-functional Problem Solving",
          description: "Build behavioural cohorts, compute retention curves, and segment users/assets for targeted strategy recommendations.",
          keyConcepts: ["Cohort Retention", "RFM Segmentation", "Churn Prediction", "Lifetime Value"],
          prerequisites: [`${p}-day-3`, `${p}-day-4`], widgetType: "data_query",
          taskInstructions: "Compute 30-day retention for Cohort Jan vs Cohort Feb and identify the highest-churn segment.",
          taskPayload: { correctAnswer: "cohort", challengeType: "segmentation" } },
      },
      {
        id: `${p}-day-6`, position: { x: 250, y: 610 },
        data: { id: `${p}-day-6`, day: 6, title: "Insight Narrative & Stakeholder Report", subtitle: "Real-world Edge Case Handling",
          description: "Translate quantitative findings into executive-level insight narratives with actionable recommendations and risk flags.",
          keyConcepts: ["Data Storytelling", "Executive Summary", "Confidence Caveats", "Recommendation Framing"],
          prerequisites: [`${p}-day-5`], widgetType: "data_query",
          taskInstructions: "Draft a one-paragraph executive summary of the cohort analysis identifying the top risk and top opportunity.",
          taskPayload: { correctAnswer: "insight", challengeType: "narrative" } },
      },
      {
        id: `${p}-day-7`, position: { x: 250, y: 750 },
        data: { id: `${p}-day-7`, day: 7, title: "Dashboard Capstone: Live Analytics Build", subtitle: "Mini Capstone Work Simulation",
          description: "Assemble a production-grade interactive dashboard consolidating all week's insights with auto-refresh and drill-downs.",
          keyConcepts: ["Dashboard Design", "Drill-Down Charts", "Auto-Refresh Pipelines", "Cross-Filter Logic"],
          prerequisites: [`${p}-day-6`], widgetType: "data_query",
          taskInstructions: "Complete the dashboard specification: define the chart types, filter dimensions, and refresh cadence.",
          taskPayload: { correctAnswer: "dashboard", challengeType: "capstone" } },
      },
    ],
    edges: [
      { id: `e-${p}-1-2`, source: `${p}-day-1`, target: `${p}-day-2` },
      { id: `e-${p}-2-3`, source: `${p}-day-2`, target: `${p}-day-3` },
      { id: `e-${p}-2-4`, source: `${p}-day-2`, target: `${p}-day-4` },
      { id: `e-${p}-3-5`, source: `${p}-day-3`, target: `${p}-day-5` },
      { id: `e-${p}-4-5`, source: `${p}-day-4`, target: `${p}-day-5` },
      { id: `e-${p}-5-6`, source: `${p}-day-5`, target: `${p}-day-6` },
      { id: `e-${p}-6-7`, source: `${p}-day-6`, target: `${p}-day-7` },
    ],
  };
}

// ─── DAG Template Builder: Design & Product ──────────────────────────────────

function buildDesignProductDAG(roleId: string): DAGGraphRole {
  const meta = ROLE_META[roleId] ?? { title: roleId, icon: "🎨", overview: "7-Day design and product sprint." };
  const p = roleId.slice(0, 4);
  return {
    roleId,
    roleTitle: meta.title,
    roleIcon: meta.icon,
    overview: meta.overview,
    nodes: [
      {
        id: `${p}-day-1`, position: { x: 250, y: 30 },
        data: { id: `${p}-day-1`, day: 1, title: "User Problem Definition & Research Synthesis", subtitle: "Foundational Paradigm",
          description: "Synthesise user interviews, behavioural data, and competitor benchmarks into a validated problem statement.",
          keyConcepts: ["Jobs-to-Be-Done", "Pain Point Mapping", "Affinity Diagrams", "HMW Statements"],
          prerequisites: [], widgetType: "design_flow",
          taskInstructions: "Reframe the vague feature request into a validated user problem statement using the JTBD framework.",
          taskPayload: { correctAnswer: "jtbd", challengeType: "problem_frame" } },
      },
      {
        id: `${p}-day-2`, position: { x: 250, y: 170 },
        data: { id: `${p}-day-2`, day: 2, title: "Wireframing & Information Architecture", subtitle: "Core Analytical Method",
          description: "Construct low-fidelity wireframes and information architecture blueprints aligned with user mental models.",
          keyConcepts: ["Card Sorting", "Navigation Hierarchies", "Content Prioritisation", "Sketch Fidelity Levels"],
          prerequisites: [`${p}-day-1`], widgetType: "design_flow",
          taskInstructions: "Critique the wireframe: identify the navigation anti-pattern and propose the corrected IA structure.",
          taskPayload: { correctAnswer: "hierarchy", challengeType: "ia_critique" } },
      },
      {
        id: `${p}-day-3`, position: { x: 90, y: 320 },
        data: { id: `${p}-day-3`, day: 3, title: "User Flow & Interaction Auditing", subtitle: "Specialised Tooling Path A",
          description: "Audit end-to-end user flows for friction points, drop-off triggers, and interaction design violations.",
          keyConcepts: ["User Flow Diagrams", "Friction Analysis", "Task Completion Rate", "Heatmap Interpretation"],
          prerequisites: [`${p}-day-2`], widgetType: "design_flow",
          taskInstructions: "Map the drop-off step in the checkout flow and propose the friction-reducing redesign.",
          taskPayload: { correctAnswer: "friction", challengeType: "flow_audit" } },
      },
      {
        id: `${p}-day-4`, position: { x: 410, y: 320 },
        data: { id: `${p}-day-4`, day: 4, title: "Metric Strategy & Success Definition", subtitle: "Specialised Tooling Path B",
          description: "Define product success metrics, instrumentation plans, and experiment hypotheses aligned to business outcomes.",
          keyConcepts: ["HEART Framework", "Instrumentation", "Hypothesis Design", "Guardrail Metrics"],
          prerequisites: [`${p}-day-2`], widgetType: "design_flow",
          taskInstructions: "Select the primary and guardrail metrics for the redesigned checkout feature and justify each choice.",
          taskPayload: { correctAnswer: "conversion", challengeType: "metric_strategy" } },
      },
      {
        id: `${p}-day-5`, position: { x: 250, y: 470 },
        data: { id: `${p}-day-5`, day: 5, title: "Usability Testing & Iteration", subtitle: "Cross-functional Problem Solving",
          description: "Design and execute moderated usability tests, synthesise findings, and produce a prioritised iteration backlog.",
          keyConcepts: ["Think-Aloud Protocol", "Task Scenario Design", "Severity Rating", "Backlog Prioritisation"],
          prerequisites: [`${p}-day-3`, `${p}-day-4`], widgetType: "design_flow",
          taskInstructions: "Prioritise usability findings using the severity × frequency matrix and assign sprint iterations.",
          taskPayload: { correctAnswer: "priority", challengeType: "usability" } },
      },
      {
        id: `${p}-day-6`, position: { x: 250, y: 610 },
        data: { id: `${p}-day-6`, day: 6, title: "High-Fidelity Prototype & Design System Docs", subtitle: "Real-world Edge Case Handling",
          description: "Produce pixel-perfect high-fidelity prototypes and contribute design tokens to the shared component library.",
          keyConcepts: ["Design Tokens", "Component Variants", "Accessibility WCAG", "Handoff Specs"],
          prerequisites: [`${p}-day-5`], widgetType: "design_flow",
          taskInstructions: "Audit the prototype for WCAG 2.1 AA violations and document the corrected colour contrast ratios.",
          taskPayload: { correctAnswer: "contrast", challengeType: "a11y" } },
      },
      {
        id: `${p}-day-7`, position: { x: 250, y: 750 },
        data: { id: `${p}-day-7`, day: 7, title: "Design Critique Capstone & Stakeholder Pitch", subtitle: "Mini Capstone Work Simulation",
          description: "Present and defend the complete design solution in a structured critique session incorporating cross-functional feedback.",
          keyConcepts: ["Design Critique Format", "Storytelling", "Trade-off Articulation", "Stakeholder Alignment"],
          prerequisites: [`${p}-day-6`], widgetType: "design_flow",
          taskInstructions: "Prepare a 3-slide design narrative: Problem → Solution → Metrics. Identify the strongest counter-argument and rebut it.",
          taskPayload: { correctAnswer: "narrative", challengeType: "capstone" } },
      },
    ],
    edges: [
      { id: `e-${p}-1-2`, source: `${p}-day-1`, target: `${p}-day-2` },
      { id: `e-${p}-2-3`, source: `${p}-day-2`, target: `${p}-day-3` },
      { id: `e-${p}-2-4`, source: `${p}-day-2`, target: `${p}-day-4` },
      { id: `e-${p}-3-5`, source: `${p}-day-3`, target: `${p}-day-5` },
      { id: `e-${p}-4-5`, source: `${p}-day-4`, target: `${p}-day-5` },
      { id: `e-${p}-5-6`, source: `${p}-day-5`, target: `${p}-day-6` },
      { id: `e-${p}-6-7`, source: `${p}-day-6`, target: `${p}-day-7` },
    ],
  };
}

// ─── DAG Template Builder: Healthcare & Science ──────────────────────────────

function buildHealthcareScienceDAG(roleId: string): DAGGraphRole {
  const meta = ROLE_META[roleId] ?? { title: roleId, icon: "🧬", overview: "7-Day healthcare and science micro-project pathway." };
  const p = roleId.slice(0, 4);
  return {
    roleId,
    roleTitle: meta.title,
    roleIcon: meta.icon,
    overview: meta.overview,
    nodes: [
      {
        id: `${p}-day-1`, position: { x: 250, y: 30 },
        data: { id: `${p}-day-1`, day: 1, title: "Case Diagnostic & Scientific Framing", subtitle: "Foundational Paradigm",
          description: "Systematically frame a complex clinical or scientific problem using structured diagnostic reasoning frameworks.",
          keyConcepts: ["Differential Diagnosis", "Hypothesis Ranking", "Clinical Reasoning", "Evidence Levels"],
          prerequisites: [], widgetType: "doc_diag",
          taskInstructions: "Rank the top three differential diagnoses from the provided patient history and lab values using likelihood ratios.",
          taskPayload: { correctAnswer: "differential", challengeType: "diagnosis" } },
      },
      {
        id: `${p}-day-2`, position: { x: 250, y: 170 },
        data: { id: `${p}-day-2`, day: 2, title: "Protocol Verification & Regulatory Compliance", subtitle: "Core Analytical Method",
          description: "Validate clinical/research protocols against regulatory standards (GCP, GLP, ICH) and identify deviation risks.",
          keyConcepts: ["GCP / GLP", "Protocol Deviation", "IRB Compliance", "Audit Trails"],
          prerequisites: [`${p}-day-1`], widgetType: "pharm_audit",
          taskInstructions: "Identify the protocol deviation in the clinical trial consent workflow and document the corrective action.",
          taskPayload: { correctAnswer: "consent", challengeType: "protocol_verify" } },
      },
      {
        id: `${p}-day-3`, position: { x: 90, y: 320 },
        data: { id: `${p}-day-3`, day: 3, title: "Data Audit & Biostatistical Validation", subtitle: "Specialised Tooling Path A",
          description: "Audit biomedical datasets for data integrity, statistical power, and confounding variable control.",
          keyConcepts: ["Statistical Power", "Confounders", "Biostatistical Tests", "p-value Interpretation"],
          prerequisites: [`${p}-day-2`], widgetType: "data_query",
          taskInstructions: "Identify the confounding variable in the study design and propose the adjusted analysis methodology.",
          taskPayload: { correctAnswer: "confounder", challengeType: "bio_stats" } },
      },
      {
        id: `${p}-day-4`, position: { x: 410, y: 320 },
        data: { id: `${p}-day-4`, day: 4, title: "Literature Synthesis & Evidence Mapping", subtitle: "Specialised Tooling Path B",
          description: "Conduct systematic evidence synthesis using PRISMA framework and construct a structured evidence hierarchy.",
          keyConcepts: ["PRISMA", "PICO Framework", "Meta-Analysis", "Forest Plots"],
          prerequisites: [`${p}-day-2`], widgetType: "doc_diag",
          taskInstructions: "Construct a PICO question from the clinical scenario and map three relevant RCTs to the evidence hierarchy.",
          taskPayload: { correctAnswer: "rct", challengeType: "evidence_map" } },
      },
      {
        id: `${p}-day-5`, position: { x: 250, y: 470 },
        data: { id: `${p}-day-5`, day: 5, title: "Intervention Design & Safety Review", subtitle: "Cross-functional Problem Solving",
          description: "Design a safe, evidence-based intervention protocol with risk stratification and safety monitoring plan.",
          keyConcepts: ["Risk Stratification", "Safety Monitoring", "Dosing Algorithms", "Adverse Event Reporting"],
          prerequisites: [`${p}-day-3`, `${p}-day-4`], widgetType: "pharm_audit",
          taskInstructions: "Identify the dose-limiting toxicity threshold from Phase I data and flag the safety stopping rule.",
          taskPayload: { correctAnswer: "toxicity", challengeType: "safety_review" } },
      },
      {
        id: `${p}-day-6`, position: { x: 250, y: 610 },
        data: { id: `${p}-day-6`, day: 6, title: "Outcome Reporting & Scientific Communication", subtitle: "Real-world Edge Case Handling",
          description: "Prepare structured outcome reports following CONSORT/STROBE guidelines for peer review and regulatory submission.",
          keyConcepts: ["CONSORT", "STROBE", "Primary Endpoints", "Reporting Bias"],
          prerequisites: [`${p}-day-5`], widgetType: "doc_diag",
          taskInstructions: "Identify the reporting bias in the abstract and rewrite the result statement to accurately reflect the ITT analysis.",
          taskPayload: { correctAnswer: "itt", challengeType: "reporting" } },
      },
      {
        id: `${p}-day-7`, position: { x: 250, y: 750 },
        data: { id: `${p}-day-7`, day: 7, title: "Clinical Decision Capstone: Case Resolution", subtitle: "Mini Capstone Work Simulation",
          description: "Integrate all week's evidence into a final clinical decision document with treatment recommendation and monitoring plan.",
          keyConcepts: ["Clinical Decision Support", "Shared Decision Making", "Follow-up Protocol", "Escalation Criteria"],
          prerequisites: [`${p}-day-6`], widgetType: "doc_diag",
          taskInstructions: "Synthesise the diagnostic, evidence, and safety review into a one-page clinical decision summary.",
          taskPayload: { correctAnswer: "treatment", challengeType: "capstone" } },
      },
    ],
    edges: [
      { id: `e-${p}-1-2`, source: `${p}-day-1`, target: `${p}-day-2` },
      { id: `e-${p}-2-3`, source: `${p}-day-2`, target: `${p}-day-3` },
      { id: `e-${p}-2-4`, source: `${p}-day-2`, target: `${p}-day-4` },
      { id: `e-${p}-3-5`, source: `${p}-day-3`, target: `${p}-day-5` },
      { id: `e-${p}-4-5`, source: `${p}-day-4`, target: `${p}-day-5` },
      { id: `e-${p}-5-6`, source: `${p}-day-5`, target: `${p}-day-6` },
      { id: `e-${p}-6-7`, source: `${p}-day-6`, target: `${p}-day-7` },
    ],
  };
}

// ─── DAG Template Builder: Legal & Consulting ────────────────────────────────

function buildLegalConsultingDAG(roleId: string): DAGGraphRole {
  const meta = ROLE_META[roleId] ?? { title: roleId, icon: "⚖️", overview: "7-Day legal and consulting micro-project pathway." };
  const p = roleId.slice(0, 4);
  return {
    roleId,
    roleTitle: meta.title,
    roleIcon: meta.icon,
    overview: meta.overview,
    nodes: [
      {
        id: `${p}-day-1`, position: { x: 250, y: 30 },
        data: { id: `${p}-day-1`, day: 1, title: "Problem Structuring & Issue Mapping", subtitle: "Foundational Paradigm",
          description: "Deconstruct complex problems using MECE frameworks, hypothesis trees, and structured issue mapping.",
          keyConcepts: ["MECE", "Issue Trees", "Hypothesis-Driven", "Pyramid Principle"],
          prerequisites: [], widgetType: "case_strategy",
          taskInstructions: "Break the client's ambiguous business problem into a MECE issue tree with three mutually exclusive branches.",
          taskPayload: { correctAnswer: "mece", challengeType: "issue_tree" } },
      },
      {
        id: `${p}-day-2`, position: { x: 250, y: 170 },
        data: { id: `${p}-day-2`, day: 2, title: "Evidence Gathering & Clause / Data Analysis", subtitle: "Core Analytical Method",
          description: "Systematically gather and analyse contractual clauses, case precedents, or financial data to build the argument base.",
          keyConcepts: ["Precedent Analysis", "Clause Mapping", "Data Collection", "Source Triangulation"],
          prerequisites: [`${p}-day-1`], widgetType: "case_strategy",
          taskInstructions: "Identify the ambiguous clause in the NDA and map the risk exposure using the provided jurisdiction precedent set.",
          taskPayload: { correctAnswer: "liability", challengeType: "clause_audit" } },
      },
      {
        id: `${p}-day-3`, position: { x: 90, y: 320 },
        data: { id: `${p}-day-3`, day: 3, title: "Quantitative Analysis & Market Sizing", subtitle: "Specialised Tooling Path A",
          description: "Apply structured quantitative estimation and market sizing techniques to support strategic recommendations.",
          keyConcepts: ["Fermi Estimation", "TAM/SAM/SOM", "Benchmarking", "Sensitivity Analysis"],
          prerequisites: [`${p}-day-2`], widgetType: "case_strategy",
          taskInstructions: "Size the Indian corporate legal market using a bottom-up Fermi estimation approach with stated assumptions.",
          taskPayload: { correctAnswer: "market-size", challengeType: "quantitative" } },
      },
      {
        id: `${p}-day-4`, position: { x: 410, y: 320 },
        data: { id: `${p}-day-4`, day: 4, title: "Stakeholder Communication & Persuasion", subtitle: "Specialised Tooling Path B",
          description: "Craft persuasive stakeholder communications using structured argumentation, counterpoint neutralisation, and positioning.",
          keyConcepts: ["Pyramid Principle", "Counter-argument Rebuttal", "Executive Framing", "Active Listening"],
          prerequisites: [`${p}-day-2`], widgetType: "case_strategy",
          taskInstructions: "Rewrite the stakeholder memo using the pyramid principle: lead with recommendation, support with evidence.",
          taskPayload: { correctAnswer: "pyramid", challengeType: "communication" } },
      },
      {
        id: `${p}-day-5`, position: { x: 250, y: 470 },
        data: { id: `${p}-day-5`, day: 5, title: "Risk Assessment & Strategic Options", subtitle: "Cross-functional Problem Solving",
          description: "Build a risk register, assess probability × impact, and synthesise strategic options with trade-off rationale.",
          keyConcepts: ["Risk Matrix", "Scenario Planning", "Option Value", "Contingency Design"],
          prerequisites: [`${p}-day-3`, `${p}-day-4`], widgetType: "case_strategy",
          taskInstructions: "Complete the risk register for the M&A scenario: rank by probability × impact and identify the top mitigation lever.",
          taskPayload: { correctAnswer: "risk", challengeType: "risk_assess" } },
      },
      {
        id: `${p}-day-6`, position: { x: 250, y: 610 },
        data: { id: `${p}-day-6`, day: 6, title: "Recommendation Synthesis & Slide Architecture", subtitle: "Real-world Edge Case Handling",
          description: "Synthesise all analysis into a board-level recommendation document with executive summary and implementation roadmap.",
          keyConcepts: ["Slide Logic", "SCQA Framework", "Implementation Roadmap", "KPI Linkage"],
          prerequisites: [`${p}-day-5`], widgetType: "case_strategy",
          taskInstructions: "Structure the recommendation deck using SCQA: identify the Complication, Question, and Answer for each slide.",
          taskPayload: { correctAnswer: "scqa", challengeType: "synthesis" } },
      },
      {
        id: `${p}-day-7`, position: { x: 250, y: 750 },
        data: { id: `${p}-day-7`, day: 7, title: "Case Strategy Capstone: Client Presentation", subtitle: "Mini Capstone Work Simulation",
          description: "Deliver the complete strategic case: hypothesis, evidence, risk, recommendation, and implementation plan.",
          keyConcepts: ["Case Delivery", "Q&A Handling", "Commitment & Next Steps", "Impact Quantification"],
          prerequisites: [`${p}-day-6`], widgetType: "case_strategy",
          taskInstructions: "Present the final recommendation and handle the three challenging client objections in the provided scenario.",
          taskPayload: { correctAnswer: "recommendation", challengeType: "capstone" } },
      },
    ],
    edges: [
      { id: `e-${p}-1-2`, source: `${p}-day-1`, target: `${p}-day-2` },
      { id: `e-${p}-2-3`, source: `${p}-day-2`, target: `${p}-day-3` },
      { id: `e-${p}-2-4`, source: `${p}-day-2`, target: `${p}-day-4` },
      { id: `e-${p}-3-5`, source: `${p}-day-3`, target: `${p}-day-5` },
      { id: `e-${p}-4-5`, source: `${p}-day-4`, target: `${p}-day-5` },
      { id: `e-${p}-5-6`, source: `${p}-day-5`, target: `${p}-day-6` },
      { id: `e-${p}-6-7`, source: `${p}-day-6`, target: `${p}-day-7` },
    ],
  };
}

// ─── Primary Public API ───────────────────────────────────────────────────────

/**
 * `getOrCreateDAG` — Dynamic DAG factory.
 * Returns the hand-crafted graph for 5 launch roles, or generates a structured
 * 7-day DAG using the appropriate domain-category template for all other roles.
 */
export function getOrCreateDAG(roleId: string): DAGGraphRole {
  if (ROLE_DAG_GRAPHS[roleId]) return ROLE_DAG_GRAPHS[roleId];

  const category = getDomainCategory(roleId);
  switch (category) {
    case "Tech & Engineering":   return buildTechEngineeringDAG(roleId);
    case "Data & Finance":       return buildDataFinanceDAG(roleId);
    case "Design & Product":     return buildDesignProductDAG(roleId);
    case "Healthcare & Science": return buildHealthcareScienceDAG(roleId);
    case "Legal & Consulting":   return buildLegalConsultingDAG(roleId);
    default:                     return buildTechEngineeringDAG(roleId);
  }
}

/**
 * `getRoleDAG` — backward-compatible alias used by all existing components.
 */
export function getRoleDAG(roleId: string): DAGGraphRole {
  return getOrCreateDAG(roleId);
}

