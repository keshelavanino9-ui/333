
import { GoogleGenAI, Type } from "@google/genai";
import { Message, ActionCard, CompetencyGap, TuningConfig, ROIInputs, FinancialTemplate, WorkflowExecution, SystemHealth, AdHocQueryProposal } from "../types";

export class GeminiService {
  private get client() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  // Orchestration helper: Wraps logic into an n8n-style intent pattern
  async dispatchIntent(intent: string, params: any, lang: 'en' | 'ka', tuning?: TuningConfig) {
    console.log(`[n8n-intent-dispatch]: ${intent}`, params);
    // Simulate processing delay for realism
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return this.chat([{
      id: 'intent-' + Date.now(),
      role: 'user',
      content: `INTENT: ${intent}. DATA: ${JSON.stringify(params)}. Execute command protocol. Return JSON confirmation.`,
      timestamp: Date.now()
    }], lang, tuning);
  }

  async synthesizeFinancialReport(budgetData: any, lang: 'en' | 'ka', tuning?: TuningConfig): Promise<string> {
    const response = await this.client.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Synthesize an exhaustive executive financial strategy based on this dataset: ${JSON.stringify(budgetData.summary)}. 
      Segment-specific performance: ${JSON.stringify(budgetData.segments)}.
      
      Your analysis must cover:
      1. Revenue Velocity: Identify seasonal peak/dip triggers for Social vs Wholesale.
      2. Functional Efficiency: Evaluate COGS/Revenue ratio. Is current procurement optimized?
      3. OpEx Burn Rate: Project impact of current operational spend on year-end EBITDA.
      4. CAPEX Strategic Roadmap: Evaluate infrastructure investment against yield growth.
      5. Risk Mitigation: Suggest hedging strategies for volume fluctuations.
      
      Deliver a set of "Autonomous Recommendations" for immediate execution.
      Output language: ${lang === 'en' ? 'English' : 'Georgian'}.
      Tone: Institutional, Precise, Predictive.`,
      config: {
        thinkingConfig: { thinkingBudget: 4000 }
      }
    });
    return response.text || "";
  }

  async generateAdHocProposal(query: string, lang: 'en' | 'ka'): Promise<AdHocQueryProposal> {
    const response = await this.client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `User Query: "${query}".
      
      You are the Governance Layer. Convert this natural language query into a strict JSON proposal object for the database.
      Allowed Tables: 'employees', 'vacancies', 'expenses', 'payroll', 'workflow_executions'.
      Allowed Operations: 'SELECT'.
      
      Strict JSON Schema:
      {
        "operation": "SELECT",
        "table": "string",
        "columns": ["string"],
        "filters": [{ "field": "string", "op": "eq|gt|lt", "value": "any" }],
        "limit": number,
        "reasoning": "string"
      }
      
      If the query is unsafe or unclear, return a valid JSON with operation "SELECT" on table "employees" with a limit of 0.`,
      config: {
        responseMimeType: "application/json"
      }
    });

    try {
      return JSON.parse(response.text || "{}");
    } catch (e) {
      return { operation: 'SELECT', table: 'error_logs', limit: 10, reasoning: 'Parsing failure fallback' };
    }
  }

  async chat(messages: Message[], lang: 'en' | 'ka', tuning?: TuningConfig, companyContext?: string): Promise<{ 
    response: string; 
    thinkingSteps: string[]; 
    confidence: number;
    suggestedAction?: string;
  }> {
    const depth = tuning?.reasoningDepth || 85;
    const creativity = tuning?.creativity || 45;
    const strictness = tuning?.strictness || 90;

    const response = await this.client.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      })),
      config: {
        systemInstruction: `You are Nyx Cognitive Core 3.6. 
        Tuning Profile: Depth ${depth}%, Creativity ${creativity}%, Strictness ${strictness}%.
        Language: ${lang === 'en' ? 'English' : 'Georgian'}.
        Org Context: ${companyContext || 'Global Logistics Mainframe'}.
        Deliver executive-level autonomous insights.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            thinkingSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
            response: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            suggestedAction: { type: Type.STRING }
          },
          required: ["thinkingSteps", "response", "confidence"]
        },
        thinkingConfig: { thinkingBudget: Math.max(2000, depth * 350) }
      }
    });

    try {
      return JSON.parse(response.text || "{}");
    } catch (e) {
      return { response: lang === 'en' ? "Neural Handshake Fault." : "ნეირალური კავშირის ხარვეზი.", thinkingSteps: [], confidence: 0 };
    }
  }

  async runAutonomousAudit(lang: 'en' | 'ka'): Promise<{ actions: ActionCard[] }> {
    const response = await this.client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Perform an autonomous organizational audit. Language: ${lang === 'en' ? 'English' : 'Georgian'}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            actions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  type: { type: Type.STRING },
                  titleEn: { type: Type.STRING },
                  titleKa: { type: Type.STRING },
                  descriptionEn: { type: Type.STRING },
                  descriptionKa: { type: Type.STRING },
                  priority: { type: Type.STRING },
                  confidence: { type: Type.NUMBER },
                  impactScore: { type: Type.NUMBER },
                  status: { type: Type.STRING }
                },
                required: ["id", "type", "titleEn", "titleKa", "descriptionEn", "descriptionKa", "priority", "confidence", "impactScore", "status"]
              }
            }
          },
          required: ["actions"]
        }
      }
    });
    try {
      return JSON.parse(response.text || "{\"actions\": []}");
    } catch (e) {
      return { actions: [] };
    }
  }

  async analyzeSkillGaps(employee: any, role: any, lang: 'en' | 'ka'): Promise<CompetencyGap> {
    const response = await this.client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze gaps for ${employee.nameEn} as ${role.title}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            readiness_score: { type: Type.NUMBER },
            gaps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  skill: { type: Type.STRING },
                  priority: { type: Type.STRING },
                  recommendation: { type: Type.STRING },
                  current: { type: Type.NUMBER },
                  target: { type: Type.NUMBER }
                },
                required: ["skill", "priority", "recommendation", "current", "target"]
              }
            }
          },
          required: ["readiness_score", "gaps"]
        }
      }
    });
    try {
      return JSON.parse(response.text || "{\"readiness_score\": 0, \"gaps\": []}");
    } catch (e) {
      return { readiness_score: 0, gaps: [] };
    }
  }

  async queryPolicy(query: string, lang: 'en' | 'ka'): Promise<{ text: string, sources: any[] }> {
    const response = await this.client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Policy query: ${query}.`,
      config: { tools: [{ googleSearch: {} }] }
    });
    return {
      text: response.text || "",
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  }

  async runFinancialSimulation(inputs: ROIInputs, lang: 'en' | 'ka'): Promise<string> {
    const response = await this.client.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Run simulation: ${JSON.stringify(inputs)}.`,
      config: { thinkingConfig: { thinkingBudget: 4000 } }
    });
    return response.text || "";
  }

  async analyzeFinancialData(data: string, template: FinancialTemplate, lang: 'en' | 'ka'): Promise<string> {
    const response = await this.client.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Analyze financial data: ${data}. Template: ${template.prompt}.`,
      config: { thinkingConfig: { thinkingBudget: 4000 } }
    });
    return response.text || "";
  }

  async fetchWorkflowExecutions(): Promise<WorkflowExecution[]> {
    return [
      { id: 'ex-9421', workflowName: 'OpsPilot Q4 Shift Calibration', status: 'SUCCESS', startedAt: '2024-05-10T14:20:00Z', duration: 42, trigger: 'Webhook', recordsProcessed: 1420, intent: 'OPERATIONS.CALIBRATION' },
      { id: 'ex-9420', workflowName: 'Global Payroll Sync', status: 'SUCCESS', startedAt: '2024-05-10T09:00:00Z', duration: 112, trigger: 'Cron', recordsProcessed: 582, intent: 'FINANCE.PAYROLL.SYNC' },
    ];
  }

  async fetchSystemHealth(): Promise<SystemHealth[]> {
    return [
      { service: 'Gemini 3 Pro', status: 'OPERATIONAL', latency: 420, breakerState: 'CLOSED' },
      { service: 'Supabase Matrix', status: 'OPERATIONAL', latency: 120, breakerState: 'CLOSED' },
      { service: 'n8n Orchestrator', status: 'OPERATIONAL', latency: 55, breakerState: 'CLOSED' },
    ];
  }

  async fetchTableData(tableName: string): Promise<any[]> {
    const mocks: Record<string, any[]> = {
      'workflow_executions': [{ id: '1', intent: 'HR.SYNC', status: 'SUCCESS', timestamp: '2024-05-10' }],
      'analysis_cache': [{ hash: '7c8d9...', content: 'Logistics summary...', expires: '2024-06-10' }],
      'error_events': [{ id: 'err-01', type: 'TRANSIENT', message: 'Timeout', severity: 'MEDIUM' }],
      'employees': [{ id: 1, name: 'G. Beridze', dept: 'Logistics' }, { id: 2, name: 'M. Kobakhidze', dept: 'Ops' }]
    };
    return mocks[tableName] || [];
  }

  async executeN8NWorkflow(workflowId: string, payload: any, onStep: (step: string) => void): Promise<void> {
    const steps = ["Validating Payload...", "Triggering n8n Webhook...", "Awaiting Node Handshake...", "Syncing Results..."];
    for (const step of steps) {
      onStep(step);
      await new Promise(r => setTimeout(r, 800));
    }
  }

  async simulateAdvancedWorkflow(onStep: (step: { id: string; msg: string }) => void): Promise<void> {
    const steps = [
      { id: "manual-trigger", msg: "INTENT_RECEIVED: OPERATIONS.PRODUCTION.CYCLE" },
      { id: "data-ingestion", msg: "INGESTING: Unstructured manifest data..." },
      { id: "data-validator", msg: "VALIDATING: Entity integrity 99.4%" },
      { id: "ai-planner", msg: "INFERRING: Reforecasting hub load..." },
      { id: "final-notify", msg: "DISPATCHING: Synchronization success." }
    ];
    for (const step of steps) {
      onStep(step);
      await new Promise(r => setTimeout(r, 1000));
    }
  }
}

export const gemini = new GeminiService();
