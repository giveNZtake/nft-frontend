export const stakeABI = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
      {
        internalType: "uint64",
        name: "_amount",
        type: "uint64",
      },
    ],
    name: "stake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export const withdrawABI = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
      {
        internalType: "uint64",
        name: "_amount",
        type: "uint64",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export const batchClaimRewardsABI = [
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "_tokenIds",
        type: "uint256[]",
      },
    ],
    name: "batchClaimRewards",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export const getStakeInfoABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_staker",
        type: "address",
      },
    ],
    name: "getStakeInfo",
    outputs: [
      {
        internalType: "uint256[]",
        name: "_tokensStaked",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "_tokenAmounts",
        type: "uint256[]",
      },
      {
        internalType: "uint256",
        name: "_totalRewards",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const getStakeInfoForTokenABI = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_staker",
        type: "address",
      },
    ],
    name: "getStakeInfoForToken",
    outputs: [
      {
        internalType: "uint256",
        name: "_tokensStaked",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_rewards",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const ownerABI = [
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const getRewardsPerUnitTimeABI = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
    ],
    name: "getRewardsPerUnitTime",
    outputs: [
      {
        internalType: "uint256",
        name: "_rewardsPerUnitTime",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const multicallABI = [
  {
    inputs: [
      {
        internalType: "bytes[]",
        name: "data",
        type: "bytes[]",
      },
    ],
    name: "multicall",
    outputs: [
      {
        internalType: "bytes[]",
        name: "results",
        type: "bytes[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];
