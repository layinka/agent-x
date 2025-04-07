import { createToolParameters } from '@goat-sdk/core';
import { z } from 'zod';
import { ChainId } from './types';

// Base parameters that all operations need
const BaseParams = z.object({
    chainId: z.nativeEnum(ChainId).describe('Chain ID where the DEX is deployed'),
    dexName: z.string().describe('Name of the DEX to use (e.g., "uniswapV3", "ubeswap")')
});

export class AddLiquidityParams extends createToolParameters(
    BaseParams.extend({
        token0: z.string().describe('Address of the first token'),
        token1: z.string().describe('Address of the second token'),
        fee: z.number().describe('Fee tier for the pool (e.g., 500 = 0.05%, 3000 = 0.3%)'),
        amount0Desired: z.string().describe('Desired amount of token0 to add'),
        amount1Desired: z.string().describe('Desired amount of token1 to add'),
        amount0Min: z.string().describe('Minimum amount of token0 to add'),
        amount1Min: z.string().describe('Minimum amount of token1 to add'),
        recipient: z.string().describe('Address that will receive the liquidity position'),
        deadline: z.number().describe('Timestamp deadline for the transaction'),
        tickLower: z.number().describe('Lower tick of the position'),
        tickUpper: z.number().describe('Upper tick of the position')
    })
) {}

export class RemoveLiquidityParams extends createToolParameters(
    BaseParams.extend({
        tokenId: z.number().describe('ID of the NFT position'),
        liquidity: z.string().describe('Amount of liquidity to remove'),
        amount0Min: z.string().describe('Minimum amount of token0 to receive'),
        amount1Min: z.string().describe('Minimum amount of token1 to receive'),
        deadline: z.number().describe('Timestamp deadline for the transaction')
    })
) {}

export class CollectFeesParams extends createToolParameters(
    BaseParams.extend({
        tokenId: z.number().describe('ID of the NFT position'),
        recipient: z.string().describe('Address that will receive the collected fees'),
        amount0Max: z.string().describe('Maximum amount of token0 fees to collect'),
        amount1Max: z.string().describe('Maximum amount of token1 fees to collect')
    })
) {}

export class GetPoolsParams extends createToolParameters(
    BaseParams.extend({
        token0: z.string().optional().describe('Optional filter for first token address'),
        token1: z.string().optional().describe('Optional filter for second token address'),
        fee: z.number().optional().describe('Optional filter for fee tier'),
        fromBlock: z.string().optional().describe('Optional filter for starting block (e.g. "earliest", block number)'),
        toBlock: z.string().optional().describe('Optional filter for ending block (e.g. "latest", block number)'),
        pageSize: z.number().optional().default(10).describe('Number of pools to return per page'),
        pageNumber: z.number().optional().default(1).describe('Page number to return, starting from 1'),
        minLiquidity: z.string().optional().describe('Optional minimum liquidity filter'),
        minTvl: z.number().optional().describe('Optional minimum TVL in USD'),
        sortBy: z.enum(['liquidity', 'tvl', 'volume24h', 'createdAt']).optional().default('liquidity').describe('Sort pools by this metric'),
        sortOrder: z.enum(['asc', 'desc']).optional().default('desc').describe('Sort order')
    })
) {}

export class GetUserPositionsParams extends createToolParameters(
    BaseParams.extend({
        owner: z.string().describe('Address of the position owner'),
        token0: z.string().optional().describe('Optional filter for first token'),
        token1: z.string().optional().describe('Optional filter for second token'),
        fee: z.number().optional().describe('Optional filter for fee tier')
    })
) {}

export class ExactInputSingleParams extends createToolParameters(
    BaseParams.extend({
        tokenIn: z.string().describe('Address of input token'),
        tokenOut: z.string().describe('Address of output token'),
        fee: z.number().describe('Pool fee tier'),
        recipient: z.string().describe('Address that will receive the output tokens'),
        amountIn: z.string().describe('Amount of input tokens to swap'),
        amountOutMinimum: z.string().describe('Minimum amount of output tokens to receive'),
        sqrtPriceLimitX96: z.string().optional().describe('Price limit for the swap'),
        deadline: z.number().describe('Timestamp deadline for the transaction')
    })
) {}

export class ExactOutputSingleParams extends createToolParameters(
    BaseParams.extend({
        tokenIn: z.string().describe('Address of input token'),
        tokenOut: z.string().describe('Address of output token'),
        fee: z.number().describe('Pool fee tier'),
        recipient: z.string().describe('Address that will receive the output tokens'),
        amountOut: z.string().describe('Amount of output tokens to receive'),
        amountInMaximum: z.string().describe('Maximum amount of input tokens to spend'),
        sqrtPriceLimitX96: z.string().optional().describe('Price limit for the swap'),
        deadline: z.number().describe('Timestamp deadline for the transaction')
    })
) {}

export class ExactInputParams extends createToolParameters(
    BaseParams.extend({
        path: z.object({
            tokenIn: z.string(),
            tokenOut: z.string(),
            intermediateTokens: z.array(z.string()),
            fees: z.array(z.number())
        }).describe('Path for the multi-hop swap'),
        recipient: z.string().describe('Address that will receive the output tokens'),
        amountIn: z.string().describe('Amount of input tokens to swap'),
        amountOutMinimum: z.string().describe('Minimum amount of output tokens to receive'),
        deadline: z.number().describe('Timestamp deadline for the transaction')
    })
) {}

export class ExactOutputParams extends createToolParameters(
    BaseParams.extend({
        path: z.object({
            tokenIn: z.string(),
            tokenOut: z.string(),
            intermediateTokens: z.array(z.string()),
            fees: z.array(z.number())
        }).describe('Path for the multi-hop swap'),
        recipient: z.string().describe('Address that will receive the output tokens'),
        amountOut: z.string().describe('Amount of output tokens to receive'),
        amountInMaximum: z.string().describe('Maximum amount of input tokens to spend'),
        deadline: z.number().describe('Timestamp deadline for the transaction')
    })
) {}

export class GetQuoteParams extends createToolParameters(
    BaseParams.extend({
        tokenIn: z.string().describe('Address of input token'),
        tokenOut: z.string().describe('Address of output token'),
        fee: z.number().describe('Pool fee tier'),
        amount: z.string().describe('Amount of tokens to quote'),
        sqrtPriceLimitX96: z.string().optional().describe('Price limit for the quote')
    })
) {}
