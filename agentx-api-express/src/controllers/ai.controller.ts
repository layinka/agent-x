import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { RequestWithUser } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import { AuthService } from '@services/auth.service';


import { openai } from '@ai-sdk/openai';

import {CoreMessage, Message, pipeDataStreamToResponse, streamText, tool } from 'ai';




import { z } from 'zod';
import * as readline from 'node:readline/promises';

import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { createWalletClient } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import { http } from "viem";
import { getOnChainTools } from "@goat-sdk/adapter-vercel-ai";
import { viem } from "@goat-sdk/wallet-viem";
import { EVMWalletClient, sendETH, } from "@goat-sdk/wallet-evm";

import { MODE, USDC, erc20 } from "@goat-sdk/plugin-erc20";
import { kim } from '@goat-sdk/plugin-kim';
import { UserPromptDTO } from '@/dtos/ai.dto';
import { randomUUID } from 'node:crypto';
import { PluginBase } from '@goat-sdk/core';
import { createMistral } from '@ai-sdk/mistral';

// const privateKey = generatePrivateKey()
// console.log('priva key:', process.env.WALLET_PRIVATE_KEY??'No Key in ENV' )
// console.log('priva key:', privateKey )
const account = privateKeyToAccount(
  process.env.WALLET_PRIVATE_KEY  as `0x${string}`
);

const walletClient = createWalletClient({
  account: account,
  transport: http('https://ethereum-sepolia-rpc.publicnode.com'),
  chain: sepolia,
});




const hyperbolicProvider = createOpenAICompatible({
  name: 'hyperbolic',
  apiKey: process.env.HYPERBOLIC_API_KEY,
  baseURL: 'https://api.hyperbolic.xyz/v1',
  
});





export class AIController {
  public auth = Container.get(AuthService);
  /**
   * @swagger
   * /ai/prompt:
   *   post:
   *     summary: Prompt AI
   *     tags: [A.I.]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/AIPrompt'
   *     responses:
   *       201:
   *         description: Prmopt completed successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/AIPromptResponse'
   *       500:
   *         description: Internal server error
   */
  public prompt = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const promptData: UserPromptDTO = req.body;

      const mistralAi = createMistral();

      const messages1: Message[]= [
        {
          id: randomUUID(),
          role: 'system',
          content: 'You are an expert crypto defi agent.',
        },
        {
          id: randomUUID(),
          role: 'user',
          content: promptData.prompt,//  'Get My Wallet address',
        }
      ];
      
      
      const onchainTools = await getOnChainTools({
        wallet:  viem(walletClient as any), 
  
        plugins: [
          //@ ts -ignore
          // sendETH(), 
          sendETH()  as unknown as PluginBase<EVMWalletClient>, 
          erc20({ tokens: [USDC, MODE] }), 
          // kim() 
        ]
      });
  
      const result = streamText({
        //   model: openai('gpt-4o'),
        model:mistralAi('mistral-large-latest', {
            safePrompt: true, // optional safety prompt injection
          }), // hyperbolicProvider('meta-llama/Meta-Llama-3.1-70B-Instruct'),
        // messages: messages1,
        //  [
        //   {
        //     role: 'system',
        //     content: ''
        //   }
        // ],
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
          
          console.log(step.finishReason, step.stepType, JSON.stringify(step.response, null, 2));
        },
  
        prompt: promptData.prompt?? "What's my wallet Address?",
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
  
      console.log('ToolCall:: ', await result.toolCalls);
      console.log('ToolResults :: ',await result.toolResults);
  
      // result.pipeDataStreamToResponse(res);
  
      return res.status(200).send({
        success: true,
        fullResponse
      })
    } catch (error) {
      next(error);
    }
  };

}
