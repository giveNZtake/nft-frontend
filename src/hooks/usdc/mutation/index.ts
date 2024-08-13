import { useWriteUSDCContract } from "..";

export function useUSDCMutation() {
  async function approveUSDC(
    spender: string, amount: bigint
  ) {
    const { approveUSDC } = useWriteUSDCContract();
    const res = await approveUSDC(spender, amount);
    return res;
  }

  return {
    approveUSDC
  };
}
