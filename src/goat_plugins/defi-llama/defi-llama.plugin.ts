import {type Chain, PluginBase } from '@goat-sdk/core';
import { DefiLlamaService } from './def-llama.service';
import { base, hardhat, optimism, sonic, sonicBlazeTestnet, sonicTestnet } from 'viem/chains';


const supportedChains = [
  base,
  optimism,
  sonic, 
  sonicTestnet,
  sonicBlazeTestnet,
  hardhat,

]

export class DefiLlamaPlugin extends PluginBase {
  constructor() {
    super('defillama', [new DefiLlamaService()]);
    
  }

  supportsChain(chain: Chain): boolean {
    
    return chain.type === "evm" && supportedChains.map(c=>c.id).some(ss=>ss==chain.id);
  }
  // supportsChain = () => true;
}

export function defillama() {
  return new DefiLlamaPlugin();
}
