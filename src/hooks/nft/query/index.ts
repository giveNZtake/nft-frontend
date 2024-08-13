import { useReadNFTContract } from "../contract";

export function useNFTQuery() {
  async function balanceOfBatch(accounts: string[], ids: bigint[]) {
    const { balanceOfBatch } = useReadNFTContract();
    const res = await balanceOfBatch(accounts, ids);
    return res;
  }

  async function isApprovedForAll(account: string, operator: string) {
    const { isApprovedForAll } = useReadNFTContract();
    const res = await isApprovedForAll(account, operator);
    return res;
  }

  async function totalSupply(tokenId: bigint) {
    const { totalSupply } = useReadNFTContract();
    const res = await totalSupply(tokenId);
    return res;
  }

  return {
    balanceOfBatch,
    isApprovedForAll,
    totalSupply,
  };
}
