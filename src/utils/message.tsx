import toast from "react-hot-toast";

import { MdClose } from "react-icons/md";
import { FiCheckCircle, FiInfo } from "react-icons/fi";

export function message(
  summary: string,
  message: string,
  type = -1,
  hash = ""
) {
  return toast.custom((t) => (
    <div
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } relative max-w-sm w-full border rounded-lg pointer-events-auto flex border-l-8 z-30 bg-white ${
        type === 1 && "border-slate-700"
      } ${type === 2 && "border-green-500"}`}
    >
      <div className="flex-1 w-0 p-3">
        <div className="flex items-center">
          <div className="flex-shrink-0 pt-0.5">
            {type === 1 && <FiInfo className="text-slate-800 text-2xl" />}
            {type === 2 && (
              <FiCheckCircle className="text-green-500 text-2xl" />
            )}
          </div>
          <div className="ml-3 flex-1">
            <p className="uppercase font-medium text-slate-800">{summary}</p>
            <p className="mt-1 text-sm text-text-slate-700">{message}</p>
            {hash.length > 0 && (
              <a
                className="mt-1 text-sm text-slate-800 italic underline hover:text-slate-500"
                href={`https://sepolia.basescan.org/tx/${hash}`}
                target="_blank"
              >
                View on Basescan
              </a>
            )}
          </div>
        </div>
      </div>
      <button
        className="absolute top-3 right-2.5 text-rose-500 border border-rose-500 hover:bg-rose-500 hover:text-slate-800 rounded-full p-1"
        onClick={() => toast.dismiss(t.id)}
      >
        <MdClose />
        <span className="sr-only">Close</span>
      </button>
    </div>
  ));
}
