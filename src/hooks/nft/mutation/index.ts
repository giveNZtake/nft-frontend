import { useWriteNFTContract } from "..";

export function useNFTMutation() {
  async function batchMintTo(
    to: string,
    tokenIds: bigint[],
    amounts: bigint[],
    baseURI: string
  ) {
    const { batchMintTo } = useWriteNFTContract();
    const res = await batchMintTo(to, tokenIds, amounts, baseURI);
    return res;
  }

  async function setApprovalForAll(operator: string, approved: boolean) {
    const { setApprovalForAll } = useWriteNFTContract();
    const res = await setApprovalForAll(operator, approved);
    return res;
  }

  return {
    batchMintTo,
    setApprovalForAll,
  };
}
