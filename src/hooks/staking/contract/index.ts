import { readContract, simulateContract, writeContract } from "@wagmi/core";
import { config } from "../../../config";
import { CONTRACT } from "../../../constants";
import {
  stakeABI,
  withdrawABI,
  batchClaimRewardsABI,
  getStakeInfoABI,
  getStakeInfoForTokenABI,
  ownerABI,
  getRewardsPerUnitTimeABI,
  depositRewardTokensABI,
  setRewardsPerUnitTimeABI,
  multicallABI,
} from "../../../contracts";
import { Hex } from "viem";

export function useReadStakingContract() {
  async function getStakeInfo(address: string) {
    const result = await readContract(config, {
      abi: getStakeInfoABI,
      // @ts-ignore
      address: CONTRACT.REAL_ESTATE_STAKING_ADDRESS,
      functionName: "getStakeInfo",
      // @ts-ignore
      args: [address],
    });
    return result;
  }

  async function getStakeInfoForToken(tokenId: bigint, address: string) {
    const result = await readContract(config, {
      abi: getStakeInfoForTokenABI,
      // @ts-ignore
      address: CONTRACT.REAL_ESTATE_STAKING_ADDRESS,
      functionName: "getStakeInfoForToken",
      // @ts-ignore
      args: [tokenId, address],
    });
    return result;
  }

  async function owner() {
    const result = await readContract(config, {
      abi: ownerABI,
      // @ts-ignore
      address: CONTRACT.REAL_ESTATE_STAKING_ADDRESS,
      functionName: "owner",
      // @ts-ignore
      args: [],
    });
    return result;
  }

  async function getRewardsPerUnitTime(tokenId: bigint) {
    const result = await readContract(config, {
      abi: getRewardsPerUnitTimeABI,
      // @ts-ignore
      address: CONTRACT.REAL_ESTATE_STAKING_ADDRESS,
      functionName: "getRewardsPerUnitTime",
      // @ts-ignore
      args: [tokenId],
    });
    return result;
  }

  return {
    getStakeInfo,
    getStakeInfoForToken,
    owner,
    getRewardsPerUnitTime,
  };
}

export function useWriteStakingContract() {
  async function stake(tokenId: bigint, amount: bigint) {
    const { request } = await simulateContract(config, {
      abi: stakeABI,
      // @ts-ignore
      address: CONTRACT.REAL_ESTATE_STAKING_ADDRESS,
      functionName: "stake",
      // @ts-ignore
      args: [tokenId, amount],
    });
    const result = await writeContract(config, request);
    return result;
  }

  async function withdraw(tokenId: bigint, amount: bigint) {
    const { request } = await simulateContract(config, {
      abi: withdrawABI,
      // @ts-ignore
      address: CONTRACT.REAL_ESTATE_STAKING_ADDRESS,
      functionName: "withdraw",
      // @ts-ignore
      args: [tokenId, amount],
    });
    const result = await writeContract(config, request);
    return result;
  }

  async function batchClaimRewards(tokenIds: bigint[]) {
    const { request } = await simulateContract(config, {
      abi: batchClaimRewardsABI,
      // @ts-ignore
      address: CONTRACT.REAL_ESTATE_STAKING_ADDRESS,
      functionName: "batchClaimRewards",
      // @ts-ignore
      args: [tokenIds],
    });
    const result = await writeContract(config, request);
    return result;
  }

  async function depositRewardTokens(amount: bigint) {
    const { request } = await simulateContract(config, {
      abi: depositRewardTokensABI,
      // @ts-ignore
      address: CONTRACT.REAL_ESTATE_STAKING_ADDRESS,
      functionName: "depositRewardTokens",
      // @ts-ignore
      args: [amount],
    });
    const result = await writeContract(config, request);
    return result;
  }

  async function setRewardsPerUnitTime(tokenId: bigint, rewards: bigint) {
    const { request } = await simulateContract(config, {
      abi: setRewardsPerUnitTimeABI,
      // @ts-ignore
      address: CONTRACT.REAL_ESTATE_STAKING_ADDRESS,
      functionName: "setRewardsPerUnitTime",
      // @ts-ignore
      args: [tokenId, rewards],
    });
    const result = await writeContract(config, request);
    return result;
  }

  async function multicall(data: Hex[]) {
    const { request } = await simulateContract(config, {
      abi: multicallABI,
      // @ts-ignore
      address: CONTRACT.REAL_ESTATE_STAKING_ADDRESS,
      functionName: "multicall",
      // @ts-ignore
      args: [data],
    });
    const result = await writeContract(config, request);
    return result;
  }

  return {
    stake,
    withdraw,
    batchClaimRewards,
    depositRewardTokens,
    setRewardsPerUnitTime,
    multicall,
  };
}
