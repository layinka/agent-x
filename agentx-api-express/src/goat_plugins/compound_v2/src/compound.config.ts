import { zeroAddress } from "viem";

export interface CompoundProtocolAddresses {
    assets: {
        [symbol: string]: {
            underlyingAddress?: `0x${string}`;
            underlyingDecimals?: number;
            cTokenAddress?: `0x${string}`;
            cTokenDecimals?: number;
        };
    };
   
    Comptroller?: `0x${string}`;
    
}

export const compoundProtocolAddresses: {
    [chainId: number]: CompoundProtocolAddresses;
} = {
    // Goerli Chain
    31337: {
        assets: {
            USDC: { 
                underlyingAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
                underlyingDecimals: 6,
                cTokenAddress: '0x39AA39c021dfbaE8faC545936693aC917d5E7563',
                cTokenDecimals:8
             },
             DAI: {
                underlyingAddress: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
                underlyingDecimals: 18,
                cTokenAddress: '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643',
                cTokenDecimals:8

              },
            // ionWETH: { address: "0x71ef7EDa2Be775E5A7aa8afD02C45F059833e9d2", decimals: 18 },
            
        },
        
        Comptroller: "0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B",
        // PriceOracle: "0x2BAF3A2B667A5027a83101d218A9e8B73577F117",
    },
    146: {// Sonic
        assets: {
            SONIC: {
                underlyingAddress: zeroAddress,
                underlyingDecimals: 18,
                cTokenAddress: '0x9F5d9f2FDDA7494aA58c90165cF8E6B070Fe92e6',
                cTokenDecimals:8
            },
            USDC: { 
                underlyingAddress: "0x29219dd400f2Bf60E5a23d13Be72B486D4038894",
                underlyingDecimals: 6,
                cTokenAddress: '0xc84f54b2db8752f80dee5b5a48b64a2774d2b445',
                cTokenDecimals:8
             },
             WETH: {
                underlyingAddress: "0x50c42dEAcD8Fc9773493ED674b675bE577f2634b",
                underlyingDecimals: 18,
                cTokenAddress: '0x15ef11b942cc14e582797a61e95d47218808800d',
                cTokenDecimals:8

              },
            // ionWETH: { address: "0x71ef7EDa2Be775E5A7aa8afD02C45F059833e9d2", decimals: 18 },
            
        },
        
        Comptroller: "0x646F91AbD5Ab94B76d1F9C5D9490A2f6DDf25730",
        // PriceOracle: "0x2BAF3A2B667A5027a83101d218A9e8B73577F117",
    },
};
