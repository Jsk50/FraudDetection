
export interface Transaction {
  id: string;
  amount: number;
  fraudScore: number;
  timestamp: string;
  isSuspicious: boolean;
}
