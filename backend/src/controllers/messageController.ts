import { Request, Response } from 'express';
import { z } from 'zod';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { linkedInMessageSchema } from '../validation/schemas';
import { asyncHandler } from '../middleware/errorHandler';
import dotenv from 'dotenv';

dotenv.config();

let genAI: GoogleGenerativeAI | null = null;

try {
  if (process.env.GEMINI_API_KEY && 
      process.env.GEMINI_API_KEY.length > 10) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }else{
    console.warn('Google Generative AI API key is not set or is invalid. AI features will be disabled.');
  }
} catch (error) {
  console.error('Failed to initialize Google Generative AI:', error);
}


interface LinkedInProfile {
  name: string;
  job_title: string;
  company: string;
  location: string;
  summary: string;
}


export const generatePersonalizedMessage = asyncHandler(async (req: Request, res: Response) => {
  // Validate request body
  try {
    const validatedData = linkedInMessageSchema.parse(req.body);
    const { name, job_title, company, location, summary } = validatedData;

    try {
      if (!genAI) {
        throw new Error('API key not configured or invalid');
      }

       const prompt = `
You are an expert at writing personalized LinkedIn outreach messages for OutFlo, a platform that helps automate outreach to increase meetings and sales.

Create a personalized, professional, and engaging LinkedIn outreach message based on the following profile information:

Name: ${name}
Job Title: ${job_title}
Company: ${company}
Location: ${location}
Summary: ${summary}

Guidelines:
- Keep the message between 50-100 words
- Be conversational and friendly, not salesy
- Reference their specific role or company
- Mention how OutFlo can help them specifically
- Include a clear call-to-action to connect
- Make it feel personal and genuine
- Avoid generic phrases

Generate only the message content, no additional text or formatting.
`;

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const message = response.text().trim();

      if (message && message.length > 10) {
        return res.status(200).json({
          success: true,
          message: message,
          source: 'ai'
        });
      } else {
        throw new Error('Invalid AI response');
      }

    } catch (aiError) {
      console.error('AI Message Generation Error:', aiError);
      
      const fallbackMessages = [
        `Hi ${name}! I noticed you're a ${job_title} at ${company}. OutFlo specializes in helping ${job_title}s like yourself automate outreach processes. Would love to connect and show you how we can help scale your efforts!`,
        
        `Hey ${name}, I see you're doing great work as a ${job_title} at ${company}. OutFlo has helped similar professionals in ${location} increase their meeting bookings by 3x through automated outreach. Let's connect!`,
        
        `Hi ${name}! Your background as a ${job_title} at ${company} caught my attention. OutFlo can help streamline your outreach efforts and increase sales conversations. Would you be interested in learning more?`,
        
        `Hello ${name}, I came across your profile and was impressed by your work at ${company}. OutFlo helps professionals like you automate personalized outreach to boost meetings and sales. Let's connect!`
      ];
      
      const randomIndex = Math.floor(Math.random() * fallbackMessages.length);
      const fallbackMessage = fallbackMessages[randomIndex];
      
      return res.status(200).json({
        success: true,
        message: fallbackMessage,
        source: 'template',
        note: 'AI service temporarily unavailable. Using intelligent template.'
      });
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: error.errors[0].message
      });
    }

    console.error('Message Generation Error:', error);
    
    const ultimateFallback = "Hi! OutFlo can help automate your outreach to increase meetings & sales. Let's connect!";
    
    res.status(200).json({
      success: true,
      message: ultimateFallback,
      source: 'fallback',
      note: 'Service temporarily unavailable. Using basic template.'
    });
  }
})

  