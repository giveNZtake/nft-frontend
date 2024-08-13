import { Hex } from "viem";
import { useWriteStakingContract } from "../contract";

export function useStakingMutation() {
  async function stake(tokenId: bigint, amount: bigint) {
    const { stake } = useWriteStakingContract();
    const res = await stake(tokenId, amount);
    return res;
  }

  async function withdraw(tokenId: bigint, amount: bigint) {
    const { withdraw } = useWriteStakingContract();
    const res = await withdraw(tokenId, amount);
    return res;
  }

  async function batchClaimRewards(tokenIds: bigint[]) {
    const { batchClaimRewards } = useWriteStakingContract();
    const res = await batchClaimRewards(tokenIds);
    return res;
  }

  async function depositRewardTokens(amount: bigint) {
    const { depositRewardTokens } = useWriteStakingContract();
    const res = await depositRewardTokens(amount);
    return res;
  }

  async function setRewardsPerUnitTime(tokenId: bigint, rewards: bigint) {
    const { setRewardsPerUnitTime } = useWriteStakingContract();
    const res = await setRewardsPerUnitTime(tokenId, rewards);
    return res;
  }

  async function multicall(data: Hex[]) {
    const { multicall } = useWriteStakingContract();
    const res = await multicall(data);
    return res;
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
