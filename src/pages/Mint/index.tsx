import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import {
  GiDiamonds as DiamondIcon,
  GiGoldBar as GoldIcon,
  GiSilverBullet as SilverIcon,
  GiStoneStack as BronzeIcon,
} from "react-icons/gi";
import { Navbar } from "../../components";
import {
  useNFTMutation,
  useNFTQuery,
  useUSDCMutation,
  useUSDCQuery,
} from "../../hooks";
import { message } from "../../utils/message";
import { CONTRACT } from "../../constants";
import { formatUSDC } from "../../utils/utils";

export function Mint() {
  const { address } = useAccount();
  const { batchMintTo } = useNFTMutation();
  const { totalSupply } = useNFTQuery();
  const { approveUSDC } = useUSDCMutation();
  const { balanceOfUSDC } = useUSDCQuery();

  const [counts, setCounts] = useState([0, 0, 0, 0]);
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState(0n);
  const MAX_UINT256 = BigInt(1) << (BigInt(256) - BigInt(1));
  const [mintedCounts, setMintedCounts] = useState([0, 0, 0, 0]);

  const nftInfos = [
    {
      name: "Diamond",
      price: 50000,
      maxSupply: 20,
    },
    {
      name: "Gold",
      price: 10000,
      maxSupply: 100,
    },
    {
      name: "Silver",
      price: 1000,
      maxSupply: 1000,
    },
    {
      name: "Bronze",
      price: 100,
      maxSupply: 5000,
    },
  ];

  async function handleApproveUSDC() {
    setIsLoading(true);
    try {
      await approveUSDC(CONTRACT.REAL_ESTATE_NFT_ADDRESS, MAX_UINT256);
    } catch (error) {
      setIsLoading(false);
    }
    setIsLoading(false);
  }

  async function getMintedCounts() {
    const counts = [];
    for (let i = 0; i < 4; i++) {
      const result = await totalSupply(BigInt(i));
      counts.push(Number(result.toString()));
    }
    setMintedCounts(counts);
  }

  async function handleBatchMint() {
    if (!address) {
      message("note", "You should connect your wallet first.", 1);
      return;
    }

    if (counts[0] + counts[1] + counts[2] + counts[3] === 0) {
      message("note", "You should select one at least NFT to mint.", 1);
      return;
    }

    let ids = [],
      amounts = [];

    for (let i = 0; i < 4; i++) {
      if (counts[i] > 0) {
        ids.push(BigInt(i));
        amounts.push(BigInt(counts[i]));
      }
    }
    setIsLoading(true);
    const hash = await batchMintTo(
      address,
      ids,
      amounts,
      "https://example.com"
    );
    if (hash) {
      message("congratulations", "You minted successfully.", 2, hash);
      getMintedCounts();
      setIsLoading(false);
    } else {
      message("note", "You need to approve USDC first.");
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (address) {
      (async () => {
        // @ts-ignore
        const res = await balanceOfUSDC(address);
        setBalance(res);
      })();
    }
  }, [address, isLoading]);

  useEffect(() => {
    getMintedCounts();
  }, []);

  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className="mt-10">
        <section className="mx-auto max-w-4xl rounded-xl border border-slate-700 p-5">
          <div className="text-[20px] font-bold">
            USDC balance: {formatUSDC(balance)}
          </div>
          <div className="text-[20px] font-bold">
            Amount To Send:{" "}
            {counts[0] * nftInfos[0].price +
              counts[1] * nftInfos[1].price +
              counts[2] * nftInfos[2].price +
              counts[3] * nftInfos[3].price}{" "}
            USDC
          </div>

          <div className="grid grid-cols-4 gap-2 font-semibold">
            {counts.map((value, index) => {
              return (
                <div className="flex flex-col">
                  <div className="mx-auto">
                    {index == 0 ? (
                      <DiamondIcon className="text-9xl" />
                    ) : index == 1 ? (
                      <GoldIcon className="text-9xl" />
                    ) : index == 2 ? (
                      <SilverIcon className="text-9xl" />
                    ) : (
                      <BronzeIcon className="text-9xl" />
                    )}
                  </div>

                  <div className="mt-3 mx-auto flex items-center gap-3">
                    <button
                      onClick={() =>
                        setCounts((counts) =>
                          counts.map((v, i) => (i === index ? v - 1 : v))
                        )
                      }
                      className="text-slate-800 text-xl outline-none rounded-l-lg border border-slate-700 w-8 h-8 text-center"
                      disabled={value === 0}
                    >
                      -
                    </button>
                    <div className="text-slate-800 text-xl">
                      <input
                        className="w-10 text-center outline-none"
                        value={value}
                        onChange={(e) => {
                          if (
                            Number(e.target.value) >= 0 &&
                            Number(e.target.value) <=
                              nftInfos[index].maxSupply - mintedCounts[index]
                          ) {
                            setCounts((counts) =>
                              counts.map((v, i) =>
                                i === index ? Number(e.target.value) : v
                              )
                            );
                          }
                        }}
                      />
                    </div>
                    <button
                      onClick={() =>
                        setCounts((counts) =>
                          counts.map((v, i) => (i === index ? v + 1 : v))
                        )
                      }
                      disabled={
                        value ===
                        nftInfos[index].maxSupply - mintedCounts[index]
                      }
                      className="text-slate-800 text-xl outline-none rounded-r-lg border border-slate-700 w-8 h-8 text-center"
                    >
                      +
                    </button>
                  </div>
                  <div className="mt-2 mx-auto flex items-center gap-3">
                    <div>Price:</div>
                    <div>{nftInfos[index].price} USDC</div>
                  </div>
                  <div className="mt-2 mx-auto flex items-center gap-3">
                    <div>Total Supply:</div>
                    <div>{nftInfos[index].maxSupply}</div>
                  </div>
                  <div className="mt-2 mx-auto flex items-center gap-3">
                    <div>Minted Counts:</div>
                    <div>{mintedCounts[index]}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-[20px] mx-auto w-full justify-center">
            <div className="gap-[20px] mt-5 flex justify-center items-center">
              <button
                onClick={handleApproveUSDC}
                className="flex justify-center rounded-xl border border-slate-700 w-36 p-3 font-semibold focus:outline-none transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
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
            </div>

            <div className="gap-[20px] mt-5 flex justify-center items-center">
              <button
                onClick={handleBatchMint}
                className="flex justify-center rounded-xl border border-slate-700 w-36 p-3 font-semibold focus:outline-none transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
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
                  "Mint"
                )}
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
