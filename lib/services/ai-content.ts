// AI Content Generation Service
export interface ArticleData {
  title: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  tags: string[];
  metaDescription: string;
}

import OpenAI from 'openai';

export async function generateArticleContent(topic: string): Promise<ArticleData> {
  // Check if OpenAI API key is available
  const hasOpenAI = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim() !== '';
  
  if (hasOpenAI) {
    try {
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      console.log('Using OpenAI to generate content for:', topic);

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert content writer. Create comprehensive, well-structured articles with proper HTML formatting. Include headings, paragraphs, lists, and engaging content."
          },
          {
            role: "user",
            content: `Write a comprehensive article about "${topic}". The article should be at least 1000 words, include an engaging title, a compelling excerpt, and well-structured HTML content with proper headings, paragraphs, and lists. Focus on current trends, practical insights, and future predictions.`
          }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      });

      const generatedContent = completion.choices[0]?.message?.content || '';
      
      // Extract title and content from the generated response
      const lines = generatedContent.split('\n').filter(line => line.trim());
      const title = lines[0]?.replace(/^#\s*/, '') || `Understanding ${topic}: A Comprehensive Guide`;
      
      const content = `<h1>${title}</h1>\n` + generatedContent.replace(/^.*\n/, '');
      
      return {
        title,
        excerpt: `Comprehensive insights into ${topic}. Discover the latest trends, practical applications, and expert analysis in this detailed guide.`,
        content,
        featuredImage: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200',
        tags: extractTags(topic),
        metaDescription: `Learn about ${topic} with expert insights and analysis. Discover trends, applications, and future outlook.`,
      };
    } catch (error) {
      console.error('OpenAI API error:', error);
      // Fall through to default content generation
    }
  }
  
  // Enhanced mock content with more realistic structure
  const mockContent = {
    title: `Understanding ${topic}: A Comprehensive Guide for 2025`,
    excerpt: `Explore the latest developments and trends in ${topic}, including expert insights, practical applications, and future predictions.`,
    content: `
      <h1>Understanding ${topic}: A Comprehensive Guide for 2025</h1>
      
      <p>In today's rapidly evolving technological landscape, ${topic} has emerged as one of the most significant trends shaping our future. This comprehensive guide explores the key aspects, implications, and opportunities surrounding this important topic.</p>
      
      <h2>What is ${topic}?</h2>
      <p>${topic} represents a fundamental shift in how we approach modern challenges. By leveraging cutting-edge technologies and innovative methodologies, it offers new solutions to age-old problems.</p>
      
      <h2>Key Benefits and Applications</h2>
      <p>The applications of ${topic} are vast and varied, spanning multiple industries and use cases. From improving efficiency to enabling entirely new capabilities, the impact is far-reaching.</p>
      
      <ul>
        <li>Enhanced productivity and automation</li>
        <li>Improved decision-making capabilities</li>
        <li>Cost reduction and resource optimization</li>
        <li>Better user experiences and satisfaction</li>
      </ul>
      
      <h2>Current Trends and Developments</h2>
      <p>The field of ${topic} is experiencing rapid growth, with new developments emerging regularly. Industry leaders and researchers are continuously pushing the boundaries of what's possible.</p>
      
      <h2>Challenges and Considerations</h2>
      <p>While ${topic} offers tremendous potential, it also presents certain challenges that organizations must address. These include technical complexity, implementation costs, and the need for specialized expertise.</p>
      
      <h2>Future Outlook</h2>
      <p>Looking ahead, ${topic} is expected to continue evolving and maturing. As technology advances and adoption increases, we can expect to see even more innovative applications and use cases emerge.</p>
      
      <h2>Conclusion</h2>
      <p>Understanding ${topic} is crucial for anyone looking to stay ahead in today's competitive landscape. By staying informed about the latest developments and trends, individuals and organizations can position themselves for success in the digital age.</p>
    `,
    featuredImage: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200',
    tags: extractTags(topic),
    metaDescription: `Comprehensive guide to ${topic} in 2025. Discover key trends, applications, and future outlook in this expert analysis.`,
  };
  
  return mockContent;
}

function extractTags(topic: string): string[] {
  // Simple tag extraction logic - in real implementation, this would be more sophisticated
  const commonTags = ['Technology', 'Innovation', 'Future', 'Trends', '2025'];
  const topicWords = topic.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );
  
  return [...topicWords, ...commonTags].slice(0, 5);
}