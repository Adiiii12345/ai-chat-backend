import { Injectable } from '@nestjs/common';
import Groq from 'groq-sdk';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class AppService {
  private groq = new Groq({
    apiKey: process.env.GROQ_API_KEY, // A .env-be tedd: GROQ_API_KEY=gsk_...
  });

  async getAiResponse(prompt: string, lang: string): Promise<string> {
    try {
      const completion = await this.groq.chat.completions.create({
        // A 'llama-3.1-8b-instant' nagyon gyors és magas a limitje
        messages: [
          {
            role: "system",
            content: lang === 'hu' 
              ? "Te egy segítőkész AI vagy. Magyarul válaszolj, röviden." 
              : "You are a helpful AI. Respond in English, briefly."
          },
          { role: "user", content: prompt },
        ],
        model: "llama-3.1-8b-instant",
      });

      return completion.choices[0]?.message?.content || "Nincs válasz.";
    } catch (error: any) {
      console.error("Groq Hiba:", error.message);
      if (error.status === 429) {
        return "Túl sok kérés! Várj egy kicsit.";
      }
      return "Hiba történt a feldolgozás során.";
    }
  }
}