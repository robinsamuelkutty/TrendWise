import { DataCollectionService, TrendingTopic } from '../services/data-collection';
import { AIContentGenerator } from '../services/ai-content-generator';
import { MongoDBService } from '../database/mongodb';


export interface WorkflowConfig {
  maxTopicsPerRun: number;
  targetWordCount: number;
  includeImages: boolean;
  includeTweets: boolean;
  includeVideos: boolean;
  autoPublish: boolean;
  regions: string[];
}

export interface WorkflowResult {
  success: boolean;
  articlesGenerated: number;
  errors: string[];
  generatedArticles: Array<{
    id: string;
    title: string;
    slug: string;
    topic: string;
  }>;
}

export class AIWorkflow {
  private dataCollector: DataCollectionService;
  private contentGenerator: AIContentGenerator;
  private database: MongoDBService;



  constructor() {
    this.dataCollector = new DataCollectionService();
    this.contentGenerator = new AIContentGenerator();
    this.database = new MongoDBService();
  }

  async execute(config: WorkflowConfig): Promise<WorkflowResult> {
    const result: WorkflowResult = {
      success: false,
      articlesGenerated: 0,
      errors: [],
      generatedArticles: [],
    };

    try {
      console.log('🚀 Starting AI Content Generation Workflow...');
      
      // Step 1: Connect to database
      await this.database.connect();
      console.log('✅ Database connected');

      // Step 2: Collect trending topics
      console.log('📊 Collecting trending topics...');
      const trendingTopics = await this.dataCollector.getAllTrendingTopics();
      console.log(`Found ${trendingTopics.length} trending topics`);

      if (trendingTopics.length === 0) {
        result.errors.push('No trending topics found');
        return result;
      }

      // Step 3: Process top topics
      const topicsToProcess = trendingTopics.slice(0, config.maxTopicsPerRun);
      console.log(`Processing ${topicsToProcess.length} topics...`);

      for (const topic of topicsToProcess) {
        try {
          await this.processTopicToArticle(topic, config, result);
        } catch (error) {
          const errorMessage = `Failed to process topic "${topic.keyword}": ${error}`;
          console.error(errorMessage);
          result.errors.push(errorMessage);
        }
      }

      result.success = result.articlesGenerated > 0;
      console.log(`✅ Workflow completed. Generated ${result.articlesGenerated} articles`);

    } catch (error) {
      const errorMessage = `Workflow failed: ${error}`;
      console.error(errorMessage);
      result.errors.push(errorMessage);
    } finally {
      await this.database.disconnect();
    }

    return result;
  }

  private async processTopicToArticle(
    topic: TrendingTopic, 
    config: WorkflowConfig, 
    result: WorkflowResult
  ): Promise<void> {
    console.log(`\n📝 Processing topic: ${topic.keyword}`);

    // Check if article already exists
    const existingArticle = await this.database.getArticleBySlug(
      topic.keyword.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    );

    if (existingArticle) {
      console.log(`⏭️  Article already exists for topic: ${topic.keyword}`);
      return;
    }

    // Step 1: Collect media for the topic
    console.log('🔍 Collecting media...');
    const media = await this.dataCollector.collectMediaForTopic(topic.keyword);
    
    // Filter media based on config
    if (!config.includeImages) media.images = [];
    if (!config.includeTweets) media.tweets = [];
    if (!config.includeVideos) media.videos = [];

    console.log(`Found: ${media.images.length} images, ${media.tweets.length} tweets, ${media.videos.length} videos, ${media.articles.length} articles`);

    // Step 2: Generate article content
    console.log('🤖 Generating article content...');
    const generatedArticle = await this.contentGenerator.generateArticle(
      topic.keyword,
      media,
      config.targetWordCount
    );

    console.log(`Generated article: "${generatedArticle.title}" (${generatedArticle.readTime} min read)`);

    // Step 3: Save to database
    console.log('💾 Saving to database...');
    const articleId = await this.database.saveArticle(
      generatedArticle,
      topic.keyword,
      [topic.source]
    );

    result.articlesGenerated++;
    result.generatedArticles.push({
      id: articleId,
      title: generatedArticle.title,
      slug: generatedArticle.slug,
      topic: topic.keyword,
    });

    console.log(`✅ Article saved successfully with ID: ${articleId}`);
  }

  async getWorkflowStats(): Promise<{
    totalArticles: number;
    articlesThisWeek: number;
    popularTags: string[];
    recentArticles: Array<{
      title: string;
      slug: string;
      publishedAt: Date;
      views: number;
    }>;
  }> {
    await this.database.connect();

    try {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const [totalArticles, recentArticles] = await Promise.all([
        this.database.getArticles(1, 1000, { status: 'published' }),
        this.database.getRecentArticles(10),
      ]);

      const articlesThisWeek = totalArticles.articles.filter(
        article => new Date(article.publishedAt!) > oneWeekAgo
      ).length;

      // Get popular tags
      const allTags = totalArticles.articles.flatMap(article => article.tags);
      const tagCounts: { [key: string]: number } = {};
      allTags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });

      const popularTags = Object.entries(tagCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([tag]) => tag);

      return {
        totalArticles: totalArticles.total,
        articlesThisWeek,
        popularTags,
        recentArticles: recentArticles.map(article => ({
          title: article.title,
          slug: article.slug,
          publishedAt: article.publishedAt!,
          views: article.views,
        })),
      };
    } finally {
      await this.database.disconnect();
    }
  }
}