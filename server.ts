import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// -------------------------------------------------------------
// Helper: Safe JSON extraction from Gemini output
// -------------------------------------------------------------
function extractJson(text: string) {
  try {
    const clean = text.trim();
    if (clean.startsWith('```json')) {
      const closing = clean.lastIndexOf('```');
      return JSON.parse(clean.substring(7, closing).trim());
    } else if (clean.startsWith('```')) {
      const closing = clean.lastIndexOf('```');
      return JSON.parse(clean.substring(3, closing).trim());
    }
    return JSON.parse(clean);
  } catch (err) {
    // Attempt regex match for first JSON object or array
    const jsonMatch = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (e) {
        // Fall through
      }
    }
    throw err;
  }
}

// -------------------------------------------------------------
// 1. API: Generate Study Plan
// -------------------------------------------------------------
app.post('/api/study-plan', async (req: Request, res: Response) => {
  const {
    subject = 'Digital Logic and Computer Organization',
    examDate = 'Tomorrow',
    availableHours = 5,
    targetScore = 80,
    topics = ['Boolean Algebra', 'Logic Gates', 'K-Maps', 'Combinational Circuits', 'Computer Organization'],
    difficulty = 'Intermediate',
    learningGoal = 'Score 80%',
  } = req.body;

  const prompt = `You are StudyPilot AI, an autonomous personal study agent for college students.
Create an adaptive, high-impact study plan for:
Subject: ${subject}
Exam Timeline: ${examDate}
Available Study Time: ${availableHours} hours
Target Score: ${targetScore}%
Selected Topics: ${topics.join(', ')}
Current Difficulty: ${difficulty}
Learning Goal: ${learningGoal}

Respond ONLY with a JSON object in this exact schema:
{
  "summary": "Brief 1-sentence strategic summary",
  "strategy": "Concise paragraph explaining how the agent prioritized the topics based on time and exam target",
  "timeline": [
    {
      "id": "step-1",
      "time": "09:00 AM — 10:00 AM",
      "topic": "Boolean Algebra",
      "priority": "HIGH",
      "activity": "Concept Revision & Core Axioms",
      "difficulty": "Intermediate",
      "durationMinutes": 60,
      "completed": false,
      "agentReasoning": "Crucial foundational topic to eliminate common simplification errors."
    }
  ],
  "agentNotes": "Key recommendation for the student to maximize retention."
}
Allocate realistic time blocks totaling ${availableHours} hours across the selected topics. Ensure priorities are realistic (HIGH/MEDIUM/LOW).`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.4,
        },
      });

      if (response.text) {
        const parsed = extractJson(response.text);
        return res.json({ success: true, plan: parsed });
      }
    } catch (err: any) {
      console.warn('Gemini study plan error, using smart agent fallback:', err.message);
    }
  }

  // Fallback intelligent agent study plan
  const fallbackPlan = {
    summary: `Structured ${availableHours}-hour targeted mastery sprint for ${subject} targeting ${targetScore}%.`,
    strategy: `StudyPilot analyzed your ${availableHours}-hour constraint and prioritized core foundational topics (Boolean Algebra, K-Maps) before integrating system-level Computer Organization. This maximizes point yield for your ${targetScore}% target.`,
    timeline: [
      {
        id: 'plan-1',
        time: '09:00 AM — 10:00 AM',
        topic: topics[0] || 'Boolean Algebra',
        priority: 'HIGH',
        activity: 'Concept Revision & Axioms',
        difficulty: 'Intermediate',
        durationMinutes: 60,
        completed: false,
        agentReasoning: 'Foundational axioms must be fresh to prevent cascading algebraic errors in circuits.',
      },
      {
        id: 'plan-2',
        time: '10:00 AM — 11:00 AM',
        topic: topics[2] || 'K-Maps',
        priority: 'HIGH',
        activity: 'Practice Problems & Grouping',
        difficulty: 'Intermediate',
        durationMinutes: 60,
        completed: false,
        agentReasoning: 'High-point exam question type. Focus on 4-variable minterm grouping and don’t-care conditions.',
      },
      {
        id: 'plan-3',
        time: '11:00 AM — 11:45 AM',
        topic: topics[1] || 'Logic Gates',
        priority: 'MEDIUM',
        activity: 'Quick Revision & Universal Gates',
        difficulty: 'Beginner',
        durationMinutes: 45,
        completed: false,
        agentReasoning: 'NAND/NOR universal gate conversions often appear as rapid 5-mark conceptual checks.',
      },
      {
        id: 'plan-4',
        time: '11:45 AM — 12:45 PM',
        topic: topics[4] || 'Computer Organization',
        priority: 'HIGH',
        activity: 'Concepts + Control Unit & ALU Questions',
        difficulty: 'Intermediate',
        durationMinutes: 60,
        completed: false,
        agentReasoning: 'Synthesizes gate knowledge into instruction cycles, registers, and memory bus operations.',
      },
      {
        id: 'plan-5',
        time: '12:45 PM — 01:15 PM',
        topic: 'Comprehensive Review',
        priority: 'HIGH',
        activity: 'AI Mock Test & Weak Area Triage',
        difficulty: 'Advanced',
        durationMinutes: 30,
        completed: false,
        agentReasoning: 'Final timed validation to test rapid recall under exam time pressure.',
      },
    ],
    agentNotes: 'Take a 5-minute active recovery break between hour 2 and 3 to sustain cognitive alertness.',
  };

  return res.json({ success: true, plan: fallbackPlan });
});

// -------------------------------------------------------------
// 2. API: Generate Adaptive Practice Question
// -------------------------------------------------------------
app.post('/api/generate-question', async (req: Request, res: Response) => {
  const {
    subject = 'Digital Logic and Computer Organization',
    topic = 'Boolean Algebra',
    difficulty = 'Intermediate',
    previousScore,
    weakAreaPrompt,
  } = req.body;

  const prompt = `You are StudyPilot AI's autonomous question generator.
Generate a realistic, high quality college exam practice question for:
Subject: ${subject}
Topic: ${topic}
Difficulty Level: ${difficulty}
Context: ${weakAreaPrompt || `The student is practicing for their exam. Previous score: ${previousScore ?? 80}%`}

Respond ONLY in JSON with this exact schema:
{
  "id": "q-${Date.now()}",
  "subject": "${subject}",
  "topic": "${topic}",
  "difficulty": "${difficulty}",
  "questionText": "The exact question text with clear mathematical or theoretical notation.",
  "hint": "A guiding hint that does not give away the whole answer.",
  "keyConcepts": ["Concept 1", "Concept 2"],
  "sampleAnswer": "Ideal concise student answer including mathematical steps."
}`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.5,
        },
      });

      if (response.text) {
        const parsed = extractJson(response.text);
        return res.json({ success: true, question: parsed });
      }
    } catch (err: any) {
      console.warn('Gemini question generation error, using fallback:', err.message);
    }
  }

  // Curated college fallback questions per topic
  const questionsBank: Record<string, any> = {
    'Boolean Algebra': {
      id: `q-${Date.now()}`,
      subject,
      topic: 'Boolean Algebra',
      difficulty,
      questionText: 'Simplify the following Boolean expression using Boolean algebra laws:\n\nF = A + AB',
      hint: 'Recall the Absorption Law: A + AB = A(1 + B). What is (1 + B) in Boolean logic?',
      keyConcepts: ['Absorption Law', 'Distributive Law', 'Identity Law'],
      sampleAnswer: 'F = A + AB\n= A(1 + B)   [by Distributive Law]\n= A(1)       [since 1 + B = 1 by Annulment/Identity]\n= A          [by Identity Law]\nTherefore, F = A.',
    },
    'Logic Gates': {
      id: `q-${Date.now()}`,
      subject,
      topic: 'Logic Gates',
      difficulty,
      questionText: 'Implement a 2-input XOR gate using only 2-input NAND gates. State the minimum number of NAND gates required and write the intermediate logic expressions.',
      hint: 'XOR is A ⊕ B = A\'B + AB\'. Remember NAND is (XY)\'. A standard minimal implementation requires 4 NAND gates.',
      keyConcepts: ['Universal NAND Gates', 'XOR Logic', 'De Morgan Theorems'],
      sampleAnswer: 'A 2-input XOR gate requires a minimum of 4 NAND gates.\n1. Gate 1: G1 = NAND(A, B) = (AB)\'\n2. Gate 2: G2 = NAND(A, G1) = (A(AB)\')\' = A\' + AB = A\' + B\n3. Gate 3: G3 = NAND(B, G1) = (B(AB)\')\' = B\' + AB = B\' + A\n4. Gate 4: G4 = NAND(G2, G3) = ( (A\' + B)(B\' + A) )\' = A\'B + AB\' = A ⊕ B.',
    },
    'K-Maps': {
      id: `q-${Date.now()}`,
      subject,
      topic: 'K-Maps',
      difficulty,
      questionText: 'Minimize the following 4-variable Boolean function using a Karnaugh Map:\nF(A, B, C, D) = Σm(0, 2, 8, 10, 14) + d(5, 7)',
      hint: 'Look for corner grouping: cells (0, 2, 8, 10) form a quad. Check if the don’t-cares d(5,7) can simplify minterm 14 or are redundant.',
      keyConcepts: ['K-Map Quad Grouping', 'Corner Minimization', 'Don’t-Care Conditions'],
      sampleAnswer: '1. Grouping the 4 corners: m(0, 2, 8, 10) gives the term B\'D\'.\n2. Grouping m(10, 14): gives the term ACD\' (or paired with don’t cares if optimal).\nMinimal expression: F = B\'D\' + ACD\'.',
    },
    'Computer Organization': {
      id: `q-${Date.now()}`,
      subject,
      topic: 'Computer Organization',
      difficulty,
      questionText: 'Explain the role of the Program Counter (PC) and Instruction Register (IR) during the Fetch and Decode phases of the CPU instruction cycle.',
      hint: 'The PC holds the memory address of the next instruction; the IR holds the instruction currently being executed.',
      keyConcepts: ['Fetch-Decode-Execute Cycle', 'Program Counter', 'Instruction Register', 'MAR/MDR'],
      sampleAnswer: '1. Fetch Phase: The address in the PC is transferred to MAR. Memory places the instruction in MDR, which is then moved into the Instruction Register (IR). PC is incremented (PC ← PC + 1) to point to the next instruction.\n2. Decode Phase: The Control Unit decodes the opcode stored in the IR to generate control signals for the ALU and registers.',
    },
  };

  const selected = questionsBank[topic] || questionsBank['Boolean Algebra'];
  return res.json({ success: true, question: selected });
});

// -------------------------------------------------------------
// 3. API: Evaluate Student Answer
// -------------------------------------------------------------
app.post('/api/evaluate-answer', async (req: Request, res: Response) => {
  const {
    questionText,
    studentAnswer,
    topic = 'Boolean Algebra',
    difficulty = 'Intermediate',
    consecutiveLowScores = 0,
    consecutiveHighScores = 0,
  } = req.body;

  const prompt = `You are StudyPilot AI, an autonomous academic agent evaluating a college student's answer.
Question: ${questionText}
Topic: ${topic}
Student Answer: "${studentAnswer}"

Evaluate strictly on:
1. Mathematical and logical correctness
2. Explicit reasoning and cited laws/theorems
3. Missing concepts
4. Common misconceptions
5. Numerical score between 0 and 10

Also determine the Agent Decision (nextAction) based on:
- If score >= 8: MOVE_TO_NEXT_TOPIC or INCREASE_DIFFICULTY
- If score between 5 and 7.9: GENERATE_ANOTHER_QUESTION
- If score < 5: START_REVISION or LOWER_DIFFICULTY or GIVE_CONCEPT_EXPLANATION

Student Performance Context:
- Consecutive high scores: ${consecutiveHighScores}
- Consecutive low scores: ${consecutiveLowScores}

Respond ONLY with a JSON object in this exact schema:
{
  "score": 9,
  "isCorrect": true,
  "correctFinalAnswer": true,
  "correctReasoning": true,
  "reasoningAnalysis": "Clear description of the student's thought process",
  "minorIssues": "Any minor omission or formatting issue, or null if none",
  "missingConcepts": ["Absorption Law"],
  "commonMistakes": [],
  "conceptUnderstanding": "Strong",
  "nextAction": "MOVE_TO_NEXT_TOPIC",
  "nextActionReasoning": "Student demonstrated robust algebraic factoring. Agent advises advancing to K-Maps.",
  "recommendedAction": "Advance to next topic",
  "aiRecommendation": "Move to the next topic.",
  "modelSolution": "Step-by-step breakdown of the ideal solution."
}`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      if (response.text) {
        const parsed = extractJson(response.text);
        return res.json({ success: true, evaluation: parsed });
      }
    } catch (err: any) {
      console.warn('Gemini evaluation error, using agent heuristic fallback:', err.message);
    }
  }

  // Heuristic evaluation fallback
  const cleanAnswer = (studentAnswer || '').toLowerCase().trim();
  let score = 7;
  let isCorrect = false;
  let minorIssues: string | null = null;
  let understanding = 'Moderate';
  let nextAction = 'GENERATE_ANOTHER_QUESTION';
  let nextReasoning = 'Solid foundation shown. One more question will cement the concept.';

  if (cleanAnswer.includes('f = a') || cleanAnswer.includes('a(1+b)') || cleanAnswer.includes('a(1 + b)') || cleanAnswer.includes('4 nand') || cleanAnswer.includes('b\'d\'')) {
    score = 9;
    isCorrect = true;
    understanding = 'Strong';
    minorIssues = cleanAnswer.includes('absorption') ? null : 'You did not explicitly mention the Absorption Law.';
    nextAction = 'MOVE_TO_NEXT_TOPIC';
    nextReasoning = 'You arrived at the correct simplified form! The agent recommends progressing to the next topic.';
  } else if (cleanAnswer.length < 5 || cleanAnswer.includes('don\'t know') || cleanAnswer.includes('idk')) {
    score = 3;
    isCorrect = false;
    understanding = 'Needs Improvement';
    minorIssues = 'Incomplete response. Key Boolean identity laws were not applied.';
    nextAction = 'START_REVISION';
    nextReasoning = 'Score is under 50%. StudyPilot recommends a 20-minute targeted review of core axioms.';
  } else {
    score = 6;
    isCorrect = false;
    understanding = 'Moderate';
    minorIssues = 'Partial simplification. Ensure all terms are factored to the irreducible minimum form.';
    nextAction = 'GENERATE_ANOTHER_QUESTION';
    nextReasoning = 'You are very close to full mastery. Let’s try one more targeted question.';
  }

  return res.json({
    success: true,
    evaluation: {
      score,
      isCorrect,
      correctFinalAnswer: isCorrect,
      correctReasoning: score >= 7,
      reasoningAnalysis: isCorrect
        ? 'Student correctly applied distributive factoring and identity simplification.'
        : 'Student attempted the problem but missed a vital algebraic reduction step.',
      minorIssues,
      missingConcepts: isCorrect ? [] : ['Absorption Law: A + AB = A'],
      commonMistakes: isCorrect ? [] : ['Leaving (1 + B) unreduced'],
      conceptUnderstanding: understanding,
      nextAction,
      nextActionReasoning: nextReasoning,
      recommendedAction: nextAction === 'START_REVISION' ? 'Revision' : 'Continue Learning',
      aiRecommendation: nextAction === 'START_REVISION' ? 'Spend 20 minutes revising Boolean Laws before re-attempting.' : 'Move to the next practice topic.',
      modelSolution: 'F = A + AB = A(1 + B). Since 1 + B = 1, F = A(1) = A.',
    },
  });
});

// -------------------------------------------------------------
// 4. API: Agent Decision Engine
// -------------------------------------------------------------
app.post('/api/agent-decision', async (req: Request, res: Response) => {
  const {
    subject = 'Digital Logic and Computer Organization',
    currentScore = 82,
    targetScore = 80,
    topicHistory = [],
    recentScores = [80, 85, 40],
    weakTopics = ['Boolean Algebra'],
    strongTopics = ['Logic Gates'],
  } = req.body;

  const prompt = `You are StudyPilot AI's Autonomous Decision Engine.
Student State:
Subject: ${subject}
Current Average Score: ${currentScore}%
Target Score: ${targetScore}%
Recent Scores: ${recentScores.join(', ')}
Weak Topics: ${weakTopics.join(', ')}
Strong Topics: ${strongTopics.join(', ')}

Analyze the study state and decide the exact next best study action from this set:
[MOVE_TO_NEXT_TOPIC, GENERATE_ANOTHER_QUESTION, START_REVISION, GIVE_CONCEPT_EXPLANATION, LOWER_DIFFICULTY, INCREASE_DIFFICULTY, START_MOCK_TEST]

Respond ONLY in JSON with this exact schema:
{
  "action": "START_REVISION",
  "recommendationTitle": "Revisit Boolean Algebra Laws",
  "recommendationText": "Based on your recent practice, Boolean Algebra is currently your weakest topic. I recommend spending 25 minutes revising Boolean Laws before attempting another advanced question.",
  "recommendedAction": "Revision",
  "estimatedTimeMinutes": 25,
  "reason": "Your last two answers indicated difficulty with Boolean absorption and De Morgan expansions.",
  "priority": "HIGH",
  "suggestedTopic": "Boolean Algebra",
  "statusBadge": "Action Recommended",
  "timelineStep": "Weak Area Detected -> Choosing Next Action"
}`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      if (response.text) {
        const parsed = extractJson(response.text);
        return res.json({ success: true, decision: parsed });
      }
    } catch (err: any) {
      console.warn('Gemini decision error, using fallback:', err.message);
    }
  }

  const decisionFallback = {
    action: 'START_REVISION',
    recommendationTitle: 'Revisit Boolean Algebra Laws',
    recommendationText: 'Based on your recent practice, Boolean Algebra is currently your weakest topic. I recommend spending 25 minutes revising Boolean Laws before attempting another advanced question.',
    recommendedAction: 'Revision',
    estimatedTimeMinutes: 25,
    reason: 'Your last two answers indicated difficulty with Boolean Algebra simplification. Targeted review prevents recurring exam deduction.',
    priority: 'HIGH',
    suggestedTopic: 'Boolean Algebra',
    statusBadge: 'Action Recommended',
    timelineStep: 'Weak Area Detected -> Choosing Next Action',
  };

  return res.json({ success: true, decision: decisionFallback });
});

// -------------------------------------------------------------
// Server Setup (Vite Middleware in Dev / Static in Prod)
// -------------------------------------------------------------
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`StudyPilot AI server running on port ${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
