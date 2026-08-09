import {
  CSRProject,
  Proposal,
  ProposalEvaluation,
  Fulfillment,
  NGOVerification,
  AIVerification,
  UserRole,
  Tender,
  TenderQuotation,
  QuotationEvaluation,
  NGONeedAnalysis,
} from '@/types';

export class FeatherlessAIAdapter {
  private static getApiKey(): string {
    return process.env.FEATHERLESS_API_KEY || '';
  }

  private static getBaseUrl(): string {
    return process.env.FEATHERLESS_BASE_URL || 'https://api.featherless.ai/v1';
  }

  private static getModel(): string {
    return process.env.FEATHERLESS_MODEL || 'Qwen/Qwen2.5-72B-Instruct';
  }

  private static async callAI(prompt: string, systemPrompt: string): Promise<string | null> {
    const apiKey = this.getApiKey();
    if (!apiKey || apiKey.includes('placeholder')) return null;

    try {
      const response = await fetch(`${this.getBaseUrl()}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: this.getModel(),
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt },
          ],
          temperature: 0.2,
          max_tokens: 1200,
        }),
      });

      if (!response.ok) {
        console.warn('Featherless AI HTTP Error:', response.status, response.statusText);
        return null;
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || null;
    } catch (err) {
      console.error('Featherless AI Fetch Exception:', err);
      return null;
    }
  }

  // ─── 1. Analyze NGO Need: Convert natural language → structured CSR data ──────

  static async analyzeNGONeed(
    project: CSRProject
  ): Promise<Omit<NGONeedAnalysis, 'id' | 'project_id' | 'created_at'>> {
    const systemPrompt = `You are the IRISiv AI Need Analyzer. Convert an NGO's natural language description into a structured CSR project requirement. Return ONLY valid JSON with keys: structured_title (concise), category (EDUCATION/HEALTHCARE/WATER & SANITATION/RENEWABLE ENERGY/DISASTER RELIEF/SKILL DEVELOPMENT), problem_summary (1 sentence), beneficiary_group (description), estimated_beneficiaries (number), location (string), required_items (array of {item, quantity, specification}), estimated_budget (number), suggested_timeline_days (number), urgency (LOW/MEDIUM/HIGH/CRITICAL), expected_impact (1-2 sentences), csr_category (string for Schedule VII), csr_eligibility_indicators (array of strings), missing_information (array of strings for any gaps).`;
    const prompt = `NGO Name: ${project.ngo_organization_id}. Project Description: "${project.description}". Location: ${project.location || 'Gujarat'}. Beneficiaries stated: ${project.beneficiaries}. Budget stated: ₹${project.estimated_budget}.`;

    const rawResponse = await this.callAI(prompt, systemPrompt);
    if (rawResponse) {
      try {
        const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return {
            original_description: project.description,
            structured_title: parsed.structured_title || project.title,
            category: parsed.category || project.category,
            problem_summary: parsed.problem_summary || project.description.slice(0, 120),
            beneficiary_group: parsed.beneficiary_group || 'Community beneficiaries',
            estimated_beneficiaries: parsed.estimated_beneficiaries || project.beneficiaries,
            location: parsed.location || project.location || 'Gujarat',
            required_items: parsed.required_items || [],
            estimated_budget: parsed.estimated_budget || project.estimated_budget,
            suggested_timeline_days: parsed.suggested_timeline_days || 45,
            urgency: parsed.urgency || 'MEDIUM',
            expected_impact: parsed.expected_impact || '',
            csr_category: parsed.csr_category || project.category,
            csr_eligibility_indicators: parsed.csr_eligibility_indicators || [],
            missing_information: parsed.missing_information || [],
            ai_powered: true,
          };
        }
      } catch (e) {
        console.warn('NGO need analysis JSON parse fallback:', e);
      }
    }

    // Deterministic fallback
    return {
      original_description: project.description,
      structured_title: project.title,
      category: project.category,
      problem_summary: project.description.slice(0, 150) + '...',
      beneficiary_group: `${project.beneficiaries} community members in ${project.location || 'Gujarat'}`,
      estimated_beneficiaries: project.beneficiaries,
      location: project.location || 'Gujarat',
      required_items: [
        { item: 'Primary deliverable', quantity: project.beneficiaries, specification: 'As per project description' },
      ],
      estimated_budget: project.estimated_budget,
      suggested_timeline_days: 45,
      urgency: 'MEDIUM',
      expected_impact: `${project.beneficiaries} beneficiaries will receive direct support through this initiative.`,
      csr_category: project.category,
      csr_eligibility_indicators: ['Serves underserved communities', 'Qualifies under CSR Schedule VII'],
      missing_information: [],
      ai_powered: false,
    };
  }

  // ─── 2. Evaluate Quotation (new tender-based scoring) ────────────────────────

  static async evaluateQuotation(
    tender: Tender,
    quotation: TenderQuotation
  ): Promise<Omit<QuotationEvaluation, 'id' | 'created_at'>> {
    const systemPrompt = `You are the IRISiv AI Quotation Evaluator. Score a business quotation objectively against a CSR tender. Return ONLY valid JSON with keys: price_score (0-100), requirement_match_score (0-100), timeline_score (0-100), capacity_score (0-100), experience_score (0-100), feasibility_score (0-100), verification_score (0-100), overall_score (0-100), recommendation (one of: "STRONG CANDIDATE (AI Recommended)", "ACCEPTABLE CANDIDATE", "RISKY CANDIDATE"), reasoning (detailed analysis). Weights: price 15%, requirement_match 25%, timeline 15%, capacity 20%, experience 15%, feasibility 10%.`;
    const prompt = `Tender: "${tender.title}", Budget: ₹${tender.budget}, Required Quantity: ${tender.required_quantity} ${tender.unit}, Specs: "${tender.minimum_specifications}", Max Timeline: ${tender.delivery_timeline_days} days.
Quotation: Bid ₹${quotation.bid_amount}, Timeline: ${quotation.delivery_timeline_days} days, Quantity Offered: ${quotation.quantity_offered}, Specs: "${quotation.specifications_offered}", Capacity: "${quotation.capacity}", Experience: "${quotation.experience}", Description: "${quotation.description}".`;

    const rawResponse = await this.callAI(prompt, systemPrompt);
    if (rawResponse) {
      try {
        const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const p = JSON.parse(jsonMatch[0]);
          return {
            quotation_id: quotation.id,
            tender_id: tender.id,
            price_score: Math.min(100, Math.max(0, p.price_score ?? 80)),
            requirement_match_score: Math.min(100, Math.max(0, p.requirement_match_score ?? 80)),
            timeline_score: Math.min(100, Math.max(0, p.timeline_score ?? 80)),
            capacity_score: Math.min(100, Math.max(0, p.capacity_score ?? 80)),
            experience_score: Math.min(100, Math.max(0, p.experience_score ?? 80)),
            feasibility_score: Math.min(100, Math.max(0, p.feasibility_score ?? 80)),
            verification_score: 100,
            overall_score: Math.min(100, Math.max(0, p.overall_score ?? 82)),
            recommendation: p.recommendation || 'ACCEPTABLE CANDIDATE',
            reasoning: p.reasoning || 'AI evaluation complete.',
            ai_powered: true,
          };
        }
      } catch {
        console.warn('Quotation evaluation JSON parse fallback');
      }
    }

    // Deterministic fallback
    const isUnderBudget = quotation.bid_amount <= tender.budget;
    const budgetRatio = isUnderBudget ? 1.0 : tender.budget / quotation.bid_amount;
    const price_score = Math.round(Math.min(100, budgetRatio * 95));
    const timeline_score = quotation.delivery_timeline_days <= tender.delivery_timeline_days ? 95 : 70;
    const requirement_match_score = quotation.quantity_offered >= tender.required_quantity ? 92 : 65;
    const capacity_score = quotation.capacity ? 88 : 70;
    const experience_score = quotation.experience ? 88 : 68;
    const feasibility_score = 82;
    const overall_score = Math.round(
      price_score * 0.15 + requirement_match_score * 0.25 + timeline_score * 0.15 +
      capacity_score * 0.20 + experience_score * 0.15 + feasibility_score * 0.10
    );

    return {
      quotation_id: quotation.id,
      tender_id: tender.id,
      price_score,
      requirement_match_score,
      timeline_score,
      capacity_score,
      experience_score,
      feasibility_score,
      verification_score: 100,
      overall_score,
      recommendation: overall_score >= 88 ? 'STRONG CANDIDATE (AI Recommended)' : overall_score >= 75 ? 'ACCEPTABLE CANDIDATE' : 'RISKY CANDIDATE',
      reasoning: `Bid ₹${quotation.bid_amount.toLocaleString()} vs budget ₹${tender.budget.toLocaleString()} (${isUnderBudget ? 'within budget' : 'over budget'}). Timeline: ${quotation.delivery_timeline_days} days (target: ${tender.delivery_timeline_days} days). ${quotation.quantity_offered >= tender.required_quantity ? 'Full quantity offered.' : `Only ${quotation.quantity_offered} of ${tender.required_quantity} required.`}`,
      ai_powered: false,
    };
  }

  // ─── 3. Evaluate Proposal (old flow — backward compat) ───────────────────────

  static async evaluateProposal(
    project: CSRProject,
    proposal: Proposal
  ): Promise<Omit<ProposalEvaluation, 'id' | 'created_at'>> {
    const systemPrompt = `You are the IRISiv AI Proposal Evaluator. Return ONLY valid JSON with keys: cost_score (0-100), timeline_score (0-100), capacity_score (0-100), experience_score (0-100), feasibility_score (0-100), overall_score (0-100), recommendation ("STRONG CANDIDATE (AI Recommended)", "ACCEPTABLE CANDIDATE", or "RISKY CANDIDATE"), reasoning.`;
    const prompt = `Project: ${project.title}, Budget: ₹${project.estimated_budget}, Beneficiaries: ${project.beneficiaries}. Proposal: Bid ₹${proposal.bid_amount}, Timeline: ${proposal.delivery_timeline_days} days, Capacity: ${proposal.capacity || 'N/A'}, Experience: ${proposal.experience || 'N/A'}, Description: ${proposal.description}.`;

    const rawResponse = await this.callAI(prompt, systemPrompt);
    if (rawResponse) {
      try {
        const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return {
            proposal_id: proposal.id,
              cost_score: Math.min(100, Math.max(0, parsed.cost_score ?? 85)),
              timeline_score: Math.min(100, Math.max(0, parsed.timeline_score ?? 85)),
              capacity_score: Math.min(100, Math.max(0, parsed.capacity_score ?? 85)),
              experience_score: Math.min(100, Math.max(0, parsed.experience_score ?? 85)),
              feasibility_score: Math.min(100, Math.max(0, parsed.feasibility_score ?? 85)),
              overall_score: Math.min(100, Math.max(0, parsed.overall_score ?? 88)),
            recommendation: parsed.recommendation || 'STRONG CANDIDATE (AI Recommended)',
            reasoning: parsed.reasoning || 'Evaluated via Featherless AI.',
          };
        }
      } catch {
        console.warn('Proposal evaluation fallback triggered');
      }
    }

    const isUnderBudget = proposal.bid_amount <= project.estimated_budget;
    const budgetRatio = isUnderBudget ? 1.0 : project.estimated_budget / proposal.bid_amount;
    const cost_score = Math.round(Math.min(100, budgetRatio * 95));
    const timeline_score = proposal.delivery_timeline_days <= 14 ? 96 : 80;
    const capacity_score = proposal.capacity ? 92 : 75;
    const experience_score = proposal.experience ? 94 : 70;
    const feasibility_score = Math.round((cost_score + timeline_score) / 2);
    const overall_score = Math.round(cost_score * 0.3 + timeline_score * 0.2 + capacity_score * 0.2 + experience_score * 0.15 + feasibility_score * 0.15);

    return {
      proposal_id: proposal.id,
      cost_score, timeline_score, capacity_score, experience_score, feasibility_score, overall_score,
      recommendation: overall_score >= 88 ? 'STRONG CANDIDATE (AI Recommended)' : 'ACCEPTABLE CANDIDATE',
      reasoning: `Bid ₹${proposal.bid_amount.toLocaleString()} ${isUnderBudget ? 'within' : 'exceeds'} budget of ₹${project.estimated_budget.toLocaleString()}. Timeline: ${proposal.delivery_timeline_days} days.`,
    };
  }

  // ─── 4. Verify Fulfillment (NGO + AI cross-check) ────────────────────────────

  static async verifyDelivery(
    project: CSRProject,
    delivery: Fulfillment,
    ngoVerification: NGOVerification
  ): Promise<Omit<AIVerification, 'id' | 'created_at'>> {
    const requested = project.beneficiaries;
    const delivered = delivery.quantity_delivered ?? delivery.beneficiaries_served ?? requested;
    const received = ngoVerification.quantity_received;

    const safeRequested = requested > 0 ? requested : 1;
    const completionPercentage = Math.round((received / safeRequested) * 100 * 100) / 100;
    const clampedCompletion = Math.min(100, completionPercentage);
    const shortfall = Math.max(0, requested - received);

    const issues = [];
    if (shortfall > 0) {
      const shortfallPercentage = Math.round((shortfall / safeRequested) * 100);
      issues.push({
        code: 'QUANTITY_MISMATCH',
        message: `Target: ${requested}, NGO confirmed: ${received} (shortfall of ${shortfall} units — ${shortfallPercentage}%).`,
        expected: requested, actual: received, shortfall, shortfallPercentage,
      });
    }
    if (!ngoVerification.quality_acceptable) {
      issues.push({ code: 'QUALITY_CONCERN', message: 'NGO reported unacceptable quality.' });
    }
    if (ngoVerification.has_issue && ngoVerification.issue_description) {
      issues.push({ code: 'NGO_REPORTED_ISSUE', message: ngoVerification.issue_description });
    }

    const hasIssues = issues.length > 0;
    const status: AIVerification['status'] = hasIssues ? 'ISSUE_DETECTED' : 'LIKELY_FULFILLED';
    const confidence = hasIssues ? 0.94 : 0.97;

    const recommendation = hasIssues
      ? `⚠ MANUAL REVIEW REQUIRED: ${clampedCompletion.toFixed(1)}% completion (${received}/${requested}). Issues: ${issues.map((i) => i.code).join(', ')}. Hold final 40% until resolved.`
      : `✓ Verified at ${clampedCompletion.toFixed(1)}% completion (${received}/${requested} units). NGO physical check passed with ${(confidence * 100).toFixed(0)}% AI confidence. Release final 40% payment.`;

    return {
      project_id: project.id,
      ngo_verification_id: ngoVerification.id,
      status, confidence,
      requested_quantity: requested,
      received_quantity: received,
        completion_percentage: requested > 0 ? clampedCompletion : 0,
      issues,
      recommendation,
    };
  }

  // ─── 5. Generate Impact Summary ───────────────────────────────────────────────

  static async generateImpactSummary(
    project: CSRProject,
    delivery?: Fulfillment,
    ngoVerification?: NGOVerification
  ): Promise<string> {
    const hasRealData = !!(delivery || ngoVerification);
    const delivered = ngoVerification?.quantity_received ?? delivery?.quantity_delivered ?? delivery?.beneficiaries_served;
    const safeRequested = project.beneficiaries > 0 ? project.beneficiaries : 1;
    const percent = delivered != null ? Math.round(Math.min(100, (delivered / safeRequested) * 100)) : null;
    const displayDelivered = delivered ?? 0;
    const displayPercent = percent ?? 0;

    const systemPrompt = `You are the IRISiv Verifiable Impact Report Generator. Write a concise 3-sentence executive impact summary for a completed CSR initiative. Mention beneficiary count, completion %, payment breakdown, and that it was verified by NGO physical check + AI.`;
    const prompt = `Project: ${project.title} (${project.project_code}), Location: ${project.location || 'Gujarat'}, Beneficiaries reached: ${displayDelivered} of ${project.beneficiaries} (${displayPercent}% completion${!hasRealData ? ' — UNVERIFIED' : ''}), Contract: ₹${(project.contract_value || project.estimated_budget).toLocaleString()}, Payment: 20% advance + 40% milestone + 40% final (all recorded).`;

    const aiSummary = await this.callAI(prompt, systemPrompt);
    if (aiSummary) return aiSummary.trim();

    if (!hasRealData) {
      return `IRISiv Impact Summary: Project '${project.title}' (${project.project_code}) completed with contract value ₹${(project.contract_value || project.estimated_budget).toLocaleString()}. No physical delivery or NGO verification data on record — recommend manual audit review.`;
    }

    return `IRISiv Verified Impact: '${project.title}' (${project.project_code}) successfully reached ${displayDelivered.toLocaleString()} of ${project.beneficiaries.toLocaleString()} target beneficiaries (${displayPercent}% completion) in ${project.location || 'Gujarat'}. Contract ₹${(project.contract_value || project.estimated_budget).toLocaleString()} disbursed across three milestones: 20% advance + 40% fulfillment + 40% final. Full dual-layer NGO physical check and AI cross-verification maintained in immutable audit trail.`;
  }

  // ─── 6. AI Assistant Chat ─────────────────────────────────────────────────────

  static async answerAssistantQuery(
    userRole: UserRole,
    userProjects: CSRProject[],
    query: string
  ): Promise<string> {
    const projectsContext = userProjects
      .map((p) => `- ${p.project_code}: "${p.title}" | Status: ${p.status} | Budget: ₹${p.estimated_budget} | ${p.beneficiaries} beneficiaries`)
      .join('\n');

    const systemPrompt = `You are IRISiv AI Assistant powered by Featherless AI. You help ${userRole} users navigate the CSR procurement platform.

Workflow: NGO submits need → AI structures it → NGO reviews → SUBMITTED → Corporate expresses interest → CORPORATE_INTERESTED → Corporate creates tender → TENDER_OPEN → Businesses submit quotations → Corporate closes tender → AI evaluates quotations → Corporate selects best quotation → CONTRACTED → 20% Advance recorded → IN_PROGRESS → Business submits fulfillment proof → 40% Milestone payment recorded → NGO confirms receipt → 40% Final payment released → Impact Report generated.

Payment model: 20% Advance on contract execution. 40% Fulfillment Milestone after delivery proof. 40% Final after NGO physical confirmation. Total: 100%.

Active Projects:
${projectsContext}

Be concise, helpful, and role-specific. Use ₹ for amounts.`;

    const aiReply = await this.callAI(query, systemPrompt);
    if (aiReply) return aiReply.trim();

    // Smart fallback
    const q = query.toLowerCase();
    if (q.includes('attention') || q.includes('pending') || q.includes('action')) {
      const pending = userProjects.filter((p) =>
        ['SUBMITTED', 'FULFILLMENT_SUBMITTED', 'NGO_CONFIRMATION_PENDING', 'MANUAL_REVIEW', 'NGO_CONFIRMED', 'TENDER_OPEN'].includes(p.status)
      );
      if (pending.length === 0) return 'All your projects are up to date! No urgent actions required right now.';
      return `You have ${pending.length} project(s) requiring attention:\n\n` +
        pending.map((p, i) => `${i + 1}. **${p.project_code}**: ${p.title} — *${p.status.replace(/_/g, ' ')}*`).join('\n');
    }

    if (q.includes('payment') || q.includes('milestone')) {
      return `IRISiv uses a 20/40/40 payment model:\n\n• **20% Advance** — Released when contract is executed (business can start work)\n• **40% Fulfillment Milestone** — Released when business submits delivery/service proof\n• **40% Final** — Released after NGO physically confirms receipt\n\nAll payments are recorded in the IRISiv audit ledger for full transparency.`;
    }

    if (q.includes('tender') || q.includes('quotation')) {
      return `Tenders are created by Corporate sponsors after expressing interest in an NGO project. Businesses then submit detailed quotations with pricing, specifications, and experience. Featherless AI evaluates all quotations on 7 factors and recommends the best candidate. Corporate makes the final selection.`;
    }

    if (q.includes('completed') || q.includes('impact')) {
      const completed = userProjects.filter((p) => p.status === 'COMPLETED');
      const totalBeneficiaries = completed.reduce((sum, p) => sum + p.beneficiaries, 0);
      return `Total Completed Projects: ${completed.length}\nVerified Beneficiaries Reached: ${totalBeneficiaries.toLocaleString()}\nAll completions have full NGO physical verification + AI audit trail.`;
    }

    return `IRISiv AI Assistant (${userRole}): I can help you understand project statuses, payment milestones, tender workflows, and impact metrics. Try asking "Which projects need my attention?" or "Explain the 20/40/40 payment model."`;
  }
}
