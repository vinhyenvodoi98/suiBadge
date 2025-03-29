'use client';

import { useEffect, useState } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useRouter } from 'next/navigation';
import { Drop, MintConfig, MintLink } from '@/types/drop';
import { format } from 'date-fns';
import Image from 'next/image';
import { toast } from 'react-toastify';
import GenerateMintLinkModal from '@/components/GenerateMintLinkModal';

interface DropDetailsPageProps {
  params: {
    id: string;
  };
}

export default function DropDetailsPage({ params }: DropDetailsPageProps) {
  const router = useRouter();
  const account = useCurrentAccount();
  const [drop, setDrop] = useState<Drop | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mintConfig, setMintConfig] = useState<MintConfig>({
    type: 'link',
  });
  const [whitelistAddresses, setWhitelistAddresses] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [mintLinks, setMintLinks] = useState<MintLink[]>([]);
  const [copiedLinks, setCopiedLinks] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchDropDetails();
    fetchMintLinks();
  }, [params.id]);

  const fetchDropDetails = async () => {
    try {
      const response = await fetch(`/api/drops/${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch drop details');
      const data = await response.json();
      setDrop(data);
      if (data.mintConfig) {
        setMintConfig(data.mintConfig);
        if (data.mintConfig.whitelist) {
          setWhitelistAddresses(data.mintConfig.whitelist.map((entry: any) => entry.address));
        }
      }
    } catch (error) {
      console.error('Error fetching drop details:', error);
      toast.error('Failed to load drop details');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMintLinks = async () => {
    try {
      const response = await fetch(`/api/drops/${params.id}/mint-links`);
      if (!response.ok) throw new Error('Failed to fetch mint links');
      const data = await response.json();
      setMintLinks(data);
    } catch (error) {
      console.error('Error fetching mint links:', error);
      toast.error('Failed to load mint links');
    }
  };

  const handleMintConfigChange = (type: 'link' | 'whitelist') => {
    setMintConfig({
      type,
      ...(type === 'whitelist' ? { whitelist: [] } : {}),
    });
  };

  const handleWhitelistUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const addresses = text
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && line.startsWith('0x'));

      setWhitelistAddresses(addresses);
      setMintConfig({
        type: 'whitelist',
        whitelist: addresses.map(addr => ({
          address: addr,
          addedAt: new Date().toISOString(),
        })),
      });

      toast.success(`Successfully loaded ${addresses.length} addresses`);
    } catch (error) {
      console.error('Error processing whitelist:', error);
      toast.error('Failed to process whitelist file');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account?.address) {
      toast.error('Please connect your wallet first');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/drops/${params.id}/mint-config`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mintConfig,
          userAddress: account.address,
        }),
      });

      if (!response.ok) throw new Error('Failed to update mint configuration');

      toast.success('Mint configuration updated successfully');
      fetchDropDetails();
    } catch (error) {
      console.error('Error updating mint configuration:', error);
      toast.error('Failed to update mint configuration');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = async (uniqueId: string) => {
    const mintUrl = `${window.location.origin}/mint/${uniqueId}`;
    try {
      await navigator.clipboard.writeText(mintUrl);
      setCopiedLinks(prev => new Set(Array.from(prev).concat(uniqueId)));
      toast.success('Link copied to clipboard');
      setTimeout(() => {
        setCopiedLinks(prev => {
          const newSet = new Set(Array.from(prev));
          newSet.delete(uniqueId);
          return newSet;
        });
      }, 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast.error('Failed to copy link');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-main bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!drop) {
    return (
      <div className="flex items-center justify-center min-h-main bg-gradient-to-br from-blue-50 to-cyan-50">
        <p className="text-gray-500">Drop not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-main bg-gradient-to-br from-blue-50 to-cyan-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="backdrop-blur-lg bg-white/70 rounded-2xl shadow-xl p-8 border border-white/20">
            <div className="relative h-72 w-full mb-8 rounded-xl overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
              <Image
                src={drop.image}
                alt={drop.name}
                fill
                className="object-cover transform hover:scale-105 transition-transform duration-500"
              />
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {drop.name}
            </h1>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">{drop.description}</p>
            <div className="space-y-6">
              <div className="p-4 bg-white/50 rounded-xl backdrop-blur-sm">
                <h3 className="text-sm font-medium text-blue-600 mb-1">Start Time</h3>
                <p className="text-gray-700">{format(new Date(drop.startTime), 'PPP p')}</p>
              </div>
              <div className="p-4 bg-white/50 rounded-xl backdrop-blur-sm">
                <h3 className="text-sm font-medium text-blue-600 mb-1">End Time</h3>
                <p className="text-gray-700">{format(new Date(drop.endTime), 'PPP p')}</p>
              </div>
              <div className="p-4 bg-white/50 rounded-xl backdrop-blur-sm">
                <h3 className="text-sm font-medium text-blue-600 mb-1">Maximum Supply</h3>
                <p className="text-gray-700">{drop.maxSupply}</p>
              </div>
            </div>

            <div className="mt-8 space-y-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Mint Configuration
              </h2>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => handleMintConfigChange('link')}
                  className={`px-6 py-3 rounded-xl transition-all duration-300 ${
                    mintConfig.type === 'link'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-white/50 text-gray-700 hover:bg-white/80 backdrop-blur-sm'
                  }`}
                >
                  Mint Link
                </button>
                <button
                  type="button"
                  onClick={() => handleMintConfigChange('whitelist')}
                  className={`px-6 py-3 rounded-xl transition-all duration-300 ${
                    mintConfig.type === 'whitelist'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-white/50 text-gray-700 hover:bg-white/80 backdrop-blur-sm'
                  }`}
                >
                  Whitelist
                </button>
              </div>

              {mintConfig.type === 'link' && (
                <div className="space-y-4">
                  <button
                    onClick={() => setIsGenerateModalOpen(true)}
                    className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                    Generate Mint Link
                  </button>

                  {mintLinks.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-700">Generated Mint Links</h3>
                      <div className="space-y-3">
                        {mintLinks.map((link) => (
                          <div key={link.uniqueId} className="p-4 bg-white/50 rounded-xl backdrop-blur-sm border border-blue-100">
                            <div className="flex items-center gap-2">
                              <code className="flex-1 p-2 bg-white/80 rounded-lg text-sm break-all">
                                {`${window.location.origin}/mint/${link.uniqueId}`}
                              </code>
                              <button
                                onClick={() => copyToClipboard(link.uniqueId)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                              >
                                {copiedLinks.has(link.uniqueId) ? (
                                  <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Copied
                                  </>
                                ) : (
                                  <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                                    </svg>
                                    Copy
                                  </>
                                )}
                              </button>
                            </div>
                            <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                              <div className="p-2 bg-white/80 rounded-lg">
                                <p className="text-gray-500">Status</p>
                                <p className={`font-medium ${link.isUsed ? 'text-red-600' : 'text-green-600'}`}>
                                  {link.isUsed ? 'Used' : 'Available'}
                                </p>
                              </div>
                              <div className="p-2 bg-white/80 rounded-lg">
                                <p className="text-gray-500">Expires</p>
                                <p className="font-medium text-gray-700">
                                  {format(new Date(link.expiresAt), 'PPP')}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {mintConfig.type === 'whitelist' && (
                <div>
                  <label className="block text-sm font-medium text-blue-600 mb-3">
                    Upload Whitelist (CSV)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".csv,.txt"
                      onChange={handleWhitelistUpload}
                      className="w-full px-6 py-3 bg-white/50 border border-blue-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent backdrop-blur-sm transition-all duration-300 cursor-pointer"
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="text-gray-500">Choose a file</span>
                    </div>
                  </div>
                  {whitelistAddresses.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-sm font-medium text-blue-600 mb-3">
                        Whitelist Preview ({whitelistAddresses.length} addresses)
                      </h3>
                      <div className="max-h-48 overflow-y-auto bg-white/50 rounded-xl backdrop-blur-sm border border-blue-100">
                        {whitelistAddresses.map((address, index) => (
                          <div
                            key={index}
                            className="px-4 py-3 border-b border-blue-100 last:border-0 hover:bg-white/80 transition-colors duration-200"
                          >
                            {address}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Save Configuration
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <GenerateMintLinkModal
        dropId={params.id}
        isOpen={isGenerateModalOpen}
        onClose={() => {
          setIsGenerateModalOpen(false);
          fetchMintLinks(); // Refresh mint links after generating a new one
        }}
      />
    </div>
  );
} 