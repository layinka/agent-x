import { Tool } from '@goat-sdk/core';
import { DefiLlamaApi } from './api';
import {
  filterPoolByAllField,
  filterPoolByApy,
  filterPoolByChain,
  filterPoolByExposure,
  filterPoolByIlRisk,
  filterPoolByOutlier,
  filterPoolByPrediction,
  filterPoolByRewardTokens,
  filterPoolByStableCoin,
  filterPoolByTvl,
  filterPoolByUnderlyingTokens,
  filterPoolByVolume1d,
  filterPoolByVolume7d,
} from './filters';

export class DefiLlamaService {
  private readonly api: DefiLlamaApi;

  constructor() {
    this.api = new DefiLlamaApi();
  }
  @Tool({
    name: 'fetch_defi_llama_and_filter_all',
    description: 'Fetch Defi Llama Pools',
  })
  async fetchAnFilterByAll(
    chainName: string,
    apy: number,
    tvlUsd: number,
    rewardTokens: any,
    ilRisk: string,
    exposure: string,
    stableCoin: boolean,
  ) {
    try {
      const pools = await this.api.makeYieldsRequest('/pools');
      return filterPoolByAllField(
        pools,
        chainName,
        apy,
        tvlUsd,
        rewardTokens,
        ilRisk,
        exposure,
        stableCoin,
      );
    } catch (error) {
      console.error('Failed to fetch or filter pools: ', error);
      throw error;
    }
  }

  @Tool({
    name: 'fetch_defi_llama_filter_by_chain',
    description: 'Fetch Defi Llama Pools',
  })
  async fetchAndFilterPoolsBychain(chainName: string): Promise<any[]> {
    try {
      const pools = await this.api.makeYieldsRequest('/pools');
      return filterPoolByChain(pools, chainName);
    } catch (error) {
      console.error('Failed to fetch or filter pools: ', error);
      throw error;
    }
  }

  @Tool({
    name: 'fetch_defi_llama_pools',
    description: 'Fetch Defi Llama Pools',
  })
  async fetchAndFilterPoolByApy(apy: number): Promise<any[]> {
    try {
      const pools = await this.api.makeYieldsRequest('/pools');
      return filterPoolByApy(pools, apy);
    } catch (error) {
      console.error('Failed to fetch or filter pools: ', error);
      throw error;
    }
  }

  @Tool({
    name: 'fetch_defi_llama_pools',
    description: 'Fetch Defi Llama Pools',
  })
  async fetchAndfilterPoolByTvl(tvl: number): Promise<any[]> {
    try {
      const pools = await this.api.makeYieldsRequest('/pools');
      return filterPoolByTvl(pools, tvl);
    } catch (error) {
      console.error('Failed to fetch or filter pools: ', error);
      throw error;
    }
  }

  @Tool({
    name: 'fetch_defi_llama_pools',
    description: 'Fetch Defi Llama Pools',
  })
  async fetchAndFilterPoolByRewardTokens(rewardTokens: any): Promise<any[]> {
    try {
      const pool = await this.api.makeYieldsRequest('/pools');
      return filterPoolByRewardTokens(pool, rewardTokens);
    } catch (error) {
      console.error('Failed to fetch or filter pools: ', error);
      throw error;
    }
  }

  @Tool({
    name: 'fetch_defi_llama_pools',
    description: 'Fetch Defi Llama Pools',
  })
  async fetchAndFilterPoolByIlRisk(ilRisk: string): Promise<any[]> {
    try {
      const pool = await this.api.makeYieldsRequest('/pools');
      return filterPoolByIlRisk(pool, ilRisk);
    } catch (error) {
      console.error('Failed to fetch or filter pools: ', error);
      throw error;
    }
  }

  @Tool({
    name: 'fetch_defi_llama_pools',
    description: 'Fetch Defi Llama Pools',
  })
  async fetchAnFilterPoolByExposure(exposure: string): Promise<any[]> {
    try {
      const pool = await this.api.makeYieldsRequest('/pools');
      return filterPoolByExposure(pool, exposure);
    } catch (error) {
      console.error('Failed to fetch or filter pools: ', error);
      throw error;
    }
  }

  @Tool({
    name: 'fetch_defi_llama_pools',
    description: 'Fetch Defi Llama Pools',
  })
  async fetcAndFilterpoolByStablecoin(stablecoin: boolean): Promise<any[]> {
    try {
      const pool = await this.api.makeYieldsRequest('/pools');
      return filterPoolByStableCoin(pool, stablecoin);
    } catch (error) {
      console.error('Failed to fetch or filter pools: ', error);
      throw error;
    }
  }

  // @Tool({
  //   name: 'fetch_defi_llama_pools',
  //   description: 'Fetch Defi Llama Pools',
  // })
  // async fetcAndFilterpoolByPredictions(predictions: any): Promise<any[]> {
  //     try {
  //         const pool = await this.api.makeYieldsRequest("/pools");
  //         return filterPoolByStableCoin(pool, predictions);
  //     } catch (error) {
  //         console.error("Failed to fetch or filter pools: ", error);
  //         throw error;
  //     }
  // }

  @Tool({
    name: 'fetch_defi_llama_pools',
    description: 'Fetch Defi Llama Pools',
  })
  async fetcAndFilterpoolByOutlier(outlier: boolean): Promise<any[]> {
    try {
      const pool = await this.api.makeYieldsRequest('/pools');
      return filterPoolByOutlier(pool, outlier);
    } catch (error) {
      console.error('Failed to fetch or filter pools: ', error);
      throw error;
    }
  }

  @Tool({
    name: 'fetch_defi_llama_pools',
    description: 'Fetch Defi Llama Pools',
  })
  async fetcAndFilterpoolByUnderlyingTokens(
    underlyingTokens: any,
  ): Promise<any[]> {
    try {
      const pool = await this.api.makeYieldsRequest('/pools');
      return filterPoolByUnderlyingTokens(pool, underlyingTokens);
    } catch (error) {
      console.error('Failed to fetch or filter pools: ', error);
      throw error;
    }
  }

  @Tool({
    name: 'fetch_defi_llama_pools',
    description: 'Fetch Defi Llama Pools',
  })
  async fetcAndFilterpoolByVolume1Days(days: any): Promise<any[]> {
    try {
      const pool = await this.api.makeYieldsRequest('/pools');
      return filterPoolByVolume1d(pool, days);
    } catch (error) {
      console.error('Failed to fetch or filter pools: ', error);
      throw error;
    }
  }

  @Tool({
    name: 'fetch_defi_llama_pools',
    description: 'Fetch Defi Llama Pools',
  })
  async fetcAndFilterpoolByVolume7Days(days: any): Promise<any[]> {
    try {
      const pool = await this.api.makeYieldsRequest('/pools');
      return filterPoolByVolume7d(pool, days);
    } catch (error) {
      console.error('Failed to fetch or filter pools: ', error);
      throw error;
    }
  }
}
