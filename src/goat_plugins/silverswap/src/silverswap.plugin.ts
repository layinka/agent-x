import { type Chain, PluginBase } from "@goat-sdk/core";
import type { EVMWalletClient } from "@goat-sdk/wallet-evm";
import { sonic, sonicBlazeTestnet } from "viem/chains";
import { SilverSwapService } from "./silverswap.service";

const SUPPORTED_CHAINS = [sonic, sonicBlazeTestnet];

export class SilverSwapPlugin extends PluginBase<EVMWalletClient> {
    constructor() {
        super("silverswap", [new SilverSwapService()]);
    }

    supportsChain = (chain: Chain) => chain.type === "evm" && SUPPORTED_CHAINS.some((c) => c.id === chain.id);
}

export const silverswap = () => new SilverSwapPlugin();
