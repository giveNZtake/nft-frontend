export const ONE_IN_DECIMALS = BigInt(1000000000000000000);

export const formatUSDC = (value: bigint) => {
  return (
    parseFloat(((value * 1000n) / ONE_IN_DECIMALS).toString()) / 1000
  ).toFixed(3);
};
