// ENUMS

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
  PARTNER = "PARTNER",
  DELIVERYMAN = "DELIVERYMAN",
}

export enum PartnerStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  SUSPENDED = "SUSPENDED",
}

export enum PartnerAvailability {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
  BUSY = "BUSY",
}

export enum DeliverymanStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  SUSPENDED = "SUSPENDED",
}

export enum DeliverymanAvailability {
  AVAILABLE = "AVAILABLE",
  BUSY = "BUSY",
  OFFLINE = "OFFLINE",
}

export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  PREPARING = "PREPARING",
  READY_FOR_PICKUP = "READY_FOR_PICKUP",
  PICKED_UP = "PICKED_UP",
  IN_TRANSIT = "IN_TRANSIT",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export enum PaymentMethod {
  MPESA = "MPESA",
  EMOLA = "EMOLA",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

// MODELS

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  phone?: string;
  image?: string;
  role: UserRole;
  bio?: string;
  country?: string;
  province?: string;
  city?: string;
  partnerId?: string;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  id: string;
  expiresAt: Date;
  token: string;
  createdAt: Date;
  updatedAt: Date;
  ipAddress?: string;
  userAgent?: string;
  userId: string;
}

export interface Account {
  id: string;
  accountId: string;
  providerId: string;
  userId: string;
  accessToken?: string;
  refreshToken?: string;
  idToken?: string;
  accessTokenExpiresAt?: Date;
  refreshTokenExpiresAt?: Date;
  scope?: string;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  id: string;
  userId: string;
  label?: string;
  street: string;
  apartment?: string;
  postalCode?: string;
  city: string;
  province: string;
  country: string;
  latitude?: number;
  longitude?: number;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Partner {
  id: string;
  userId: string;
  name: string;
  description?: string;
  phone: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  address: string;
  city: string;
  province: string;
  country: string;
  latitude?: number;
  longitude?: number;
  isLocationSet: boolean;
  photo?: string;
  banner?: string;
  status: PartnerStatus;
  availability: PartnerAvailability;
  balance: number;
  commissionRate: number;
  businessHours?: string;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface MenuCategory {
  id: string;
  partnerId: string;
  name: string;
  isAvailable: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  partnerId: string;
  menuCategoryId: string;
  name: string;
  description: string;
  price: number;
  photo?: string;
  preparationTime: number;
  isAvailable: boolean;
  salesCount: number;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Deliveryman {
  id: string;
  userId: string;
  phone: string;
  photo?: string;
  documentNumber?: string;
  vehicleType?: string;
  vehiclePlate?: string;
  currentLatitude?: number;
  currentLongitude?: number;
  status: DeliverymanStatus;
  availability: DeliverymanAvailability;
  balance: number;
  totalDeliveries: number;
  rating?: number;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  partnerId: string;
  deliverymanId?: string;
  addressId: string;
  status: OrderStatus;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  estimatedPreparationTime?: number;
  estimatedDeliveryTime?: Date;
  confirmedAt?: Date;
  readyAt?: Date;
  pickedUpAt?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
  notes?: string;
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  orderId: string;
  userId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  phoneNumber?: string;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  orderId: string;
  userId: string;
  partnerId?: string;
  deliverymanId?: string;
  partnerRating?: number;
  deliverymanRating?: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Withdrawal {
  id: string;
  deliverymanId: string;
  amount: number;
  method: string;
  accountDetails: string;
  status: string;
  requestedAt: Date;
  processedAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// EXTENDED TYPES WITH RELATIONS

export interface UserWithRelations extends User {
  addresses?: Address[];
  orders?: Order[];
  reviews?: Review[];
  payments?: Payment[];
  partner?: Partner;
  deliveryman?: Deliveryman;
  sessions?: Session[];
  accounts?: Account[];
}

export interface PartnerWithRelations extends Partner {
  user?: User;
  menuCategories?: MenuCategory[];
  products?: Product[];
  orders?: Order[];
  reviews?: Review[];
}

export interface OrderWithRelations extends Order {
  user?: User;
  partner?: Partner;
  deliveryman?: Deliveryman;
  address?: Address;
  orderItems?: OrderItem[];
  payment?: Payment;
  review?: Review;
}

export interface ProductWithRelations extends Product {
  partner?: Partner;
  menuCategory?: MenuCategory;
  orderItems?: OrderItem[];
}

export interface DeliverymanWithRelations extends Deliveryman {
  user?: User;
  orders?: Order[];
  reviews?: Review[];
  withdrawals?: Withdrawal[];
}
