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
  status: 'pending' | 'success' | 'error';
  message: string;
  transactionHash?: string;
} 