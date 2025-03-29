'use client'

import { ConnectButton } from '@mysten/dapp-kit';

export default function Header() {

  return (
    <div className='sticky top-0 z-50'>
      <div className='flex items-center justify-between px-6 h-32'>
        <div className="navbar">
          <div className="navbar-start">
          </div>
          <div className="navbar-end flex gap-4">
            <ConnectButton />
          </div>
        </div>
      </div>
    </div>
  );
}
