import { NextResponse } from 'next/server';
import { chatWithAI } from '@/ai/flows/chat-flow';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const result = await chatWithAI({ message });
    
    if (!result || !result.response) {
      return NextResponse.json({ error: 'AI response failed' }, { status: 500 });
    }

    return NextResponse.json({ response: result.response });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'AI response failed' },
      { status: 500 }
    );
  }
}
