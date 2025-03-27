import { useCurrentAccount } from "@mysten/dapp-kit";
import { OwnedObjects } from "./OwnedObjects";

export function WalletStatus() {
  const account = useCurrentAccount();

  return (
    <div className="">
      <p>Wallet Status</p>

      {account ? (
        <div className="flex flex-col">
          <p>Wallet connected</p>
          <p>Address: {account.address}</p>
        </div>
      ) : (
        <p>Wallet not connected</p>
      )}
      <OwnedObjects />
    </div>
  );
}
