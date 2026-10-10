export type ShipmentType = 'forward' | 'reverse';

export type ShipmentStatus =
  | 'Manifested'
  | 'Ready For Pickup'
  | 'Pickup Scheduled'
  | 'In Transit'
  | 'Out For Delivery'
  | 'Delivered'
  | 'RTO Initiated'
  | 'RTO Delivered'
  | 'Cancelled'
  | 'NDR Action Required'
  | 'NDR Action Requested';

export type PaymentMode = 'Prepaid' | 'COD';

export type CourierCode = 'delhivery' | 'bluedart' | 'xpressbees' | 'ecom' | 'shadowfax' | 'dtdc';

export interface TrackingEvent {
  id: string;
  status: string;
  location: string;
  timestamp: string;
  description: string;
}

export interface Shipment {
  id: string; // Internal Swift ID, e.g. SWIFT-849204
  awb: string; // Courier AWB e.g. 148294018241
  type: ShipmentType;
  orderId: string; // e.g. ORD-94021
  courier: {
    code: CourierCode;
    name: string;
    logo?: string;
  };
  status: ShipmentStatus;
  paymentMode: PaymentMode;
  amount: number; // Order value / COD collection amount
  shippingCharges: number;
  weight: number; // in kg (actual)
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  volumetricWeight: number; // (L*W*H)/5000
  chargeableWeight: number; // max(weight, volumetricWeight)
  customer: {
    name: string;
    phone: string;
    email: string;
    address: string;
    landmark?: string;
    city: string;
    state: string;
    pincode: string;
  };
  pickupWarehouse: Warehouse;
  items: {
    sku: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  ndrReason?: string;
  ndrAction?: string;
  createdAt: string;
  lastUpdated: string;
  trackingHistory: TrackingEvent[];
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  city: string;
  state: string;
  pincode: string;
  paymentMode: PaymentMode;
  totalAmount: number;
  items: {
    sku: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  status: 'New' | 'Processing' | 'Ready to Ship' | 'Shipped' | 'Delivered' | 'Cancelled';
  channel: 'Manual' | 'Shopify' | 'WooCommerce' | 'CSV';
  createdAt: string;
}

export interface ProductItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  sellingPrice: number;
  weight: number; // kg
  length: number;
  width: number;
  height: number;
  stock: number;
}

export interface PackagingProfile {
  id: string;
  name: string;
  boxType: string;
  length: number;
  width: number;
  height: number;
  tareWeight: number; // kg
  cost: number;
}

export interface WalletTransaction {
  id: string;
  refId: string;
  type: 'credit' | 'debit';
  amount: number;
  balanceAfter: number;
  description: string;
  category: 'recharge' | 'shipping_charge' | 'cod_remittance' | 'rto_charge' | 'weight_discrepancy' | 'refund';
  createdAt: string;
  paymentMethod?: string;
}

export interface Warehouse {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  contactPhone?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface WeightDiscrepancy {
  id: string;
  shipmentId: string;
  awb: string;
  courier: string;
  merchantWeight: number;
  courierWeight: number;
  excessWeight: number;
  disputedAmount: number;
  raisedDate: string;
  disputeDeadline: string;
  status: 'Pending Action' | 'Disputed' | 'Accepted' | 'Resolved';
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface UserAccount {
  name: string;
  email: string;
  role: string;
  phone?: string;
  companyName?: string;
}
