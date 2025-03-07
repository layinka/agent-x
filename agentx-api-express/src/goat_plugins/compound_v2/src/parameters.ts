import { createToolParameters } from "@goat-sdk/core";
import { z } from "zod";

export class SupplyAssetParameters extends createToolParameters(
    z.object({
        
        asset: z.string().describe("The asset to supply (e.g. SONIC, USDC, DAI)"),
        amount: z.string().describe("The amount to supply in human units"),
    }),
) {}

export class RedeemAssetParameters extends createToolParameters(
    z.object({
        
        cTokenAsset: z.string().describe("The cToken to redeem (e.g. cSONIC, cUSDC, cDAI)"),
        amount: z.string().describe("The amount to supply in human units"),
    }),
) {}

export class EnterMarketParameters extends createToolParameters(
    z.object({
        assets: z.array(z.string()).describe("The assets to use as Collateral (e.g. SONIC, USDC, DAI)"),
        
    }),
) {}

export class BorrowAssetParameters extends createToolParameters(
    z.object({
        asset: z.string().describe("The asset to borrow (e.g. USDC, DAI)"),
        amount: z.string().describe("The amount to borrow in base units"),
    }),
) {}

export class RepayLoanParameters extends createToolParameters(
    z.object({
        cTokenAsset: z.string().describe("The asset to repay loan for (e.g. cUSDC, cDAI)"),
        amount: z.string().describe("The amount to borrow in base units"),
    }),
) {}

export class GetHealthMetricsParameters extends createToolParameters(z.object({})) {}

export class LoopAssetParameters extends createToolParameters(
    z.object({
        asset: z.string().describe("The asset to loop (e.g. ionWeETH, iondMBTC)"),
        initialAmount: z.string().describe("Initial amount to supply"),
        targetltv: z.string().describe("Target Loan-to-Value ratio"),
        maxIterations: z.number().optional().describe("Maximum number of loop iterations"),
    }),
) {}

export class SwapCollateralParameters extends createToolParameters(
    z.object({
        fromAsset: z.string().describe("Asset to swap from"),
        toAsset: z.string().describe("Asset to swap to"),
        amount: z.string().describe("Amount to swap"),
    }),
) {}

export class GetPoolDataParameters extends createToolParameters(
    z.object({
        poolId: z.string().describe("The pool ID to get data for"),
    }),
) {}

export class GetPoolAssetsParameters extends createToolParameters(
    z.object({
        poolId: z.string().describe("The pool ID to get assets for"),
    }),
) {}

export class GetPoolRatesParameters extends createToolParameters(
    z.object({
        poolId: z.string().describe("The pool ID to get rates for"),
        asset: z.string().describe("The asset to get rates for (e.g. ionUSDC, ionWETH)"),
    }),
) {}

export class GetUserPositionParameters extends createToolParameters(
    z.object({
        poolId: z.string().describe("The pool ID to get position for"),
        user: z.string().describe("The user address to get position for"),
    }),
) {}
