// src\routes\api\+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import LambdaInvoker from '$lib/types'; // Import LambdaInvoker

export const POST: RequestHandler = async ({ request }) => {
    const invoker = new LambdaInvoker({
        functionArn: process.env.LAMBDA_ARN || '',
        apiKey: process.env.LAMBDA_KEY || ''
    });

    try {
        const requestData = await request.json();
        const lambdaResponse = await invoker.invoke(requestData.method, requestData.additionalData);
        return new Response(JSON.stringify(lambdaResponse));
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};
