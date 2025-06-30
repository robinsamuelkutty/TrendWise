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

// Function to fetch topic-specific image from Unsplash
async function fetchTopicImage(topic: string): Promise<string> {
  const unsplashAccessKey = process.env.UNSPLASH_ACCESS_KEY;
  
  if (!unsplashAccessKey) {
    console.log('Unsplash API key not found, using default image');
    return 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200';
  }

  try {
    const searchQuery = encodeURIComponent(topic);
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${searchQuery}&per_page=1&orientation=landscape`,
      {
        headers: {
          'Authorization': `Client-ID ${unsplashAccessKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      return data.results[0].urls.regular;
    }
    
    // Fallback to default image if no results
    return 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200';
  } catch (error) {
    console.error('Error fetching image from Unsplash:', error);
    return 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200';
  }
}

export async function generateArticleContent(topic: string): Promise<ArticleData> {
  // Check if Gemini API key is available
  const hasGemini = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '';

  // Fetch topic-specific image
  const featuredImage = await fetchTopicImage(topic);

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
        featuredImage,
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
    featuredImage,
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

const categoryTopics = {
  technology: [
    "AI-Powered Development Tools",
    "Quantum Computing Breakthroughs",
    "Edge Computing Revolution",
    "5G Technology Implementation",
    "Cybersecurity Mesh Architecture",
    "Cloud-Native Applications",
    "Serverless Computing Trends",
    "IoT Device Management",
    "Blockchain Integration",
    "DevOps Automation"
  ],
  business: [
    "Remote Work Strategies",
    "Digital Transformation",
    "E-commerce Growth",
    "Customer Experience",
    "Supply Chain Optimization",
    "Data-Driven Decisions",
    "Agile Methodologies",
    "Market Analysis",
    "Revenue Optimization",
    "Brand Building"
  ],
  ai: [
    "Machine Learning Models",
    "Natural Language Processing",
    "Computer Vision Applications",
    "Neural Network Architecture",
    "AI Ethics and Governance",
    "Generative AI Tools",
    "AI in Healthcare",
    "Autonomous Systems",
    "AI-Powered Analytics",
    "Deep Learning Frameworks"
  ],
  startup: [
    "Venture Capital Trends",
    "MVP Development",
    "Startup Scaling",
    "Product-Market Fit",
    "Fundraising Strategies",
    "Team Building",
    "Growth Hacking",
    "Innovation Management",
    "Entrepreneurship",
    "Startup Ecosystems"
  ],
  sustainability: [
    "Green Technology",
    "Renewable Energy",
    "Carbon Footprint Reduction",
    "Sustainable Manufacturing",
    "Circular Economy",
    "Environmental Monitoring",
    "Clean Transportation",
    "Waste Management",
    "Eco-Friendly Materials",
    "Climate Solutions"
  ],
  health: [
    "Digital Health",
    "Telemedicine",
    "Wearable Technology",
    "Mental Health Apps",
    "Precision Medicine",
    "Health Data Analytics",
    "Medical Devices",
    "Wellness Programs",
    "Healthcare AI",
    "Personalized Treatment"
  ],
  education: [
    "Online Learning",
    "EdTech Platforms",
    "Virtual Classrooms",
    "Learning Analytics",
    "Educational Apps",
    "Skill Development",
    "MOOCs Evolution",
    "AI in Education",
    "Interactive Learning",
    "Knowledge Management"
  ],
  gaming: [
    "Game Development",
    "Esports Industry",
    "VR Gaming",
    "Mobile Gaming",
    "Game Monetization",
    "Player Analytics",
    "Gaming Communities",
    "Interactive Entertainment",
    "Game Design Trends",
    "Gaming Technology"
  ]
};

export function generateRandomTopic(): string {
  const allTopics = Object.values(categoryTopics).flat();
  return allTopics[Math.floor(Math.random() * allTopics.length)];
}

export function generateCategoryTopic(category: string): string {
  const topics = categoryTopics[category as keyof typeof categoryTopics];
  if (!topics) {
    return generateRandomTopic();
  }
  return topics[Math.floor(Math.random() * topics.length)];
}

export async function generateCategoryArticle(category: string): Promise<ArticleData> {
  const topic = generateCategoryTopic(category);
  const categoryName = getCategoryDisplayName(category);
  
  // Check if Gemini API key is available
  const hasGemini = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '';

  // Fetch category and topic-specific image
  const featuredImage = await fetchTopicImage(`${categoryName} ${topic}`);

  if (hasGemini) {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      console.log(`Using Gemini to generate ${categoryName} content for:`, topic);

      const prompt = `You are an expert writer specializing in ${categoryName}. Create a comprehensive, well-structured article about "${topic}" specifically for the ${categoryName} category.

      The article should be at least 1200 words and include:
      - An engaging, SEO-friendly title that clearly relates to ${categoryName} and "${topic}"
      - A compelling excerpt (2-3 sentences) explaining the ${categoryName} relevance
      - Well-structured HTML content with proper headings (h1, h2, h3), paragraphs, and lists
      - Focus on current ${categoryName} trends and practical applications of "${topic}"
      - Include specific examples, case studies, or data points relevant to ${categoryName}
      - Address common questions about "${topic}" in the ${categoryName} context
      - Provide actionable insights for ${categoryName} professionals
      - Conclude with future outlook and recommendations

      Write in a professional yet accessible tone. Make the content valuable for someone interested in both ${categoryName} and "${topic}".
      
      Format your response as a structured article with clear sections.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const generatedContent = response.text();

      // Parse the response and extract article data
      const lines = generatedContent.split('\n').filter(line => line.trim());

      // Extract title (first non-empty line), clean up any HTML markup
      let title = lines[0] || `${topic} in ${categoryName}`;

      // Clean up HTML markup, markdown code blocks, and other unwanted formatting
      title = title
        .replace(/```html|```|<!DOCTYPE html>/gi, '')
        .replace(/<[^>]*>/g, '')
        .replace(/^[#\-\*\s]+/, '')
        .trim();

      if (!title) {
        title = `${topic} in ${categoryName}`;
      }

      // Extract content (remaining lines joined), also clean up
      let content = lines.slice(1).join('\n\n');
      content = content
        .replace(/^```html|^```|^<!DOCTYPE html>/gi, '')
        .trim();

      return {
        title,
        excerpt: `Explore the latest developments in ${topic} within the ${categoryName} industry. Discover trends, applications, and expert insights.`,
        content,
        featuredImage,
        tags: extractCategoryTags(category, topic),
        metaDescription: `Learn about ${topic} in ${categoryName}. Expert analysis of trends, applications, and future outlook.`,
      };
    } catch (error) {
      console.error('Gemini API error:', error);
      // Fall through to default content generation
    }
  }

  // Enhanced mock content for category-specific articles
  const mockContent = {
    title: `${topic}: ${categoryName} Trends and Insights for 2025`,
    excerpt: `Discover how ${topic} is transforming the ${categoryName} landscape with cutting-edge innovations and practical applications.`,
    content: `
      <h1>${topic}: ${categoryName} Trends and Insights for 2025</h1>

      <p>The ${categoryName} industry is experiencing unprecedented transformation, with ${topic} leading the charge. This comprehensive analysis explores how ${topic} is reshaping ${categoryName} practices and creating new opportunities.</p>

      <h2>Understanding ${topic} in ${categoryName}</h2>
      <p>${topic} represents a pivotal advancement in ${categoryName}, offering innovative solutions to traditional challenges. Industry leaders are leveraging these technologies to gain competitive advantages and drive growth.</p>

      <h2>Current Applications and Use Cases</h2>
      <p>Organizations across the ${categoryName} sector are implementing ${topic} in various ways:</p>
      <ul>
        <li>Streamlining operational processes and workflows</li>
        <li>Enhancing customer experience and satisfaction</li>
        <li>Improving decision-making through data-driven insights</li>
        <li>Reducing costs while increasing efficiency</li>
        <li>Creating new revenue streams and business models</li>
      </ul>

      <h2>Industry Impact and Benefits</h2>
      <p>The integration of ${topic} in ${categoryName} has delivered measurable benefits including improved productivity, enhanced innovation capabilities, and better resource utilization.</p>

      <h2>Challenges and Considerations</h2>
      <p>While ${topic} offers significant opportunities, ${categoryName} professionals must navigate implementation challenges, regulatory requirements, and skill development needs.</p>

      <h2>Future Outlook and Predictions</h2>
      <p>Experts predict that ${topic} will continue evolving, with emerging trends pointing toward increased automation, better integration, and more sophisticated applications in ${categoryName}.</p>

      <h2>Best Practices and Recommendations</h2>
      <p>To successfully leverage ${topic} in ${categoryName}, organizations should focus on strategic planning, employee training, and gradual implementation approaches.</p>

      <h2>Conclusion</h2>
      <p>As ${categoryName} continues to evolve, ${topic} will play an increasingly important role in shaping the industry's future. Organizations that embrace these technologies today will be best positioned for tomorrow's opportunities.</p>
    `,
    featuredImage,
    tags: extractCategoryTags(category, topic),
    metaDescription: `Comprehensive guide to ${topic} in ${categoryName}. Discover trends, applications, and future outlook in this expert analysis.`,
  };

  return mockContent;
}

function getCategoryDisplayName(category: string): string {
  const categoryNames: { [key: string]: string } = {
    technology: 'Technology',
    business: 'Business',
    ai: 'Artificial Intelligence',
    startup: 'Startup',
    sustainability: 'Sustainability',
    health: 'Health & Wellness',
    education: 'Education',
    gaming: 'Gaming'
  };
  
  return categoryNames[category] || category;
}

function extractCategoryTags(category: string, topic: string): string[] {
  const categoryName = getCategoryDisplayName(category);
  const topicWords = topic.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );
  
  const commonTags = ['2025', 'Trends', 'Innovation', 'Analysis'];
  
  return [categoryName, ...topicWords, ...commonTags].slice(0, 6);
}