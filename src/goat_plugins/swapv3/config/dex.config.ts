import { ChainId } from '../types';

export interface DexAddresses {
    name: string;
    factory: string;
    swapRouter: string;
    positionManager: string;
    quoter: string;
}

export interface ChainConfig {
    [dexName: string]: DexAddresses;
}

export const DEX_CONFIGS: Record<number, ChainConfig> = {
    // Ethereum Mainnet
    1: {
        uniswapv3: {
            name: 'Uniswap V3',
            factory: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
            swapRouter: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
            positionManager: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
            quoter: '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6'
        }
    },
    // Celo Mainnet
    42220: {
        ubeswap: {
            name: 'UbeSwap',
            factory: '0xb860200BD68dc39cEAfd6ebb82883f189f4CdA76',
            swapRouter: '0x4882198dd2064D1E35b24735e6B9E5e3B45AcD6b',
            positionManager: '0x5084E9fDF9264489A14E77c011073D757e572bB4',
            quoter: '0x82825d0554fA07f7FC52Ab63c961F330fdEFa8E8'
        }
    },
    // Celo Alfajores Testnet
    44787: {
        ubeswap: {
            name: 'UbeSwap Testnet',
            factory: '0x79a5cd5d6953fE0525768577C6CeF40188AAA8D4',
            swapRouter: '0x3F1B0974dEb55d3Ac9e0E1b3BAe271c1BC501Ab2',
            positionManager: '0x0E9E628A1D25540889Ae93153Fd65Fb70E5BE054',
            quoter: '0x82825d0554fA07f7FC52Ab63c961F330fdEFa8E8'
        }
    }
};
