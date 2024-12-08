// src/routes/api/openai/[+server].ts

import OpenAI from 'openai';
import { OPENAI_API_KEY } from '$env/static/private';

// export const maxDuration = 60 * 60 * 24 * 365; // 1 year

export async function POST({ request }) {
    const body = await request.json();
    const openai = new OpenAI({
        apiKey: OPENAI_API_KEY
    });

    console.log('Calling OpenAI API with body:', body);
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: body.messages
        });
        console.log('💚 OpenAI API response:', response);
        // need to return a response object
        return new Response(JSON.stringify(response));

    } catch (error) {
        console.error('💔 Error calling OpenAI API:', error);
        // return {
        //     status: 500,
        //     body: { error: 'Error communicating with OpenAI API' }
        // };
        return new Response(JSON.stringify({ error: 'Error communicating with OpenAI API' }), { status: 500 });
    }
};
