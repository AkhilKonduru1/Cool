import { AdventureRequest, AdventureResponse } from '@/types/adventure';
import Constants from 'expo-constants';

class AIService {
  private static readonly API_KEY = Constants.expoConfig?.extra?.groqApiKey || process.env.GROQ_API_KEY || '';
  private static readonly API_URL = 'https://api.groq.com/openai/v1/chat/completions';

  static async generateAdventures(request: AdventureRequest): Promise<AdventureResponse[]> {
    try {
      console.log('🤖 Starting AI adventure generation...');
      console.log('📍 Request:', request);
      
      const prompt = this.buildPrompt(request);
      console.log('📝 Prompt:', prompt);
      
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            {
              role: 'system',
              content: 'You are an AI assistant that creates fun, spontaneous mini-adventures for teens. Always respond with valid JSON in the exact format requested.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.8,
          max_tokens: 1024,
        }),
      });

      console.log('📡 API Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error:', errorText);
        throw new Error(`API request failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('📦 API Response data:', data);
      
      const generatedText = data.choices?.[0]?.message?.content;
      
      if (!generatedText) {
        throw new Error('No content generated from API');
      }

      console.log('✨ Generated text:', generatedText);
      const parsedAdventures = this.parseMultipleAdventuresResponse(generatedText);
      console.log('🎯 Parsed adventures:', parsedAdventures);
      
      return parsedAdventures;
    } catch (error) {
      console.error('❌ Error generating adventure:', error);
      console.log('🔄 Using fallback adventure...');
      // Fallback to a default adventure if API fails
      return this.getFallbackAdventure(request);
    }
  }

  private static buildPrompt(request: AdventureRequest): string {
    const moodDescriptions = {
      chill: "relaxing, peaceful, low-energy activities",
      funny: "humorous, silly, entertaining experiences",
      active: "energetic, physical, movement-based activities", 
      creative: "artistic, imaginative, expressive pursuits"
    };

    return `You are an expert adventure curator for teens! Generate 5 amazing personalized activities based on these criteria:

📍 Location: ${request.location} (coordinates: ${request.latitude}, ${request.longitude})
🎭 Mood: ${request.mood} (${moodDescriptions[request.mood as keyof typeof moodDescriptions]})
⏰ Time Available: ${request.timeBudget} minutes
💰 Budget: ${request.budget}

Create 5 unique, engaging activities that:
- Are perfect for teens (ages 13-19)
- Can realistically be completed in the specified time
- Fit exactly within the specified budget
- Are location-aware and actually doable in ${request.location}
- Match the ${request.mood} mood perfectly
- Are spontaneous, fun, and Instagram-worthy
- Include specific, actionable details
- Are safe and appropriate
- Feel like mini adventures, not just regular activities
- Are all different from each other (variety is key!)

Respond in this EXACT JSON format (no additional text, no markdown):
{
  "activities": [
    {
      "title": "Creative activity title (max 45 characters)",
      "description": "Exciting 2-3 sentence description that makes the activity sound irresistible",
      "emoji": "Perfect emoji that represents the activity",
      "estimatedTime": "Realistic time estimate (e.g., '25-35 minutes')",
      "cost": "Exact cost estimate (e.g., 'Free', '$3-5', '$8-12')",
      "location": "Specific location name or area in ${request.location}",
      "tips": ["Practical tip 1", "Fun tip 2", "Pro tip 3"],
      "category": "${request.mood}"
    },
    {
      "title": "Second activity title",
      "description": "Description for second activity",
      "emoji": "Emoji for second activity",
      "estimatedTime": "Time estimate",
      "cost": "Cost estimate",
      "location": "Location for second activity",
      "tips": ["Tip 1", "Tip 2", "Tip 3"],
      "category": "${request.mood}"
    },
    {
      "title": "Third activity title",
      "description": "Description for third activity",
      "emoji": "Emoji for third activity",
      "estimatedTime": "Time estimate",
      "cost": "Cost estimate",
      "location": "Location for third activity",
      "tips": ["Tip 1", "Tip 2", "Tip 3"],
      "category": "${request.mood}"
    },
    {
      "title": "Fourth activity title",
      "description": "Description for fourth activity",
      "emoji": "Emoji for fourth activity",
      "estimatedTime": "Time estimate",
      "cost": "Cost estimate",
      "location": "Location for fourth activity",
      "tips": ["Tip 1", "Tip 2", "Tip 3"],
      "category": "${request.mood}"
    },
    {
      "title": "Fifth activity title",
      "description": "Description for fifth activity",
      "emoji": "Emoji for fifth activity",
      "estimatedTime": "Time estimate",
      "cost": "Cost estimate",
      "location": "Location for fifth activity",
      "tips": ["Tip 1", "Tip 2", "Tip 3"],
      "category": "${request.mood}"
    }
  ]
}

Make all 5 activities sound absolutely amazing and something every teen would want to do right now!`;
  }

  private static parseMultipleAdventuresResponse(text: string): AdventureResponse[] {
    try {
      // Clean up the response text to extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const jsonString = jsonMatch[0];
      const response = JSON.parse(jsonString);

      // Check if response has activities array
      if (!response.activities || !Array.isArray(response.activities)) {
        throw new Error('No activities array found in response');
      }

      // Validate each activity
      const requiredFields = ['title', 'description', 'emoji', 'estimatedTime', 'cost', 'location', 'tips', 'category'];
      for (let i = 0; i < response.activities.length; i++) {
        const activity = response.activities[i];
        for (const field of requiredFields) {
          if (!activity[field]) {
            throw new Error(`Missing required field '${field}' in activity ${i + 1}`);
          }
        }
      }

      return response.activities as AdventureResponse[];
    } catch (error) {
      console.error('Error parsing multiple adventures response:', error);
      throw new Error('Failed to parse multiple adventures response');
    }
  }

  private static getFallbackAdventure(request: AdventureRequest): AdventureResponse[] {
    const fallbackAdventures = {
      chill: {
        title: "Peaceful Park Stroll",
        description: "Take a relaxing walk in a nearby park and find a quiet spot to people-watch or read.",
        emoji: "🌳",
        estimatedTime: "30-45 minutes",
        cost: "Free",
        location: "Local park",
        tips: ["Bring a book or journal", "Find a shady spot", "Take your time and enjoy nature"],
        category: "chill"
      },
      funny: {
        title: "Silly Selfie Challenge",
        description: "Take creative selfies with random objects around your neighborhood and create a funny photo story.",
        emoji: "📸",
        estimatedTime: "20-30 minutes",
        cost: "Free",
        location: "Your neighborhood",
        tips: ["Be creative with poses", "Use interesting backgrounds", "Share with friends"],
        category: "funny"
      },
      active: {
        title: "Quick Fitness Adventure",
        description: "Do a quick workout circuit at a local park or outdoor space.",
        emoji: "🏃‍♀️",
        estimatedTime: "15-30 minutes",
        cost: "Free",
        location: "Local park or outdoor space",
        tips: ["Warm up first", "Stay hydrated", "Have fun with it"],
        category: "active"
      },
      creative: {
        title: "Artistic Photo Walk",
        description: "Take artistic photos of interesting things you find while walking around your area.",
        emoji: "📷",
        estimatedTime: "30-45 minutes",
        cost: "Free",
        location: "Your neighborhood",
        tips: ["Look for interesting textures", "Try different angles", "Capture the moment"],
        category: "creative"
      }
    };

    const baseAdventure = fallbackAdventures[request.mood as keyof typeof fallbackAdventures] || fallbackAdventures.chill;
    
    // Create 5 variations of the base adventure
    return [
      { ...baseAdventure, title: `${baseAdventure.title} #1` },
      { ...baseAdventure, title: `${baseAdventure.title} #2` },
      { ...baseAdventure, title: `${baseAdventure.title} #3` },
      { ...baseAdventure, title: `${baseAdventure.title} #4` },
      { ...baseAdventure, title: `${baseAdventure.title} #5` },
    ];
  }
}

export { AIService, type AdventureRequest, type AdventureResponse };


