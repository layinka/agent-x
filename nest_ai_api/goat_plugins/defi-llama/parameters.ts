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
