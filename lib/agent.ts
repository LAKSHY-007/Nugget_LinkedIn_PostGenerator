import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, GenerativeModel } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

const PERSONAS = {
  executive: "You are a C-level executive with 20+ years of industry experience. You speak with authority, strategic vision, and deep market insights. Your tone is commanding yet approachable.",
  innovator: "You are a tech innovator and thought leader. You focus on future trends, disruptive technologies, and transformative ideas. Your tone is visionary and inspiring.",
  storyteller: "You are a master storyteller who connects through narrative and emotional intelligence. You use metaphors, personal anecdotes, and compelling storytelling techniques.",
  analyst: "You are a data-driven industry analyst. You provide deep insights backed by research, statistics, and logical reasoning. Your tone is precise and authoritative.",
  mentor: "You are an experienced mentor and coach. You provide actionable advice, frameworks, and practical wisdom that helps others grow professionally."
};

const CONTENT_FRAMEWORKS = [
  "P-A-R (Problem-Agitation-Resolution) framework",
  "S-T-A-R (Situation-Task-Action-Result) method",
  "Before-After-Bridge narrative structure",
  "3-Point persuasive argument",
  "Case study format with data-driven insights"
];

async function advancedGenerateContent(model: GenerativeModel, prompt: string, retries: number = 3): Promise<string> {
  let attempt = 0;
  let delay = 2000;

  while (attempt < retries) {
    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err: unknown) {
      attempt++;
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      
      if (errorMessage.includes("503") || errorMessage.includes("429")) {
        console.warn(`Model overloaded (attempt ${attempt}/${retries}), retrying in ${delay}ms...`);
        await new Promise(res => setTimeout(res, delay));
        delay *= 2;
      } else {
        throw err;
      }
    }
  }
  throw new Error("Model unavailable after multiple attempts. Please try again later.");
}

function validateContentQuality(content: string): boolean {
  const minLength = 100;
  const maxLength = 3000;
  const qualityIndicators = [
    content.length > minLength,
    content.length < maxLength,
    content.split('.').length >= 4,
    !content.includes('As an AI language model'),
    !content.includes('I cannot'),
    !content.includes('I apologize')
  ];

  return qualityIndicators.every(indicator => indicator === true);
}

async function generateSmartHashtags(model: GenerativeModel, content: string): Promise<string[]> {
  const hashtagPrompt = `
  Analyze the following LinkedIn post content and generate 3-5 highly relevant, professional hashtags.
  Focus on industry-specific tags, trending topics, and engagement-driven hashtags.
  
  Content: "${content.substring(0, 500)}..."
  
  Return ONLY the hashtags as a comma-separated list, nothing else.
  `;

  try {
    const response = await model.generateContent(hashtagPrompt);
    const hashtags = response.response.text().split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag);
    return hashtags.slice(0, 5);
  } catch (_error) {
    console.warn('Hashtag generation failed, using fallback tags');
    return ['Leadership', 'ProfessionalGrowth', 'CareerDevelopment'];
  }
}

export interface GeneratePostsResult {
  posts: string[];
  tokenUsage?: number;
  hashtags?: string[][];
}

export async function generatePosts(
  topic: string,
  tone: string = 'professional'
): Promise<GeneratePostsResult> {

  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-pro",
    safetySettings,
    generationConfig: {
      temperature: 0.8,
      topK: 50,
      topP: 0.95,
      maxOutputTokens: 4096,
    },
  });

  const planningPrompt = `
  STRATEGIC CONTENT PLANNING - PHASE 1
  
  TOPIC: "${topic}"
  TONE: ${tone}
  PERSONA: ${PERSONAS.executive}
  
  TASK: Create a comprehensive content strategy for 3 distinct LinkedIn posts.
  
  For each post, provide:
  1. UNIQUE ANGLE: A fresh perspective on the topic
  2. CORE MESSAGE: The key insight or takeaway
  3. TARGET AUDIENCE: Who this post will resonate with
  4. EMOTIONAL HOOK: How to capture attention emotionally
  5. FRAMEWORK: Which content framework to use (${CONTENT_FRAMEWORKS.join(', ')})
  
  Format your response as a structured JSON-like plan without markdown.
  `;

  const generationPrompt = (plan: string) => `
  PREMIUM LINKEDIN CONTENT GENERATION - PHASE 2
  
  BASED ON THIS STRATEGIC PLAN:
  ${plan}
  
  TASK: Generate 3 exceptional LinkedIn posts that:
  - Are 150-250 words each (substantial but concise)
  - Include storytelling elements and concrete examples
  - Provide actionable insights or thought-provoking ideas
  - Use professional language with moments of conversational warmth
  - Incorporate relevant data, metaphors, or analogies when appropriate
  - End with an engaging question or call to reflection
  
  FORMAT REQUIREMENTS:
  <post_1>
  [Full post content here - premium quality]
  ***
  <post_2>
  [Full post content here - premium quality]
  ***
  <post_3>
  [Full post content here - premium quality]
  
  Do not include any other text or commentary.
  `;

  try {
    console.log('Starting strategic planning phase...');
    const strategicPlan = await advancedGenerateContent(model, planningPrompt);
    
    console.log('Starting content generation phase...');
    const generatedContent = await advancedGenerateContent(model, generationPrompt(strategicPlan));
    
    const blocks = generatedContent.split('***').map(block => block.trim());
    const posts: string[] = [];
    
    for (const block of blocks) {
      if (block.includes('<post_')) {
        const postContent = block.split('\n').slice(1).join('\n').trim();
        if (validateContentQuality(postContent)) {
          posts.push(postContent);
        }
      } else if (block.length > 150) {
        posts.push(block);
      }
    }

    if (posts.length < 3) {
      throw new Error('Insufficient high-quality content generated');
    }

    console.log('Generating smart hashtags...');
    const hashtagPromises = posts.slice(0, 3).map(post => 
      generateSmartHashtags(model, post)
    );
    
    const hashtags = await Promise.all(hashtagPromises);

    const enhancedPosts = posts.map((post, index) => {
      let enhanced = post;
      
      if (!post.includes('\n\n')) {
        const sentences = post.split('. ');
        if (sentences.length > 4) {
          const midPoint = Math.floor(sentences.length / 2);
          enhanced = sentences.slice(0, midPoint).join('. ') + '.\n\n' + 
                     sentences.slice(midPoint).join('. ') + '.';
        }
      }
      
      enhanced += `\n\n${hashtags[index].join(' ')}`;
      
      return enhanced;
    });

    const totalContent = strategicPlan + generatedContent + hashtags.flat().join(' ');
    const tokenUsage = Math.floor(totalContent.length / 3.5);

    return {
      posts: enhancedPosts.slice(0, 3),
      tokenUsage,
      hashtags: hashtags.slice(0, 3)
    };

  } catch (error: unknown) {
    console.error('Advanced content generation failed:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    if (errorMessage.includes('safety') || errorMessage.includes('blocked')) {
      throw new Error('Content safety protocols activated. Please refine your topic or tone.');
    }

    if (errorMessage.includes('unavailable')) {
      throw new Error('AI service temporarily unavailable. Please try again in a moment.');
    }

    throw new Error('Advanced content generation failed. Please try a different approach.');
  }
}

export interface PremiumPostResult {
  post: string;
  hashtags: string[];
  tokenUsage?: number;
}

export async function generatePremiumPost(
  topic: string,
  style: keyof typeof PERSONAS = 'executive'
): Promise<PremiumPostResult> {
  
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-pro",
    safetySettings,
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.9,
      maxOutputTokens: 2048,
    },
  });

  const premiumPrompt = `
  CREATE A SIGNATURE LINKEDIN POST
  
  TOPIC: "${topic}"
  PERSONA: ${PERSONAS[style]}
  STYLE: Premium thought leadership content
  
  REQUIREMENTS:
  - 200-300 words of exceptional quality
  - Unique insight or fresh perspective
  - Storytelling with emotional resonance
  - Data or examples where appropriate
  - Professional yet engaging tone
  - Clear structure with compelling hook and strong conclusion
  - End with an thought-provoking question
  
  Return only the post content, nothing else.
  `;

  try {
    const post = await advancedGenerateContent(model, premiumPrompt);
    const hashtags = await generateSmartHashtags(model, post);
    
    const enhancedPost = validateContentQuality(post) 
      ? post + `\n\n${hashtags.join(' ')}`
      : post;

    return {
      post: enhancedPost,
      hashtags,
      tokenUsage: Math.floor(post.length / 3.5)
    };

  } catch (error: unknown) {
    console.error('Premium post generation failed:', error);
    throw new Error('Could not generate premium content. Please try again.');
  }
}