import { Tool } from "@goat-sdk/core";
import { DefiLlamaApi } from "./api";
import {
    filterPoolByAllField,
    filterPoolByApy,
    filterPoolByChain,
    filterPoolByExposure,
    filterPoolByIlRisk,
    filterPoolByOutlier,
    filterPoolByRewardTokens,
    filterPoolByStableCoin,
    filterPoolByTvl,
    filterPoolByUnderlyingTokens,
    filterPoolByVolume1d,
    filterPoolByVolume7d
} from "./filters";
import { 
    GetDefiPoolsByChainParameters,
    GetAllPoolsParameters,
    FilterByApyParameters,
    FilterByTvlParameters,
    FilterByRewardTokensParameters,
    FilterByIlRiskParameters,
    FilterByExposureParameters,
    FilterByStablecoinParameters,
    FilterByOutlierParameters,
    FilterByUnderlyingTokensParameters,
    FilterByVolume1dParameters,
    FilterByVolume7dParameters
} from "./parameters";

export class DefiLlamaService {
    private readonly api: DefiLlamaApi;

    constructor() {
        this.api = new DefiLlamaApi();
    }

    @Tool({
        name: 'defillama_get_all_pools',
        description: 'Get and filter DeFi pools by multiple criteria including chain, APY, TVL, reward tokens, IL risk, exposure, and stablecoin status'
    })
    async fetchAndFilterByAll(parameters: GetAllPoolsParameters): Promise<any[]> {
        try {
            const pools = await this.api.makeYieldsRequest('/pools');
            return filterPoolByAllField(
                pools,
                parameters.chainName,
                parameters.apy,
                parameters.tvlUsd,
                parameters.rewardTokens,
                parameters.ilRisk,
                parameters.exposure,
                parameters.stableCoin
            );
        } catch (error) {
            console.error('Failed to fetch or filter pools: ', error);
            throw error;
        }
    }

    @Tool({
        name: "defillama_filter_defi_yield_pools_by_chain",
        description: "Fetch Defi Llama Yield Pools by Chain"
    })
    async fetchAndFilterPoolsBychain(parameters: GetDefiPoolsByChainParameters): Promise<any[]> {
        const { chain: chainName } = parameters;
        try {
            const pools = await this.api.makeYieldsRequest("/pools");
            return filterPoolByChain(pools, chainName);
        } catch (error) {
            console.error("Failed to fetch or filter pools: ", error);
            throw error;
        }
    }

    @Tool({
        name: 'defillama_filter_by_apy',
        description: 'Filter DeFi pools by minimum APY threshold'
    })
    async fetchAndFilterPoolByApy(parameters: FilterByApyParameters): Promise<any[]> {
        try {
            const pools = await this.api.makeYieldsRequest('/pools');
            return filterPoolByApy(pools, parameters.apy);
        } catch (error) {
            console.error('Failed to fetch or filter pools: ', error);
            throw error;
        }
    }

    @Tool({
        name: 'defillama_filter_by_tvl',
        description: 'Filter DeFi pools by minimum TVL (Total Value Locked)'
    })
    async fetchAndFilterPoolByTvl(parameters: FilterByTvlParameters): Promise<any[]> {
        try {
            const pools = await this.api.makeYieldsRequest('/pools');
            return filterPoolByTvl(pools, parameters.tvl);
        } catch (error) {
            console.error('Failed to fetch or filter pools: ', error);
            throw error;
        }
    }

    @Tool({
        name: 'defillama_filter_by_reward_tokens',
        description: 'Filter DeFi pools by specific reward tokens'
    })
    async fetchAndFilterPoolByRewardTokens(parameters: FilterByRewardTokensParameters): Promise<any[]> {
        try {
            const pools = await this.api.makeYieldsRequest('/pools');
            return filterPoolByRewardTokens(pools, parameters.rewardTokens);
        } catch (error) {
            console.error('Failed to fetch or filter pools: ', error);
            throw error;
        }
    }

    @Tool({
        name: 'defillama_filter_by_ilrisk',
        description: 'Filter DeFi pools by Impermanent Loss risk level'
    })
    async fetchAndFilterPoolByIlRisk(parameters: FilterByIlRiskParameters): Promise<any[]> {
        try {
            const pools = await this.api.makeYieldsRequest('/pools');
            return filterPoolByIlRisk(pools, parameters.ilRisk);
        } catch (error) {
            console.error('Failed to fetch or filter pools: ', error);
            throw error;
        }
    }

    @Tool({
        name: 'defillama_filter_by_exposure',
        description: 'Filter DeFi pools by exposure type'
    })
    async fetchAndFilterPoolByExposure(parameters: FilterByExposureParameters): Promise<any[]> {
        try {
            const pools = await this.api.makeYieldsRequest('/pools');
            return filterPoolByExposure(pools, parameters.exposure);
        } catch (error) {
            console.error('Failed to fetch or filter pools: ', error);
            throw error;
        }
    }

    @Tool({
        name: 'defillama_filter_by_stablecoin',
        description: 'Filter DeFi pools to show only stablecoin pools'
    })
    async fetchAndFilterPoolByStablecoin(parameters: FilterByStablecoinParameters): Promise<any[]> {
        try {
            const pools = await this.api.makeYieldsRequest('/pools');
            return filterPoolByStableCoin(pools, parameters.stablecoin);
        } catch (error) {
            console.error('Failed to fetch or filter pools: ', error);
            throw error;
        }
    }

    @Tool({
        name: 'defillama_filter_by_outlier',
        description: 'Filter DeFi pools by outlier status'
    })
    async fetchAndFilterPoolByOutlier(parameters: FilterByOutlierParameters): Promise<any[]> {
        try {
            const pools = await this.api.makeYieldsRequest('/pools');
            return filterPoolByOutlier(pools, parameters.outlier);
        } catch (error) {
            console.error('Failed to fetch or filter pools: ', error);
            throw error;
        }
    }

    @Tool({
        name: 'defillama_filter_by_underlying_tokens',
        description: 'Filter DeFi pools by underlying token assets'
    })
    async fetchAndFilterPoolByUnderlyingTokens(parameters: FilterByUnderlyingTokensParameters): Promise<any[]> {
        try {
            const pools = await this.api.makeYieldsRequest('/pools');
            return filterPoolByUnderlyingTokens(pools, parameters.underlyingTokens);
        } catch (error) {
            console.error('Failed to fetch or filter pools: ', error);
            throw error;
        }
    }

    @Tool({
        name: 'defillama_filter_by_volume1d',
        description: 'Filter DeFi pools by 1-day volume'
    })
    async fetchAndFilterPoolByVolume1d(parameters: FilterByVolume1dParameters): Promise<any[]> {
        try {
            const pools = await this.api.makeYieldsRequest('/pools');
            return filterPoolByVolume1d(pools, parameters.volume1d);
        } catch (error) {
            console.error('Failed to fetch or filter pools: ', error);
            throw error;
        }
    }

    @Tool({
        name: 'defillama_filter_by_volume7d',
        description: 'Filter DeFi pools by 7-day volume'
    })
    async fetchAndFilterPoolByVolume7d(parameters: FilterByVolume7dParameters): Promise<any[]> {
        try {
            const pools = await this.api.makeYieldsRequest('/pools');
            return filterPoolByVolume7d(pools, parameters.volume7d);
        } catch (error) {
            console.error('Failed to fetch or filter pools: ', error);
            throw error;
        }
    }
}
