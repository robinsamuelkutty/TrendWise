#!/usr/bin/env node

const { config } = require('dotenv');
const { AIWorkflow } = require('../lib/workflow/ai-workflow');

// Load environment variables
config();

async function runWorkflow() {
  const workflow = new AIWorkflow();
  
  // Configuration for the workflow
  const workflowConfig = {
    maxTopicsPerRun: 5, // Process 5 trending topics per run
    targetWordCount: 1500, // Target article length
    includeImages: true,
    includeTweets: true,
    includeVideos: true,
    autoPublish: true,
    regions: ['US', 'GB'], // Google Trends regions
  };

  console.log('🚀 Starting AI Content Generation Workflow...');
  console.log('Configuration:', JSON.stringify(workflowConfig, null, 2));

  try {
    const result = await workflow.execute(workflowConfig);
    
    console.log('\n📊 Workflow Results:');
    console.log(`✅ Success: ${result.success}`);
    console.log(`📝 Articles Generated: ${result.articlesGenerated}`);
    console.log(`❌ Errors: ${result.errors.length}`);
    
    if (result.generatedArticles.length > 0) {
      console.log('\n📚 Generated Articles:');
      result.generatedArticles.forEach((article, index) => {
        console.log(`${index + 1}. ${article.title}`);
        console.log(`   Topic: ${article.topic}`);
        console.log(`   Slug: ${article.slug}`);
        console.log(`   ID: ${article.id}\n`);
      });
    }

    if (result.errors.length > 0) {
      console.log('\n❌ Errors:');
      result.errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }

    // Get workflow stats
    console.log('\n📈 Getting workflow statistics...');
    const stats = await workflow.getWorkflowStats();
    
    console.log('\n📊 Workflow Statistics:');
    console.log(`Total Articles: ${stats.totalArticles}`);
    console.log(`Articles This Week: ${stats.articlesThisWeek}`);
    console.log(`Popular Tags: ${stats.popularTags.join(', ')}`);
    
    if (stats.recentArticles.length > 0) {
      console.log('\n📚 Recent Articles:');
      stats.recentArticles.slice(0, 5).forEach((article, index) => {
        console.log(`${index + 1}. ${article.title} (${article.views} views)`);
      });
    }

  } catch (error) {
    console.error('💥 Workflow failed:', error);
    process.exit(1);
  }
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
AI Content Generation Workflow

Usage: npm run workflow [options]

Options:
  --help, -h     Show this help message
  --stats        Show workflow statistics only
  --dry-run      Run without saving to database

Environment Variables Required:
  OPENAI_API_KEY          - OpenAI API key for content generation
  MONGODB_URI             - MongoDB connection string
  TWITTER_API_KEY         - Twitter API key
  TWITTER_API_SECRET      - Twitter API secret
  TWITTER_ACCESS_TOKEN    - Twitter access token
  TWITTER_ACCESS_SECRET   - Twitter access secret
  UNSPLASH_ACCESS_KEY     - Unsplash API key for images

Example:
  npm run workflow
  `);
  process.exit(0);
}

if (args.includes('--stats')) {
  // Show stats only
  const workflow = new AIWorkflow();
  workflow.getWorkflowStats().then(stats => {
    console.log('📊 Workflow Statistics:');
    console.log(JSON.stringify(stats, null, 2));
  }).catch(console.error);
} else {
  // Run the full workflow
  runWorkflow();
}