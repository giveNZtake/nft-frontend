import { useState } from "react";
import { Link } from "react-router-dom";

import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { MdClose } from "react-icons/md";

import { ConnectButton } from "..";

export function Navbar() {
  const [isOpenMenu, setOpenMenu] = useState(false);

  const navList = (
    <ul className="absolute lg:relative w-full lg:flex items-center gap-8 text-slate-800 uppercase font-bold px-5 lg:p-0">
      <li className="mt-3 lg:mt-0 text-center hover:text-slate-500 cursor-pointer">
        <Link to="/">Mint</Link>
      </li>
      <li className="mt-3 lg:mt-0 text-center hover:text-slate-500 cursor-pointer">
        <Link to="/staking">Earn</Link>
      </li>
      <li className="mt-3 lg:mt-0 text-center hover:text-slate-500 cursor-pointer">
        <ConnectButton />
      </li>
    </ul>
  );

  return (
    <>
      <nav className="mx-auto container py-3 sm:py-5">
        <div className="flex justify-between ">
          <Link to="/">
            <h1 className="text-4xl italic underline font-serif font-bold">
              Real Estate Staking
            </h1>
          </Link>

          <div className="flex items-center">
            <button
              className="flex lg:hidden text-slate-800 p-2 focus:text-slate-500 text-secondary rounded-lg mr-5"
              onClick={() => setOpenMenu((cur) => !cur)}
            >
              {isOpenMenu === false ? (
                <HiOutlineMenuAlt2 className="text-2xl" />
              ) : (
                <MdClose className="text-2xl" />
              )}
            </button>
            <div className="mr-4 hidden lg:block">{navList}</div>
          </div>
        </div>
      </nav>
      {isOpenMenu && <div className="lg:hidden">{navList}</div>}
    </>
  );
}
