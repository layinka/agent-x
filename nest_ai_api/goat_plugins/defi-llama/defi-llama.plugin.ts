import { PluginBase } from '@goat-sdk/core';
import { DefiLlamaService } from './def-llama.service';

export class DefiLlamaPlugin extends PluginBase {
  constructor() {
    super('defi-llama', [new DefiLlamaService()]);
  }

  supportsChain = () => true;
}

export function defillama() {
  return new DefiLlamaPlugin();
}
