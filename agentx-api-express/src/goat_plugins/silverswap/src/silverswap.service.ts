import { Tool } from "@goat-sdk/core";
import { EVMWalletClient } from "@goat-sdk/wallet-evm";
import { parseUnits } from "viem";
import { encodeAbiParameters } from "viem";
import { ERC20_ABI } from "./abi/erc20";
import { FACTORY_ABI } from "./abi/factory";
import { POOL_ABI } from "./abi/pool";
import { POSITION_MANAGER_ABI } from "./abi/positionManager";
import { SWAP_ROUTER_ABI } from "./abi/swaprouter";
import {
    BurnParams,
    CollectParams,
    DecreaseLiquidityParams,
    ExactInputParams,
    ExactInputSingleParams,
    ExactOutputParams,
    ExactOutputSingleParams,
    GetSwapRouterAddressParams,
    IncreaseLiquidityParams,
    MintParams,
} from "./parameters";


// async resolveAddress(address: string) {
//     if (/^0x[a-fA-F0-9]{40}$/.test(address)) return address as `0x${string}`;

//     try {
//         const resolvedAddress = (await this.publicClient.getEnsAddress({
//             name: normalize(address),
//         })) as `0x${string}`;
//         if (!resolvedAddress) {
//             throw new Error("ENS name could not be resolved.");
//         }
//         return resolvedAddress as `0x${string}`;
//     } catch (error) {
//         throw new Error(`Failed to resolve ENS name: ${error}`);
//     }
// }
// // Silverswap - SonicBlaze
// const SWAP_ROUTER_ADDRESS = "0x0Bb909b7c3817F8fB7188e8fbaA2763028956E30";
// const POSITION_MANAGER_ADDRESS = "0xEcA3eDfD09435C2C7D2583124ca9a44f82aF1e8b";
// const FACTORY_ADDRESS = "0x9C5Dd70D98e9B321217e8232235e25E64E78C595";

//Silverswap - Sonic
const SWAP_ROUTER_ADDRESS = "0x4882198dd2064D1E35b24735e6B9E5e3B45AcD6b";
const POSITION_MANAGER_ADDRESS = "0x5084E9fDF9264489A14E77c011073D757e572bB4";
const FACTORY_ADDRESS = "0xb860200BD68dc39cEAfd6ebb82883f189f4CdA76";

export class SilverSwapService {
    @Tool({
        name: "silverswap_get_swap_router_address",
        description: "Get the address of the swap router",
    })
    async getSwapRouterAddress(parameters: GetSwapRouterAddressParams) {
        return SWAP_ROUTER_ADDRESS;
    }

    @Tool({
        name: "silverswap_swap_exact_input_single_hop",
        description:
            "Swap an exact amount of input tokens for an output token in a single hop. Have the token amounts in their base units. Don't need to approve the swap router for the output token. User will have sufficient balance of the input token. The swap router address is already provided in the function. Returns a transaction hash on success. Once you get a transaction hash, the swap is complete - do not call this function again.",
    })
    async swapExactInputSingleHop(walletClient: EVMWalletClient, parameters: ExactInputSingleParams) {
        console.log('Starting exact single input')
        try {
            const approvalHash = await walletClient.sendTransaction({
                to: parameters.tokenInAddress as `0x${string}`,
                abi: ERC20_ABI,
                functionName: "approve",
                args: [SWAP_ROUTER_ADDRESS, parameters.amountIn],
            });

            console.log('Approvehash::', approvalHash)



            const timestamp = Math.floor(Date.now() / 1000) + parameters.deadline;

            console.log('Final args:',  [
                {
                    tokenIn: parameters.tokenInAddress,
                    tokenOut: parameters.tokenOutAddress,
                    recipient: walletClient.getAddress(),
                    deadline: timestamp,
                    amountIn: parameters.amountIn,
                    amountOutMinimum: parameters.amountOutMinimum,
                    limitSqrtPrice: parameters.limitSqrtPrice,
                },
            ])

            const hash = await walletClient.sendTransaction({
                to: SWAP_ROUTER_ADDRESS,
                abi: SWAP_ROUTER_ABI,
                functionName: "exactInputSingle",
                args: [
                    {
                        tokenIn: parameters.tokenInAddress,
                        tokenOut: parameters.tokenOutAddress,
                        recipient: walletClient.getAddress(),
                        deadline: timestamp,
                        amountIn: parameters.amountIn,
                        amountOutMinimum: parameters.amountOutMinimum,
                        limitSqrtPrice: parameters.limitSqrtPrice,
                    },
                ],
            });

            console.log('Submitted txn::', hash)

            return hash.hash;
        } catch (error) {
            console.error('swap_exact_input_single_hop Error: ', error )// error
            throw Error(`Failed to swap exact input single hop: ${error}`);

        }
    }

    @Tool({
        name: "silverswap_swap_exact_output_single_hop",
        description:
            "Swap an exact amount of output tokens for a single hop. Have the token amounts in their base units. Don't need to approve the swap router for the output token. User will have sufficient balance of the input token. The swap router address is already provided in the function. Returns a transaction hash on success. Once you get a transaction hash, the swap is complete - do not call this function again.",
    })
    async swapExactOutputSingleHop(
        walletClient: EVMWalletClient,
        parameters: ExactOutputSingleParams,
    ): Promise<string> {
        try {
            const tokenIn = parameters.tokenInAddress;
            const tokenOut = parameters.tokenOutAddress;

            const amountOut = parameters.amountOut;
            const amountInMaximum = parameters.amountInMaximum;
            const limitSqrtPrice = parameters.limitSqrtPrice;
            const timestamp = Math.floor(Date.now() / 1000) + parameters.deadline;

            const approvalHash = await walletClient.sendTransaction({
                to: parameters.tokenInAddress as `0x${string}`,
                abi: ERC20_ABI,
                functionName: "approve",
                args: [SWAP_ROUTER_ADDRESS, amountInMaximum],
            });

            const hash = await walletClient.sendTransaction({
                to: SWAP_ROUTER_ADDRESS,
                abi: SWAP_ROUTER_ABI,
                functionName: "exactOutputSingle",
                args: [
                    {
                        tokenIn: tokenIn,
                        tokenOut: tokenOut,
                        recipient: walletClient.getAddress(),
                        deadline: timestamp,
                        amountOut: amountOut,
                        amountInMaximum: amountInMaximum,
                        limitSqrtPrice: limitSqrtPrice,
                    },
                ],
            });

            return hash.hash;
        } catch (error) {
            throw Error(`Failed to swap exact output single hop: ${error}`);
        }
    }

    @Tool({
        name: "silverswap_swap_exact_input_multi_hop",
        description: "Swap an exact amount of input tokens in multiple hops",
    })
    async swapExactInputMultiHop(walletClient: EVMWalletClient, parameters: ExactInputParams): Promise<string> {
        try {
            const recipient = parameters.recipient as `0x${string}`;// await walletClient.resolveAddress(parameters.recipient);

            // Get first and last token decimals
            const tokenInDecimals = Number(
                await walletClient.read({
                    address: parameters.path.tokenIn as `0x${string}`,
                    abi: ERC20_ABI,
                    functionName: "decimals",
                }),
            );

            const tokenOutDecimals = Number(
                await walletClient.read({
                    address: parameters.path.tokenOut as `0x${string}`,
                    abi: ERC20_ABI,
                    functionName: "decimals",
                }),
            );

            // Encode the path
            const encodedPath = encodeAbiParameters(
                [{ type: "address[]" }, { type: "uint24[]" }],
                [
                    [
                        parameters.path.tokenIn as `0x${string}`,
                        ...parameters.path.intermediateTokens.map((t: string) => t as `0x${string}`),
                        parameters.path.tokenOut as `0x${string}`,
                    ],
                    parameters.path.fees,
                ],
            );

            const hash = await walletClient.sendTransaction({
                to: SWAP_ROUTER_ADDRESS,
                abi: SWAP_ROUTER_ABI,
                functionName: "exactInput",
                args: [
                    encodedPath,
                    recipient,
                    parameters.deadline,
                    parseUnits(parameters.amountIn, tokenInDecimals),
                    parseUnits(parameters.amountOutMinimum, tokenOutDecimals),
                ],
            });

            return hash.hash;
        } catch (error) {
            throw new Error(`Failed to swap: ${error}`);
        }
    }

    @Tool({
        name: "silverswap_swap_exact_output_multi_hop",
        description: "Swap tokens to receive an exact amount of output tokens in multiple hops",
    })
    async swapExactOutputMultiHop(walletClient: EVMWalletClient, parameters: ExactOutputParams): Promise<string> {
        try {
            const recipient = parameters.recipient as `0x${string}`;// await walletClient.resolveAddress(parameters.recipient);

            // Get first and last token decimals
            const tokenInDecimals = Number(
                await walletClient.read({
                    address: parameters.path.tokenIn as `0x${string}`,
                    abi: ERC20_ABI,
                    functionName: "decimals",
                }),
            );

            const tokenOutDecimals = Number(
                await walletClient.read({
                    address: parameters.path.tokenOut as `0x${string}`,
                    abi: ERC20_ABI,
                    functionName: "decimals",
                }),
            );

            // Encode the path
            const encodedPath = encodeAbiParameters(
                [{ type: "address[]" }, { type: "uint24[]" }],
                [
                    [
                        parameters.path.tokenIn as `0x${string}`,
                        ...parameters.path.intermediateTokens.map((t: string) => t as `0x${string}`),
                        parameters.path.tokenOut as `0x${string}`,
                    ],
                    parameters.path.fees,
                ],
            );

            const hash = await walletClient.sendTransaction({
                to: SWAP_ROUTER_ADDRESS,
                abi: SWAP_ROUTER_ABI,
                functionName: "exactOutput",
                args: [
                    encodedPath,
                    recipient,
                    parameters.deadline,
                    parseUnits(parameters.amountOut, tokenOutDecimals),
                    parseUnits(parameters.amountInMaximum, tokenInDecimals),
                ],
            });

            return hash.hash;
        } catch (error) {
            throw new Error(`Failed to swap: ${error}`);
        }
    }

    @Tool({
        name: "silverswap_mint_position",
        description:
            "Mint a new liquidity position in a pool. Returns a transaction hash on success. Once you get a transaction hash, the mint is complete - do not call this function again.",
    })
    async mintPosition(walletClient: EVMWalletClient, parameters: MintParams): Promise<string> {
        try {
            const tickSpacing = 60;

            // First determine token order
            const isOrderMatched = parameters.token0Address.toLowerCase() < parameters.token1Address.toLowerCase();

            // Set tokens and amounts in correct order
            const [token0, token1] = isOrderMatched
                ? [parameters.token0Address, parameters.token1Address]
                : [parameters.token1Address, parameters.token0Address];

            const [amount0Raw, amount1Raw] = isOrderMatched
                ? [parameters.amount0Desired, parameters.amount1Desired]
                : [parameters.amount1Desired, parameters.amount0Desired];

            const poolAddressResult = await walletClient.read({
                address: FACTORY_ADDRESS as `0x${string}`,
                abi: FACTORY_ABI,
                functionName: "poolByPair",
                args: [token0, token1],
            });
            const poolAddress = (poolAddressResult as { value: string }).value;

            const globalState = await walletClient.read({
                address: poolAddress as `0x${string}`,
                abi: POOL_ABI,
                functionName: "globalState",
            });

           
            

            
            // biome-ignore lint/suspicious/noExplicitAny: value is any
            const globalStateArray = (globalState as { value: any[] }).value;
            
            if (globalStateArray[0] === BigInt(0)) {
                console.log("Initializing pool...");
                const initHash = await walletClient.sendTransaction({
                    to: poolAddress as `0x${string}`,
                    abi: POOL_ABI,
                    functionName: "initialize",
                    args: [BigInt (2 ** 96).toString()],
                });
                
            }else{
                console.log("Using Initialized Pool at:", poolAddress, globalStateArray[0]);
            }
            const currentTick = Number.parseInt(globalStateArray[1].toString());

            // Calculate nearest tick that's divisible by spacing
            const nearestTick = Math.floor(currentTick / tickSpacing) * tickSpacing;

            // Use provided ticks if they exist and are valid numbers
            const tickLower = nearestTick - tickSpacing * 10; // 600 ticks below
            const tickUpper = nearestTick + tickSpacing * 10; // 600 ticks above

            const approvalHash0 = await walletClient.sendTransaction({
                to: token0 as `0x${string}`,
                abi: ERC20_ABI,
                functionName: "approve",
                args: [POSITION_MANAGER_ADDRESS, amount0Raw],
            });

            const approvalHash1 = await walletClient.sendTransaction({
                to: token1 as `0x${string}`,
                abi: ERC20_ABI,
                functionName: "approve",
                args: [POSITION_MANAGER_ADDRESS, amount1Raw],
            });

            // Add timestamp calculation
            const timestamp = Math.floor(Date.now() / 1000) + parameters.deadline;

            const hash = await walletClient.sendTransaction({
                to: POSITION_MANAGER_ADDRESS,
                abi: POSITION_MANAGER_ABI,
                functionName: "mint",
                args: [
                    {
                        token0,
                        token1,
                        tickLower: tickLower,
                        tickUpper: tickUpper,
                        amount0Desired: amount0Raw,
                        amount1Desired: amount1Raw,
                        amount0Min: 0,
                        amount1Min: 0,
                        recipient: walletClient.getAddress(),
                        deadline: timestamp,
                    },
                ],
            });

            return hash.hash;
        } catch (error) {
            throw new Error(`Failed to mint position: ${error}`);
        }
    }

    @Tool({
        name: "silverswap_increase_liquidity",
        description:
            "Increase liquidity in an existing position. Returns a transaction hash on success. Once you get a transaction hash, the increase is complete - do not call this function again.",
    })
    async increaseLiquidity(walletClient: EVMWalletClient, parameters: IncreaseLiquidityParams): Promise<string> {
        try {
            // Set tokens and amounts in correct order
            const isOrderMatched = parameters.token0Address.toLowerCase() < parameters.token1Address.toLowerCase();

            const [token0, token1] = isOrderMatched
                ? [parameters.token0Address, parameters.token1Address]
                : [parameters.token1Address, parameters.token0Address];

            const [amount0Raw, amount1Raw] = isOrderMatched
                ? [parameters.amount0Desired, parameters.amount1Desired]
                : [parameters.amount1Desired, parameters.amount0Desired];

            const approvalHash0 = await walletClient.sendTransaction({
                to: token0 as `0x${string}`,
                abi: ERC20_ABI,
                functionName: "approve",
                args: [POSITION_MANAGER_ADDRESS, amount0Raw],
            });

            const approvalHash1 = await walletClient.sendTransaction({
                to: token1 as `0x${string}`,
                abi: ERC20_ABI,
                functionName: "approve",
                args: [POSITION_MANAGER_ADDRESS, amount1Raw],
            });

            // Calculate deadline as current time + deadline seconds
            const timestamp = Math.floor(Date.now() / 1000) + 60; // 60 seconds from now

            const hash = await walletClient.sendTransaction({
                to: POSITION_MANAGER_ADDRESS,
                abi: POSITION_MANAGER_ABI,
                functionName: "increaseLiquidity",
                args: [
                    {
                        tokenId: parameters.tokenId,
                        amount0Desired: amount0Raw,
                        amount1Desired: amount1Raw,
                        amount0Min: BigInt(0),
                        amount1Min: BigInt(0),
                        deadline: timestamp,
                    },
                ],
            });

            return hash.hash;
        } catch (error) {
            throw new Error(`Failed to increase liquidity: ${error}`);
        }
    }

    @Tool({
        name: "silverswap_decrease_liquidity",
        description:
            "Decrease liquidity in an existing position by specifying a percentage (0-100). Returns a transaction hash on success. Once you get a transaction hash, the decrease is complete - do not call this function again.",
    })
    async decreaseLiquidity(walletClient: EVMWalletClient, parameters: DecreaseLiquidityParams): Promise<string> {
        try {
            // Get position info
            const positionResult = await walletClient.read({
                address: POSITION_MANAGER_ADDRESS as `0x${string}`,
                abi: POSITION_MANAGER_ABI,
                functionName: "positions",
                args: [parameters.tokenId],
            });

            // biome-ignore lint/suspicious/noExplicitAny: value is any
            const position = (positionResult as { value: any[] }).value;

            const currentLiquidity = position[6];
            const liquidityToRemove = (currentLiquidity * BigInt(parameters.percentage)) / BigInt(100);

            // Set min amounts to 0 for now
            const amount0Min = BigInt(0);
            const amount1Min = BigInt(0);

            const timestamp = Math.floor(Date.now() / 1000) + 60;

            const hash = await walletClient.sendTransaction({
                to: POSITION_MANAGER_ADDRESS,
                abi: POSITION_MANAGER_ABI,
                functionName: "decreaseLiquidity",
                args: [
                    {
                        tokenId: parameters.tokenId,
                        liquidity: liquidityToRemove,
                        amount0Min: amount0Min,
                        amount1Min: amount1Min,
                        deadline: timestamp,
                    },
                ],
            });

            return hash.hash;
        } catch (error) {
            throw new Error(`Failed to decrease liquidity: ${error}`);
        }
    }

    @Tool({
        name: "silverswap_collect",
        description:
            "Collect all available tokens from a liquidity position. Can be rewards or tokens removed from a liquidity position. So, should be called after decreasing liquidity as well as on its own.",
    })
    async collect(walletClient: EVMWalletClient, parameters: CollectParams): Promise<string> {
        try {
            const recipient = walletClient.getAddress();
            // Use max uint128 to collect all available tokens
            const maxUint128 = BigInt(2 ** 128) - BigInt(1);

            const hash = await walletClient.sendTransaction({
                to: POSITION_MANAGER_ADDRESS,
                abi: POSITION_MANAGER_ABI,
                functionName: "collect",
                args: [
                    {
                        tokenId: parameters.tokenId,
                        recipient,
                        amount0Max: maxUint128,
                        amount1Max: maxUint128,
                    },
                ],
            });

            return hash.hash;
        } catch (error) {
            throw new Error(`Failed to collect: ${error}`);
        }
    }

    @Tool({
        name: "silverswap_burn",
        description: "Burn a liquidity position NFT after all tokens have been collected.",
    })
    async burn(walletClient: EVMWalletClient, parameters: BurnParams): Promise<string> {
        try {
            const hash = await walletClient.sendTransaction({
                to: POSITION_MANAGER_ADDRESS,
                abi: POSITION_MANAGER_ABI,
                functionName: "burn",
                args: [parameters.tokenId],
            });

            return hash.hash;
        } catch (error) {
            throw new Error(`Failed to burn position: ${error}`);
        }
    }
}
