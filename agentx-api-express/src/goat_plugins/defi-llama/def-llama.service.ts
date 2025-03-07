import { Tool } from '@goat-sdk/core';
import { DefiLlamaApi } from './api';
import {
  filterPoolByAllField,
  filterPoolByApy,
  filterPoolByChain,
  filterPoolByExposure,
  filterPoolByIlRisk,
  filterPoolByOutlier,
  // filterPoolByPrediction,
  filterPoolByRewardTokens,
  filterPoolByStableCoin,
  filterPoolByTvl,
  filterPoolByUnderlyingTokens,
  filterPoolByVolume1d,
  filterPoolByVolume7d,
} from './filters';
import { GetDefiPoolsByChainParameters } from './parameters';

export class DefiLlamaService {
  private readonly api: DefiLlamaApi;

  constructor() {
    this.api = new DefiLlamaApi();
  }
  // @Tool({
  //   name: 'defillama_get_all_pools',
  //   description: 'Get List of all DefiLlama Pools',
  // })
  // async fetchAndFilterByAll(
  //   chainName: string,
  //   apy: number,
  //   tvlUsd: number,
  //   rewardTokens: any,
  //   ilRisk: string,
  //   exposure: string,
  //   stableCoin: boolean,
  // ) {
  //   try {
  //     const pools = await this.api.makeYieldsRequest('/pools');
  //     return filterPoolByAllField(
  //       pools,
  //       chainName,
  //       apy,
  //       tvlUsd,
  //       rewardTokens,
  //       ilRisk,
  //       exposure,
  //       stableCoin,
  //     );
  //   } catch (error) {
  //     console.error('Failed to fetch or filter pools: ', error);
  //     throw error;
  //   }
  // }

  @Tool({
    name: 'defillama_filter_defi_pools_by_chain',
    description: 'Fetch Defi Llama Pools by Chain',
  })
  async fetchAndFilterPoolsBychain(parameters: GetDefiPoolsByChainParameters): Promise<any[]> {
    const {chain: chainName}= parameters;
    try {
      const pools = await this.api.makeYieldsRequest('/pools');
      // console.log('pools: ', pools)
      return filterPoolByChain(pools, chainName);

    } catch (error) {
      console.error('Failed to fetch or filter pools: ', error);
      throw error;
    }
  }

  // @Tool({
  //   name: 'fetch_defi_llama_by_apy',
  //   description: 'Fetch Defi Llama Pools',
  // })
  // async fetchAndFilterPoolByApy(apy: number): Promise<any[]> {
  //   try {
  //     const pools = await this.api.makeYieldsRequest('/pools');
  //     return filterPoolByApy(pools, apy);
  //   } catch (error) {
  //     console.error('Failed to fetch or filter pools: ', error);
  //     throw error;
  //   }
  // }

  // @Tool({
  //   name: 'fetch_defi_llama_by_tvl',
  //   description: 'Fetch Defi Llama Pools',
  // })
  // async fetchAndfilterPoolByTvl(tvl: number): Promise<any[]> {
  //   try {
  //     const pools = await this.api.makeYieldsRequest('/pools');
  //     return filterPoolByTvl(pools, tvl);
  //   } catch (error) {
  //     console.error('Failed to fetch or filter pools: ', error);
  //     throw error;
  //   }
  // }

  // @Tool({
  //   name: 'fetch_defi_llama_by_reward_tokens',
  //   description: 'Fetch Defi Llama Pools',
  // })
  // async fetchAndFilterPoolByRewardTokens(rewardTokens: any): Promise<any[]> {
  //   try {
  //     const pool = await this.api.makeYieldsRequest('/pools');
  //     return filterPoolByRewardTokens(pool, rewardTokens);
  //   } catch (error) {
  //     console.error('Failed to fetch or filter pools: ', error);
  //     throw error;
  //   }
  // }

  // @Tool({
  //   name: 'fetch_defi_llama_by_ilrisk',
  //   description: 'Fetch Defi Llama Pools',
  // })
  // async fetchAndFilterPoolByIlRisk(ilRisk: string): Promise<any[]> {
  //   try {
  //     const pool = await this.api.makeYieldsRequest('/pools');
  //     return filterPoolByIlRisk(pool, ilRisk);
  //   } catch (error) {
  //     console.error('Failed to fetch or filter pools: ', error);
  //     throw error;
  //   }
  // }

  // @Tool({
  //   name: 'fetch_defi_llama_by_exposure',
  //   description: 'Fetch Defi Llama Pools',
  // })
  // async fetchAnFilterPoolByExposure(exposure: string): Promise<any[]> {
  //   try {
  //     const pool = await this.api.makeYieldsRequest('/pools');
  //     return filterPoolByExposure(pool, exposure);
  //   } catch (error) {
  //     console.error('Failed to fetch or filter pools: ', error);
  //     throw error;
  //   }
  // }

  // @Tool({
  //   name: 'fetch_defi_llama_by_stablecoin',
  //   description: 'Fetch Defi Llama Pools',
  // })
  // async fetcAndFilterpoolByStablecoin(stablecoin: boolean): Promise<any[]> {
  //   try {
  //     const pool = await this.api.makeYieldsRequest('/pools');
  //     return filterPoolByStableCoin(pool, stablecoin);
  //   } catch (error) {
  //     console.error('Failed to fetch or filter pools: ', error);
  //     throw error;
  //   }
  // }

  // // @Tool({
  // //   name: 'fetch_defi_llama_pools',
  // //   description: 'Fetch Defi Llama Pools',
  // // })
  // // async fetcAndFilterpoolByPredictions(predictions: any): Promise<any[]> {
  // //     try {
  // //         const pool = await this.api.makeYieldsRequest("/pools");
  // //         return filterPoolByStableCoin(pool, predictions);
  // //     } catch (error) {
  // //         console.error("Failed to fetch or filter pools: ", error);
  // //         throw error;
  // //     }
  // // }

  // @Tool({
  //   name: 'fetch_defi_llama_by_outlier',
  //   description: 'Fetch Defi Llama Pools',
  // })
  // async fetcAndFilterpoolByOutlier(outlier: boolean): Promise<any[]> {
  //   try {
  //     const pool = await this.api.makeYieldsRequest('/pools');
  //     return filterPoolByOutlier(pool, outlier);
  //   } catch (error) {
  //     console.error('Failed to fetch or filter pools: ', error);
  //     throw error;
  //   }
  // }

  // @Tool({
  //   name: 'fetch_defi_llama_by_underlying_tokens',
  //   description: 'Fetch Defi Llama Pools',
  // })
  // async fetcAndFilterpoolByUnderlyingTokens(
  //   underlyingTokens: any,
  // ): Promise<any[]> {
  //   try {
  //     const pool = await this.api.makeYieldsRequest('/pools');
  //     return filterPoolByUnderlyingTokens(pool, underlyingTokens);
  //   } catch (error) {
  //     console.error('Failed to fetch or filter pools: ', error);
  //     throw error;
  //   }
  // }

  // @Tool({
  //   name: 'fetch_defi_llama_by_volume1d',
  //   description: 'Fetch Defi Llama Pools',
  // })
  // async fetcAndFilterpoolByVolume1Days(days: any): Promise<any[]> {
  //   try {
  //     const pool = await this.api.makeYieldsRequest('/pools');
  //     return filterPoolByVolume1d(pool, days);
  //   } catch (error) {
  //     console.error('Failed to fetch or filter pools: ', error);
  //     throw error;
  //   }
  // }

  // @Tool({
  //   name: 'fetch_defi_llama_by_volume7d',
  //   description: 'Fetch Defi Llama Pools',
  // })
  // async fetcAndFilterpoolByVolume7Days(days: any): Promise<any[]> {
  //   try {
  //     const pool = await this.api.makeYieldsRequest('/pools');
  //     return filterPoolByVolume7d(pool, days);
  //   } catch (error) {
  //     console.error('Failed to fetch or filter pools: ', error);
  //     throw error;
  //   }
  // }
}
