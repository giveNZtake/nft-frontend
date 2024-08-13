import { useState } from "react";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount } from "wagmi";
import { FaWallet } from "react-icons/fa6";
import { WalletModal } from "../Modals";

export function ConnectButton() {
  const { open } = useWeb3Modal();
  const { address } = useAccount();
  const [isOpenModal, setOpenModal] = useState(false);

  return (
    <>
      {!address ? (
        <button
          className="flex justify-center items-center text-slate-800 border border-slate-700 rounded-xl w-full px-4 py-3 hover:shadow-md hover:shadow-slate-400 gap-5"
          onClick={() => open({ view: "Networks" })}
        >
          <FaWallet />
          Connect
        </button>
      ) : (
        <div className="relative w-full">
          <button
            onClick={() => setOpenModal(true)}
            className="text-slate-800 border border-slate-700 rounded-xl w-full px-4 py-3 hover:shadow-md hover:shadow-slate-400"
          >
            {address.slice(0, 5)} ... {address.slice(39, 43)}
          </button>
        </div>
      )}
      {isOpenModal && (
        <WalletModal isOpen={isOpenModal} setOpen={setOpenModal} />
      )}
    </>
  );
}
