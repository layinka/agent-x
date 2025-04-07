import { Tool } from "@goat-sdk/core";
import { EVMWalletClient } from "@goat-sdk/wallet-evm";
import { encodeAbiParameters, Log } from "viem";
import { DexManager } from "./utils/dex-manager";
import {
    ERC20_ABI,
    FACTORY_ABI,
    POOL_ABI,
    POSITION_MANAGER_ABI,
    SWAP_ROUTER_ABI,
    QUOTER_ABI
} from "./abis";
import {
    AddLiquidityParams,
    RemoveLiquidityParams,
    CollectFeesParams,
    GetPoolsParams,
    GetUserPositionsParams,
    ExactInputSingleParams,
    ExactOutputSingleParams,
    ExactInputParams,
    ExactOutputParams,
    GetQuoteParams
} from "./parameters";
import { Pool, Position, PositionInfo } from "./types";

// Define the PoolCreated event type
interface PoolCreatedEvent extends Log {
    args: {
        token0: `0x${string}`;
        token1: `0x${string}`;
        fee: number;
        tickSpacing: number;
        pool: `0x${string}`;
    };
}

export class SwapV3Service {
    @Tool({
        name: "swapv3_add_liquidity",
        description: "Add liquidity to a V3 pool with specified price range"
    })
    async addLiquidity(walletClient: EVMWalletClient, parameters: AddLiquidityParams): Promise<string> {
        try {
            const dexConfig = DexManager.getDexConfig(parameters.chainId, parameters.dexName);

            // Approve tokens
            await walletClient.sendTransaction({
                to: parameters.token0 as `0x${string}`,
                abi: ERC20_ABI,
                functionName: "approve",
                args: [dexConfig.positionManager, BigInt(parameters.amount0Desired)]
            });

            await walletClient.sendTransaction({
                to: parameters.token1 as `0x${string}`,
                abi: ERC20_ABI,
                functionName: "approve",
                args: [dexConfig.positionManager, BigInt(parameters.amount1Desired)]
            });

            const result = await walletClient.sendTransaction({
                to: dexConfig.positionManager as `0x${string}`,
                abi: POSITION_MANAGER_ABI,
                functionName: "mint",
                args: [{
                    token0: parameters.token0,
                    token1: parameters.token1,
                    fee: parameters.fee,
                    tickLower: parameters.tickLower,
                    tickUpper: parameters.tickUpper,
                    amount0Desired: BigInt(parameters.amount0Desired),
                    amount1Desired: BigInt(parameters.amount1Desired),
                    amount0Min: BigInt(parameters.amount0Min),
                    amount1Min: BigInt(parameters.amount1Min),
                    recipient: parameters.recipient,
                    deadline: parameters.deadline
                }]
            });

            return result.hash;
        } catch (error) {
            throw new Error(`Failed to add liquidity: ${error}`);
        }
    }

    @Tool({
        name: "swapv3_remove_liquidity",
        description: "Remove liquidity from a V3 position"
    })
    async removeLiquidity(walletClient: EVMWalletClient, parameters: RemoveLiquidityParams): Promise<string> {
        try {
            const dexConfig = DexManager.getDexConfig(parameters.chainId, parameters.dexName);

            const result = await walletClient.sendTransaction({
                to: dexConfig.positionManager as `0x${string}`,
                abi: POSITION_MANAGER_ABI,
                functionName: "decreaseLiquidity",
                args: [{
                    tokenId: parameters.tokenId,
                    liquidity: BigInt(parameters.liquidity),
                    amount0Min: BigInt(parameters.amount0Min),
                    amount1Min: BigInt(parameters.amount1Min),
                    deadline: parameters.deadline
                }]
            });

            return result.hash;
        } catch (error) {
            throw new Error(`Failed to remove liquidity: ${error}`);
        }
    }

    @Tool({
        name: "swapv3_collect_fees",
        description: "Collect accumulated fees from a V3 position"
    })
    async collectFees(walletClient: EVMWalletClient, parameters: CollectFeesParams): Promise<string> {
        try {
            const dexConfig = DexManager.getDexConfig(parameters.chainId, parameters.dexName);

            const result = await walletClient.sendTransaction({
                to: dexConfig.positionManager as `0x${string}`,
                abi: POSITION_MANAGER_ABI,
                functionName: "collect",
                args: [{
                    tokenId: parameters.tokenId,
                    recipient: parameters.recipient,
                    amount0Max: BigInt(parameters.amount0Max),
                    amount1Max: BigInt(parameters.amount1Max)
                }]
            });

            return result.hash;
        } catch (error) {
            throw new Error(`Failed to collect fees: ${error}`);
        }
    }

    // @Tool({
    //     name: "swapv3_get_pools",
    //     description: "Get list of pools from the DEX with optional filters"
    // })
    // async getPools(walletClient: EVMWalletClient, parameters: GetPoolsParams): Promise<{pools: Pool[], total: number}> {
    //     try {
    //         const dexConfig = DexManager.getDexConfig(parameters.chainId, parameters.dexName);
    //         let pools: Pool[] = [];

    //         // If specific tokens are provided, get their pool
    //         if (parameters.token0 && parameters.token1 && parameters.fee) {
    //             const poolAddress = await walletClient.read({
    //                 address: dexConfig.factory as `0x${string}`,
    //                 abi: FACTORY_ABI,
    //                 functionName: "getPool",
    //                 args: [parameters.token0, parameters.token1, parameters.fee]
    //             });

    //             if (poolAddress.value !== "0x0000000000000000000000000000000000000000") {
    //                 const pool = await this.getPoolInfo(walletClient, poolAddress.value as `0x${string}`);
    //                 if (pool) pools.push(pool);
    //             }
                
    //             return { pools, total: pools.length };
    //         } else {
    //             // Get all pools by querying PoolCreated events
    //             const events = await walletClient.getLogs({
    //                 address: dexConfig.factory as `0x${string}`,
    //                 event: {
    //                     type: 'event',
    //                     name: 'PoolCreated',
    //                     inputs: [
    //                         { type: 'address', name: 'token0', indexed: true },
    //                         { type: 'address', name: 'token1', indexed: true },
    //                         { type: 'uint24', name: 'fee', indexed: true },
    //                         { type: 'int24', name: 'tickSpacing', indexed: false },
    //                         { type: 'address', name: 'pool', indexed: false }
    //                     ]
    //                 },
    //                 fromBlock: BigInt(parameters.fromBlock || '0'),
    //                 toBlock: parameters.toBlock === 'latest' ? 'latest' : BigInt(parameters.toBlock || '0')
    //             }) as PoolCreatedEvent[];

    //             // Process all events to get pool info
    //             const batchSize = 5;
    //             for (let i = 0; i < events.length; i += batchSize) {
    //                 const batch = events.slice(i, i + batchSize);
    //                 const poolPromises = batch.map(event => {
    //                     const poolAddress = event.args.pool;
    //                     return this.getPoolInfo(walletClient, poolAddress)
    //                         .catch(error => {
    //                             console.error(`Failed to get pool info for ${poolAddress}:`, error);
    //                             return null;
    //                         });
    //                 });
    //                 const poolResults = await Promise.all(poolPromises);
    //                 pools.push(...poolResults.filter((pool): pool is Pool => pool !== null));
    //             }

    //             // Apply filters
    //             if (parameters.minLiquidity) {
    //                 const minLiquidity = BigInt(parameters.minLiquidity);
    //                 pools = pools.filter(pool => pool.liquidity >= minLiquidity);
    //             }

    //             // Sort pools
    //             pools.sort((a, b) => {
    //                 let comparison = 0;
    //                 switch (parameters.sortBy) {
    //                     case 'liquidity':
    //                         comparison = Number(a.liquidity - b.liquidity);
    //                         break;
    //                     case 'createdAt':
    //                         // Use the pool address as a proxy for creation time
    //                         // Lower addresses were created earlier
    //                         comparison = a.address.localeCompare(b.address);
    //                         break;
    //                     default:
    //                         comparison = Number(a.liquidity - b.liquidity);
    //                 }
    //                 return parameters.sortOrder === 'desc' ? -comparison : comparison;
    //             });

    //             // Apply pagination
    //             const pageSize = parameters.pageSize || 10;
    //             const pageNumber = parameters.pageNumber || 1;
    //             const startIndex = (pageNumber - 1) * pageSize;
    //             const endIndex = startIndex + pageSize;
    //             const paginatedPools = pools.slice(startIndex, endIndex);

    //             return { 
    //                 pools: paginatedPools,
    //                 total: pools.length
    //             };
    //         }
    //     } catch (error) {
    //         throw new Error(`Failed to get pools: ${error}`);
    //     }
    // }

    @Tool({
        name: "swapv3_get_user_positions",
        description: "Get all liquidity positions for a user with optional filters"
    })
    async getUserPositions(walletClient: EVMWalletClient, parameters: GetUserPositionsParams): Promise<PositionInfo[]> {
        try {
            const dexConfig = DexManager.getDexConfig(parameters.chainId, parameters.dexName);
            const positions: PositionInfo[] = [];

            // Implementation would require indexing or graph queries for efficiency
            // This is a simplified version that would need to be expanded based on specific DEX capabilities

            return positions;
        } catch (error) {
            throw new Error(`Failed to get user positions: ${error}`);
        }
    }

    @Tool({
        name: "swapv3_swap_exact_input_single",
        description: "Swap an exact amount of input tokens for output tokens in a single pool. Returns a transaction hash on success. Once you get a transaction hash, the swap is complete - do not call this function again."
    })
    async swapExactInputSingle(walletClient: EVMWalletClient, parameters: ExactInputSingleParams): Promise<string> {
        try {
            const dexConfig = DexManager.getDexConfig(parameters.chainId, parameters.dexName);

            // Approve input token
            await walletClient.sendTransaction({
                to: parameters.tokenIn as `0x${string}`,
                abi: ERC20_ABI,
                functionName: "approve",
                args: [dexConfig.swapRouter, BigInt(parameters.amountIn)]
            });

            const result = await walletClient.sendTransaction({
                to: dexConfig.swapRouter as `0x${string}`,
                abi: SWAP_ROUTER_ABI,
                functionName: "exactInputSingle",
                args: [{
                    tokenIn: parameters.tokenIn,
                    tokenOut: parameters.tokenOut,
                    fee: parameters.fee,
                    recipient: parameters.recipient,
                    deadline: parameters.deadline,
                    amountIn: BigInt(parameters.amountIn),
                    amountOutMinimum: BigInt(parameters.amountOutMinimum),
                    sqrtPriceLimitX96: parameters.sqrtPriceLimitX96 ? BigInt(parameters.sqrtPriceLimitX96) : BigInt(0)
                }]
            });

            return result.hash;
        } catch (error) {
            throw new Error(`Failed to swap exact input single: ${error}`);
        }
    }

    @Tool({
        name: "swapv3_swap_exact_output_single",
        description: "Swap tokens for an exact amount of output tokens in a single pool"
    })
    async swapExactOutputSingle(walletClient: EVMWalletClient, parameters: ExactOutputSingleParams): Promise<string> {
        try {
            const dexConfig = DexManager.getDexConfig(parameters.chainId, parameters.dexName);

            // Approve input token
            await walletClient.sendTransaction({
                to: parameters.tokenIn as `0x${string}`,
                abi: ERC20_ABI,
                functionName: "approve",
                args: [dexConfig.swapRouter, BigInt(parameters.amountInMaximum)]
            });

            const result = await walletClient.sendTransaction({
                to: dexConfig.swapRouter as `0x${string}`,
                abi: SWAP_ROUTER_ABI,
                functionName: "exactOutputSingle",
                args: [{
                    tokenIn: parameters.tokenIn,
                    tokenOut: parameters.tokenOut,
                    fee: parameters.fee,
                    recipient: parameters.recipient,
                    deadline: parameters.deadline,
                    amountOut: BigInt(parameters.amountOut),
                    amountInMaximum: BigInt(parameters.amountInMaximum),
                    sqrtPriceLimitX96: parameters.sqrtPriceLimitX96 ? BigInt(parameters.sqrtPriceLimitX96) : BigInt(0)
                }]
            });

            return result.hash;
        } catch (error) {
            throw new Error(`Failed to swap exact output single: ${error}`);
        }
    }

    @Tool({
        name: "swapv3_swap_exact_input_multi",
        description: "Swap an exact amount of input tokens for output tokens through multiple pools"
    })
    async swapExactInputMulti(walletClient: EVMWalletClient, parameters: ExactInputParams): Promise<string> {
        try {
            const dexConfig = DexManager.getDexConfig(parameters.chainId, parameters.dexName);

            // Approve input token
            await walletClient.sendTransaction({
                to: parameters.path.tokenIn as `0x${string}`,
                abi: ERC20_ABI,
                functionName: "approve",
                args: [dexConfig.swapRouter, BigInt(parameters.amountIn)]
            });

            // Encode the path
            const path = this.encodePath(
                [parameters.path.tokenIn, ...parameters.path.intermediateTokens, parameters.path.tokenOut],
                parameters.path.fees
            );

            const result = await walletClient.sendTransaction({
                to: dexConfig.swapRouter as `0x${string}`,
                abi: SWAP_ROUTER_ABI,
                functionName: "exactInput",
                args: [{
                    path,
                    recipient: parameters.recipient,
                    deadline: parameters.deadline,
                    amountIn: BigInt(parameters.amountIn),
                    amountOutMinimum: BigInt(parameters.amountOutMinimum)
                }]
            });

            return result.hash;
        } catch (error) {
            throw new Error(`Failed to swap exact input multi: ${error}`);
        }
    }

    @Tool({
        name: "swapv3_swap_exact_output_multi",
        description: "Swap tokens for an exact amount of output tokens through multiple pools"
    })
    async swapExactOutputMulti(walletClient: EVMWalletClient, parameters: ExactOutputParams): Promise<string> {
        try {
            const dexConfig = DexManager.getDexConfig(parameters.chainId, parameters.dexName);

            // Approve input token for maximum amount
            await walletClient.sendTransaction({
                to: parameters.path.tokenIn as `0x${string}`,
                abi: ERC20_ABI,
                functionName: "approve",
                args: [dexConfig.swapRouter, BigInt(parameters.amountInMaximum)]
            });

            // Encode the path (reverse for exactOutput)
            const path = this.encodePath(
                [parameters.path.tokenOut, ...parameters.path.intermediateTokens.reverse(), parameters.path.tokenIn],
                parameters.path.fees.reverse()
            );

            const result = await walletClient.sendTransaction({
                to: dexConfig.swapRouter as `0x${string}`,
                abi: SWAP_ROUTER_ABI,
                functionName: "exactOutput",
                args: [{
                    path,
                    recipient: parameters.recipient,
                    deadline: parameters.deadline,
                    amountOut: BigInt(parameters.amountOut),
                    amountInMaximum: BigInt(parameters.amountInMaximum)
                }]
            });

            return result.hash;
        } catch (error) {
            throw new Error(`Failed to swap exact output multi: ${error}`);
        }
    }

    @Tool({
        name: "swapv3_get_quote",
        description: "Get a quote for a swap between two tokens"
    })
    async getQuote(walletClient: EVMWalletClient, parameters: GetQuoteParams): Promise<string> {
        try {
            const dexConfig = DexManager.getDexConfig(parameters.chainId, parameters.dexName);

            const quote = await walletClient.read({
                address: dexConfig.quoter as `0x${string}`,
                abi: QUOTER_ABI,
                functionName: "quoteExactInputSingle",
                args: [
                    parameters.tokenIn,
                    parameters.tokenOut,
                    parameters.fee,
                    BigInt(parameters.amount),
                    parameters.sqrtPriceLimitX96 ? BigInt(parameters.sqrtPriceLimitX96) : BigInt(0)
                ]
            });

            return quote.toString();
        } catch (error) {
            throw new Error(`Failed to get quote: ${error}`);
        }
    }

    private async getPoolInfo(walletClient: EVMWalletClient, poolAddress: string): Promise<Pool> {
        const [token0, token1, fee, slot0, liquidity] = await Promise.all([
            walletClient.read({
                address: poolAddress as `0x${string}`,
                abi: POOL_ABI,
                functionName: "token0"
            }),
            walletClient.read({
                address: poolAddress as `0x${string}`,
                abi: POOL_ABI,
                functionName: "token1"
            }),
            walletClient.read({
                address: poolAddress as `0x${string}`,
                abi: POOL_ABI,
                functionName: "fee"
            }),
            walletClient.read({
                address: poolAddress as `0x${string}`,
                abi: POOL_ABI,
                functionName: "slot0"
            }),
            walletClient.read({
                address: poolAddress as `0x${string}`,
                abi: POOL_ABI,
                functionName: "liquidity"
            })
        ]);

        const [token0Info, token1Info] = await Promise.all([
            this.getTokenInfo(walletClient, token0.value as string),
            this.getTokenInfo(walletClient, token1.value as string)
        ]);

        // Calculate current prices
        const sqrtPriceX96: bigint = slot0.value[0] as any;
        const Q96 = BigInt(2) ** BigInt(96);
        const token0Price = Number( (sqrtPriceX96 * sqrtPriceX96 * BigInt(10 ** token1Info.decimals)) / (Q96 * Q96 * BigInt(10 ** token0Info.decimals)));
        const token1Price = 1 / token0Price;

        // // Get block number for createdAt
        // const block = await walletClient.getBlock();
        // const createdAt = Number(block.number);

        // Calculate TVL in terms of token0 and token1
        const token0Amount = Number(liquidity.value) * (1.0001 ** (slot0.value[1] / 2)) / (10 ** token0Info.decimals);
        const token1Amount = Number(liquidity.value) * (1.0001 ** (-slot0.value[1] / 2)) / (10 ** token1Info.decimals);

        // For now, we'll set TVL in USD as null since we don't have price feeds
        // In a real implementation, we would use price feeds to get token prices in USD
        const tvlUSD = null;

        return {
            token0: token0Info,
            token1: token1Info,
            fee: Number(fee.value),
            tickSpacing: this.getTickSpacing(Number(fee.value)),
            sqrtPriceX96: slot0.value[0],
            liquidity: liquidity.value as bigint,
            tick: slot0.value[1],
            address: poolAddress,
            // createdAt,
            tvlUSD,
            token0Price,
            token1Price,
            volume24h: null,  // Would require event logs analysis
            feesUSD24h: null // Would require event logs analysis
        };
    }

    private async getTokenInfo(walletClient: EVMWalletClient, tokenAddress: string): Promise<any> {
        // Implementation for getting token details
        // Would include decimals, symbol, name, etc.
        return {};
    }

    private getTickSpacing(fee: number): number {
        switch (fee) {
            case 100: return 1;
            case 500: return 10;
            case 3000: return 60;
            case 10000: return 200;
            default: throw new Error(`Invalid fee amount: ${fee}`);
        }
    }

    private encodePath(path: string[], fees: number[]): string {
        if (path.length !== fees.length + 1) {
            throw new Error('path/fee lengths do not match');
        }

        let encoded = '0x';
        for (let i = 0; i < fees.length; i++) {
            encoded += path[i].slice(2);
            encoded += fees[i].toString(16).padStart(6, '0');
        }
        encoded += path[path.length - 1].slice(2);

        return encoded as `0x${string}`;
    }
}
