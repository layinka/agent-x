import { type Chain, PluginBase } from "@goat-sdk/core";
import { EVMWalletClient } from "@goat-sdk/wallet-evm";
import { base, hardhat, mode, optimism, sonic, sonicBlazeTestnet, sonicTestnet } from "viem/chains";
import { CompoundService } from "./compound.service";

const supportedChains = [
    base,
    optimism,
    sonic, 
    sonicTestnet,
    sonicBlazeTestnet,
    hardhat
]

export class CompoundV2Plugin extends PluginBase<EVMWalletClient> {
    constructor() {
        super("compound_v2", [new CompoundService()]);
    }

    supportsChain(chain: Chain): boolean {
        return chain.type === "evm" && supportedChains.map(c=>c.id).some(ss=>ss==chain.id);
    }
}

export function compound_v2() {
    return new CompoundV2Plugin();
}
