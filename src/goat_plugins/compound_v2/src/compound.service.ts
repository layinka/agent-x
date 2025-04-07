import { Tool } from "@goat-sdk/core";
import { EVMWalletClient } from "@goat-sdk/wallet-evm";
import { type Address, erc20Abi, formatUnits, parseUnits } from "viem";
import { CETHER_ABI, COMPTROLLER_ABI, CTOKEN_ABI } from "./abis";


import { compoundProtocolAddresses } from "./compound.config";
import {
    BorrowAssetParameters,
    EnterMarketParameters,
    GetHealthMetricsParameters,
    LoopAssetParameters,
    RedeemAssetParameters,
    RepayLoanParameters,
    SupplyAssetParameters,
    SwapCollateralParameters,
} from "./parameters";
import type { HealthMetrics } from "./types";

export class CompoundService {
    private async getAssetConfig(chainId: number, symbol: string) {
        const config = compoundProtocolAddresses[chainId]?.assets?.[symbol];
        if (!config?.underlyingAddress || config.underlyingDecimals === undefined) {
            throw new Error(`Asset ${symbol} not found in Compound V2 addresses for chain ${chainId}`);
        }
        console.log('AssetCfg:: ', config)
        return config;
    }

    // // Generic contract interaction helper
    // private async interactWithContract({ address, abi, functionName, args, value }: {
    //     address: `0x${string}`;
    //     abi: any[];
    //     functionName: string;
    //     args?: any[];
    //     value?: bigint;
    // }) {
    //     const account = (await walletClient.getAddresses())[0];
        
    //     const { request } = await publicClient.simulateContract({
    //         address,
    //         abi,
    //         functionName,
    //         args,
    //         value,
    //         account
    //     });
    
    //     return walletClient.writeContract(request);
    // }

  //   async checkBalance(wallet: EVMWalletClient, tokenAddress: `0x${string}`, account: `0x${string}`) {
      

  //     const balance = await wallet.read({

  //         address: tokenAddress,
  //         abi: erc20Abi,
  //         functionName: 'balanceOf',
  //         args: [account]
  //     });
      
            
  //     return balance;
  //   }

  //   @Tool({
  //     name: "get_token_balance",
  //     description: "Get Balance of an ERC20 Token.",
  // })
  // async getBalance(wallet: EVMWalletClient, params: SupplyAssetParameters): Promise<string> {
      
  //     const { asset, amount } = params;
  //     const chain = wallet.getChain();

  //     const isNativeAsset = asset=='ETH' || asset.toUpperCase()=='SONIC';
      

  //     // Get token address from config
  //     const underlyingToken = compoundProtocolAddresses[chain.id]?.assets?.[asset];
  //     const underlyingTokenAddress = underlyingToken?.underlyingAddress
  //     if (!underlyingTokenAddress) {
  //         throw new Error(`Token address not found for ${asset} on chain ${chain.id}`);
  //     }

  //     const cTokenAddress = compoundProtocolAddresses[chain.id]?.assets?.[asset].cTokenAddress;
  //     if (!cTokenAddress) {
  //         throw new Error(`cToken address not found for ${asset} on chain ${chain.id}`);
  //     }

  //     let txn;
  //     if(isNativeAsset){
  //         //Mint
  //         txn = await wallet.sendTransaction({
  //             to: cTokenAddress,
  //             abi: CTOKEN_ABI,
  //             functionName: "mint",
  //             args: [parseUnits(amount, underlyingToken.underlyingDecimals??18)],
  //             value: parseUnits(amount, underlyingToken.underlyingDecimals??18)
  //         });
  //     }else{
  //         //Approve first
  //         await this.checkAndApprove(wallet, underlyingTokenAddress, cTokenAddress, parseUnits(amount, underlyingToken.underlyingDecimals??18));

  //         //Mint
  //         txn = await wallet.sendTransaction({
  //             to: cTokenAddress,
  //             abi: CTOKEN_ABI,
  //             functionName: "mint",
  //             args: [parseUnits(amount, underlyingToken.underlyingDecimals??18)],
  //         });
          
  //     }

  //     return txn.hash;
  // }

    async checkAndApprove(wallet: EVMWalletClient, tokenAddress: `0x${string}`, spender: `0x${string}`, amount: bigint) {
        const account = wallet.getAddress();

        // console.log('SUPPLY::  Approving   ', account)

        const allowance = await wallet.read({

            address: tokenAddress,
            abi: [{
                name: 'allowance',
                type: 'function',
                stateMutability: 'view',
                inputs: [
                  { name: 'owner', type: 'address' },
                  { name: 'spender', type: 'address' }
                ],
                outputs: [{ type: 'uint256' }]
            }],
            functionName: 'allowance',
            args: [account, spender]
        });
        
        // console.log('SUPPLY::  Approving -  allowance - ', allowance, ', amount: ', amount)
              
        if (allowance.value as bigint < amount) {

          // console.log('SUPPLY::  Needs Approvial')
          const txn = await wallet.sendTransaction({
            to: tokenAddress,
            abi: [{
                name: 'approve',
                type: 'function',
                stateMutability: 'nonpayable',
                inputs: [
                  { name: 'spender', type: 'address' },
                  { name: 'amount', type: 'uint256' }
                ],
                outputs: [{ type: 'bool' }]
            }],
            functionName: 'approve',
            args: [spender, amount],
          });

          // console.log('SUPPLY::  Approving -  TXN Hash - ', txn.hash)

        }
      }

    @Tool({
        name: "compound_supply_asset",
        description: "Supply an asset to Compound V2 and MachFi.",
    })
    async supplyAsset(wallet: EVMWalletClient, params: SupplyAssetParameters): Promise<string> {
        
        const { asset, amount } = params;
        const chain = wallet.getChain();

        // console.log('SUPPLY::  Wallet Chain  ', chain)



        const isNativeAsset = asset=='ETH' || asset.toUpperCase()=='SONIC';
        

        // Get token address from config
        const underlyingToken = compoundProtocolAddresses[chain.id]?.assets?.[asset];
        const underlyingTokenAddress = underlyingToken?.underlyingAddress
        if (!underlyingTokenAddress) {
            throw new Error(`Token address not found for ${asset} on chain ${chain.id}`);
        }

        const cTokenAddress = compoundProtocolAddresses[chain.id]?.assets?.[asset].cTokenAddress;
        if (!cTokenAddress) {
            throw new Error(`cToken address not found for ${asset} on chain ${chain.id}`);
        }

      // //   // console.log('SUPPLY::  isNativeAsset  ', isNativeAsset)
      //   const account = await wallet.getAddress();
      //   const comptrollerAddress = compoundProtocolAddresses[chain.id]?.Comptroller;
      //   if (!comptrollerAddress) throw new Error("Comptroller not found");

      //   let {value: [,liquidity] } : {value: any} = await wallet.read({
      //     address: comptrollerAddress,
      //     abi: COMPTROLLER_ABI,
      //     functionName: 'getAccountLiquidity',
      //     args: [account]
      //  });  

      // console.log('SUPPLY::  liqResult ::  ', liquidity)


        let txn;
        if(isNativeAsset){
            //Mint
            txn = await wallet.sendTransaction({
                to: cTokenAddress,
                abi: CETHER_ABI,
                functionName: "mint",
                args: [parseUnits(amount, underlyingToken.underlyingDecimals??18)],
                value: parseUnits(amount, underlyingToken.underlyingDecimals??18)
            });
        }else{
          // console.log('SUPPLY::  Approving  ', )
            //Approve first
            await this.checkAndApprove(wallet, underlyingTokenAddress, cTokenAddress, parseUnits(amount, underlyingToken.underlyingDecimals??18));
            // console.log('SUPPLY::  Approved')
            try{
              //Mint
              txn = await wallet.sendTransaction({
                  to: cTokenAddress,
                  abi: CTOKEN_ABI,
                  functionName: "mint",
                  args: [parseUnits(amount, underlyingToken.underlyingDecimals??18)],
              });
              // console.log('SUPPLY::  Minted', txn.hash)
            }catch(errr){
              // console.error('SUPPLY::  Mint Failed - ', errr)
            }
            
        }

        return txn.hash;
    }


    @Tool({
        name: "compound_redeem_asset",
        description: "Redeem an asset from Compound V2 and MachFi.",
    })
    async redeemAsset(wallet: EVMWalletClient, params: RedeemAssetParameters): Promise<string> {
        
        const { cTokenAsset, amount } = params;
        const chain = wallet.getChain();
        
        if(!cTokenAsset || !cTokenAsset.startsWith('c')){
            throw new Error(`Invalid cToken ${cTokenAsset}`);
        }
        
        const asset = cTokenAsset.substring(1).toUpperCase()
        // Get token address from config
        const underlyingToken = compoundProtocolAddresses[chain.id]?.assets?.[asset];
        const underlyingTokenAddress = underlyingToken?.underlyingAddress
        if (!underlyingTokenAddress) {
            throw new Error(`Token address not found for ${asset} on chain ${chain.id}`);
        }

        const cTokenAddress = compoundProtocolAddresses[chain.id]?.assets?.[asset].cTokenAddress;
        if (!cTokenAddress) {
            throw new Error(`cToken address not found for ${asset} on chain ${chain.id}`);
        }

        let txn= await wallet.sendTransaction({
            to: cTokenAddress,
            abi: CTOKEN_ABI,
            functionName: "redeem",
            args: [parseUnits(amount, underlyingToken.cTokenDecimals??8)],
            // value: parseUnits(amount, underlyingToken.underlyingDecimals??18)
        });


        return txn.hash;
    }

    @Tool({
        name: "compound_enter_market",
        description: "Enable collateral for an asset on Compound V2 and MachFi",
    })
    async enterMarkets(wallet: EVMWalletClient, params: EnterMarketParameters): Promise<string> {
    
        const { assets } = params;
        const chain = wallet.getChain();

        const comptrollerAddress = compoundProtocolAddresses[chain.id]?.Comptroller;
        if (!comptrollerAddress) throw new Error("Comptroller not found");

        const cTokenAssets = assets.map((asset) => {
            const cTokenAddress = compoundProtocolAddresses[chain.id]?.assets?.[asset].cTokenAddress;
            if (!cTokenAddress) {
                throw new Error(`cToken address not found for ${asset} on chain ${chain.id}`);
            }
            return cTokenAddress
        })
        

        
        const txn = await wallet.sendTransaction({
          to: comptrollerAddress,
          abi: COMPTROLLER_ABI,
          functionName: 'enterMarkets',
          args: [cTokenAssets],
          
        });

        return txn.hash;
    }

    @Tool({
        name: "compound_borrow_asset",
        description: "Borrow an asset from Compound V2 and MachFi",
    })
    async borrowAsset(wallet: EVMWalletClient, params: BorrowAssetParameters): Promise<{
        liquidity: any;
        collateralFactor: any;
        borrowRate: any;
        hash: any;
    }> {
        const { asset, amount } = params;
        const chain = await wallet.getChain();
        const account = await wallet.getAddress();
        

        const comptrollerAddress = compoundProtocolAddresses[chain.id]?.Comptroller;
        if (!comptrollerAddress) throw new Error("Comptroller not found");

        const underlyingTokenDecimal = compoundProtocolAddresses[chain.id]?.assets?.[asset]?.underlyingDecimals;
        if (!underlyingTokenDecimal) {
            throw new Error(`underlyingTokenDecimal not found for ${asset} on chain ${chain.id}`);
        }

        const cTokenAddress = compoundProtocolAddresses[chain.id]?.assets?.[asset]?.cTokenAddress;
        if (!cTokenAddress) {
            throw new Error(`cToken address not found for ${asset} on chain ${chain.id}`);
        }

        console.log('Calculating your liquid assets in the protocol...');
        

        let {value: [,liquidity] } : {value: any} = await wallet.read({
            address: comptrollerAddress,
            abi: COMPTROLLER_ABI,
            functionName: 'getAccountLiquidity',
            args: [account]
        });        
        liquidity = liquidity / 1e18;

        // console.log('Fetching cETH collateral factor...');
        let collateralResult  = await wallet.read({
            address: comptrollerAddress,
            abi: COMPTROLLER_ABI,
            functionName: 'markets',
            args: [cTokenAddress]
        });       
        let  [, collateralFactor ]= collateralResult.value as any 
        liquidity = liquidity / 1e18;
        
        collateralFactor = (collateralFactor / 1e18) * 100; // Convert to percent

        // console.log(`Fetching ${assetName} price from the price feed...`);
        // let underlyingPriceInUsd = await priceFeed.callStatic.price(assetName);
        // underlyingPriceInUsd = underlyingPriceInUsd / 1e6; // Price feed provides price in USD with 6 decimal places

        // console.log(`Fetching borrow rate per block for ${asset} borrowing...`);
        let borrowRateResult  = await wallet.read({
            address: cTokenAddress,
            abi: CTOKEN_ABI,
            functionName: 'borrowRatePerBlock',
            args: [cTokenAddress]
        }); 
        let borrowRate=borrowRateResult.value as any;
        borrowRate = borrowRate / Math.pow(10, underlyingTokenDecimal);

        // const ret = {
        //     liquidity,
        //     collateralFactor,
        //     borrowRate
        // }

        console.log(`\nYou have ${liquidity} of LIQUID assets (worth of USD) pooled in the protocol.`);
        console.log(`You can borrow up to ${collateralFactor}% of your TOTAL collateral supplied to the protocol as ${asset}.`);
        // console.log(`1 ${assetName} == ${underlyingPriceInUsd.toFixed(6)} USD`);
        // console.log(`You can borrow up to ${liquidity/underlyingPriceInUsd} ${assetName} from the protocol.`);
        console.log(`NEVER borrow near the maximum amount because your account will be instantly liquidated.`);
        console.log(`\nYour borrowed amount INCREASES (${borrowRate} * borrowed amount) ${asset} per block.\nThis is based on the current borrow rate.\n`);



        // Execute borrow
        const txn = await wallet.sendTransaction({
            to: cTokenAddress,
            abi: [{
              name: 'borrow',
              type: 'function',
              stateMutability: 'nonpayable',
              inputs: [{ type: 'uint256' }],
              outputs: [{ type: 'uint256' }]
            }],
            functionName: 'borrow',
            args: [amount],
            
        });

        return {
            liquidity,
            collateralFactor,
            borrowRate,
            hash: txn.hash
        } ;
    }



    @Tool({
        name: "compound_repay_asset",
        description: "Repay a loan an asset from Compound V2 and MachFi",
    })
    async repayAssetLoan(wallet: EVMWalletClient, params: RepayLoanParameters): Promise<{
        liquidity: any;
        collateralFactor: any;
        borrowRate: any;
        hash: any;
    }> {
        const { cTokenAsset, amount } = params;
        const chain = await wallet.getChain();
        const account = await wallet.getAddress();

        if(!cTokenAsset || !cTokenAsset.startsWith('c')){
            throw new Error(`Invalid cToken ${cTokenAsset}`);
        }
        
        const asset = cTokenAsset.substring(1).toUpperCase()
        
        const isNativeAsset = asset=='ETH' || asset.toUpperCase()=='SONIC';
        const comptrollerAddress = compoundProtocolAddresses[chain.id]?.Comptroller;
        if (!comptrollerAddress) throw new Error("Comptroller not found");

        const underlyingTokenAddress = compoundProtocolAddresses[chain.id]?.assets?.[asset]?.underlyingAddress;
        if (!underlyingTokenAddress) {
            throw new Error(`underlyingTokenAddress not found for ${asset} on chain ${chain.id}`);
        }

        const underlyingTokenDecimal = compoundProtocolAddresses[chain.id]?.assets?.[asset]?.underlyingDecimals;
        if (!underlyingTokenDecimal) {
            throw new Error(`underlyingTokenDecimal not found for ${asset} on chain ${chain.id}`);
        }

        const cTokenAddress = compoundProtocolAddresses[chain.id]?.assets?.[asset]?.cTokenAddress;
        if (!cTokenAddress) {
            throw new Error(`cToken address not found for ${asset} on chain ${chain.id}`);
        }

        const amountWei = parseUnits(amount, underlyingTokenDecimal)

        let txn;
        if (!isNativeAsset) { // ERC20
            await this.checkAndApprove(wallet, underlyingTokenAddress, cTokenAddress, amountWei);
            
            txn = await wallet.sendTransaction({
              to: cTokenAddress,
              abi: [{
                name: 'repayBorrow',
                type: 'function',
                stateMutability: 'nonpayable',
                inputs: [{ type: 'uint256' }],
                outputs: [{ type: 'uint256' }]
              }],
              functionName: 'repayBorrow',
              args: [amountWei],
              
            });
          } else { // ETH
            txn = await wallet.sendTransaction({
              to: cTokenAddress,
              abi: [{
                name: 'repayBorrow',
                type: 'function',
                stateMutability: 'payable',
                inputs: [],
                outputs: [{ type: 'uint256' }]
              }],
              functionName: 'repayBorrow',
              value: amountWei,
              
            });
          }

        return txn.hash;
    }

    
}
