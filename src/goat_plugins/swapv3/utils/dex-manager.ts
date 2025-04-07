import { DEX_CONFIGS, DexAddresses } from '../config/dex.config';

export class DexManager {
    static getDexConfig(chainId: number, dexName: string): DexAddresses {
        const chainConfig = DEX_CONFIGS[chainId];
        if (!chainConfig) {
            throw new Error(`Chain ID ${chainId} not supported`);
        }

        const dexConfig = chainConfig[dexName.toLowerCase()];
        if (!dexConfig) {
            throw new Error(`DEX ${dexName} not found on chain ${chainId}`);
        }

        return dexConfig;
    }

    static isValidDex(chainId: number, dexName: string): boolean {
        try {
            this.getDexConfig(chainId, dexName);
            return true;
        } catch {
            return false;
        }
    }

    static getSupportedDexes(chainId: number): string[] {
        const chainConfig = DEX_CONFIGS[chainId];
        if (!chainConfig) {
            return [];
        }
        return Object.keys(chainConfig);
    }

    static getSupportedChains(): number[] {
        return Object.keys(DEX_CONFIGS).map(Number);
    }
}
