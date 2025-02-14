import { groq } from '@ai-sdk/groq';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    try {
        const prompt = "Create a list of three of open-ended and engaging questions formatted as a single string. Each question should be separated by ' || '. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable topics, focusing instead on universal themes that encourge friendly interaction. For example, 'What's your favorite book and why?' || 'What's the best advice you've ever received?' || 'What's your favorite thing about yourself?' Ensure that the questions are engaging and open-ended, and that they are suitable for a wide audience.";

        const result = streamText({

            model: groq('gemma2-9b-it'),
            prompt: prompt,
        });
        return result.toDataStreamResponse();
    } catch (error) {
        console.error('Error sending message', error);
        throw error;
    }
}