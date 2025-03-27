'use client'

import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import Link from "next/link";

export default function Home() {
  const account = useCurrentAccount();
  return (
    <div className="bg-cover bg-center min-h-main">
      <div className="grid grid-rows-2 place-items-center min-h-main">
        <div className="">
          <p className="text-9xl font-bold text-white">SuiBadge</p>
        </div>
        <div className="">
          {
            account ?
            <Link href='/garden'>
              <button className="btn btn-neutral w-[200px] text-2xl">Play 🎮</button>
            </Link>
            :
            <ConnectButton />
          }
        </div>
      </div>
    </div>
  );
}
