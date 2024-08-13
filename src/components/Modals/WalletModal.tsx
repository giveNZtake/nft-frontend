import { SetStateAction, Dispatch } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAccount, useDisconnect } from "wagmi";

import { MdClose } from "react-icons/md";
import { FiCopy, FiExternalLink } from "react-icons/fi";

interface IWalletModal {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function WalletModal({ isOpen, setOpen }: IWalletModal) {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  async function copyAddress() {
    try {
      if (address) {
        await navigator.clipboard.writeText(address);
      }
    } catch (e) {
      console.error("Failed to copy:", e);
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
            className="p-3 sm:p-5 relative text-slate-800 rounded-2xl w-full max-w-lg border border-slate-800"
          >
            <button
              className="absolute top-3 right-2.5 text-slate-800 hover:border hover:border-rose-500 hover:text-rose-500 rounded-xl p-1.5"
              onClick={() => setOpen(false)}
            >
              <MdClose className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </button>

            <h1 className="text-xl font-medium text-left">Account</h1>
            <div className="mt-3 sm:mt-5 p-3 sm:p-5 border border-slate-800 rounded-xl">
              <div className="flex flex-col gap-4 items-start">
                <button
                  onClick={() => {
                    disconnect();
                    setOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-secondary hover:text-slate-500 hover:bg-secondary"
                >
                  Disconnect
                </button>

                <p className="mt-1 text-2xl font-medium text-slate-800">
                  {address &&
                    address.slice(0, 6) + "..." + address.slice(39, 43)}
                </p>

                <div className="sm:flex gap-5 font-medium">
                  <button
                    onClick={() => copyAddress()}
                    className="flex items-center gap-1 hover:text-slate-400 focus:outline-none transition-all duration-300 p-1 rounded-lg"
                  >
                    <FiCopy /> Copy Address
                  </button>

                  <a
                    href={`https://sepolia.basescan.org/address/${address}`}
                    target="_blank"
                    className="flex items-center gap-1 normal-case hover:text-slate-400 focus:outline-none transition-all duration-300 p-1 rounded-lg"
                  >
                    <FiExternalLink /> View on Basescan
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
