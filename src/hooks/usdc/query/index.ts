import { useReadUSDCContract } from "..";

export function useUSDCQuery() {
  async function balanceOfUSDC(
    account: string
  ) {
    const { balanceOfUSDC } = useReadUSDCContract();
    const res = await balanceOfUSDC(account);
    return res;
  }

  return {
    balanceOfUSDC
  };
}
