// src\lib\types.ts
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

interface LambdaInvokerOptions {
    functionArn: string;
    apiKey: string;
}

class LambdaInvoker {
    private lambdaClient: LambdaClient;
    private functionArn: string;
    private apiKey: string;

    constructor(options: LambdaInvokerOptions) {
        this.lambdaClient = new LambdaClient({});
        this.functionArn = options.functionArn;
        this.apiKey = options.apiKey;
    }

    async invoke(method: string, additionalData: Record<string, any>): Promise<any> {
        const body = JSON.stringify({
            API_KEY: this.apiKey,
            method: method,
            ...additionalData
        });
        const payload = { body: body };
        const jsonPayload = JSON.stringify(payload);

        const command = new InvokeCommand({
            FunctionName: this.functionArn,
            InvocationType: 'RequestResponse',
            Payload: new TextEncoder().encode(jsonPayload)
        });

        const response = await this.lambdaClient.send(command);

        if (response.Payload) {
            return JSON.parse(new TextDecoder().decode(response.Payload));
        }

        return {};
    }

    // Add other methods like search_and_crawl, crawl, etc.
}

// Example usage
// const lambdaArn = process.env.LAMBDA_ARN || '';
// const apiKey = process.env.LAMBDA_KEY || '';
// const invoker = new LambdaInvoker({ functionArn: lambdaArn, apiKey: apiKey });

export default LambdaInvoker;
