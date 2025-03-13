export const ERC20_ABI = [
    {
        type: 'function',
        name: 'name',
        inputs: [],
        outputs: [{ type: 'string', name: '' }],
        stateMutability: 'view'
    },
    {
        type: 'function',
        name: 'symbol',
        inputs: [],
        outputs: [{ type: 'string', name: '' }],
        stateMutability: 'view'
    },
    {
        type: 'function',
        name: 'decimals',
        inputs: [],
        outputs: [{ type: 'uint8', name: '' }],
        stateMutability: 'view'
    },
    {
        type: 'function',
        name: 'balanceOf',
        inputs: [{ type: 'address', name: 'account' }],
        outputs: [{ type: 'uint256', name: '' }],
        stateMutability: 'view'
    },
    {
        type: 'function',
        name: 'allowance',
        inputs: [
            { type: 'address', name: 'owner' },
            { type: 'address', name: 'spender' }
        ],
        outputs: [{ type: 'uint256', name: '' }],
        stateMutability: 'view'
    },
    {
        type: 'function',
        name: 'approve',
        inputs: [
            { type: 'address', name: 'spender' },
            { type: 'uint256', name: 'amount' }
        ],
        outputs: [{ type: 'bool', name: '' }],
        stateMutability: 'nonpayable'
    },
    {
        type: 'function',
        name: 'transfer',
        inputs: [
            { type: 'address', name: 'to' },
            { type: 'uint256', name: 'amount' }
        ],
        outputs: [{ type: 'bool', name: '' }],
        stateMutability: 'nonpayable'
    }
] as const;

export const FACTORY_ABI = [
    {
        type: 'event',
        name: 'PoolCreated',
        inputs: [
            { type: 'address', name: 'token0', indexed: true },
            { type: 'address', name: 'token1', indexed: true },
            { type: 'uint24', name: 'fee', indexed: true },
            { type: 'int24', name: 'tickSpacing', indexed: false },
            { type: 'address', name: 'pool', indexed: false }
        ]
    },
    {
        type: 'function',
        name: 'getPool',
        inputs: [
            { type: 'address', name: 'tokenA' },
            { type: 'address', name: 'tokenB' },
            { type: 'uint24', name: 'fee' }
        ],
        outputs: [{ type: 'address', name: 'pool' }],
        stateMutability: 'view'
    },
    {
        type: 'function',
        name: 'createPool',
        inputs: [
            { type: 'address', name: 'tokenA' },
            { type: 'address', name: 'tokenB' },
            { type: 'uint24', name: 'fee' }
        ],
        outputs: [{ type: 'address', name: 'pool' }],
        stateMutability: 'nonpayable'
    },
    {
        type: 'function',
        name: 'owner',
        inputs: [],
        outputs: [{ type: 'address', name: '' }],
        stateMutability: 'view'
    },
    {
        type: 'function',
        name: 'parameters',
        inputs: [],
        outputs: [
            { type: 'address', name: 'factory' },
            { type: 'address', name: 'token0' },
            { type: 'address', name: 'token1' },
            { type: 'uint24', name: 'fee' },
            { type: 'int24', name: 'tickSpacing' }
        ],
        stateMutability: 'view'
    },
    {
        type: 'function',
        name: 'feeAmountTickSpacing',
        inputs: [{ type: 'uint24', name: 'fee' }],
        outputs: [{ type: 'int24', name: '' }],
        stateMutability: 'view'
    }
] as const;

export const POOL_ABI = [
    {
        type: 'function',
        name: 'token0',
        inputs: [],
        outputs: [{ type: 'address', name: '' }],
        stateMutability: 'view'
    },
    {
        type: 'function',
        name: 'token1',
        inputs: [],
        outputs: [{ type: 'address', name: '' }],
        stateMutability: 'view'
    },
    {
        type: 'function',
        name: 'fee',
        inputs: [],
        outputs: [{ type: 'uint24', name: '' }],
        stateMutability: 'view'
    },
    {
        type: 'function',
        name: 'slot0',
        inputs: [],
        outputs: [
            { type: 'uint160', name: 'sqrtPriceX96' },
            { type: 'int24', name: 'tick' },
            { type: 'uint16', name: 'observationIndex' },
            { type: 'uint16', name: 'observationCardinality' },
            { type: 'uint16', name: 'observationCardinalityNext' },
            { type: 'uint8', name: 'feeProtocol' },
            { type: 'bool', name: 'unlocked' }
        ],
        stateMutability: 'view'
    },
    {
        type: 'function',
        name: 'liquidity',
        inputs: [],
        outputs: [{ type: 'uint128', name: '' }],
        stateMutability: 'view'
    }
] as const;

export const POSITION_MANAGER_ABI = [
    {
        inputs: [
            {
                components: [
                    { name: "token0", type: "address" },
                    { name: "token1", type: "address" },
                    { name: "fee", type: "uint24" },
                    { name: "tickLower", type: "int24" },
                    { name: "tickUpper", type: "int24" },
                    { name: "amount0Desired", type: "uint256" },
                    { name: "amount1Desired", type: "uint256" },
                    { name: "amount0Min", type: "uint256" },
                    { name: "amount1Min", type: "uint256" },
                    { name: "recipient", type: "address" },
                    { name: "deadline", type: "uint256" },
                ],
                name: "params",
                type: "tuple",
            },
        ],
        name: "mint",
        outputs: [
            { name: "tokenId", type: "uint256" },
            { name: "liquidity", type: "uint128" },
            { name: "amount0", type: "uint256" },
            { name: "amount1", type: "uint256" },
        ],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { name: "tokenId", type: "uint256" },
                    { name: "amount0Desired", type: "uint256" },
                    { name: "amount1Desired", type: "uint256" },
                    { name: "amount0Min", type: "uint256" },
                    { name: "amount1Min", type: "uint256" },
                    { name: "deadline", type: "uint256" },
                ],
                name: "params",
                type: "tuple",
            },
        ],
        name: "increaseLiquidity",
        outputs: [
            { name: "liquidity", type: "uint128" },
            { name: "amount0", type: "uint256" },
            { name: "amount1", type: "uint256" },
        ],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { name: "tokenId", type: "uint256" },
                    { name: "liquidity", type: "uint128" },
                    { name: "amount0Min", type: "uint256" },
                    { name: "amount1Min", type: "uint256" },
                    { name: "deadline", type: "uint256" },
                ],
                name: "params",
                type: "tuple",
            },
        ],
        name: "decreaseLiquidity",
        outputs: [
            { name: "amount0", type: "uint256" },
            { name: "amount1", type: "uint256" },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ name: "tokenId", type: "uint256" }],
        name: "positions",
        outputs: [
            { name: "nonce", type: "uint96" },
            { name: "operator", type: "address" },
            { name: "token0", type: "address" },
            { name: "token1", type: "address" },
            { name: "fee", type: "uint24" },
            { name: "tickLower", type: "int24" },
            { name: "tickUpper", type: "int24" },
            { name: "liquidity", type: "uint128" },
            { name: "feeGrowthInside0LastX128", type: "uint256" },
            { name: "feeGrowthInside1LastX128", type: "uint256" },
            { name: "tokensOwed0", type: "uint128" },
            { name: "tokensOwed1", type: "uint128" },
        ],
        stateMutability: "view",
        type: "function",
    }
] as const;

export const SWAP_ROUTER_ABI = [
    {
        inputs: [
            {
                components: [
                    { name: "tokenIn", type: "address" },
                    { name: "tokenOut", type: "address" },
                    { name: "fee", type: "uint24" },
                    { name: "recipient", type: "address" },
                    { name: "deadline", type: "uint256" },
                    { name: "amountIn", type: "uint256" },
                    { name: "amountOutMinimum", type: "uint256" },
                    { name: "sqrtPriceLimitX96", type: "uint160" },
                ],
                name: "params",
                type: "tuple",
            },
        ],
        name: "exactInputSingle",
        outputs: [{ name: "amountOut", type: "uint256" }],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { name: "path", type: "bytes" },
                    { name: "recipient", type: "address" },
                    { name: "deadline", type: "uint256" },
                    { name: "amountIn", type: "uint256" },
                    { name: "amountOutMinimum", type: "uint256" },
                ],
                name: "params",
                type: "tuple",
            },
        ],
        name: "exactInput",
        outputs: [{ name: "amountOut", type: "uint256" }],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { name: "tokenIn", type: "address" },
                    { name: "tokenOut", type: "address" },
                    { name: "fee", type: "uint24" },
                    { name: "recipient", type: "address" },
                    { name: "deadline", type: "uint256" },
                    { name: "amountOut", type: "uint256" },
                    { name: "amountInMaximum", type: "uint256" },
                    { name: "sqrtPriceLimitX96", type: "uint160" },
                ],
                name: "params",
                type: "tuple",
            },
        ],
        name: "exactOutputSingle",
        outputs: [{ name: "amountIn", type: "uint256" }],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { name: "path", type: "bytes" },
                    { name: "recipient", type: "address" },
                    { name: "deadline", type: "uint256" },
                    { name: "amountOut", type: "uint256" },
                    { name: "amountInMaximum", type: "uint256" },
                ],
                name: "params",
                type: "tuple",
            },
        ],
        name: "exactOutput",
        outputs: [{ name: "amountIn", type: "uint256" }],
        stateMutability: "payable",
        type: "function",
    }
] as const;

export const QUOTER_ABI = [
    {
        inputs: [
            { name: "tokenIn", type: "address" },
            { name: "tokenOut", type: "address" },
            { name: "fee", type: "uint24" },
            { name: "amountIn", type: "uint256" },
            { name: "sqrtPriceLimitX96", type: "uint160" },
        ],
        name: "quoteExactInputSingle",
        outputs: [{ name: "amountOut", type: "uint256" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { name: "path", type: "bytes" },
            { name: "amountIn", type: "uint256" },
        ],
        name: "quoteExactInput",
        outputs: [{ name: "amountOut", type: "uint256" }],
        stateMutability: "nonpayable",
        type: "function",
    }
] as const;
