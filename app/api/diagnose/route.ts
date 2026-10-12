// app/api/diagnose/route.ts
// Groq Llama 3 AI Diagnostic API Route with deterministic scoring matrix blend

import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import {
  calculateDeterministicScores,
  calculateFinalScores,
  TraitKey,
  AssessmentAnswers,
} from "@/lib/questions";

interface GroqQ7Output {
  q7_traits: Record<TraitKey, number>; // 0 to 3 scores
  pivot_readiness: number;             // 0 to 3
  mapped_other_interest_profession: string;
  q7_rationale_quote: string;
}

// Fallback heuristic analyzer for Q7 text when GROQ_API_KEY is unset or API call fails
function fallbackHeuristicQ7Analysis(
  q7Text: string = "",
  otherInterest: string = ""
): GroqQ7Output {
  const text = (q7Text + " " + otherInterest).toLowerCase();

  const traits: Record<TraitKey, number> = {
    LOG: 1.5,
    DAT: 1.5,
    EMP: 1.5,
    INT: 1.5,
    PRC: 1.5,
    AMB: 1.5,
  };

  // Keyword scans
  if (/code|program|software|algorithm|tech|developer|python|build|app|ai|system/i.test(text)) {
    traits.LOG += 1.0;
    traits.PRC += 0.8;
  }
  if (/data|analyst|business|finance|metric|market|growth|strategy|stats|revenue/i.test(text)) {
    traits.DAT += 1.0;
    traits.INT += 0.7;
  }
  if (/law|legal|court|justice|debate|policy|rights|contract|advocate/i.test(text)) {
    traits.INT += 1.2;
    traits.LOG += 0.6;
  }
  if (/doctor|patient|health|hospital|care|heal|clinic|medicine|biology/i.test(text)) {
    traits.EMP += 1.2;
    traits.PRC += 0.8;
  }
  if (/pharma|drug|chemistry|compound|formulation|lab|safety/i.test(text)) {
    traits.PRC += 1.2;
    traits.DAT += 0.8;
  }
  if (/startup|freedom|pivot|new|risk|explore|adventure|pivot/i.test(text)) {
    traits.AMB += 1.0;
  }

  // Bound to 0-3
  (Object.keys(traits) as TraitKey[]).forEach((k) => {
    traits[k] = Math.min(3, Math.max(0.5, Number(traits[k].toFixed(1))));
  });

  let mappedProf = "Software Engineer";
  if (/law|legal|rights|court/i.test(text)) mappedProf = "Lawyer";
  else if (/patient|doctor|clinic|health/i.test(text)) mappedProf = "Doctor";
  else if (/pharma|drug|chemistry/i.test(text)) mappedProf = "Pharmacist";
  else if (/business|finance|market|analyst/i.test(text)) mappedProf = "Business Analyst";

  const quote = q7Text.trim().length > 10
    ? `"${q7Text.trim().slice(0, 140)}${q7Text.trim().length > 140 ? "..." : ""}"`
    : "";

  return {
    q7_traits: traits,
    pivot_readiness: 2,
    mapped_other_interest_profession: mappedProf,
    q7_rationale_quote: quote,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const answers: AssessmentAnswers = body.answers || {};
    const userBranch: string = body.stream || body.grade || "";
    const selectedInterests: string[] = answers.interests || [];
    const otherInterest: string = answers.otherInterest || "";
    const q7Text: string = answers.q7 || "";

    // 1. Calculate deterministic baseline from Q1 to Q6
    const deterministicTraits = calculateDeterministicScores(answers);

    // 2. Query Groq Llama 3 for Q7 deep free-text & "other" interest evaluation
    let q7Analysis: GroqQ7Output;
    const groqApiKey = process.env.GROQ_API_KEY;

    if (groqApiKey && groqApiKey.trim().length > 5) {
      try {
        const groq = new Groq({ apiKey: groqApiKey });

        const prompt = `You are a psychological and career diagnostic psychologist evaluating an Indian student/professional.
Analyze the user's free-text response (Q7) about their career dream/7-day trial and custom interest.

User Q7 text: "${q7Text}"
User additional interest: "${otherInterest}"
User academic branch: "${userBranch}"

Score each trait from 0.0 to 3.0 (where 0 is absent, 1.5 is average, 3.0 is exceptionally strong):
- LOG: Logic & Algorithmic Thinking
- DAT: Data & Quantitative Analysis
- EMP: Empathy & Human-centric Understanding
- INT: Interpretation, Persuasion & Strategic Reasoning
- PRC: Precision, Detail & Protocol Adherence
- AMB: Ambiguity Tolerance & Risk Comfort

Also evaluate pivot_readiness (0 to 3) and map any other interest into one of these 5 professions:
["Software Engineer", "Business Analyst", "Lawyer", "Doctor", "Pharmacist"].
Extract a short impactful quote from Q7.

Return ONLY a valid JSON object matching this schema:
{
  "q7_traits": { "LOG": number, "DAT": number, "EMP": number, "INT": number, "PRC": number, "AMB": number },
  "pivot_readiness": number,
  "mapped_other_interest_profession": string,
  "q7_rationale_quote": string
}`;

        const completion = await groq.chat.completions.create({
          messages: [
            {
              role: "system",
              content: "You are an expert psychometric AI engine. Respond ONLY with valid JSON format.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          model: "llama3-70b-8192",
          temperature: 0.2,
          response_format: { type: "json_object" },
        });

        const rawContent = completion.choices[0]?.message?.content || "{}";
        const parsed = JSON.parse(rawContent);

        if (parsed.q7_traits && typeof parsed.q7_traits === "object") {
          q7Analysis = {
            q7_traits: {
              LOG: Number(parsed.q7_traits.LOG) || 1.5,
              DAT: Number(parsed.q7_traits.DAT) || 1.5,
              EMP: Number(parsed.q7_traits.EMP) || 1.5,
              INT: Number(parsed.q7_traits.INT) || 1.5,
              PRC: Number(parsed.q7_traits.PRC) || 1.5,
              AMB: Number(parsed.q7_traits.AMB) || 1.5,
            },
            pivot_readiness: Number(parsed.pivot_readiness) || 2,
            mapped_other_interest_profession: String(parsed.mapped_other_interest_profession || "Software Engineer"),
            q7_rationale_quote: String(parsed.q7_rationale_quote || `"${q7Text.slice(0, 120)}"`),
          };
        } else {
          q7Analysis = fallbackHeuristicQ7Analysis(q7Text, otherInterest);
        }
      } catch (groqErr) {
        console.warn("[Groq API] Warning during Llama call, using heuristic fallback:", groqErr);
        q7Analysis = fallbackHeuristicQ7Analysis(q7Text, otherInterest);
      }
    } else {
      // Offline / Unconfigured fallback
      q7Analysis = fallbackHeuristicQ7Analysis(q7Text, otherInterest);
    }

    // 3. Perform deterministic + AI blend calculation
    const evaluation = calculateFinalScores(
      deterministicTraits,
      q7Analysis.q7_traits,
      selectedInterests,
      userBranch,
      q7Analysis.mapped_other_interest_profession,
      q7Analysis.q7_rationale_quote
    );

    // Format consolidated response matching the spec
    const payload = {
      top_careers: evaluation.topCareers.map((c) => ({
        role: c.role,
        roleId: c.roleId,
        score: c.score,
        fit_score: c.fitScore,
        interest_score: c.interestScore,
        rationale: c.rationale,
      })),
      is_close_call: evaluation.isCloseCall,
      pivot_status: evaluation.pivotStatus,
      pivot_gap: evaluation.pivotGap,
      pivot_analysis: evaluation.pivotAnalysis,
      recommended_role: evaluation.recommendedRole,
      recommended_role_id: evaluation.recommendedRoleId,
      home_profession: evaluation.homeProfession,
      blended_traits: evaluation.blendedTraits,
      q7_rationale_quote: q7Analysis.q7_rationale_quote,
      raw_evaluation: evaluation,
    };

    return NextResponse.json(payload, { status: 200 });
  } catch (error: any) {
    console.error("[Diagnose API Error]:", error);
    return NextResponse.json(
      { error: "We were unable to process your career diagnostic at this moment. Please check your connection and try submitting again." },
      { status: 500 }
    );
  }
}
