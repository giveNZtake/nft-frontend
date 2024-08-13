import { useState, useEffect, SetStateAction, Dispatch } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAccount } from "wagmi";

import { MdClose } from "react-icons/md";
import { CONTRACT } from "../../constants";
import { useNFTQuery, useNFTMutation, useStakingMutation } from "../../hooks";
import { message } from "../../utils/message";

interface IStakingModal {
  isOpen: boolean;
  tokenId: bigint;
  balance: bigint;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function StakingModal({
  isOpen,
  setOpen,
  tokenId,
  balance,
}: IStakingModal) {
  const { address } = useAccount();
  const { isApprovedForAll } = useNFTQuery();
  const { setApprovalForAll } = useNFTMutation();
  const { stake } = useStakingMutation();

  const [amount, setAmount] = useState<number>(0);
  const [errors, setErrors] = useState<any>({});
  const [isApproved, setApproved] = useState<boolean>(false);
  const [isApproveLoading, setApproveLoading] = useState(false);
  const [isStakeLoading, setStakeLoading] = useState(false);

  useEffect(() => {
    if (address) {
      async function getData() {
        const res = await isApprovedForAll(
          // @ts-ignore
          address,
          // @ts-ignore
          CONTRACT.REAL_ESTATE_STAKING_ADDRESS
        );
        if (res) {
          setApproved(res);
        }
      }
      getData();
    }
  }, [address]);

  async function handleApproveForALl() {
    try {
      setApproveLoading(true);
      const hash = await setApprovalForAll(
        CONTRACT.REAL_ESTATE_STAKING_ADDRESS,
        true
      );
      if (hash) {
        message("congratulations", "You approved successfully.", 2, hash);
        setApproved(true);
        setApproveLoading(false);
      }
    } catch (e) {
      setApproveLoading(false);
      console.log(e);
    }
  }

  async function handleStake() {
    if (isApproved === false) {
      message("note", "You should approve first.", 1);
      return;
    }

    const validationErrors: any = {};
    if (amount === 0) {
      validationErrors.amount = "You should input amount.";
    }

    if (amount > Number(balance)) {
      validationErrors.amount = "You should input amount less than balance.";
    }

    setErrors(validationErrors);
    setTimeout(() => {
      setErrors({});
    }, 2000);

    try {
      if (Object.keys(validationErrors).length === 0) {
        setStakeLoading(true);
        const hash = await stake(tokenId, BigInt(amount));
        if (hash) {
          message("congratulations", "You approved successfully", 2, hash);
          setStakeLoading(false);
          window.location.reload();
        }
      }
    } catch (e) {
      setStakeLoading(false);
      console.log(e);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="bg-slate-400/20 backdrop-blur p-3 sm:p-5 fixed inset-0 z-50 grid place-items-center cursor-pointer"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ scale: 0, rotate: "40deg" }}
            animate={{ scale: 1, rotate: "0deg" }}
            exit={{ scale: 0, rotate: "0deg" }}
            onClick={(e) => e.stopPropagation()}
            className="p-3 sm:p-5 relative text-slate-800 rounded-2xl w-full max-w-md border border-slate-800"
          >
            <button
              className="absolute top-3 right-2.5 text-slate-800 hover:border hover:border-rose-500 hover:text-rose-500 rounded-xl p-1.5"
              onClick={() => setOpen(false)}
            >
              <MdClose className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </button>

            <h1 className="text-xl font-medium text-left">Staking</h1>
            <div className="mt-3 sm:mt-5 p-3 sm:p-5 border border-slate-700 rounded-xl">
              <h2 className="font-bold italic">Balance : {Number(balance)}</h2>

              <input
                className={`mt-3 w-full outline-none rounded-xl p-2 ${
                  errors?.amount && "border border-rose-500"
                }`}
                placeholder="Input amount"
                defaultValue={0}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
              {errors?.amount && (
                <p className="mt-2 text-rose-500">{errors.amount}</p>
              )}

              <div className="mt-3 sm:flex gap-5 font-medium justify-end">
                <button
                  onClick={handleApproveForALl}
                  className="w-24 text-center border border-slate-800 rounded-xl hover:text-slate-600 focus:outline-none transition-all duration-300 p-2 disabled:border-none disabled:text-slate-400"
                  disabled={isApproved || isApproveLoading}
                >
                  Approve
                </button>

                <button
                  onClick={handleStake}
                  className="flex justify-center w-24 text-center border border-slate-800 rounded-xl hover:text-slate-600 focus:outline-none transition-all duration-300 p-2"
                  disabled={isStakeLoading}
                >
                  {isStakeLoading ? (
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
                    "Stake"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
