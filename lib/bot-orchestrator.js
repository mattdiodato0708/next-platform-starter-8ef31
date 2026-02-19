/**
 * Bot Orchestrator
 * 
 * Coordinates all monitoring services and autonomous trading decisions.
 * 
 * CRITICAL DISCLAIMER:
 * - This is a demonstration/educational tool ONLY
 * - NEVER use this with real money without extensive testing and legal review
 * - Automated trading involves SUBSTANTIAL RISK OF LOSS
 * - Comply with ALL applicable laws and regulations in your jurisdiction
 * - This code does NOT constitute financial, investment, or legal advice
 * - The authors assume NO responsibility for any losses incurred
 */

import { getCryptoMonitor } from './crypto-monitor.js';
import { getSportsArbitrageMonitor } from './sports-arbitrage.js';
import { getPredictionMarketArbitrage } from './prediction-market-arbitrage.js';

export class BotOrchestrator {
  constructor() {
    this.cryptoMonitor = getCryptoMonitor();
    this.sportsMonitor = getSportsArbitrageMonitor();
    this.predictionMarketMonitor = getPredictionMarketArbitrage();
    
    this.isRunning = false;
    this.mode = 'manual'; // 'manual' or 'autonomous'
    this.executionLog = [];
    this.checkInterval = null;
  }

  /**
   * Start all monitoring services
   */
  async start(mode = 'manual') {
    if (this.isRunning) {
      console.log('Bot is already running');
      return;
    }

    this.mode = mode;
    this.isRunning = true;

    console.log(`Starting bot orchestrator in ${mode} mode...`);

    // Start all monitors
    await Promise.all([
      this.cryptoMonitor.start(),
      this.sportsMonitor.start(),
      this.predictionMarketMonitor.start(),
    ]);

    // If in autonomous mode, periodically evaluate and execute
    if (mode === 'autonomous') {
      this.checkInterval = setInterval(() => {
        this.evaluateAndExecute();
      }, 10 * 1000); // Check every 10 seconds
    }

    console.log('Bot orchestrator started successfully');
  }

  /**
   * Stop all monitoring services
   */
  stop() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }

    this.cryptoMonitor.stop();
    this.sportsMonitor.stop();
    this.predictionMarketMonitor.stop();

    this.isRunning = false;
    console.log('Bot orchestrator stopped');
  }

  /**
   * Get bot status
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      mode: this.mode,
      monitors: {
        crypto: this.cryptoMonitor.isRunning,
        sports: this.sportsMonitor.isRunning,
        predictionMarket: this.predictionMarketMonitor.isRunning,
      },
      opportunityCounts: {
        crypto: this.cryptoMonitor.getOpportunities().length,
        sports: this.sportsMonitor.getOpportunities().length,
        predictionMarket: this.predictionMarketMonitor.getOpportunities().length,
      },
      executionLog: this.executionLog.slice(-10), // Last 10 executions
    };
  }

  /**
   * Get all opportunities across all monitors
   */
  getAllOpportunities() {
    return {
      crypto: this.cryptoMonitor.getOpportunities(),
      sports: this.sportsMonitor.getOpportunities(),
      predictionMarket: this.predictionMarketMonitor.getOpportunities(),
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Evaluate all opportunities and execute trades if in autonomous mode
   */
  async evaluateAndExecute() {
    if (!this.isRunning || this.mode !== 'autonomous') {
      return;
    }

    console.log('Evaluating opportunities for autonomous execution...');

    try {
      // Evaluate crypto opportunities
      const cryptoOpps = this.cryptoMonitor.getHighConfidenceOpportunities();
      for (const opp of cryptoOpps) {
        const evaluation = this.cryptoMonitor.evaluateOpportunity(opp);
        if (evaluation.shouldBuy && opp.status === 'pending') {
          await this.executeCryptoTrade(opp, evaluation);
        }
      }

      // Evaluate sports arbitrage opportunities
      const sportsOpps = this.sportsMonitor.getProfitableOpportunities(1.0);
      for (const opp of sportsOpps) {
        const evaluation = this.sportsMonitor.evaluateOpportunity(opp);
        if (evaluation.shouldBuy && opp.status === 'pending') {
          await this.executeSportsArbitrage(opp, evaluation);
        }
      }

      // Evaluate prediction market opportunities
      const predictionOpps = this.predictionMarketMonitor.getProfitableOpportunities(0.5);
      for (const opp of predictionOpps) {
        const evaluation = this.predictionMarketMonitor.evaluateOpportunity(opp);
        if (evaluation.shouldTrade && opp.status === 'pending') {
          await this.executePredictionMarketArbitrage(opp, evaluation);
        }
      }
    } catch (error) {
      console.error('Error during autonomous evaluation:', error);
      this.logExecution({
        type: 'error',
        message: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Execute a crypto trade (SIMULATION ONLY)
   */
  async executeCryptoTrade(opportunity, evaluation) {
    console.log(`SIMULATION: Would execute crypto trade for ${opportunity.symbol}`);
    
    const execution = {
      type: 'crypto',
      action: 'buy',
      symbol: opportunity.symbol,
      reason: evaluation.reason,
      confidence: evaluation.confidence,
      source: opportunity.source,
      timestamp: new Date().toISOString(),
      status: 'simulated', // In production: 'executed', 'failed', etc.
    };

    this.logExecution(execution);
    opportunity.status = 'executed';

    // In production, this would:
    // 1. Connect to exchange API
    // 2. Check account balance
    // 3. Calculate position size based on risk management
    // 4. Execute market or limit order
    // 5. Monitor order status
    // 6. Update portfolio tracking
  }

  /**
   * Execute a sports arbitrage trade (SIMULATION ONLY)
   */
  async executeSportsArbitrage(opportunity, evaluation) {
    console.log(`SIMULATION: Would execute sports arbitrage for ${opportunity.event}`);
    
    const execution = {
      type: 'sports_arbitrage',
      event: opportunity.event,
      bookmaker1: opportunity.bestBookmaker1,
      bookmaker2: opportunity.bestBookmaker2,
      stake1: opportunity.stake1,
      stake2: opportunity.stake2,
      expectedProfit: opportunity.profit,
      reason: evaluation.reason,
      timestamp: new Date().toISOString(),
      status: 'simulated',
    };

    this.logExecution(execution);
    opportunity.status = 'executed';

    // In production, this would:
    // 1. Connect to bookmaker APIs
    // 2. Verify odds haven't changed
    // 3. Check account balances
    // 4. Calculate optimal stake distribution
    // 5. Place bets on both sides simultaneously
    // 6. Monitor bet acceptance
    // 7. Track positions until settlement
  }

  /**
   * Execute a prediction market arbitrage (SIMULATION ONLY)
   */
  async executePredictionMarketArbitrage(opportunity, evaluation) {
    console.log(`SIMULATION: Would execute prediction market arbitrage for ${opportunity.question}`);
    
    const execution = {
      type: 'prediction_market_arbitrage',
      question: opportunity.question,
      buyPlatform: opportunity.buyPlatform,
      sellPlatform: opportunity.sellPlatform,
      buyOutcome: opportunity.buyOutcome,
      sellOutcome: opportunity.sellOutcome,
      expectedProfit: opportunity.profit,
      reason: evaluation.reason,
      timestamp: new Date().toISOString(),
      status: 'simulated',
    };

    this.logExecution(execution);
    opportunity.status = 'executed';

    // In production, this would:
    // 1. Connect to both platforms (API + blockchain)
    // 2. Verify prices and liquidity
    // 3. Check account balances on both platforms
    // 4. Calculate optimal position sizes
    // 5. Execute trades simultaneously or with minimal time gap
    // 6. Monitor transaction confirmations
    // 7. Track positions until market resolution
  }

  /**
   * Log execution for audit trail
   */
  logExecution(execution) {
    this.executionLog.push(execution);
    
    // Keep only last 100 executions in memory
    if (this.executionLog.length > 100) {
      this.executionLog = this.executionLog.slice(-100);
    }

    // In production, persist to database
    console.log('Execution logged:', execution);
  }

  /**
   * Get execution history
   */
  getExecutionLog(limit = 50) {
    return this.executionLog.slice(-limit);
  }

  /**
   * Manual execution of a specific opportunity
   */
  async executeManually(type, opportunityId) {
    if (this.mode !== 'manual') {
      throw new Error('Manual execution only allowed in manual mode');
    }

    let opportunity, evaluation;

    switch (type) {
      case 'crypto':
        opportunity = this.cryptoMonitor.getOpportunities().find(
          opp => opp.symbol === opportunityId
        );
        if (!opportunity) throw new Error('Crypto opportunity not found');
        evaluation = this.cryptoMonitor.evaluateOpportunity(opportunity);
        await this.executeCryptoTrade(opportunity, evaluation);
        break;

      case 'sports':
        opportunity = this.sportsMonitor.getOpportunities().find(
          opp => opp.eventId === opportunityId
        );
        if (!opportunity) throw new Error('Sports opportunity not found');
        evaluation = this.sportsMonitor.evaluateOpportunity(opportunity);
        await this.executeSportsArbitrage(opportunity, evaluation);
        break;

      case 'prediction':
        opportunity = this.predictionMarketMonitor.getOpportunities().find(
          opp => opp.marketId === opportunityId
        );
        if (!opportunity) throw new Error('Prediction market opportunity not found');
        evaluation = this.predictionMarketMonitor.evaluateOpportunity(opportunity);
        await this.executePredictionMarketArbitrage(opportunity, evaluation);
        break;

      default:
        throw new Error('Invalid opportunity type');
    }

    return {
      success: true,
      message: 'Opportunity executed (simulated)',
    };
  }
}

// Singleton instance
let botInstance = null;

export function getBotOrchestrator() {
  if (!botInstance) {
    botInstance = new BotOrchestrator();
  }
  return botInstance;
}
