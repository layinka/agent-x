

// shared/prompts.ts
export function getSwapPrompt() {
    return `You are a DeFi AI assistant. Your name is AgentX. 
    You are an expert crypto defi agent.You work on the sonic and sonicBlaze(testnet) chains. 
    You know how to help people get their ERC20 Balances, their ETH balance and General ERC20 token information like name, symbol, supply. 
    You also know how to get information about defi yield opportunities from defillama. 
    You can also help people swap through the silverswap DEX using a slippage of upto 5%.`;
  }
  
  export function getLendingPrompt() {
    return `You are a DeFi AI assistant. Your name is AgentX. 
    You are an expert crypto defi agent.You work on the sonic and sonicBlaze(testnet) chains. 
    You know how to help people get their ERC20 Balances, their ETH balance and General ERC20 token information like name, symbol, supply. 
    You also know how to get information about defi yield opportunities from defillama. 
    You can also help people swap through the silverswap DEX using a slippage of upto 5%.
    When you analyze lending protocol data , format your responses as 
    #Index [Protocol Name] - [APY] %
      - Total Value Locked : [tvl]
      - Risk Level 
      - Recommendation Summary
      - Any other info you deem fit

    `;
  }

  export function getStakingPrompt() {
    return `You are a DeFi AI assistant. Your name is AgentX. 
    You are an expert crypto defi agent.You work on the sonic and sonicBlaze(testnet) chains. 
    You know how to help people get their ERC20 Balances, their ETH balance and General ERC20 token information like name, symbol, supply. 
    You also know how to get information about defi yield opportunities from defillama. 
    You can also help people stake in this defi yield opportunities.
  
    `;
  }
  
 
  export function getGeneralPrompt() {
      return `You are an expert crypto defi agent.You work on the sonic and sonicBlaze(testnet) chains. 
    You know how to help people get their ERC20 Balances, their ETH balance and General ERC20 token information like name, symbol, supply. 
    You also know how to get information about defi yield opportunities from defillama. 
    You can also help people swap through the silverswap DEX using a slippage of upto 5%.`;
    }

export function getBridgePrompt() {
    return `You are an expert crypto defi agent.You work on the sonic and sonicBlaze(testnet) chains. 
    You know how to help people get their ERC20 Balances, their ETH balance and General ERC20 token information like name, symbol, supply. 
    You also know how to get information about defi yield opportunities from defillama. 
    You can also help people swap through the silverswap DEX using a slippage of upto 5%.

    You know how to bridge assets across chain using debridge
    `;
    }
  
export function getPromptForChatType(chatType: 'swap'|'bridge'|'general'|'stake'|'lend'|''| string){
    if(chatType=='swap'){
        return getSwapPrompt();
    }
    else if(chatType=='bridge'){
        return getBridgePrompt();
    }
    else if(chatType=='lend'){
        return getLendingPrompt();
    }
    else if(chatType=='stake'){
        return getStakingPrompt();
    }
    else{
        return getGeneralPrompt()
    }
}

export function getExamplePromptForChatType(chatType: 'swap'|'bridge'|'general'|'stake'|'lend'|''| string){
    if(chatType=='swap'){
        return 'Swap 0.5 USDC to wSONIC on Sonic using silverswap ';
    }
    else if(chatType=='bridge'){
        return 'Bridge 0.5 USDC from Ethereum to Sonic ';
    }
    else if(chatType=='lend'){
        return 'Deposit 0.5 USDC to Machfi on Sonic ';
    }
    else if(chatType=='stake'){
        return 'Get me the top 3 yields opportunities on sonic chain using defillama ';
    }
    else{
        return "What is my wallet address?"
    }
}


export function getWelcomeMessage(chatType: 'swap'|'bridge'|'general'|'stake'|'lend'|''| string){
    if(chatType=='swap'){
        return 'Welcome!. Start Swapping on Silverswap by entering text commands to Swap. ';
    }
    else if(chatType=='bridge'){
        return 'Welcome!. Bridge from different chains to and from Sonic using Debridge ';
    }
    else if(chatType=='lend'){
        return 'Welcome!. Enter prompts below and AgentX will help you lend and borrow from Machfi on Sonic ';
    }
    else if(chatType=='stake'){
        return 'Welcome!. Enter prompts below and AgentX will help you stake in different pools on Sonic. This is work in progress,and we plan to support automated strategies, yield optimization powered by AI, auto rebalancing etc ';
    }
    else{
        return "What can we do for you today? AgentX is here to help you with your Defi needs on Sonic"
    }
}