import { readContract, simulateContract, writeContract } from "@wagmi/core";
import { config } from "../../../config";
import { CONTRACT } from "../../../constants";
import {
  batchMintToABI,
  setApprovalForAllABI,
  balanceOfBatchABI,
  isApprovedForAllABI,
  totalSupplyABI,
} from "../../../contracts";

export function useReadNFTContract() {
  async function balanceOfBatch(accounts: string[], ids: bigint[]) {
    const result = await readContract(config, {
      abi: balanceOfBatchABI,
      // @ts-ignore
      address: CONTRACT.REAL_ESTATE_NFT_ADDRESS,
      functionName: "balanceOfBatch",
      // @ts-ignore
      args: [accounts, ids],
    });
    return result;
  }

  async function isApprovedForAll(account: string, operator: string) {
    const result = await readContract(config, {
      abi: isApprovedForAllABI,
      // @ts-ignore
      address: CONTRACT.REAL_ESTATE_NFT_ADDRESS,
      functionName: "isApprovedForAll",
      // @ts-ignore
      args: [account, operator],
    });
    return result;
  }

  async function totalSupply(tokenId: bigint) {
    const result = await readContract(config, {
      abi: totalSupplyABI,
      // @ts-ignore
      address: CONTRACT.REAL_ESTATE_NFT_ADDRESS,
      functionName: "totalSupply",
      // @ts-ignore
      args: [tokenId],
    });
    return result;
  }

  return {
    balanceOfBatch,
    isApprovedForAll,
    totalSupply,
  };
}

export function useWriteNFTContract() {
  async function batchMintTo(
    to: string,
    tokenIds: bigint[],
    amounts: bigint[],
    baseURI: string
  ) {
    const { request } = await simulateContract(config, {
      abi: batchMintToABI,
      // @ts-ignore
      address: CONTRACT.REAL_ESTATE_NFT_ADDRESS,
      functionName: "batchMintTo",
      // @ts-ignore
      args: [to, tokenIds, amounts, baseURI],
    });
    const result = await writeContract(config, request);
    return result;
  }

  async function setApprovalForAll(operator: string, approved: boolean) {
    const { request } = await simulateContract(config, {
      abi: setApprovalForAllABI,
      // @ts-ignore
      address: CONTRACT.REAL_ESTATE_NFT_ADDRESS,
      functionName: "setApprovalForAll",
      // @ts-ignore
      args: [operator, approved],
    });
    const result = await writeContract(config, request);
    return result;
  }

  return { batchMintTo, setApprovalForAll };
}
