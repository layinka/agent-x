// filter chain by name
export function filterPoolByChain(pools: any[], chainName: string): any[] {
  return pools.filter((pool) => pool.chain.toLowerCase() == chainName.trim().toLowerCase());
}

export function filterPoolByApy(pools: any[], apyRange: number): any[] {
  return pools.filter((pool) => pool.apy >= apyRange);
}

export function filterPoolByTvl(pools: any[], tvlUsdRange: number): any[] {
  return pools.filter((pool) => pool.tvlUsd >= tvlUsdRange);
}

export function filterPoolByRewardTokens(
  pools: any[],
  rewardTokens: any,
): any[] {
  return pools.filter((pool) => pool.rewardTokens == rewardTokens);
}

export function filterPoolByIlRisk(pools: any[], ilRisk: string): any[] {
  return pools.filter((pool) => pool.ilRisk === ilRisk);
}

export function filterPoolByExposure(pools: any[], exposure: string): any[] {
  return pools.filter((pool) => pool.exposure.toLowerCase() === exposure.trim().toLowerCase());
}

export function filterPoolByStableCoin(
  pools: any[],
  stableCoin: boolean,
): any[] {
  return pools.filter((pool) => pool.stablecoin === stableCoin);
}

export function filterPoolByPrediction(pools: any[], predictions: any): any[] {
  return pools.filter((pool) => pool.predictions === predictions);
}

export function filterPoolByOutlier(pools: any[], outlier: boolean): any[] {
  return pools.filter((pool) => pool.outlier === outlier);
}

export function filterPoolByUnderlyingTokens(
  pools: any[],
  underlyingTokens: any,
): any[] {
  return pools.filter((pool) => pool.underlyingTokens === underlyingTokens);
}

export function filterPoolByVolume1d(pools: any[], volumeUsd1d: any): any[] {
  return pools.filter((pool) => pool.volumeUsd1d >= volumeUsd1d);
}

export function filterPoolByVolume7d(pools: any[], volumeUsd7d: any): any[] {
  return pools.filter((pool) => pool.volumeUsd7d >= volumeUsd7d);
}

export function filterPoolByAllField(
  pools: any[],
  chainName?: string,
  apy?: number,
  tvlUsd?: number,
  rewardTokens?: any,
  ilRisk?: string,
  exposure?: string,
  stableCoin?: boolean,
): any[] {
  return pools.filter((pool) => {
    return (
      (chainName === undefined || pool.chain.toLowerCase() === chainName.trim().toLowerCase()) &&
      (apy === undefined || pool.apy >= apy) &&
      (tvlUsd === undefined || pool.tvlUsd >= tvlUsd) &&
      (rewardTokens === undefined ||
        (pool.rewardTokens ?? []).includes(rewardTokens)) &&
      (ilRisk === undefined || pool.ilRisk === ilRisk) &&
      (exposure === undefined || pool.exposure?.toLowerCase() === exposure.trim().toLowerCase()) &&
      (stableCoin === undefined || pool.stablecoin === stableCoin)
    );
  });
}
