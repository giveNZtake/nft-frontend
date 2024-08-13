import { useReadStakingContract } from "../contract";

export function useStakingQuery() {
  async function getStakeInfo(address: string) {
    const { getStakeInfo } = useReadStakingContract();
    const res = await getStakeInfo(address);
    return res;
  }

  async function getStakeInfoForToken(tokenId: bigint, address: string) {
    const { getStakeInfoForToken } = useReadStakingContract();
    const res = await getStakeInfoForToken(tokenId, address);
    return res;
  }

  async function getOwner() {
    const { owner } = useReadStakingContract();
    const res = await owner();
    return res;
  }

  async function getRewardsPerUnitTime(tokenId: bigint) {
    const { getRewardsPerUnitTime } = useReadStakingContract();
    const res = await getRewardsPerUnitTime(tokenId);
    return res;
  }

  return {
    getStakeInfo,
    getStakeInfoForToken,
    getOwner,
    getRewardsPerUnitTime,
  };
}
