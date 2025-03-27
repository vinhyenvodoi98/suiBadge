'use client'
import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";

export function OwnedObjects() {
  const account = useCurrentAccount();
  const { data, isPending, error } = useSuiClientQuery(
    "getOwnedObjects",
    {
      owner: account?.address as string,
    },
    {
      enabled: !!account,
    },
  );

  if (!account) {
    return;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (isPending || !data) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col">
      {data.data.length === 0 ? (
        <p>No objects owned by the connected wallet</p>
      ) : (
        <p>Objects owned by the connected wallet</p>
      )}
      {data.data.map((object) => (
        <div className="flex" key={object.data?.objectId}>
          <p>Object ID: {object.data?.objectId}</p>
        </div>
      ))}
    </div>
  );
}
