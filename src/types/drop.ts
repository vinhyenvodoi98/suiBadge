export interface Drop {
  id: string;
  name: string;
  description: string;
  image: string;
  totalSupply: number;
  claimedCount: number;
  createdAt: string;
  chain: string;
  creator: string;
  contractAddress?: string;
  startDate?: string;
  endDate?: string;
  requirements?: {
    type: 'wallet' | 'twitter' | 'discord' | 'email';
    value: string;
  }[];
}
