export enum ChainId {
    ETHEREUM = 1,
    CELO = 42220,
    CELO_ALFAJORES = 44787
}

export interface Token {
    address: string;
    chainId: ChainId|number;
    decimals: number;
    symbol: string;
    name: string;
}

export interface Pool {
    token0: Token;
    token1: Token;
    fee: number;
    tickSpacing: number;
    sqrtPriceX96: bigint;
    liquidity: bigint;
    tick: number;
    address: string;
    createdAt?: number;      // Block number when pool was created
    tvlUSD?: number;         // Total value locked in USD
    volume24h?: number;      // 24-hour trading volume in USD
    feesUSD24h?: number;     // 24-hour fees earned in USD
    token0Price?: number;    // Current price of token0 in terms of token1
    token1Price?: number;    // Current price of token1 in terms of token0
}

export interface Position {
    tokenId: number;
    nonce: bigint;
    operator: string;
    token0: string;
    token1: string;
    fee: number;
    tickLower: number;
    tickUpper: number;
    liquidity: bigint;
    feeGrowthInside0LastX128: bigint;
    feeGrowthInside1LastX128: bigint;
    tokensOwed0: bigint;
    tokensOwed1: bigint;
}

export interface PositionInfo extends Position {
    pool: Pool;
    amount0: bigint;
    amount1: bigint;
}

export interface Route {
    tokenIn: string;
    tokenOut: string;
    intermediateTokens: string[];
    fees: number[];
}

export type FeeAmount = 100 | 500 | 3000 | 10000;
