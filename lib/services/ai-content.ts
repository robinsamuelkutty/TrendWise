// AI Content Generation Service
export interface ArticleData {
  title: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  tags: string[];
  metaDescription: string;
}

import { GoogleGenerativeAI } from '@google/generative-ai';

export async function generateArticleContent(topic: string): Promise<ArticleData> {
  // Check if Gemini API key is available
  const hasGemini = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '';

  if (hasGemini) {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      console.log('Using Gemini to generate content for:', topic);

      const prompt = `You are an expert content writer. Create a comprehensive, well-structured article with proper HTML formatting about "${topic}". 

      The article should be at least 1000 words and include:
      - An engaging, SEO-friendly title that directly addresses the search intent for "${topic}"
      - A compelling excerpt (2-3 sentences) that clearly explains what readers will learn
      - Well-structured HTML content with proper headings (h1, h2, h3), paragraphs, and lists
      - Focus on current trends, practical insights, and actionable advice
      - Include specific examples, case studies, or data points when relevant
      - Address common questions people might have about "${topic}"
      - Conclude with actionable takeaways or next steps
      - Meta description for SEO that includes the main keyword

      Write in a conversational yet authoritative tone. Make the content valuable for someone searching specifically for "${topic}".
      
      Format your response as a structured article with clear sections.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const generatedContent = response.text();

      // Parse the response and extract article data
      const lines = generatedContent.split('\n').filter(line => line.trim());

      // Extract title (first non-empty line), clean up any HTML markup
      let title = lines[0] || topic;

      // Clean up HTML markup, markdown code blocks, and other unwanted formatting
      title = title
        .replace(/```html|```|<!DOCTYPE html>/gi, '') // Remove HTML/markdown artifacts
        .replace(/<[^>]*>/g, '') // Remove any HTML tags
        .replace(/^[#\-\*\s]+/, '') // Remove markdown headers and bullets
        .trim();

      // Fallback to topic if title is empty after cleaning
      if (!title) {
        title = topic;
      }

      // Extract content (remaining lines joined), also clean up
      let content = lines.slice(1).join('\n\n');

      // Clean up any HTML artifacts at the beginning of content
      content = content
        .replace(/^```html|^```|^<!DOCTYPE html>/gi, '')
        .trim();

      return {
        title,
        excerpt: `Comprehensive insights into ${topic}. Discover the latest trends, practical applications, and expert analysis in this detailed guide.`,
        content,
        featuredImage: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200',
        tags: extractTags(topic),
        metaDescription: `Learn about ${topic} with expert insights and analysis. Discover trends, applications, and future outlook.`,
      };
    } catch (error) {
      console.error('Gemini API error:', error);
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

export function generateRandomTopic(): string {
  const techTopics = [
    "AI-Powered Healthcare Revolution",
    "Quantum Computing Breakthroughs",
    "Sustainable Smart Cities",
    "Blockchain in Supply Chain",
    "Virtual Reality in Education",
    "Edge Computing Applications",
    "5G Technology Impact",
    "Cybersecurity in IoT",
    "Machine Learning in Finance",
    "Autonomous Vehicle Technology",
    "Green Energy Storage Solutions",
    "Digital Twins in Manufacturing",
    "Voice AI and Natural Language Processing",
    "Augmented Reality in Retail",
    "Robotics in Agriculture",
    "Cloud-Native Development",
    "Biometric Security Systems",
    "Metaverse Business Applications",
    "Neural Network Innovations",
    "Smart Home Automation"
  ];

  const businessTopics = [
    "Remote Work Culture Evolution",
    "E-commerce Personalization",
    "Digital Marketing Automation",
    "Startup Funding Trends",
    "Sustainable Business Models",
    "Customer Experience Innovation",
    "Data-Driven Decision Making",
    "Agile Project Management",
    "Digital Transformation Strategies",
    "Workplace Wellness Programs"
  ];

  const futureTopics = [
    "Space Technology Commercialization",
    "Biotechnology Advances",
    "Climate Change Solutions",
    "Next-Generation Batteries",
    "Precision Medicine",
    "Brain-Computer Interfaces",
    "3D Printing Revolution",
    "Renewable Energy Grid",
    "Smart Materials Development",
    "Genetic Engineering Ethics"
  ];

  const allTopics = [...techTopics, ...businessTopics, ...futureTopics];
  return allTopics[Math.floor(Math.random() * allTopics.length)];
}