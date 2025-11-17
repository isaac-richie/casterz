import OpenAI from 'openai'
import { randomUUID } from 'crypto'
import { Signal, Market } from '../types'
import { config } from '../config'

export class AIEngineService {
  private openai: OpenAI | null
  private model: string

  constructor() {
    const apiKey = config.OPENAI_API_KEY || process.env.OPENAI_API_KEY
    
    if (!apiKey) {
      console.warn('⚠️  OPENAI_API_KEY not found - AI analysis will use fallback')
      this.openai = null
    } else {
      this.openai = new OpenAI({
        apiKey: apiKey
      })
      console.log('✅ OpenAI client initialized')
    }
    
    // Default to gpt-4o - best quality and accuracy
    // gpt-5-nano exists but has limitations (empty responses, no json_object support)
    // For cheapest: use gpt-4o-mini or gpt-3.5-turbo, for best quality: use gpt-4o
    this.model = process.env.OPENAI_MODEL || 'gpt-4o'
  }

  async generateSignal(market: Market, userWallet?: string): Promise<Signal> {
    if (!this.openai) {
      console.warn('⚠️  OpenAI not configured - using fallback signal')
      return this.generateFallbackSignal(market)
    }

    try {
      const prompt = this.buildAnalysisPrompt(market)
      
      // gpt-5-nano has different parameter requirements
      const isNanoModel = this.model.includes('nano')
      const requestParams: any = {
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are a premium prediction market analyst. Always respond with valid JSON only, no markdown formatting, no code blocks.'
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      }
      
      // Nano models use max_completion_tokens and don't support custom temperature or json_object format
      if (isNanoModel) {
        requestParams.max_completion_tokens = 4000
        // Temperature defaults to 1 for nano models, can't be customized
        // Note: gpt-5-nano may not support json_object format, so we'll parse the response manually
      } else {
        requestParams.response_format = { type: 'json_object' }
        requestParams.max_tokens = 4000
        requestParams.temperature = 0.7
      }
      
      const response = await this.openai.chat.completions.create(requestParams)

      const analysis = response.choices[0]?.message?.content || ''
      
      // Debug: log response for nano models
      if (isNanoModel && !analysis) {
        console.warn('⚠️  Empty response from nano model, checking response structure...')
        console.log('Response:', JSON.stringify(response, null, 2))
      }
      
      const signal = this.parseAnalysis(analysis, market)

      return signal
    } catch (error: any) {
      console.error('AI analysis failed:', error?.message || error)
      return this.generateFallbackSignal(market)
    }
  }

  private buildAnalysisPrompt(market: Market): string {
    // Calculate days until end date
    const daysUntilEnd = market.end_date ? 
      Math.ceil((new Date(market.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 
      'Unknown'
    
    // Enhanced volume analysis
    const volumeIndicator = market.volume > 10000 ? 'High' : market.volume > 1000 ? 'Medium' : 'Low'
    const volumePerDay = daysUntilEnd !== 'Unknown' && daysUntilEnd > 0 
      ? (market.volume / daysUntilEnd).toFixed(0) 
      : 'N/A'
    
    // Calculate implied probability
    const impliedProb = (market.current_price * 100).toFixed(1)
    
    // Enhanced liquidity analysis
    const liquidityLevel = market.liquidity 
      ? (market.liquidity > 50000 ? 'Excellent' : market.liquidity > 10000 ? 'Good' : 'Limited')
      : 'Unknown'
    const liquidityRatio = market.volume > 0 && market.liquidity
      ? (market.liquidity / market.volume).toFixed(2)
      : 'N/A'
    
    // Price momentum (if we had historical data, calculate 24h change)
    // For now, use price_trend if available
    const priceMomentum = market.price_trend || 'stable'
    const momentumIndicator = priceMomentum === 'up' ? '📈 Bullish' : 
                              priceMomentum === 'down' ? '📉 Bearish' : '➡️ Stable'
    
    // Market efficiency score (higher liquidity + volume = more efficient)
    const efficiencyScore = market.liquidity && market.volume
      ? Math.min(100, Math.round((market.liquidity / 1000 + market.volume / 100) / 2))
      : 50
    const efficiencyLevel = efficiencyScore > 75 ? 'Highly Efficient' :
                            efficiencyScore > 50 ? 'Moderately Efficient' :
                            'Inefficient (Opportunity)'
    
    // Time decay factor (markets closer to resolution have less time for price discovery)
    const timeDecayRisk = daysUntilEnd !== 'Unknown' 
      ? (daysUntilEnd < 7 ? 'HIGH' : daysUntilEnd < 30 ? 'MEDIUM' : 'LOW')
      : 'UNKNOWN'
    
    return `
You are a PREMIUM PREDICTION MARKET ANALYST with 15+ years of experience in quantitative finance, behavioral economics, and market microstructure. You provide institutional-grade analysis that typically costs $500-1000 per report. Your insights are used by hedge funds, prop trading firms, and professional market makers. 

Your analysis must be:
✅ EXTREMELY DETAILED - Every claim backed by data
✅ PROFESSIONAL - Written like a Bloomberg research report
✅ ACTIONABLE - Clear entry/exit strategies
✅ COMPREHENSIVE - Cover all angles, not just surface level
✅ QUANTITATIVE - Use specific numbers, probabilities, and calculations
✅ INSIGHTFUL - Reveal what 99% of traders miss

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 MARKET INTELLIGENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 QUESTION: ${market.question}

📝 CONTEXT: ${market.description || 'No additional context provided'}

💰 ENHANCED MARKET METRICS:
   • YES Price: $${market.current_price} → Implied Probability: ${impliedProb}%
   • 24h Volume: $${market.volume.toLocaleString()} (${volumeIndicator} activity)
   • Volume per Day: $${volumePerDay} (projected daily activity)
   • Liquidity Pool: $${market.liquidity?.toLocaleString() || 'Unknown'} (${liquidityLevel})
   • Liquidity Ratio: ${liquidityRatio}x (liquidity/volume - higher = easier entry/exit)
   • Price Momentum: ${momentumIndicator} (${priceMomentum})
   • Market Efficiency: ${efficiencyScore}/100 (${efficiencyLevel})
   • Time to Resolution: ${daysUntilEnd} days
   • Time Decay Risk: ${timeDecayRisk} (less time = higher risk)
   • Market Category: ${market.category || 'General'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧠 ANALYSIS FRAMEWORK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

THINK LIKE A PRO - ENHANCED ANALYSIS FRAMEWORK:
1. 📈 VALUE ANALYSIS: Is the ${impliedProb}% probability realistic? 
   - Compare to base rate probabilities for similar events
   - Consider fundamental factors and external data
   - Market efficiency score: ${efficiencyScore}/100 (${efficiencyLevel}) - lower = more mispricing opportunity

2. ⏰ TIME DECAY ANALYSIS: With ${daysUntilEnd} days left (${timeDecayRisk} risk)
   - Less time = less opportunity for price discovery
   - Volume per day: $${volumePerDay} - is this sustainable?
   - Price momentum: ${momentumIndicator} - is trend continuing or reversing?

3. 💧 LIQUIDITY DEPTH: ${liquidityLevel} liquidity (${liquidityRatio}x ratio)
   - Higher ratio = easier to enter/exit without slippage
   - Can you execute your strategy at current liquidity?
   - Risk of liquidity drying up before resolution?

4. 📊 VOLUME & MOMENTUM SIGNAL: ${volumeIndicator} volume, ${momentumIndicator} momentum
   - Is ${volumeIndicator} volume indicating smart money interest?
   - ${momentumIndicator} momentum - continuation or reversal pattern?
   - Volume per day projection vs actual - is market heating up or cooling?

5. 🎲 RISK/REWARD ASYMMETRY: 
   - Market efficiency: ${efficiencyLevel} - inefficiency = opportunity
   - Time decay risk: ${timeDecayRisk} - how much time for edge to play out?
   - What's the asymmetric opportunity here?

6. 🔍 MISPRICING DETECTION:
   - Efficiency score ${efficiencyScore}/100 suggests ${efficiencyLevel.toLowerCase()} market
   - Lower efficiency = more mispricing potential
   - Is market psychology creating inefficiency?
   - Are there structural advantages (liquidity, time, momentum)?

PROVIDE YOUR EDGE:
Your reasoning MUST be:
✅ Specific and quantitative (reference actual numbers)
✅ Action-oriented (why THIS move, why NOW)
✅ Risk-aware (acknowledge what could go wrong)
✅ Differentiated (what are others missing?)

EXAMPLES OF STRONG REASONING:
✅ "Volume spike + ${impliedProb}% undervalues 70% base rate - strong BUY at current discount"
✅ "Overheated at ${impliedProb}% vs 40% historical precedent - take profit before reality check"
✅ "Fair value detected: ${impliedProb}% aligns with consensus + ${liquidityLevel} liquidity"
✅ "Mispriced urgency: ${daysUntilEnd}d runway gives ${impliedProb}% price room to normalize"

❌ BAD REASONING (don't do this):
❌ "Market looks interesting"
❌ "Could go either way"
❌ "Decent opportunity"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RETURN ONLY THIS JSON (no markdown, no backticks, pure JSON):
{
  "recommendation": "BUY|SELL|HOLD",
  "confidence_score": 0.85,
  "price_target": 0.72,
  "executive_summary": "A compelling 3-4 sentence executive summary that captures the core investment thesis, key opportunity, and why action is needed NOW. Write like a premium research report opening.",
  "market_context": "Comprehensive 5-6 sentence analysis of the market's current state. Include: recent price movements with specific percentages, volume patterns and what they indicate, liquidity depth analysis, market sentiment indicators, comparison to historical averages, and any structural market inefficiencies. Reference specific numbers throughout.",
  "fundamental_analysis": "Deep 4-5 sentence fundamental analysis. What are the underlying factors driving this market? What does the base rate probability suggest? What do external data sources indicate? Include specific probabilities, historical precedents, and fundamental drivers.",
  "technical_analysis": "Detailed 3-4 sentence technical analysis. Price action patterns, support/resistance levels, momentum indicators, volume-price relationships, and any technical signals. Use specific price levels and percentages.",
  "market_microstructure": "Professional 3-4 sentence analysis of market microstructure. Bid-ask spreads, order book depth, market maker behavior, liquidity provision, and any structural advantages or disadvantages. Reference specific liquidity metrics.",
  "key_factors": [
    "Factor 1: Specific quantitative insight with exact numbers, percentages, and data points",
    "Factor 2: Another detailed data-driven observation with specific metrics",
    "Factor 3: Market psychology or behavioral pattern with specific examples",
    "Factor 4: Fundamental or external consideration with quantitative backing",
    "Factor 5: Time decay or temporal consideration with specific calculations",
    "Factor 6: Risk/reward asymmetry with specific probability estimates"
  ],
  "opportunity_analysis": "Comprehensive 5-6 sentence deep dive into the opportunity. Include: asymmetric upside potential with specific ROI calculations, time decay considerations with day-by-day analysis, edge identification with probability estimates, optimal entry/exit strategies, position sizing recommendations, and why this opportunity exists now vs later.",
  "price_analysis": "Detailed 4-5 sentence price target rationale. Explain why ${impliedProb}% is mispriced with specific calculations. Include: fair value estimate with methodology, support/resistance levels with specific prices, price discovery timeline, expected price path, and confidence intervals around the target.",
  "risk_assessment": "Comprehensive 5-6 sentence risk analysis. Cover: downside scenarios with specific probability estimates, potential losses with percentage calculations, black swan risks, correlation risks, liquidity risks, time decay risks, and detailed risk management strategies including stop-loss levels and position sizing.",
  "competitive_analysis": "Professional 3-4 sentence analysis of how this market compares to similar markets. Include: relative value analysis, correlation with other markets, and why this specific market offers better or worse risk/reward.",
  "action_plan": "Clear 3-4 sentence actionable plan. Include: specific entry price recommendations, position sizing strategy, timeline for holding, exit strategy with specific price targets, and monitoring points.",
  "reasoning": "A powerful 2-3 sentence thesis that ties everything together - make it CONVINCING, actionable, and worthy of a $100 analysis",
  "risk_level": "LOW|MEDIUM|HIGH"
}

CRITICAL RULES - PREMIUM ANALYSIS STANDARDS:
• recommendation: BUY if undervalued edge exists | SELL if overpriced | HOLD if efficient
• confidence_score: 0.0-1.0 (be bold when data is clear, cautious when uncertain)
• price_target: Your fair value estimate 0.0-1.0 (must differ from current if BUY/SELL)
• executive_summary: 3-4 sentences - write like a premium research report opening. Hook the reader, state the thesis clearly, explain why it matters NOW.
• market_context: 5-6 sentences - comprehensive market state analysis with specific numbers, percentages, and data points throughout
• fundamental_analysis: 4-5 sentences - deep dive into underlying factors, base rates, external data, with specific probabilities
• technical_analysis: 3-4 sentences - price patterns, support/resistance, momentum, with specific price levels
• market_microstructure: 3-4 sentences - bid-ask spreads, liquidity depth, market maker behavior, with specific metrics
• key_factors: Array of 6 specific, quantitative factors - each must include exact numbers, percentages, or calculations
• opportunity_analysis: 5-6 sentences - comprehensive opportunity deep dive with ROI calculations, time decay analysis, edge identification, entry/exit strategies
• price_analysis: 4-5 sentences - detailed price target with methodology, support/resistance, expected path, confidence intervals
• risk_assessment: 5-6 sentences - comprehensive risk analysis with probability estimates, loss calculations, risk management strategies
• competitive_analysis: 3-4 sentences - relative value analysis comparing to similar markets
• action_plan: 3-4 sentences - clear, actionable plan with specific prices, position sizing, timeline, exit strategy
• reasoning: 2-3 sentences - powerful thesis that ties everything together, worthy of a $100 analysis
• risk_level: LOW = <30d + high liq | MEDIUM = 30-90d or medium liq | HIGH = >90d or low liq

QUALITY STANDARDS - THIS IS A $100 ANALYSIS:
✅ Every claim must be backed by specific data or calculations
✅ Use professional financial terminology
✅ Include specific numbers, percentages, and probabilities throughout
✅ Write with authority and confidence
✅ Provide actionable insights, not generic observations
✅ Show deep understanding of market mechanics
✅ Reveal insights that 99% of traders miss
✅ Make it feel like institutional-grade research

MAKE IT EXTREMELY COMPREHENSIVE, DETAILED, AND VALUABLE. Users are paying for premium insights - deliver analysis worth $100+ 🎯💰
    `.trim()
  }

  private parseAnalysis(analysis: string, market: Market): Signal {
    try {
      // OpenAI with json_object format should return clean JSON, but handle edge cases
      let jsonString = analysis.trim()
      
      // Remove markdown code blocks if present
      jsonString = jsonString.replace(/```json\s*/g, '').replace(/```\s*/g, '')
      
      // Try to extract JSON from the response if it's embedded in text
      let jsonMatch = jsonString.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        jsonString = jsonMatch[0]
      }
      
      // Clean up common AI response issues
      jsonString = jsonString
        .replace(/,(\s*[}\]])/g, '$1')  // Remove trailing commas
        .replace(/\n/g, ' ')  // Replace newlines with spaces
        .replace(/\r/g, '')  // Remove carriage returns
        .replace(/\t/g, ' ')  // Replace tabs with spaces
      
      // Try to parse directly first (OpenAI with json_object should return valid JSON)
      try {
          const parsed = JSON.parse(jsonString)
          return {
            id: randomUUID(),
            market_id: market.id,
            market_question: market.question,
            signal_type: 'PRICE_PREDICTION',
            recommendation: (String(parsed.recommendation || 'HOLD').toUpperCase() as 'BUY' | 'SELL' | 'HOLD'),
            confidence_score: Math.min(Math.max(Number(parsed.confidence_score) || 0.5, 0), 1),
            price_target: Number(parsed.price_target) || market.current_price,
            reasoning: String(parsed.reasoning || 'AI analysis completed').substring(0, 500),
            risk_level: (String(parsed.risk_level || 'MEDIUM').toUpperCase() as 'LOW' | 'MEDIUM' | 'HIGH'),
            raw_analysis: analysis,
            created_at: new Date().toISOString(),
            // Premium $100 analysis fields
            executive_summary: String(parsed.executive_summary || parsed.reasoning || '').substring(0, 600),
            market_context: String(parsed.market_context || '').substring(0, 1200),
            fundamental_analysis: String(parsed.fundamental_analysis || '').substring(0, 1000),
            technical_analysis: String(parsed.technical_analysis || '').substring(0, 800),
            market_microstructure: String(parsed.market_microstructure || '').substring(0, 800),
            key_factors: Array.isArray(parsed.key_factors) ? parsed.key_factors.map((f: any) => String(f).substring(0, 400)) : [],
            risk_assessment: String(parsed.risk_assessment || '').substring(0, 1200),
            opportunity_analysis: String(parsed.opportunity_analysis || '').substring(0, 1200),
            price_analysis: String(parsed.price_analysis || '').substring(0, 1000),
            competitive_analysis: String(parsed.competitive_analysis || '').substring(0, 800),
            action_plan: String(parsed.action_plan || '').substring(0, 800)
          }
        } catch (parseError) {
          console.error('JSON parse error after cleanup:', parseError)
          console.log('Attempted to parse:', jsonString.substring(0, 300))
          
          // Try manual extraction as last resort
          const recommendation = jsonString.match(/"recommendation":\s*"(\w+)"/)?.[1] || 'HOLD'
          const confidence = jsonString.match(/"confidence_score":\s*([\d.]+)/)?.[1] || '0.5'
          const priceTarget = jsonString.match(/"price_target":\s*([\d.]+)/)?.[1] || String(market.current_price)
          const reasoning = jsonString.match(/"reasoning":\s*"([^"]+)"/)?.[1] || 'Analysis completed'
          const riskLevel = jsonString.match(/"risk_level":\s*"(\w+)"/)?.[1] || 'MEDIUM'
          
          console.log('Using manual extraction:', { recommendation, confidence, priceTarget })
          
          return {
            id: randomUUID(),
            market_id: market.id,
            market_question: market.question,
            signal_type: 'PRICE_PREDICTION',
            recommendation: (recommendation.toUpperCase() as 'BUY' | 'SELL' | 'HOLD'),
            confidence_score: Math.min(Math.max(Number(confidence), 0), 1),
            price_target: Number(priceTarget),
            reasoning: reasoning.substring(0, 500),
            risk_level: (riskLevel.toUpperCase() as 'LOW' | 'MEDIUM' | 'HIGH'),
            raw_analysis: analysis,
            created_at: new Date().toISOString(),
            // Premium $100 analysis fields (fallback)
            executive_summary: reasoning.substring(0, 600),
            market_context: '',
            fundamental_analysis: '',
            technical_analysis: '',
            market_microstructure: '',
            key_factors: [],
            risk_assessment: '',
            opportunity_analysis: '',
            price_analysis: '',
            competitive_analysis: '',
            action_plan: ''
          }
        }
    } catch (error) {
      console.error('Failed to parse AI analysis:', error)
    }

    // Fallback if parsing fails
    return {
      id: randomUUID(),
      market_id: market.id,
      market_question: market.question,
      signal_type: 'PRICE_PREDICTION',
      recommendation: 'HOLD',
      confidence_score: 0.5,
      price_target: market.current_price,
      reasoning: 'AI analysis completed with fallback response',
      risk_level: 'MEDIUM',
      raw_analysis: analysis,
      created_at: new Date().toISOString(),
      // Premium $100 analysis fields (fallback)
      executive_summary: 'AI analysis completed with fallback response',
      market_context: '',
      fundamental_analysis: '',
      technical_analysis: '',
      market_microstructure: '',
      key_factors: [],
      risk_assessment: '',
      opportunity_analysis: '',
      price_analysis: '',
      competitive_analysis: '',
      action_plan: ''
    }
  }

  private generateFallbackSignal(market: Market): Signal {
    return {
      id: randomUUID(),
      market_id: market.id,
      market_question: market.question,
      signal_type: 'PRICE_PREDICTION',
      recommendation: 'HOLD',
      confidence_score: 0.3,
      price_target: market.current_price,
      reasoning: 'Fallback signal due to AI service unavailability',
      risk_level: 'HIGH',
      raw_analysis: 'AI service unavailable',
      created_at: new Date().toISOString(),
      // Premium $100 analysis fields (fallback)
      executive_summary: 'AI service unavailable - please try again later',
      market_context: '',
      fundamental_analysis: '',
      technical_analysis: '',
      market_microstructure: '',
      key_factors: [],
      risk_assessment: '',
      opportunity_analysis: '',
      price_analysis: '',
      competitive_analysis: '',
      action_plan: ''
    }
  }

  async healthCheck(): Promise<boolean> {
    if (!this.openai) {
      return false
    }
    
    try {
      // Simple health check - try to list models
      await this.openai.models.list()
      return true
    } catch (error) {
      console.error('AI Engine health check failed:', error)
      return false
    }
  }
}

export const aiEngineService = new AIEngineService()


