export interface Drop {
  _id: string;
  name: string;
  description: string;
  image: string;
  maxSupply: number;
  packageId: string;
  objectId: string;
  startTime: string;
  endTime: string;
  userAddress: string;
  createdAt: string;
  mintConfig?: MintConfig;
}

export interface MintConfig {
  type: 'link' | 'whitelist';
  mintLink?: string;
  whitelist?: WhitelistEntry[];
}

export interface WhitelistEntry {
  address: string;
  addedAt: string;
}

export interface DropFormData {
  name: string;
  description: string;
  image: string;
  maxSupply: number;
  startTime: string;
  endTime: string;
  mintConfig: {
    type: 'link' | 'whitelist';
    mintLink?: string;
    whitelist?: WhitelistEntry[];
  };
}

export interface MintLink {
  _id: string;
  dropId: string;
  uniqueId: string;
  createdAt: string;
  expiresAt: string;
  isUsed: boolean;
  usedBy?: string;
  usedAt?: string;
}

export interface MintStatus {
  status: 'success' | 'error';
  message: string;
  transactionHash?: string;
}
