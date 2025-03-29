'use client';

import { useEffect, useState } from 'react';
import { useCurrentAccount, useSignAndExecuteTransactionBlock } from '@mysten/dapp-kit';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { Drop, MintLink, MintStatus } from '@/types/drop';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { SuiTransactionBlockResponse } from '@mysten/sui.js/client';

interface MintPageProps {
  params: {
    id: string;
  };
}

export default function MintPage({ params }: MintPageProps) {
  const router = useRouter();
  const account = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransactionBlock();
  const [drop, setDrop] = useState<Drop | null>(null);
  const [mintLink, setMintLink] = useState<MintLink | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mintStatus, setMintStatus] = useState<MintStatus | null>(null);
  const [isMinting, setIsMinting] = useState(false);

  useEffect(() => {
    validateMintLink();
  }, [params.id]);

  const validateMintLink = async () => {
    try {
      const response = await fetch(`/api/mint-links/${params.id}`);
      if (!response.ok) {
        if (response.status === 404) {
          toast.error('Invalid mint link');
          router.push('/');
          return;
        }
        throw new Error('Failed to validate mint link');
      }

      const data = await response.json();
      setMintLink(data);
      setDrop(data.drop);

      if (data.isUsed) {
        toast.error('This mint link has already been used');
        router.push('/');
        return;
      }

      if (new Date(data.expiresAt) < new Date()) {
        toast.error('This mint link has expired');
        router.push('/');
        return;
      }
    } catch (error) {
      console.error('Error validating mint link:', error);
      toast.error('Failed to validate mint link');
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMint = async () => {
    if (!account?.address || !mintLink || !drop) return;

    setIsMinting(true);
    try {
      // Create a new transaction block
      const tx = new TransactionBlock();
      
      // Add mint transaction
      tx.moveCall({
        target: `${drop.packageId}::nft::mint`,
        arguments: [
          tx.object(drop.objectId),
          tx.pure(drop.maxSupply),
        ],
      });

      // Sign and execute the transaction
      const result = await signAndExecute({
        transactionBlock: tx,
        options: {
          showEffects: true,
        },
      }) as SuiTransactionBlockResponse;

      // Update mint link status
      const response = await fetch(`/api/mint-links/${mintLink.uniqueId}/mint`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userAddress: account.address,
        }),
      });

      if (!response.ok) throw new Error('Failed to update mint link status');

      setMintStatus({
        status: 'success',
        message: 'NFT minted successfully!',
        transactionHash: result.digest,
      });

      // Refresh mint link status
      validateMintLink();
    } catch (error) {
      console.error('Error minting NFT:', error);
      setMintStatus({
        status: 'error',
        message: 'Failed to mint NFT. Please try again.',
      });
    } finally {
      setIsMinting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-main bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!drop || !mintLink) {
    return null;
  }

  return (
    <div className="min-h-main bg-gradient-to-br from-blue-50 to-cyan-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="backdrop-blur-lg bg-white/70 rounded-2xl shadow-xl p-8 border border-white/20">
            <div className="relative h-72 w-full mb-8 rounded-xl overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
              <Image
                src={drop.image}
                alt={drop.name}
                fill
                className="object-cover"
              />
            </div>

            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {drop.name}
            </h1>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              {drop.description}
            </p>

            {mintStatus ? (
              <div className={`p-4 rounded-xl ${
                mintStatus.status === 'success'
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center gap-2">
                  {mintStatus.status === 'success' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                  <p className={mintStatus.status === 'success' ? 'text-green-700' : 'text-red-700'}>
                    {mintStatus.message}
                  </p>
                </div>
                {mintStatus.transactionHash && (
                  <a
                    href={`https://suiexplorer.com/txblock/${mintStatus.transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800 block"
                  >
                    View on Explorer →
                  </a>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-white/50 rounded-xl backdrop-blur-sm">
                    <p className="text-gray-500">Maximum Supply</p>
                    <p className="font-medium text-gray-700">{drop.maxSupply}</p>
                  </div>
                  <div className="p-3 bg-white/50 rounded-xl backdrop-blur-sm">
                    <p className="text-gray-500">Expires</p>
                    <p className="font-medium text-gray-700">
                      {new Date(mintLink.expiresAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleMint}
                  disabled={isMinting || !account?.address}
                  className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {isMinting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Minting...
                    </>
                  ) : !account?.address ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                      </svg>
                      Connect Wallet
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                      </svg>
                      Mint NFT
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 