'use client';

import { useState } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { toast } from 'react-toastify';
import { MintLink } from '@/types/mint';

interface GenerateMintLinkModalProps {
  dropId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface LocationSettings {
  enabled: boolean;
  latitude: number;
  longitude: number;
  radius: number; // in meters
}

export default function GenerateMintLinkModal({ dropId, isOpen, onClose }: GenerateMintLinkModalProps) {
  const account = useCurrentAccount();
  const [isGenerating, setIsGenerating] = useState(false);
  const [mintLink, setMintLink] = useState<MintLink | null>(null);
  const [copied, setCopied] = useState(false);
  const [locationSettings, setLocationSettings] = useState<LocationSettings>({
    enabled: false,
    latitude: 0,
    longitude: 0,
    radius: 100, // default 100 meters
  });

  const generateMintLink = async () => {
    if (!account?.address) {
      toast.error('Please connect your wallet first');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch(`/api/drops/${dropId}/mint-links`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userAddress: account.address,
          locationSettings: locationSettings.enabled ? locationSettings : undefined,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate mint link');

      const data = await response.json();
      setMintLink(data);
      toast.success('Mint link generated successfully');
    } catch (error) {
      console.error('Error generating mint link:', error);
      toast.error('Failed to generate mint link');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLocationToggle = async () => {
    if (!locationSettings.enabled) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          });
        });

        setLocationSettings(prev => ({
          ...prev,
          enabled: true,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
      } catch (error) {
        console.error('Error getting location:', error);
        toast.error('Failed to get your location. Please enable location services.');
      }
    } else {
      setLocationSettings(prev => ({
        ...prev,
        enabled: false,
      }));
    }
  };

  const copyToClipboard = async () => {
    if (!mintLink) return;

    const mintUrl = `${window.location.origin}/mint/${mintLink.uniqueId}`;
    try {
      await navigator.clipboard.writeText(mintUrl);
      setCopied(true);
      toast.success('Link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast.error('Failed to copy link');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl p-6 md:p-8 max-w-2xl w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold mb-6 text-[#333]">
          Generate Mint Link
        </h2>
        
        <div className="space-y-6">
          <p className="text-[#555]">
            Generate a unique mint link that you can share with others. Each link can only be used once.
          </p>

          {!mintLink ? (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-[#0057FF]">Location Verification</h3>
                  <button
                    onClick={handleLocationToggle}
                    className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                      locationSettings.enabled
                        ? 'bg-[#0057FF] text-white'
                        : 'bg-white text-[#555] border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {locationSettings.enabled ? 'Enabled' : 'Enable'}
                  </button>
                </div>
                
                {locationSettings.enabled && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-[#555] mb-1">Latitude</label>
                        <input
                          type="number"
                          value={locationSettings.latitude}
                          onChange={(e) => setLocationSettings(prev => ({
                            ...prev,
                            latitude: parseFloat(e.target.value)
                          }))}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF]"
                          step="any"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-[#555] mb-1">Longitude</label>
                        <input
                          type="number"
                          value={locationSettings.longitude}
                          onChange={(e) => setLocationSettings(prev => ({
                            ...prev,
                            longitude: parseFloat(e.target.value)
                          }))}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF]"
                          step="any"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-[#555] mb-1">Radius (meters)</label>
                      <input
                        type="number"
                        value={locationSettings.radius}
                        onChange={(e) => setLocationSettings(prev => ({
                          ...prev,
                          radius: parseInt(e.target.value)
                        }))}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF]"
                        min="1"
                      />
                    </div>
                    <p className="text-sm text-[#555]">
                      Users will need to be within {locationSettings.radius} meters of this location to mint.
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={generateMintLink}
                disabled={isGenerating}
                className="w-full px-6 py-3 bg-[#0057FF] text-white rounded-lg hover:bg-[#0046CC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2 shadow-sm"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                    Generate Mint Link
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium text-[#0057FF] mb-2">Your Mint Link</h3>
                <div className="flex items-center gap-2">
                  <code className="flex-1 p-2 bg-white rounded-md text-sm break-all border border-gray-200">
                    {`${window.location.origin}/mint/${mintLink.uniqueId}`}
                  </code>
                  <button
                    onClick={copyToClipboard}
                    className="px-4 py-2 bg-[#0057FF] text-white rounded-lg hover:bg-[#0046CC] transition-colors duration-200 flex items-center gap-2 shadow-sm"
                  >
                    {copied ? (
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
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-[#555]">Created</p>
                  <p className="font-medium text-[#333]">
                    {new Date(mintLink.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-[#555]">Expires</p>
                  <p className="font-medium text-[#333]">
                    {new Date(mintLink.expiresAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setMintLink(null)}
                className="w-full px-6 py-3 bg-gray-50 text-[#555] rounded-lg hover:bg-gray-100 transition-colors duration-200 border border-gray-200"
              >
                Generate Another Link
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 