import { createToolParameters } from '@goat-sdk/core';
import { z } from 'zod';

export class ProtocolListingParameters extends createToolParameters(
  z.object({
    sort: z
      .enum([
        'protocol',
        'name',
        'version',
        'rewards',
        'lockup_period',
        'minStake',
        'maxStake',
        'totalStaked',
        'securityAudit',
        'insuranceCoverage',
        'stakingAddress',
        'rewardAddress',
      ])
      .optional()
      .default('protocol')
      .describe(''),
  }),
) {}

export class GetDefiPoolsByChainParameters extends createToolParameters(
  z.object({
      chain: z.string().describe("Chain (e.g., 'sonic')"),
      
  }),
) {}

export class GetAllPoolsParameters extends createToolParameters(
  z.object({
    chainName: z.string().describe('Name of the blockchain network'),
    apy: z.number().describe('Minimum Annual Percentage Yield (APY)'),
    tvlUsd: z.number().describe('Minimum Total Value Locked in USD'),
    rewardTokens: z.array(z.string()).describe('List of reward token symbols'),
    ilRisk: z.enum(['low', 'medium', 'high']).describe('Impermanent Loss risk level'),
    exposure: z.enum(['single', 'multi']).describe('Type of exposure'),
    stableCoin: z.boolean().describe('Filter for stablecoin pools'),
  }),
) {}

export class FilterByApyParameters extends createToolParameters(
  z.object({
    apy: z.number().describe('Minimum Annual Percentage Yield (APY) threshold'),
  }),
) {}

export class FilterByTvlParameters extends createToolParameters(
  z.object({
    tvl: z.number().describe('Minimum Total Value Locked in USD'),
  }),
) {}

export class FilterByRewardTokensParameters extends createToolParameters(
  z.object({
    rewardTokens: z.array(z.string()).describe('List of reward token symbols to filter by'),
  }),
) {}

export class FilterByIlRiskParameters extends createToolParameters(
  z.object({
    ilRisk: z.enum(['low', 'medium', 'high']).describe('Risk level'),
  }),
) {}

export class FilterByExposureParameters extends createToolParameters(
  z.object({
    exposure: z.enum(['single', 'multi']).describe('Exposure type'),
  }),
) {}

export class FilterByStablecoinParameters extends createToolParameters(
  z.object({
    stablecoin: z.boolean().describe('Whether to filter for stablecoin pools'),
  }),
) {}

export class FilterByOutlierParameters extends createToolParameters(
  z.object({
    outlier: z.boolean().describe('Whether to include outlier pools'),
  }),
) {}

export class FilterByUnderlyingTokensParameters extends createToolParameters(
  z.object({
    underlyingTokens: z.array(z.string()).describe('List of underlying token symbols to filter by'),
  }),
) {}

export class FilterByVolume1dParameters extends createToolParameters(
  z.object({
    volume1d: z.number().describe('Minimum 1-day volume in USD'),
  }),
) {}

export class FilterByVolume7dParameters extends createToolParameters(
  z.object({
    volume7d: z.number().describe('Minimum 7-day volume in USD'),
  }),
) {}