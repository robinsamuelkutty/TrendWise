import * as cron from 'node-cron';
import { AIWorkflow, WorkflowConfig } from '../workflow/ai-workflow';

export class WorkflowScheduler {
  private workflow: AIWorkflow;
  private isRunning = false;

  constructor() {
    this.workflow = new AIWorkflow();
  }

  startScheduler(): void {
    console.log('🕐 Starting AI Workflow Scheduler...');

    // Run every 6 hours
    cron.schedule('0 */6 * * *', async () => {
      if (this.isRunning) {
        console.log('⏳ Workflow already running, skipping this execution');
        return;
      }

      console.log('🚀 Scheduled workflow execution started');
      await this.runScheduledWorkflow();
    });

    // Run daily stats report at 9 AM
    cron.schedule('0 9 * * *', async () => {
      console.log('📊 Generating daily stats report');
      await this.generateStatsReport();
    });

    console.log('✅ Scheduler started successfully');
    console.log('📅 Workflow will run every 6 hours');
    console.log('📊 Stats report will be generated daily at 9 AM');
  }

  private async runScheduledWorkflow(): Promise<void> {
    this.isRunning = true;

    try {
      const config: WorkflowConfig = {
        maxTopicsPerRun: 3, // Conservative for scheduled runs
        targetWordCount: 1200,
        includeImages: true,
        includeTweets: true,
        includeVideos: false, // Skip videos for faster processing
        autoPublish: true,
        regions: ['US'],
      };

      const result = await this.workflow.execute(config);
      
      console.log(`✅ Scheduled workflow completed: ${result.articlesGenerated} articles generated`);
      
      if (result.errors.length > 0) {
        console.error('❌ Workflow errors:', result.errors);
      }

    } catch (error) {
      console.error('💥 Scheduled workflow failed:', error);
    } finally {
      this.isRunning = false;
    }
  }

  private async generateStatsReport(): Promise<void> {
    try {
      const stats = await this.workflow.getWorkflowStats();
      
      console.log('\n📊 Daily Stats Report:');
      console.log(`📚 Total Articles: ${stats.totalArticles}`);
      console.log(`📈 Articles This Week: ${stats.articlesThisWeek}`);
      console.log(`🏷️  Popular Tags: ${stats.popularTags.slice(0, 5).join(', ')}`);
      
      // You could send this to a monitoring service, email, or Slack
      
    } catch (error) {
      console.error('Error generating stats report:', error);
    }
  }

  stopScheduler(): void {
    cron.getTasks().forEach(task => task.stop());
    console.log('🛑 Scheduler stopped');
  }
}

// Export a singleton instance
export const workflowScheduler = new WorkflowScheduler();