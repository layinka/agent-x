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