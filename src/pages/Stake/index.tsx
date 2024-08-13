import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { encodeFunctionData } from "viem";
import {
  GiDiamonds as DiamondIcon,
  GiGoldBar as GoldIcon,
  GiSilverBullet as SilverIcon,
  GiStoneStack as BronzeIcon,
} from "react-icons/gi";
import { Navbar, StakingModal } from "../../components";
import {
  useNFTQuery,
  useStakingQuery,
  useStakingMutation,
  useUSDCQuery,
  useUSDCMutation,
} from "../../hooks";
import { message } from "../../utils/message";
import { ONE_IN_DECIMALS, formatUSDC } from "../../utils/utils";
import { CONTRACT } from "../../constants";
import { WithdrawModal } from "../../components/Modals/WithdrawModal";
import { setRewardsPerUnitTimeABI } from "../../contracts";

export function Stake() {
  const [balances, setBalances] = useState([0n, 0n, 0n, 0n]);
  const [stakedBalances, setStakedBalances] = useState([0n, 0n, 0n, 0n]);
  const [rewards, setRewards] = useState([0n, 0n, 0n, 0n]);
  const [totalRewards, setTotalRewards] = useState(0n);
  const [isOpen, setOpen] = useState(false);
  const [isOpen1, setOpen1] = useState(false);
  const [tokenId, setTokenId] = useState(0n);
  const [balance, setBalance] = useState(0n);
  const [isClaimLoading, setClaimLoading] = useState(false);
  const [usdcBalance, setUSDCBalance] = useState(0n);
  const [usdcBalanceOnStaking, setUSDCBalanceOnStaking] = useState(0n);

  const { address } = useAccount();
  const { balanceOfUSDC } = useUSDCQuery();
  const { approveUSDC } = useUSDCMutation();
  const { balanceOfBatch } = useNFTQuery();
  const { getStakeInfo, getStakeInfoForToken, getRewardsPerUnitTime } =
    useStakingQuery();
  const {
    batchClaimRewards,
    depositRewardTokens,
    multicall,
  } = useStakingMutation();
  const [totalStakedBalances, setTotalStakedBalances] = useState([
    0n,
    0n,
    0n,
    0n,
  ]);
  const { getOwner } = useStakingQuery();
  const [depositAmount, setDepostAmount] = useState("");
  const [profitAmount, setProfitAmount] = useState("");
  const [owner, setOwner] = useState("");

  const MAX_UINT256 = BigInt(1) << (BigInt(256) - BigInt(1));

  async function getProfitAmount() {
    try {
      const result = await getRewardsPerUnitTime(0n);
      return BigInt(result) / ONE_IN_DECIMALS;
    } catch {
      return 0n;
    }
  }

  useEffect(() => {
    async function getAdminData() {
      const res = await getOwner();
      setOwner(res);
      const r = await getProfitAmount();
      setProfitAmount(r.toString());
    }
    getAdminData();
  }, []);

  useEffect(() => {
    (async () => {
      const res = await balanceOfUSDC(CONTRACT.REAL_ESTATE_STAKING_ADDRESS);
      setUSDCBalanceOnStaking(res);
    })();
  }, []);

  useEffect(() => {
    const accounts = Array(4).fill(CONTRACT.REAL_ESTATE_STAKING_ADDRESS);
    (async () => {
      const res: any = await balanceOfBatch(accounts, [0n, 1n, 2n, 3n]);
      setTotalStakedBalances(res);
    })();
  }, []);

  useEffect(() => {
    if (address) {
      const accounts = Array(4).fill(address);
      (async () => {
        const res: any = await balanceOfBatch(accounts, [0n, 1n, 2n, 3n]);
        if (res) {
          setBalances(res);
        }
      })();
    }
  }, [address]);

  useEffect(() => {
    if (address) {
      (async () => {
        const res = await balanceOfUSDC(address);
        setUSDCBalance(res);
      })();
    }
  }, [address]);

  useEffect(() => {
    if (address) {
      (async () => {
        // @ts-ignore
        const res: any = await getStakeInfo(address);
        if (res) {
          const array = Array(4).fill(0n);
          const ids_array: bigint[] = res[0],
            balances_array: bigint[] = res[1];
          ids_array.forEach((value, index) => {
            array[Number(value)] = balances_array[index];
          });
          setStakedBalances(array);
          setTotalRewards(res[2]);
        }

        let array = [];
        for (let i = 0; i < 4; i++) {
          const res = await getStakeInfoForToken(BigInt(i), address);
          if (res[0] > 0) array.push(res[1]);
          else array.push(0n);
        }
        setRewards(array);
      })();
    } else {
      setStakedBalances([0n, 0n, 0n, 0n]);
      setRewards([0n, 0n, 0n, 0n]);
    }
  }, [address]);

  function handleStakeModal(index: number) {
    if (balances.length > 0 && Number(balances[index]) === 0) {
      message(
        "note",
        "You do not have this type of NFT in your wallet to stake.",
        1
      );
      return;
    }
    setOpen(true);
    setBalance(balances[index]);
    setTokenId(BigInt(index));
  }

  function handleWithdrawModal(index: number) {
    if (Number(stakedBalances[index]) > 0 === false) {
      message(
        "note",
        "You do not have this type of NFT stacked at this time",
        1
      );
      return;
    }
    setOpen1(true);
    setBalance(stakedBalances[index]);
    setTokenId(BigInt(index));
  }

  async function handleClaim() {
    if (totalRewards === 0n) {
      message("note", "You do not have any rewards to claim at this time", 1);
      return;
    }
    try {
      setClaimLoading(true);
      const hash = await batchClaimRewards([0n, 1n, 2n, 3n]);
      if (hash) {
        message("congratulations", "You claimed successfully", 2, hash);
        setClaimLoading(false);
      }
    } catch (e) {
      message("Failed", "You cannot claim reward yet", 1);
      setClaimLoading(false);
    }
  }

  async function handleApproveUSDC() {
    setClaimLoading(true);
    try {
      await approveUSDC(CONTRACT.REAL_ESTATE_STAKING_ADDRESS, MAX_UINT256);
    } catch (error) {
      setClaimLoading(false);
    }
    setClaimLoading(false);
  }

  async function handleDepositReward() {
    setClaimLoading(true);
    try {
      await depositRewardTokens(BigInt(depositAmount) * ONE_IN_DECIMALS);
    } catch (error) {
      message("Error", "Approve USDC firstly!", 1);
      setClaimLoading(false);
    }
    setClaimLoading(false);
  }

  async function handleSetProfitAmount() {
    setClaimLoading(true);
    try {
      await multicall([
        encodeFunctionData({
          abi: setRewardsPerUnitTimeABI,
          functionName: "setRewardsPerUnitTime",
          args: [0n, BigInt(profitAmount) * ONE_IN_DECIMALS],
        }),
        encodeFunctionData({
          abi: setRewardsPerUnitTimeABI,
          functionName: "setRewardsPerUnitTime",
          args: [1n, (BigInt(profitAmount) * ONE_IN_DECIMALS) / 5n],
        }),
        encodeFunctionData({
          abi: setRewardsPerUnitTimeABI,
          functionName: "setRewardsPerUnitTime",
          args: [2n, (BigInt(profitAmount) * ONE_IN_DECIMALS) / 50n],
        }),
        encodeFunctionData({
          abi: setRewardsPerUnitTimeABI,
          functionName: "setRewardsPerUnitTime",
          args: [3n, (BigInt(profitAmount) * ONE_IN_DECIMALS) / 500n],
        }),
      ]);
      setClaimLoading(false);
    } catch (error) {
      console.log(error);
      message("Error", "Approve USDC firstly!", 1);
    }
    setClaimLoading(false);
  }

  return (
    <>
      <header>
        <Navbar />
      </header>

      {address === owner ? (
        <>
          <main className="mt-10 flex justify-center gap-3">
            <section className="grid grid-cols-2 gap-3">
              {totalStakedBalances.map((value, index) => (
                <div className="rounded-xl border border-slate-700 p-3">
                  <div className="flex justify-between gap-7">
                    <div className="flex gap-3 items-center">
                      {index == 0 ? (
                        <DiamondIcon className="text-8xl" />
                      ) : index == 1 ? (
                        <GoldIcon className="text-8xl" />
                      ) : index == 2 ? (
                        <SilverIcon className="text-8xl" />
                      ) : (
                        <BronzeIcon className="text-8xl" />
                      )}
                      <div className="text-lg font-bold italic">
                        <p className="mt-3">
                          Staked Amount : {value?.toString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </section>

            <aside className="min-w-72 border border-slate-700 rounded-xl p-3 flex flex-col justify-between">
              <div>
                <h2 className="mt-10 text-xl font-bold italic">
                  USDC on Staking Contract
                </h2>
                <h2 className="text-2xl font-bold">
                  {formatUSDC(usdcBalanceOnStaking)}
                </h2>
                <h2 className="mt-10 text-xl font-bold italic">USDC Balance</h2>
                <h2 className="text-2xl font-bold">
                  {formatUSDC(usdcBalance)}
                </h2>
              </div>
            </aside>
          </main>

          <div className="flex justify-center mt-10 gap-3">
            <div className="rounded-xl border border-slate-700 p-3">
              <div>Deposit USDC</div>
              <div className="flex items-center gap-3">
                <input
                  className="outline-none border-[1px] border-black"
                  value={depositAmount}
                  onChange={(e) => setDepostAmount(e.target.value)}
                />
                <button
                  onClick={() => handleApproveUSDC()}
                  className="rounded-xl border border-slate-700 w-32 p-2 font-semibold focus:outline-none transition-all duration-300"
                  disabled={isClaimLoading}
                >
                  {isClaimLoading ? (
                    <svg
                      className="w-6 h-6 text-slate-400 animate-spin fill-slate-800"
                      viewBox="0 0 101 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                  ) : (
                    "Approve"
                  )}
                </button>
                <button
                  onClick={() => handleDepositReward()}
                  className="rounded-xl border border-slate-700 w-32 p-2 font-semibold focus:outline-none transition-all duration-300"
                  disabled={isClaimLoading}
                >
                  {isClaimLoading ? (
                    <svg
                      className="w-6 h-6 text-slate-400 animate-spin fill-slate-800"
                      viewBox="0 0 101 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                  ) : (
                    "Deposit"
                  )}
                </button>
              </div>
            </div>
            <div className="rounded-xl border border-slate-700 p-3">
              <div>Profit amount</div>
              <div className="flex items-center gap-3">
                <input
                  className="outline-none border-[1px] border-black"
                  value={profitAmount}
                  onChange={(e) => setProfitAmount(e.target.value)}
                />
                <button
                  onClick={() => handleSetProfitAmount()}
                  className="rounded-xl border border-slate-700 w-32 p-2 font-semibold focus:outline-none transition-all duration-300"
                  disabled={isClaimLoading}
                >
                  {isClaimLoading ? (
                    <svg
                      className="w-6 h-6 text-slate-400 animate-spin fill-slate-800"
                      viewBox="0 0 101 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                  ) : (
                    "Set"
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <main className="mt-10 flex justify-center gap-3">
          <section className="grid grid-cols-2 gap-3">
            {totalStakedBalances.map((_, index) => (
              <div className="rounded-xl border border-slate-700 p-3">
                <div className="flex justify-between gap-7">
                  <div className="flex gap-3 items-center">
                    {index == 0 ? (
                      <DiamondIcon className="text-8xl" />
                    ) : index == 1 ? (
                      <GoldIcon className="text-8xl" />
                    ) : index == 2 ? (
                      <SilverIcon className="text-8xl" />
                    ) : (
                      <BronzeIcon className="text-8xl" />
                    )}
                    <div className="text-lg font-bold italic">
                      <p>
                        Balance :{" "}
                        {balances.length > 0 && balances[index].toString()}
                      </p>

                      <p className="mt-3">
                        Staked Amount : {stakedBalances[index].toString()}
                      </p>
                      <p className="mt-3">
                        Rewards : {formatUSDC(rewards[index])}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between">
                    <button
                      onClick={() => handleStakeModal(index)}
                      className="rounded-xl border border-slate-700 w-32 p-2 font-semibold focus:outline-none transition-all duration-300"
                      disabled={isClaimLoading}
                    >
                      Stake
                    </button>

                    <button
                      onClick={() => handleWithdrawModal(index)}
                      className="flex justify-center rounded-xl border border-slate-700 w-32 p-2 font-semibold focus:outline-none transition-all duration-300"
                      disabled={isClaimLoading}
                    >
                      Unstake
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </section>

          <aside className="min-w-72 border border-slate-700 rounded-xl p-3 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold italic">Total Rewards</h2>
              <h2 className="text-2xl font-bold">
                {formatUSDC(totalRewards)} USDC
              </h2>
              <h2 className="mt-10 text-xl font-bold italic">USDC Balance</h2>
              <h2 className="text-2xl font-bold">{formatUSDC(usdcBalance)}</h2>
              <button
                onClick={handleClaim}
                className="mt-10 flex justify-center rounded-xl border border-slate-700 w-36 p-3 font-semibold focus:outline-none transition-all duration-300"
                disabled={isClaimLoading}
              >
                {isClaimLoading ? (
                  <svg
                    className="w-6 h-6 text-slate-400 animate-spin fill-slate-800"
                    viewBox="0 0 101 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                ) : (
                  "Claim"
                )}
              </button>
            </div>
          </aside>
        </main>
      )}

      {isOpen && (
        <StakingModal
          isOpen={isOpen}
          setOpen={setOpen}
          tokenId={tokenId}
          balance={balance}
        />
      )}
      {isOpen1 && (
        <WithdrawModal
          isOpen={isOpen1}
          setOpen={setOpen1}
          tokenId={tokenId}
          balance={balance}
        />
      )}
    </>
  );
}
