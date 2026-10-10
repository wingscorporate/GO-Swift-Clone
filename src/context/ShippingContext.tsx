import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Shipment,
  Order,
  ProductItem,
  PackagingProfile,
  WalletTransaction,
  Warehouse,
  WeightDiscrepancy,
  ShipmentType,
  ShipmentStatus,
  UserAccount,
} from '../types/shipping';
import {
  INITIAL_SHIPMENTS,
  INITIAL_ORDERS,
  INITIAL_PRODUCTS,
  INITIAL_PACKAGING_PROFILES,
  INITIAL_TRANSACTIONS,
  INITIAL_WAREHOUSES,
  INITIAL_DISCREPANCIES,
} from '../data/mockData';

export type NavItem =
  | 'Analytics'
  | 'Shipments'
  | 'Ship Parcel'
  | 'Packaging'
  | 'Orders'
  | 'Product Master'
  | 'Payments'
  | 'Discrepancies'
  | 'Report'
  | 'Support'
  | 'Settings';

interface ShippingContextType {
  activeNav: NavItem;
  setActiveNav: (nav: NavItem) => void;
  shipments: Shipment[];
  setShipments: React.Dispatch<React.SetStateAction<Shipment[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  products: ProductItem[];
  warehouses: Warehouse[];
  packagingProfiles: PackagingProfile[];
  walletBalance: number;
  transactions: WalletTransaction[];
  discrepancies: WeightDiscrepancy[];
  // User Account
  userAccount: UserAccount;
  updateUserAccount: (updated: Partial<UserAccount>) => void;
  isAccountModalOpen: boolean;
  setIsAccountModalOpen: (open: boolean) => void;
  // Modals & Drawers
  isRechargeModalOpen: boolean;
  setIsRechargeModalOpen: (open: boolean) => void;
  isOnboardingModalOpen: boolean;
  setIsOnboardingModalOpen: (open: boolean) => void;
  selectedTrackingShipment: Shipment | null;
  setSelectedTrackingShipment: (shipment: Shipment | null) => void;
  selectedLabelShipment: Shipment | null;
  setSelectedLabelShipment: (shipment: Shipment | null) => void;
  isLabelMinimized: boolean;
  setIsLabelMinimized: (val: boolean) => void;
  selectedInvoiceShipment: Shipment | null;
  setSelectedInvoiceShipment: (shipment: Shipment | null) => void;
  isSupportWidgetOpen: boolean;
  setIsSupportWidgetOpen: (open: boolean) => void;
  // Onboarding status
  onboardingCompleted: boolean;
  setOnboardingCompleted: (val: boolean) => void;
  // Demo mode toggle (empty state vs seeded state)
  viewEmptyState: boolean;
  setViewEmptyState: (val: boolean) => void;
  // Actions
  rechargeWallet: (amount: number, method: string) => void;
  bookShipment: (shipmentData: Omit<Shipment, 'id' | 'awb' | 'createdAt' | 'lastUpdated' | 'trackingHistory'>) => Shipment;
  cancelShipment: (id: string) => void;
  resolveNDR: (id: string, action: 'reattempt' | 'address_update' | 'rto', details?: string) => void;
  createOrder: (order: Omit<Order, 'id' | 'createdAt'>) => Order;
  convertOrderToShipment: (orderId: string) => void;
  resolveDiscrepancy: (id: string, action: 'accept' | 'dispute') => void;
  addWarehouse: (wh: Omit<Warehouse, 'id'>) => void;
  addProduct: (prod: Omit<ProductItem, 'id'>) => void;
}

const ShippingContext = createContext<ShippingContextType | undefined>(undefined);

export const ShippingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeNav, setActiveNav] = useState<NavItem>('Shipments');
  const [shipments, setShipments] = useState<Shipment[]>(INITIAL_SHIPMENTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [warehouses, setWarehouses] = useState<Warehouse[]>(INITIAL_WAREHOUSES);
  const [packagingProfiles] = useState<PackagingProfile[]>(INITIAL_PACKAGING_PROFILES);
  // Requested: Initial wallet balance of 4983 rupees which decreases on shipping and increases on recharge
  const [walletBalance, setWalletBalance] = useState<number>(() => {
    const saved = localStorage.getItem('swift_wallet_balance');
    return saved !== null && !isNaN(parseFloat(saved)) ? parseFloat(saved) : 4983.0;
  });

  useEffect(() => {
    localStorage.setItem('swift_wallet_balance', walletBalance.toString());
  }, [walletBalance]);

  const [transactions, setTransactions] = useState<WalletTransaction[]>(INITIAL_TRANSACTIONS);
  const [discrepancies, setDiscrepancies] = useState<WeightDiscrepancy[]>(INITIAL_DISCREPANCIES);
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean>(false);
  const [viewEmptyState, setViewEmptyState] = useState<boolean>(false);

  // User Account customizable profile (displays active account on home page and header)
  const [userAccount, setUserAccount] = useState<UserAccount>(() => {
    const saved = localStorage.getItem('swift_user_account');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore fallback
      }
    }
    return {
      name: 'Wings Corporate',
      email: 'wingscorporate1504@gmail.com',
      role: 'Merchant Admin',
      companyName: 'Wings Corporate Logistics',
    };
  });

  useEffect(() => {
    localStorage.setItem('swift_user_account', JSON.stringify(userAccount));
  }, [userAccount]);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  // Modals
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
  const [selectedTrackingShipment, setSelectedTrackingShipment] = useState<Shipment | null>(null);
  const [selectedLabelShipment, setSelectedLabelShipment] = useState<Shipment | null>(null);
  const [isLabelMinimized, setIsLabelMinimized] = useState(false);
  const [selectedInvoiceShipment, setSelectedInvoiceShipment] = useState<Shipment | null>(null);
  const [isSupportWidgetOpen, setIsSupportWidgetOpen] = useState(false);

  const updateUserAccount = (updated: Partial<UserAccount>) => {
    setUserAccount((prev) => ({ ...prev, ...updated }));
  };

  const rechargeWallet = (amount: number, method: string) => {
    const refId = `RZP-PAY-${Math.floor(10000000 + Math.random() * 90000000)}`;
    const nowStr = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    setWalletBalance((prev) => {
      const newBal = prev + amount;
      const newTxn: WalletTransaction = {
        id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
        refId,
        type: 'credit',
        amount,
        balanceAfter: newBal,
        description: `Instant Wallet Recharge via ${method}`,
        category: 'recharge',
        paymentMethod: method,
        createdAt: nowStr,
      };
      setTransactions((t) => [newTxn, ...t]);
      return newBal;
    });
  };

  const bookShipment = (shipmentData: Omit<Shipment, 'id' | 'awb' | 'createdAt' | 'lastUpdated' | 'trackingHistory'>): Shipment => {
    const id = `SWIFT-${Math.floor(900000 + Math.random() * 99999)}`;
    const courierPrefix = shipmentData.courier.code === 'delhivery' ? 'DEL' : shipmentData.courier.code === 'bluedart' ? 'BD' : shipmentData.courier.code === 'xpressbees' ? 'XB' : 'SFX';
    const awb = `${courierPrefix}${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    const nowStr = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const newShipment: Shipment = {
      ...shipmentData,
      id,
      awb,
      createdAt: new Date().toISOString(),
      lastUpdated: nowStr,
      trackingHistory: [
        {
          id: `EV-${Date.now()}`,
          status: 'Shipment Manifested',
          location: shipmentData.pickupWarehouse.name,
          timestamp: nowStr,
          description: `AWB ${awb} generated. Shipment manifested and courier notified.`,
        },
      ],
    };

    // Deduct wallet balance by freight cost (₹69 flat or specific courier rate)
    const freightCost = shipmentData.shippingCharges || 69.0;
    setWalletBalance((prev) => {
      const newBal = Math.max(0, prev - freightCost);
      const debitTxn: WalletTransaction = {
        id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
        refId: id,
        type: 'debit',
        amount: freightCost,
        balanceAfter: newBal,
        description: `Freight Charge: ${shipmentData.courier.name} (AWB: ${awb})`,
        category: 'shipping_charge',
        createdAt: nowStr,
      };
      setTransactions((t) => [debitTxn, ...t]);
      return newBal;
    });

    setShipments((prev) => [newShipment, ...prev]);
    setViewEmptyState(false);
    setIsLabelMinimized(false);
    return newShipment;
  };

  const cancelShipment = (id: string) => {
    setShipments((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          return {
            ...s,
            status: 'Cancelled',
            lastUpdated: new Date().toLocaleString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            }),
            trackingHistory: [
              {
                id: `EV-${Date.now()}`,
                status: 'Shipment Cancelled by Merchant',
                location: 'Merchant Dashboard',
                timestamp: 'Just now',
                description: 'Shipment cancelled before courier pickup. Freight charges refunded to wallet.',
              },
              ...s.trackingHistory,
            ],
          };
        }
        return s;
      })
    );
  };

  const resolveNDR = (id: string, action: 'reattempt' | 'address_update' | 'rto', details?: string) => {
    setShipments((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const newStatus: ShipmentStatus = action === 'rto' ? 'RTO Initiated' : 'NDR Action Requested';
          return {
            ...s,
            status: newStatus,
            ndrAction: `Requested: ${action.replace('_', ' ').toUpperCase()} (${details || 'Immediate'})`,
            trackingHistory: [
              {
                id: `EV-${Date.now()}`,
                status: `NDR Action: ${action.replace('_', ' ').toUpperCase()}`,
                location: 'Hub',
                timestamp: 'Just now',
                description: `Merchant instructed: ${action === 'reattempt' ? 'Reattempt delivery with verified recipient' : action === 'address_update' ? `Address amended: ${details}` : 'Mark for RTO'}`,
              },
              ...s.trackingHistory,
            ],
          };
        }
        return s;
      })
    );
  };

  const createOrder = (orderData: Omit<Order, 'id' | 'createdAt'>): Order => {
    const id = `ORD-${Math.floor(98000 + Math.random() * 1999)}`;
    const newOrder: Order = {
      ...orderData,
      id,
      createdAt: new Date().toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const convertOrderToShipment = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const defaultWarehouse = warehouses.find((w) => w.isDefault) || warehouses[0];
    const newShipment = bookShipment({
      type: 'forward',
      orderId: order.orderNumber,
      courier: {
        code: 'delhivery',
        name: 'Delhivery Surface',
      },
      status: 'Ready For Pickup',
      paymentMode: order.paymentMode,
      amount: order.totalAmount,
      shippingCharges: 69.0,
      weight: 0.5,
      dimensions: { length: 22, width: 18, height: 8 },
      volumetricWeight: 0.63,
      chargeableWeight: 0.63,
      customer: {
        name: order.customerName,
        phone: order.customerPhone,
        email: order.customerEmail,
        address: order.shippingAddress,
        city: order.city,
        state: order.state,
        pincode: order.pincode,
      },
      pickupWarehouse: defaultWarehouse,
      items: order.items,
    });

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'Shipped' } : o))
    );
    setActiveNav('Shipments');
    setSelectedLabelShipment(newShipment);
  };

  const resolveDiscrepancy = (id: string, action: 'accept' | 'dispute') => {
    setDiscrepancies((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, status: action === 'accept' ? 'Accepted' : 'Disputed' } : d
      )
    );
  };

  const addWarehouse = (wh: Omit<Warehouse, 'id'>) => {
    const newWh: Warehouse = {
      ...wh,
      id: `WH-${Math.floor(100 + Math.random() * 900)}`,
    };
    setWarehouses((prev) => [...prev, newWh]);
  };

  const addProduct = (prod: Omit<ProductItem, 'id'>) => {
    const newProd: ProductItem = {
      ...prod,
      id: `PROD-${Math.floor(100 + Math.random() * 900)}`,
    };
    setProducts((prev) => [...prev, newProd]);
  };

  return (
    <ShippingContext.Provider
      value={{
        activeNav,
        setActiveNav,
        shipments,
        setShipments,
        orders,
        setOrders,
        products,
        warehouses,
        packagingProfiles,
        walletBalance,
        transactions,
        discrepancies,
        isRechargeModalOpen,
        setIsRechargeModalOpen,
        isOnboardingModalOpen,
        setIsOnboardingModalOpen,
        selectedTrackingShipment,
        setSelectedTrackingShipment,
        selectedLabelShipment,
        setSelectedLabelShipment,
        isLabelMinimized,
        setIsLabelMinimized,
        selectedInvoiceShipment,
        setSelectedInvoiceShipment,
        userAccount,
        updateUserAccount,
        isAccountModalOpen,
        setIsAccountModalOpen,
        isSupportWidgetOpen,
        setIsSupportWidgetOpen,
        onboardingCompleted,
        setOnboardingCompleted,
        viewEmptyState,
        setViewEmptyState,
        rechargeWallet,
        bookShipment,
        cancelShipment,
        resolveNDR,
        createOrder,
        convertOrderToShipment,
        resolveDiscrepancy,
        addWarehouse,
        addProduct,
      }}
    >
      {children}
    </ShippingContext.Provider>
  );
};

export const useShipping = () => {
  const context = useContext(ShippingContext);
  if (!context) {
    throw new Error('useShipping must be used within a ShippingProvider');
  }
  return context;
};
