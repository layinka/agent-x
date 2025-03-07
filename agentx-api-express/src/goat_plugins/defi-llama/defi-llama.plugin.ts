import {type Chain, PluginBase } from '@goat-sdk/core';
import { DefiLlamaService } from './def-llama.service';
import { base, optimism, sonic, sonicTestnet } from 'viem/chains';


const supportedChains = [
  base,
  optimism,
  sonic, 
  sonicTestnet
]

export class DefiLlamaPlugin extends PluginBase {
  constructor() {
    super('defi-llama', [new DefiLlamaService()]);
  }

  supportsChain(chain: Chain): boolean {
    return chain.type === "evm" && (chain.id in supportedChains);
  }
  // supportsChain = () => true;
}

export function defillama() {
  return new DefiLlamaPlugin();
}
