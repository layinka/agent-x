import { openai } from '@ai-sdk/openai';
import { Controller,Get, Post, Res } from '@nestjs/common';
import {CoreMessage, pipeDataStreamToResponse, streamText, tool } from 'ai';
import { Response } from 'express';



import { z } from 'zod';
import * as readline from 'node:readline/promises';

import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { createWalletClient } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import { http } from "viem";
import { getOnChainTools } from "@goat-sdk/adapter-vercel-ai";
import { viem } from "@goat-sdk/wallet-viem";
import 'dotenv/config';
import { ConfigService } from '@nestjs/config';

// const privateKey = generatePrivateKey()
// console.log('priva key:', process.env.WALLET_PRIVATE_KEY??'No Key in ENV' )
// console.log('priva key:', privateKey )
const account = privateKeyToAccount(
  process.env.WALLET_PRIVATE_KEY  as `0x${string}`
);

const walletClient = createWalletClient({
  account: account,
  transport: http(),
  chain: sepolia,
});




const hyperbolicProvider = createOpenAICompatible({
  name: 'hyperbolic',
  apiKey: process.env.HYPERBOLIC_API_KEY,
  baseURL: 'https://api.hyperbolic.xyz/v1',
});


@Controller()
export class AppController {
  constructor(private configService: ConfigService){
    console.log('priva key:', process.env.WALLET_PRIVATE_KEY??'No Key in ENV', ', config key 1: ',
       this.configService.get<string>('WALLET_PRIVATE_KEY') , 
       ', Encrypt key: ', this.configService.get<string>('ENCRYPTION_KEY'), 
       this.configService.get<string>('ENCRYPTION_KEY').length )
  }
  @Get('/')
  async root(@Res() res: Response) {
    // return res.status(200).send({
    //   success: true,
    //   f: 1234
    // })
    const onchainTools = await getOnChainTools({
      wallet: viem(walletClient as any), 
    });

    const result = streamText({
      //   model: openai('gpt-4o'),
      model: hyperbolicProvider('meta-llama/Meta-Llama-3.1-70B-Instruct'),
      // messages,
      //@ts-ignore
      tools: onchainTools, 
      // {
      //   // weather: tool({
      //   //   description: 'Get the weather in a location (in Celsius)',
      //   //   parameters: z.object({
      //   //     location: z
      //   //       .string()
      //   //       .describe('The location to get the weather for'),
      //   //   }),
      //   //   execute: async ({ location }) => ({
      //   //     location,
      //   //     temperature: Math.round((Math.random() * 30 + 5) * 10) / 10, // Random temp between 5°C and 35°C
      //   //   }),
      //   // }),

      //   // convertCelsiusToFahrenheit: tool({
      //   //     description: 'Convert a temperature from Celsius to Fahrenheit',
      //   //     parameters: z.object({
      //   //       celsius: z
      //   //         .number()
      //   //         .describe('The temperature in Celsius to convert'),
      //   //     }),
      //   //     execute: async ({ celsius }) => {
      //   //       const fahrenheit = (celsius * 9) / 5 + 32;
      //   //       return { fahrenheit: Math.round(fahrenheit * 100) / 100 };
      //   //     },
      //   // }),

      //   ...onchainTools
      // },
      maxSteps: 3,
      onStepFinish: step => {
        console.log(JSON.stringify(step, null, 2));
      },

      prompt: 'Invent a new holiday and describe its traditions.',
    });

    let fullResponse = '';
    // process.stdout.write('\nAssistant: ');
    for await (const delta of result.textStream) {
      fullResponse += delta;
      // process.stdout.write(delta);
    }

    // const result = streamText({
    //   model: openai('gpt-4o'),
    //   prompt: 'Invent a new holiday and describe its traditions.',
    // });

    console.log(await result.toolCalls);
    console.log(await result.toolResults);

    // result.pipeDataStreamToResponse(res);

    return res.status(200).send({
      success: true,
      fullResponse
    })
  }

  @Get('/stream-data')
  async streamData(@Res() res: Response) {
    pipeDataStreamToResponse(res, {
      execute: async (dataStreamWriter) => {
        dataStreamWriter.writeData('initialized call');

        const result = streamText({
          // model: openai('gpt-4o'),
          model: hyperbolicProvider('meta-llama/Meta-Llama-3.1-70B-Instruct'),
          prompt: 'Invent a new holiday and describe its traditions.',
        });

        result.mergeIntoDataStream(dataStreamWriter);
      },
      onError: (error) => {
        // Error messages are masked by default for security reasons.
        // If you want to expose the error message to the client, you can do so here:
        return error instanceof Error ? error.message : String(error);
      },
    });
  }
}
