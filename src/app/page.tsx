'use client'

import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import Link from "next/link";

export default function Home() {
  const account = useCurrentAccount();
  return (
    <div className="bg-cover bg-center min-h-main relative overflow-hidden">
      {/* Water background effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-400 via-blue-300 to-blue-500 animate-gradient">
        <div className="absolute inset-0 bg-[url('/water-pattern.svg')] opacity-20 animate-wave"></div>
      </div>
      <div className="grid grid-rows-2 place-items-center min-h-main relative z-10">
        <div className="">
          <p className="text-9xl font-bold text-white">SuiBadge</p>
        </div>
        <div className="">
          {
            account ?
            <Link href='/drops'>
              <button className="btn btn-neutral w-[200px] text-2xl">Make badge</button>
            </Link>
            :
            <ConnectButton />
          }
        </div>
      </div>
    </div>
  );
}
