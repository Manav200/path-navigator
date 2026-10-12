// lib/questions.ts
// Hybrid Psychological Diagnostic Engine & Scoring Matrix (Expanded Scope)

export type TraitKey = "LOG" | "DAT" | "EMP" | "INT" | "PRC" | "AMB";

export interface TraitDefinition {
  key: TraitKey;
  name: string;
  description: string;
}

export const TRAIT_DEFINITIONS: Record<TraitKey, TraitDefinition> = {
  LOG: {
    key: "LOG",
    name: "Logic & Algorithmic Thinking",
    description: "Systematic decomposition, pattern synthesis, and step-by-step causality reasoning.",
  },
  DAT: {
    key: "DAT",
    name: "Data & Quantitative Analysis",
    description: "Numerical agility, trend evaluation, probabilistic reasoning, and metrics interpretation.",
  },
  EMP: {
    key: "EMP",
    name: "Empathy & Human-centric Understanding",
    description: "Affective empathy, patient/user distress diagnosis, and compassionate interpersonal communication.",
  },
  INT: {
    key: "INT",
    name: "Interpretation, Persuasion & Strategic Reasoning",
    description: "Verbal eloquence, dispute deconstruction, precedent synthesis, and persuasive rhetoric.",
  },
  PRC: {
    key: "PRC",
    name: "Precision, Detail & Protocol Adherence",
    description: "Meticulous quality control, strict regulatory compliance, and zero-tolerance tolerance for edge failure.",
  },
  AMB: {
    key: "AMB",
    name: "Ambiguity Tolerance & Risk Comfort",
    description: "Decision-making comfort under incomplete context, agile pivoting, and adaptive experimentation.",
  },
};

// ─── 17 Expanded Launch & Growth Professions ─────────────────────────────────

export type ProfessionKey =
  // Engineering & Technology
  | "Software / Full-Stack Engineer"
  | "AI / Machine Learning Engineer"
  | "Data Scientist"
  | "Cybersecurity & Cloud Engineer"
  | "Electronics & Embedded Systems Engineer"
  | "Electronics & Embedded Systems Engineer (ECE)"
  | "Mechanical & Robotics Engineer"
  | "Civil & Structural Engineer"

  // Healthcare & Life Sciences
  | "Doctor / Clinical Practitioner"
  | "Pharmacist / Pharmaceutical Analyst"
  | "Biotechnology & Genomic Researcher"

  // Business, Finance & Management
  | "Business Analyst"
  | "Product Manager"
  | "Financial Analyst / Investment Specialist"
  | "Management Consultant"
  | "Digital Marketing & Growth Strategist"

  // Creative, Design & Legal
  | "UI/UX & Product Designer"
  | "Lawyer / Corporate Legal Specialist";

// URL slug mappings for each expanded profession
export const PROFESSION_SLUGS: Record<ProfessionKey, string> = {
  "Software / Full-Stack Engineer": "software-engineer",
  "AI / Machine Learning Engineer": "ai-ml-engineer",
  "Data Scientist": "data-scientist",
  "Cybersecurity & Cloud Engineer": "cybersecurity-cloud-engineer",
  "Electronics & Embedded Systems Engineer": "electronics-embedded-engineer",
  "Electronics & Embedded Systems Engineer (ECE)": "electronics-embedded-engineer",
  "Mechanical & Robotics Engineer": "mechanical-robotics-engineer",
  "Civil & Structural Engineer": "civil-structural-engineer",

  "Doctor / Clinical Practitioner": "doctor",
  "Pharmacist / Pharmaceutical Analyst": "pharmacist",
  "Biotechnology & Genomic Researcher": "biotech-genomics-researcher",

  "Business Analyst": "business-analyst",
  "Product Manager": "product-manager",
  "Financial Analyst / Investment Specialist": "financial-analyst",
  "Management Consultant": "management-consultant",
  "Digital Marketing & Growth Strategist": "digital-marketing-growth",

  "UI/UX & Product Designer": "ui-ux-product-designer",
  "Lawyer / Corporate Legal Specialist": "lawyer",
};

export const PROFESSION_FROM_SLUG: Record<string, ProfessionKey> = {
  "software-engineer": "Software / Full-Stack Engineer",
  "ai-ml-engineer": "AI / Machine Learning Engineer",
  "data-scientist": "Data Scientist",
  "cybersecurity-cloud-engineer": "Cybersecurity & Cloud Engineer",
  "electronics-embedded-engineer": "Electronics & Embedded Systems Engineer (ECE)",
  "mechanical-robotics-engineer": "Mechanical & Robotics Engineer",
  "civil-structural-engineer": "Civil & Structural Engineer",

  "doctor": "Doctor / Clinical Practitioner",
  "pharmacist": "Pharmacist / Pharmaceutical Analyst",
  "biotech-genomics-researcher": "Biotechnology & Genomic Researcher",

  "business-analyst": "Business Analyst",
  "product-manager": "Product Manager",
  "financial-analyst": "Financial Analyst / Investment Specialist",
  "management-consultant": "Management Consultant",
  "digital-marketing-growth": "Digital Marketing & Growth Strategist",

  "ui-ux-product-designer": "UI/UX & Product Designer",
  "lawyer": "Lawyer / Corporate Legal Specialist",
};

// ─── Expanded Trait Weights Matrix (w_pt) ───────────────────────────────────

export const PROFESSION_WEIGHTS: Record<ProfessionKey, Record<TraitKey, number>> = {
  "Software / Full-Stack Engineer":             { LOG: 3, DAT: 2, PRC: 2, AMB: 1, INT: 0, EMP: 0 },
  "AI / Machine Learning Engineer":            { LOG: 3, DAT: 3, PRC: 2, AMB: 1, INT: 0, EMP: 0 },
  "Data Scientist":                            { DAT: 3, LOG: 2, INT: 2, PRC: 1, AMB: 1, EMP: 0 },
  "Cybersecurity & Cloud Engineer":            { LOG: 3, PRC: 3, DAT: 1, AMB: 1, INT: 0, EMP: 0 },
  "Electronics & Embedded Systems Engineer":   { LOG: 3, PRC: 3, DAT: 1, AMB: 1, INT: 0, EMP: 0 },
  "Electronics & Embedded Systems Engineer (ECE)": { LOG: 3, PRC: 3, DAT: 1, AMB: 1, INT: 0, EMP: 0 },
  "Mechanical & Robotics Engineer":            { LOG: 3, PRC: 2, DAT: 2, AMB: 1, INT: 0, EMP: 0 },
  "Civil & Structural Engineer":               { PRC: 3, LOG: 2, DAT: 2, INT: 1, AMB: 0, EMP: 0 },

  "Doctor / Clinical Practitioner":            { EMP: 3, PRC: 3, LOG: 2, DAT: 1, INT: 1, AMB: 0 },
  "Pharmacist / Pharmaceutical Analyst":        { PRC: 3, DAT: 2, LOG: 2, EMP: 1, INT: 0, AMB: 0 },
  "Biotechnology & Genomic Researcher":        { DAT: 3, PRC: 3, LOG: 2, AMB: 1, EMP: 0, INT: 0 },

  "Business Analyst":                          { DAT: 3, LOG: 2, INT: 2, AMB: 1, PRC: 1, EMP: 0 },
  "Product Manager":                           { INT: 3, EMP: 2, AMB: 2, DAT: 2, LOG: 1, PRC: 0 },
  "Financial Analyst / Investment Specialist": { DAT: 3, LOG: 2, PRC: 2, INT: 1, AMB: 1, EMP: 0 },
  "Management Consultant":                     { INT: 3, DAT: 2, LOG: 2, AMB: 2, PRC: 0, EMP: 0 },
  "Digital Marketing & Growth Strategist":     { DAT: 2, INT: 3, AMB: 2, EMP: 2, LOG: 0, PRC: 0 },

  "UI/UX & Product Designer":                  { EMP: 3, INT: 2, AMB: 2, PRC: 2, LOG: 0, DAT: 0 },
  "Lawyer / Corporate Legal Specialist":       { INT: 3, LOG: 2, PRC: 2, EMP: 1, DAT: 0, AMB: 0 },
};

// ─── Expanded Stream/Branch Home Profession Mapping ─────────────────────────

export const BRANCH_HOME_MAP: Record<string, ProfessionKey> = {
  // Engineering Branches
  "B.Tech / B.E. (CSE/IT)":              "Software / Full-Stack Engineer",
  "B.Tech / B.E. (AI & Data Science)":   "AI / Machine Learning Engineer",
  "B.Tech / B.E. (ECE/EEE)":             "Electronics & Embedded Systems Engineer (ECE)",
  "B.Tech / B.E. (Mechanical/Civil)":    "Mechanical & Robotics Engineer",
  "B.Tech / B.E. (Chemical/Biotech)":    "Biotechnology & Genomic Researcher",
  "BCA":                                  "Software / Full-Stack Engineer",
  "B.Sc (Computer Science / Data)":      "Data Scientist",

  // Science
  "B.Sc (Biotech / Life Sciences)":      "Biotechnology & Genomic Researcher",
  "B.Sc (Physics / Chemistry / Maths)":  "Data Scientist",

  // Medical & Pharmacy
  "MBBS":                                 "Doctor / Clinical Practitioner",
  "B.Pharm":                              "Pharmacist / Pharmaceutical Analyst",

  // Business & Commerce
  "BBA":                                  "Product Manager",
  "B.Com":                                "Financial Analyst / Investment Specialist",
  "MBA":                                  "Management Consultant",

  // Humanities, Design & Law
  "BA LL.B / BBA LL.B":                  "Lawyer / Corporate Legal Specialist",
  "BA (Design / Fine Arts)":             "UI/UX & Product Designer",
  "B.Des (Industrial / Communication)":  "UI/UX & Product Designer",

  // School Streams
  "Science (PCM)":                        "Software / Full-Stack Engineer",
  "Science (PCB)":                        "Doctor / Clinical Practitioner",
  "Commerce with Math":                   "Financial Analyst / Investment Specialist",
  "Commerce without Math":               "Business Analyst",
  "Humanities / Arts":                    "Lawyer / Corporate Legal Specialist",
  "Vocational":                           "Digital Marketing & Growth Strategist",
};

// Legacy compatibility alias map
export const STREAM_HOME_PROFESSIONS = BRANCH_HOME_MAP;

export function getHomeProfession(streamOrBranch?: string): ProfessionKey {
  if (!streamOrBranch) return "Software / Full-Stack Engineer";

  // Exact match
  if (BRANCH_HOME_MAP[streamOrBranch]) {
    return BRANCH_HOME_MAP[streamOrBranch];
  }

  // Case-insensitive / partial substring search
  const cleanInput = streamOrBranch.toLowerCase().trim();
  for (const [key, val] of Object.entries(BRANCH_HOME_MAP)) {
    if (cleanInput.includes(key.toLowerCase()) || key.toLowerCase().includes(cleanInput)) {
      return val;
    }
  }

  // Domain keyword fallbacks
  if (/cse|it|software|code|program/i.test(cleanInput)) return "Software / Full-Stack Engineer";
  if (/ai|ml|data science/i.test(cleanInput)) return "AI / Machine Learning Engineer";
  if (/ece|eee|embedded|hardware/i.test(cleanInput)) return "Electronics & Embedded Systems Engineer (ECE)";
  if (/mech|robot/i.test(cleanInput)) return "Mechanical & Robotics Engineer";
  if (/civil|struct/i.test(cleanInput)) return "Civil & Structural Engineer";
  if (/mbbs|doctor|clinic/i.test(cleanInput)) return "Doctor / Clinical Practitioner";
  if (/pharm/i.test(cleanInput)) return "Pharmacist / Pharmaceutical Analyst";
  if (/biotech|genom/i.test(cleanInput)) return "Biotechnology & Genomic Researcher";
  if (/bba|product/i.test(cleanInput)) return "Product Manager";
  if (/b\.com|finance|invest/i.test(cleanInput)) return "Financial Analyst / Investment Specialist";
  if (/consult/i.test(cleanInput)) return "Management Consultant";
  if (/law|llb|advocate/i.test(cleanInput)) return "Lawyer / Corporate Legal Specialist";
  if (/design|ui|ux/i.test(cleanInput)) return "UI/UX & Product Designer";

  return "Software / Full-Stack Engineer";
}

// ─── Question Definitions & Structure ────────────────────────────────────────

export interface AssessmentAnswers {
  q1?: string;       // "A" | "B" | "C" | "D"
  q2?: string;       // "A" | "B" | "C" | "D"
  q3a?: string;      // Expected: "42"
  q3b?: string;      // Expected: "12"
  q4?: string;       // "A" | "B" | "C" | "D"
  q5a?: number;      // 1 to 5 slider (Precision)
  q5b?: number;      // 1 to 5 slider (Ambiguity)
  q6?: string[];     // Ordered array of 4 environment IDs
  q7?: string;       // Free text
  interests?: string[]; // Selected interest chips
  otherInterest?: string; // Optional "Other" input
}

export const QUESTION_CONFIGS = [
  {
    id: "q1",
    type: "choice",
    title: "Cognitive Style & Mental Model",
    subtitle: "When presented with an entirely new challenge, what is your default intuition?",
    options: [
      { id: "A", label: "Deconstruct into algorithmic logic, flows, and deterministic rules", traitWeights: { LOG: 3, PRC: 1 } },
      { id: "B", label: "Inspect the quantitative metrics, data patterns, and market indicators", traitWeights: { DAT: 3, LOG: 1 } },
      { id: "C", label: "Empathize with human pain-points, emotional needs, and real-world suffering", traitWeights: { EMP: 3, INT: 1 } },
      { id: "D", label: "Analyze textual nuances, persuasive arguments, and policy precedents", traitWeights: { INT: 3, LOG: 1 } },
    ],
  },
  {
    id: "q2",
    type: "choice",
    title: "Preferred Problem Solving Domain",
    subtitle: "Which of these everyday workplace activities genuinely energizes you?",
    options: [
      { id: "A", label: "Engineering scalable backend systems, debugging code, and automated architectures", traitWeights: { LOG: 3, PRC: 2 } },
      { id: "B", label: "Translating messy business metrics into high-impact strategic roadmaps and forecasts", traitWeights: { DAT: 3, INT: 2 } },
      { id: "C", label: "Diagnosing clinical/biological symptoms, patient care, and healing under pressure", traitWeights: { EMP: 2, PRC: 3 } },
      { id: "D", label: "Crafting structured legal briefs, negotiating contracts, and defending regulatory compliance", traitWeights: { INT: 3, LOG: 2 } },
    ],
  },
  {
    id: "q3",
    type: "aptitude",
    title: "Objective Quantitative & Logic Check",
    subtitle: "Answer these two quick aptitude questions to calibrate deterministic baseline.",
    subquestions: [
      {
        id: "q3a",
        label: "Q3a. A server cluster processes 210 requests across 5 nodes evenly. If 1 node fails, how many requests must each remaining node process? (Answer is a number)",
        expected: "42",
        placeholder: "e.g. 42",
      },
      {
        id: "q3b",
        label: "Q3b. Sequence: 2, 4, 6, 8, 10, ? — What is the next natural term?",
        expected: "12",
        placeholder: "e.g. 12",
      },
    ],
  },
  {
    id: "q4",
    type: "choice",
    title: "Analytical Rigor vs. Human Empathy",
    subtitle: "In a high-stakes disagreement with conflicting inputs, what leads your judgment?",
    options: [
      { id: "A", label: "Pure empirical data, hard facts, and mathematical benchmarks", traitWeights: { DAT: 2, LOG: 2, PRC: 1 } },
      { id: "B", label: "Strict adherence to established standard operating protocols (SOPs) & ethical checklists", traitWeights: { PRC: 3, EMP: 1 } },
      { id: "C", label: "Direct patient or client empathy, emotional reassurance, and personal rapport", traitWeights: { EMP: 3, INT: 1 } },
      { id: "D", label: "Persuasive dialectic, cross-examination of premises, and strategic advocacy", traitWeights: { INT: 3, AMB: 2 } },
    ],
  },
  {
    id: "q5",
    type: "sliders",
    title: "Precision & Ambiguity Calibration",
    subtitle: "Rate your comfort and natural inclination on a scale from 1 (Very Low) to 5 (Extremely High).",
    sliders: [
      {
        id: "q5a",
        label: "Q5a. Detail Precision & Protocol Adherence",
        description: "How strictly do you demand zero-defect tolerance and adherence to rigorous manuals?",
        min: 1,
        max: 5,
        trait: "PRC",
      },
      {
        id: "q5b",
        label: "Q5b. Ambiguity Tolerance & High-Risk Agility",
        description: "How comfortable are you making impactful choices when guidelines and outcomes are unclear?",
        min: 1,
        max: 5,
        trait: "AMB",
      },
    ],
  },
  {
    id: "q6",
    type: "ranking",
    title: "Workplace Ecosystem Ranking",
    subtitle: "Rank the 4 environments below from 1st (Most Appealing) to 4th (Least Appealing).",
    items: [
      { id: "tech_lab", label: "Modern Software Lab / Engineering Terminal (Codebases, Architecture, Git)", traits: { LOG: 1.5, PRC: 1 } },
      { id: "analytics_boardroom", label: "Strategic Analytics Hub (Dashboards, Financial Models, Stakeholder Presentations)", traits: { DAT: 1.5, INT: 1 } },
      { id: "legal_chamber", label: "Courtroom & High-Stakes Arbitration Chamber (Constitutional Briefs, Advocacy)", traits: { INT: 1.5, LOG: 1 } },
      { id: "clinical_unit", label: "Clinical Healthcare Facility (Patient Care, Diagnostic Instruments, Drug Compounding)", traits: { EMP: 1.5, PRC: 1 } },
    ],
  },
  {
    id: "q7",
    type: "freetext",
    title: "Personal Career Vision & Deep Pivot Aspiration",
    subtitle: "Describe what work problems genuinely fascinate you. If you had 7 days of complete freedom with real industry mentors, what domain would you test yourself in and why?",
    placeholder: "Example: I love building technical tools that automate tedious workflows, but I also enjoy analyzing how businesses monetize. In 7 days, I'd love to build a complete full-stack app or build a predictive churn model...",
  },
];

export const INTEREST_CHIP_OPTIONS = [
  { id: "software", label: "Software & System Architecture", role: "Software / Full-Stack Engineer" as ProfessionKey },
  { id: "ai_ml", label: "AI & Neural Networks", role: "AI / Machine Learning Engineer" as ProfessionKey },
  { id: "data_science", label: "Data Science & Predictive Modeling", role: "Data Scientist" as ProfessionKey },
  { id: "cybersecurity", label: "Cybersecurity & Cloud Security", role: "Cybersecurity & Cloud Engineer" as ProfessionKey },
  { id: "embedded", label: "Embedded Electronics & IoT", role: "Electronics & Embedded Systems Engineer (ECE)" as ProfessionKey },
  { id: "robotics", label: "Robotics & Automation Hardware", role: "Mechanical & Robotics Engineer" as ProfessionKey },
  { id: "civil", label: "Structural Design & Infrastructure", role: "Civil & Structural Engineer" as ProfessionKey },

  { id: "patient_care", label: "Clinical Medicine & Patient Care", role: "Doctor / Clinical Practitioner" as ProfessionKey },
  { id: "pharmacology", label: "Pharmacology & Drug Formulations", role: "Pharmacist / Pharmaceutical Analyst" as ProfessionKey },
  { id: "biotech", label: "Genomics & Bio-Informatics", role: "Biotechnology & Genomic Researcher" as ProfessionKey },

  { id: "business_strategy", label: "Business Analytics & Growth Metrics", role: "Business Analyst" as ProfessionKey },
  { id: "product_mgmt", label: "Product Roadmaps & User Value", role: "Product Manager" as ProfessionKey },
  { id: "fintech", label: "Financial Analysis & Valuation", role: "Financial Analyst / Investment Specialist" as ProfessionKey },
  { id: "consulting", label: "Management Strategy & Case Studies", role: "Management Consultant" as ProfessionKey },
  { id: "growth_marketing", label: "Growth Strategy & User Acquisition", role: "Digital Marketing & Growth Strategist" as ProfessionKey },

  { id: "design", label: "UI/UX & Interactive Design", role: "UI/UX & Product Designer" as ProfessionKey },
  { id: "corporate_law", label: "Corporate Law, Contracts & Litigation", role: "Lawyer / Corporate Legal Specialist" as ProfessionKey },
];

// ─── Deterministic Calculation Helpers ───────────────────────────────────────

/**
 * Calculates raw Q1-Q6 scores and normalizes them to 0-100 for each trait.
 */
export function calculateDeterministicScores(answers: AssessmentAnswers): Record<TraitKey, number> {
  const raw: Record<TraitKey, number> = {
    LOG: 0,
    DAT: 0,
    EMP: 0,
    INT: 0,
    PRC: 0,
    AMB: 0,
  };

  // Q1
  if (answers.q1) {
    if (answers.q1 === "A") { raw.LOG += 3; raw.PRC += 1; }
    else if (answers.q1 === "B") { raw.DAT += 3; raw.LOG += 1; }
    else if (answers.q1 === "C") { raw.EMP += 3; raw.INT += 1; }
    else if (answers.q1 === "D") { raw.INT += 3; raw.LOG += 1; }
  }

  // Q2
  if (answers.q2) {
    if (answers.q2 === "A") { raw.LOG += 3; raw.PRC += 2; }
    else if (answers.q2 === "B") { raw.DAT += 3; raw.INT += 2; }
    else if (answers.q2 === "C") { raw.EMP += 2; raw.PRC += 3; }
    else if (answers.q2 === "D") { raw.INT += 3; raw.LOG += 2; }
  }

  // Q3a & Q3b (Objective Aptitude)
  if (answers.q3a && answers.q3a.trim() === "42") {
    raw.DAT += 2;
    raw.LOG += 2;
  }
  if (answers.q3b && answers.q3b.trim() === "12") {
    raw.LOG += 2;
    raw.DAT += 2;
  }

  // Q4
  if (answers.q4) {
    if (answers.q4 === "A") { raw.DAT += 2; raw.LOG += 2; raw.PRC += 1; }
    else if (answers.q4 === "B") { raw.PRC += 3; raw.EMP += 1; }
    else if (answers.q4 === "C") { raw.EMP += 3; raw.INT += 1; }
    else if (answers.q4 === "D") { raw.INT += 3; raw.AMB += 2; }
  }

  // Q5a (Precision 1-5) & Q5b (Ambiguity 1-5)
  const valQ5a = typeof answers.q5a === "number" ? answers.q5a : 3;
  const valQ5b = typeof answers.q5b === "number" ? answers.q5b : 3;
  raw.PRC += valQ5a * 1.4;
  raw.AMB += valQ5b * 1.5;

  // Q6 (Ranking 4 Work Environments)
  if (answers.q6 && Array.isArray(answers.q6)) {
    const rankPoints = [3.0, 2.0, 1.0, 0.0];
    answers.q6.forEach((itemId, idx) => {
      const pts = rankPoints[idx] ?? 0;
      if (itemId === "tech_lab") {
        raw.LOG += pts * 0.8;
        raw.PRC += pts * 0.5;
      } else if (itemId === "analytics_boardroom") {
        raw.DAT += pts * 0.8;
        raw.INT += pts * 0.5;
      } else if (itemId === "legal_chamber") {
        raw.INT += pts * 0.8;
        raw.LOG += pts * 0.5;
      } else if (itemId === "clinical_unit") {
        raw.EMP += pts * 0.8;
        raw.PRC += pts * 0.6;
      }
    });
  }

  // Normalization ceilings based on max possible raw points
  const maxRaw: Record<TraitKey, number> = {
    LOG: 14.5,
    DAT: 13.0,
    EMP: 10.0,
    INT: 12.5,
    PRC: 15.0,
    AMB: 9.5,
  };

  const normalized: Record<TraitKey, number> = {
    LOG: Math.min(100, Math.max(10, Math.round((raw.LOG / maxRaw.LOG) * 100))),
    DAT: Math.min(100, Math.max(10, Math.round((raw.DAT / maxRaw.DAT) * 100))),
    EMP: Math.min(100, Math.max(10, Math.round((raw.EMP / maxRaw.EMP) * 100))),
    INT: Math.min(100, Math.max(10, Math.round((raw.INT / maxRaw.INT) * 100))),
    PRC: Math.min(100, Math.max(10, Math.round((raw.PRC / maxRaw.PRC) * 100))),
    AMB: Math.min(100, Math.max(10, Math.round((raw.AMB / maxRaw.AMB) * 100))),
  };

  return normalized;
}

export interface CareerScoreBreakdown {
  role: ProfessionKey;
  roleId: string;
  score: number;
  fitScore: number;
  interestScore: number;
  rationale: string;
}

export interface FinalEvaluationResult {
  topCareers: CareerScoreBreakdown[];
  isCloseCall: boolean;
  pivotStatus: "no_pivot" | "explore_pivot" | "strong_pivot";
  pivotGap: number;
  homeProfession: ProfessionKey;
  recommendedRole: ProfessionKey;
  recommendedRoleId: string;
  blendedTraits: Record<TraitKey, number>;
  q7RationaleQuote?: string;
  pivotAnalysis: string;
}

/**
 * Blends deterministic traits with Llama Q7 evaluation and computes final 17-profession scores.
 */
export function calculateFinalScores(
  deterministicTraits: Record<TraitKey, number>,
  q7LlamaTraits: Record<TraitKey, number>, // expected 0-3 (or 0-100)
  selectedInterests: string[] = [],
  userBranch?: string,
  mappedOtherProfession?: string,
  q7RationaleQuote?: string
): FinalEvaluationResult {
  const traits: TraitKey[] = ["LOG", "DAT", "EMP", "INT", "PRC", "AMB"];
  const blendedTraits: Record<TraitKey, number> = {} as Record<TraitKey, number>;

  // 1. Blend: T_final = 0.8 * T_deterministic + 0.2 * T_q7 (normalized 0-100)
  for (const t of traits) {
    const rawQ7 = q7LlamaTraits[t] ?? 1.5;
    const q7Norm = rawQ7 <= 3 ? Math.round((rawQ7 / 3) * 100) : Math.round(rawQ7);
    const dScore = deterministicTraits[t] ?? 50;
    blendedTraits[t] = Math.round(0.8 * dScore + 0.2 * q7Norm);
  }

  // 2. Compute Fit(p) for all 17 expanded professions
  const allProfessions = Object.keys(PROFESSION_WEIGHTS) as ProfessionKey[];

  const results: CareerScoreBreakdown[] = allProfessions.map((role) => {
    const weights = PROFESSION_WEIGHTS[role];
    let sumWeight = 0;
    let weightedTraitSum = 0;

    for (const t of traits) {
      const w = weights[t];
      sumWeight += w;
      weightedTraitSum += w * blendedTraits[t];
    }

    const fitScore = sumWeight > 0 ? Math.round(weightedTraitSum / sumWeight) : 50;

    // 3. Compute Interest(p) from chips + mapped Other
    let interestScore = 55; // baseline neutral interest
    for (const chipId of selectedInterests) {
      const chipObj = INTEREST_CHIP_OPTIONS.find((c) => c.id === chipId);
      if (chipObj && chipObj.role === role) {
        interestScore += 25;
      }
    }
    if (mappedOtherProfession && mappedOtherProfession.toLowerCase().includes(role.toLowerCase().slice(0, 8))) {
      interestScore += 25;
    }
    interestScore = Math.min(100, Math.max(30, interestScore));

    // 4. Calculate Score(p) = 0.75 * Fit(p) + 0.25 * Interest(p)
    const finalScore = Math.round(0.75 * fitScore + 0.25 * interestScore);

    return {
      role,
      roleId: PROFESSION_SLUGS[role] || "software-engineer",
      score: finalScore,
      fitScore,
      interestScore,
      rationale: getRoleRationale(role, fitScore, blendedTraits),
    };
  });

  // 5. Sort professions descending
  results.sort((a, b) => b.score - a.score);

  // Close call check: if (#1 score - #2 score) <= 5
  const isCloseCall = results.length >= 2 && results[0].score - results[1].score <= 5;

  // 6. Calculate Pivot Gap = Score(top) - Score(home_profession)
  const homeProfession = getHomeProfession(userBranch);
  const homeProfScore = results.find((r) => r.role === homeProfession)?.score ?? results[0].score;
  const topScore = results[0].score;
  const pivotGap = Math.max(0, topScore - homeProfScore);

  let pivotStatus: "no_pivot" | "explore_pivot" | "strong_pivot" = "no_pivot";
  if (pivotGap > 25) {
    pivotStatus = "strong_pivot";
  } else if (pivotGap >= 15) {
    pivotStatus = "explore_pivot";
  } else {
    pivotStatus = "no_pivot";
  }

  // Qualitative pivot explanation
  let pivotAnalysis = "";
  if (pivotStatus === "no_pivot") {
    pivotAnalysis = `Your psychological aptitudes strongly reinforce your core domain (${homeProfession}). Your highest aptitude vectors align with this pathway with a negligible gap of ${pivotGap}%. Direct experiential immersion will sharpen your execution.`;
  } else if (pivotStatus === "explore_pivot") {
    pivotAnalysis = `Moderate domain pivot detected. While your academic baseline is rooted in ${homeProfession}, your cognitive profile shows a noticeable ${pivotGap}% affinity surge toward ${results[0].role}. Exploring the 7-day experiential DAG will validate your natural fit before committing.`;
  } else {
    pivotAnalysis = `Significant domain pivot recommended! Your latent analytical and behavioral traits match ${results[0].role} over ${homeProfession} by an exceptional ${pivotGap}% differential. Starting the 7-day micro-task pathway is strongly advised to test your capabilities with real industry workplace challenges.`;
  }

  return {
    topCareers: results.slice(0, 5),
    isCloseCall,
    pivotStatus,
    pivotGap,
    homeProfession,
    recommendedRole: results[0].role,
    recommendedRoleId: results[0].roleId,
    blendedTraits,
    q7RationaleQuote,
    pivotAnalysis,
  };
}

function getRoleRationale(
  role: ProfessionKey,
  fitScore: number,
  traits: Record<TraitKey, number>
): string {
  switch (role) {
    case "Software / Full-Stack Engineer":
      return `Outstanding algorithmic logic (${traits.LOG}/100) and precision adherence (${traits.PRC}/100), ideal for system architecture and software engineering.`;
    case "AI / Machine Learning Engineer":
      return `Superior algorithmic logic (${traits.LOG}/100) and deep quantitative data analysis (${traits.DAT}/100), optimal for training neural models and machine learning pipelines.`;
    case "Data Scientist":
      return `Elevated quantitative analysis (${traits.DAT}/100) and strategic interpretation (${traits.INT}/100), ideal for statistical inference and predictive modeling.`;
    case "Cybersecurity & Cloud Engineer":
      return `Exceptional protocol precision (${traits.PRC}/100) and logical deconstruction (${traits.LOG}/100), essential for zero-trust security and cloud resilience.`;
    case "Electronics & Embedded Systems Engineer":
    case "Electronics & Embedded Systems Engineer (ECE)":
      return `Meticulous circuit precision (${traits.PRC}/100) and systematic hardware logic (${traits.LOG}/100), ideal for embedded microcontrollers and IoT systems.`;
    case "Mechanical & Robotics Engineer":
      return `High mechanical logic (${traits.LOG}/100), spatial precision (${traits.PRC}/100), and quantitative data modeling (${traits.DAT}/100) for robotics design.`;
    case "Civil & Structural Engineer":
      return `Uncompromising structural safety precision (${traits.PRC}/100) and quantitative load calculations (${traits.DAT}/100) for large-scale infrastructure.`;

    case "Doctor / Clinical Practitioner":
      return `Elevated empathy quotient (${traits.EMP}/100) coupled with rigorous protocol precision (${traits.PRC}/100) in high-stakes clinical diagnosis.`;
    case "Pharmacist / Pharmaceutical Analyst":
      return `Exceptional attention to chemical precision (${traits.PRC}/100) and quantitative pharmacology (${traits.DAT}/100).`;
    case "Biotechnology & Genomic Researcher":
      return `Intense quantitative analysis (${traits.DAT}/100) and laboratory protocol precision (${traits.PRC}/100) for genomic sequencing.`;

    case "Business Analyst":
      return `Strong quantitative analysis (${traits.DAT}/100) combined with strategic persuasion (${traits.INT}/100) and problem synthesis.`;
    case "Product Manager":
      return `High strategic interpretation (${traits.INT}/100), user empathy (${traits.EMP}/100), and ambiguity tolerance (${traits.AMB}/100) to steer product vision.`;
    case "Financial Analyst / Investment Specialist":
      return `Rigorous quantitative modeling (${traits.DAT}/100) and audit precision (${traits.PRC}/100) for capital markets and valuation.`;
    case "Management Consultant":
      return `Persuasive strategic reasoning (${traits.INT}/100), ambiguity comfort (${traits.AMB}/100), and quantitative breakdown (${traits.DAT}/100) for executive advisory.`;
    case "Digital Marketing & Growth Strategist":
      return `Dynamic persuasion (${traits.INT}/100), consumer empathy (${traits.EMP}/100), and quantitative conversion analytics (${traits.DAT}/100).`;

    case "UI/UX & Product Designer":
      return `Superior human empathy (${traits.EMP}/100), visual precision (${traits.PRC}/100), and strategic persuasion (${traits.INT}/100) in digital interfaces.`;
    case "Lawyer / Corporate Legal Specialist":
      return `Superior dialectic reasoning (${traits.INT}/100) and structured logic (${traits.LOG}/100), optimal for legal analysis and contract arbitration.`;
    default:
      return `Strong composite trait match across logic (${traits.LOG}/100) and quantitative aptitude (${traits.DAT}/100).`;
  }
}
