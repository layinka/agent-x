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
import { sepolia, sonic,hardhat, sonicTestnet } from "viem/chains";
import { http } from "viem";
import { getOnChainTools } from "@goat-sdk/adapter-vercel-ai";
import { viem } from "@goat-sdk/wallet-viem";
import { EVMWalletClient, sendETH, } from "@goat-sdk/wallet-evm";

import { MODE, Token, erc20 } from "@goat-sdk/plugin-erc20";
import { kim } from '@goat-sdk/plugin-kim';
import { UserPromptDTO } from '@/dtos/ai.dto';
import { randomUUID } from 'node:crypto';
import { PluginBase } from '@goat-sdk/core';
import { createMistral } from '@ai-sdk/mistral';
import { defillama, DefiLlamaPlugin } from '@/goat_plugins/defi-llama';
import { debridge } from "@goat-sdk/plugin-debridge";
import { compound_v2 } from '@/goat_plugins/compound_v2/src';


export const USDC: Token = {
  decimals: 6,
  symbol: "USDC",
  name: "USDC",
  chains: {
      "1": {
          contractAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      },
      "10": {
          contractAddress: "0x0b2c639c533813f4aa9d7837caf62653d097ff85",
      },
      "137": {
          contractAddress: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
      },
      "8453": {
          contractAddress: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      },
      "84532": {
          contractAddress: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
      },
      "11155111": {
          contractAddress: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
      },
      "34443": {
          contractAddress: "0xd988097fb8612cc24eeC14542bC03424c656005f",
      },
      "31337": {
          contractAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      },
  },
};

export const DAI: Token = {
  decimals: 18,
  symbol: "DAI",
  name: "DAI",
  chains: {
      "1": {
          contractAddress: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      },
      "10": {
          contractAddress: "0x0b2c639c533813f4aa9d7837caf62653d097ff85",
      },
      "137": {
          contractAddress: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
      },
      "8453": {
          contractAddress: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      },
      "84532": {
          contractAddress: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
      },
      "11155111": {
          contractAddress: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
      },
      "34443": {
          contractAddress: "0xd988097fb8612cc24eeC14542bC03424c656005f",
      },
      "31337": {
          contractAddress: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      },
  },
};

// const privateKey = generatePrivateKey()
// console.log('priva key:', process.env.WALLET_PRIVATE_KEY??'No Key in ENV' )
// console.log('priva key:', privateKey )
const account = privateKeyToAccount(
  process.env.WALLET_PRIVATE_KEY  as `0x${string}`
);

const walletClient = createWalletClient({
  account: account,
  transport: http('http://localhost:8545'),//'https://ethereum-sepolia-rpc.publicnode.com'
  chain: hardhat,
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

      const messages: Message[]= [
        {
          id: randomUUID(),
          role: 'system',
          content: 'You are an expert crypto defi agent.You work on the hardhat chain. You know how to help people get their ERC20 Balances, their ETH balance and General ERC20 token information like name, symbol, supply. You also know how to get information about defi yield opportunities from defillama.',
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
          erc20({ tokens: [USDC, DAI, MODE] }), 
          defillama(),
          // debridge(),
          compound_v2()
          // kim() 
        ]
      });
  
      const result = streamText({
        //   model: openai('gpt-4o'),
        model:mistralAi('mistral-large-latest', {
            // safePrompt: true, // optional safety prompt injection
          }), // hyperbolicProvider('meta-llama/Meta-Llama-3.1-70B-Instruct'),
        messages: messages,
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
        maxSteps: 15,
        onStepFinish: step => {
          
          console.log(step.finishReason, step.stepType, JSON.stringify(step.response, null, 2));
        },
  
        // prompt: promptData.prompt?? "What's my wallet Address?",
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
  
      // console.log('ToolCall:: ', await result.toolCalls);
      // console.log('ToolResults :: ',await result.toolResults);
  
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
