
export interface Product {
  id: string;
  productName: string;
  description: string;
  price: number;
  imageData: string;
  productType: string;
  available: boolean;
  stockQuantity?: number;  // Added stock quantity
}

export interface User {
  email: string;
  name?: string;
  role?: string;
  token?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  mobile: string;
  password: string;
}

export interface ShippingAddress {
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
}

export interface PaymentDetails {
  email: string;
  date: string;
  address: ShippingAddress;
}

// New interfaces for wallet verification and transactions
export interface WalletData {
  ageDays: number;
  txCount: number;
  solBalance?: number;
  nftCount?: number;
  walletAddress: string;
}

export interface TransactionData {
  transactionHash: string;
  walletAddress: string;
  email: string;
  productId: string;
  amount: number;
  date: string;
}

export interface CartApiItem {
  productId: string;
  quantity: number;
  email: string;
}

export interface transaction{
  "transId":string,
    "email":string,
    "amount":number,
    "walletAddress":string,
    "name":string,
    "mobile":string,
    "transDate":string
    "productId":string
}

