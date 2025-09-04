/**
 * Toast Orders API Type Definitions
 */

// Base entity structure used throughout Toast API
export interface ToastEntity {
  guid: string;
  entityType: string;
  externalId?: string;
}

export interface ToastEntityWithMultiLocation extends ToastEntity {
  multiLocationId?: string;
}

// Enums and Union Types
export type UnitOfMeasure = 'NONE';
export type SelectionType = 'NONE';
export type FulfillmentStatus = 'NEW';
export type TaxInclusion = 'INCLUDED';
export type ChargeType = 'FIXED';
export type PaymentType = 'CASH';
export type CardEntryMode = 'SWIPED';
export type CardType = 'VISA';
export type RefundStatus = 'NONE';
export type PaymentStatus = 'OPEN';
export type ProcessingState = 'PENDING_APPLIED';
export type DiscountType = 'BOGO';
export type TaxType = 'PERCENT';
export type ServiceChargeCalculation = 'PRE_DISCOUNT';
export type ServiceChargeCategory = 'SERVICE_CHARGE';
export type LoyaltyVendor = 'TOAST';
export type PricingFeature = 'TAXESV2';
export type ApprovalStatus = 'NEEDS_APPROVAL';
export type DeliveryState = 'PENDING';
export type OptionGroupPricingMode = 'INCLUDED';
export type PackagingInclusion = 'YES';

// Customer information
export interface OrderCustomer extends ToastEntity {
  firstName?: string;
  lastName?: string;
  phone?: string;
  phoneCountryCode?: string;
  email?: string;
}

// Device information
export interface Device {
  id: string;
}

// Reference structures
export interface VoidReason extends ToastEntity {}
export interface ServiceCharge extends ToastEntity {}
export interface SalesCategory extends ToastEntityWithMultiLocation {}
export interface Item extends ToastEntityWithMultiLocation {}
export interface ItemGroup extends ToastEntityWithMultiLocation {}
export interface OptionGroup extends ToastEntityWithMultiLocation {}
export interface PreModifier extends ToastEntityWithMultiLocation {}
export interface DiningOption extends ToastEntity {}
export interface Server extends ToastEntity {}
export interface CashDrawer extends ToastEntity {}
export interface HouseAccount extends ToastEntity {}
export interface OtherPayment extends ToastEntity {}
export interface Table extends ToastEntity {}
export interface ServiceArea extends ToastEntity {}
export interface RestaurantService extends ToastEntity {}
export interface RevenueCenter extends ToastEntity {}

// Tax information
export interface TaxRate extends ToastEntity {}

export interface AppliedTax {
  guid?: string | null;
  entityType?: string | null;
  taxRate?: TaxRate | null;
  name?: string | null;
  rate?: number | null;
  taxAmount?: number | null;
  type?: TaxType | null;
  facilitatorCollectAndRemitTax?: boolean | null;
  displayName?: string | null;
  jurisdiction?: string | null;
  jurisdictionType?: string | null;
}

// Refund information
export interface RefundTransaction extends ToastEntity {}

export interface RefundDetails {
  refundAmount?: number;
  taxRefundAmount?: number;
  refundTransaction?: RefundTransaction | null;
}

// Discount information
export interface Discount extends ToastEntity {}

export interface DiscountTrigger {
  selection?: ToastEntity | null;
  quantity?: number | null;
}

export interface AppliedDiscountReason {
  name?: string | null;
  description?: string | null;
  comment?: string | null;
  discountReason?: ToastEntity | null;
}

export interface LoyaltyDetails {
  vendor?: LoyaltyVendor | null;
  referenceId?: string | null;
}

export interface AppliedDiscount extends ToastEntity {
  name?: string | null;
  discountAmount?: number | null;
  nonTaxDiscountAmount?: number | null;
  discount?: Discount | null;
  triggers?: DiscountTrigger[];
  approver?: ToastEntity | null;
  processingState?: ProcessingState | null;
  appliedDiscountReason?: AppliedDiscountReason | null;
  loyaltyDetails?: LoyaltyDetails | null;
  comboItems?: ToastEntity[];
  appliedPromoCode?: string | null;
  discountType?: DiscountType | null;
  discountPercent?: number | null;
}

// Split information
export interface SplitOrigin extends ToastEntity {}

// Selection (order item) information
export interface Selection extends ToastEntity {
  item?: Item;
  itemGroup?: ItemGroup;
  optionGroup?: OptionGroup;
  preModifier?: PreModifier;
  quantity?: number;
  seatNumber?: number;
  unitOfMeasure?: UnitOfMeasure;
  selectionType?: SelectionType;
  salesCategory?: SalesCategory;
  appliedDiscounts?: AppliedDiscount[];
  deferred?: boolean;
  preDiscountPrice?: number;
  price?: number;
  tax?: number;
  voided?: boolean;
  voidDate?: string;
  voidBusinessDate?: number;
  voidReason?: VoidReason;
  refundDetails?: RefundDetails;
  displayName?: string;
  createdDate?: string;
  modifiedDate?: string;
  modifiers?: any[]; // Can be recursive, keeping as any for now
  fulfillmentStatus?: FulfillmentStatus;
  taxInclusion?: TaxInclusion;
  appliedTaxes?: AppliedTax[];
  diningOption?: DiningOption;
  openPriceAmount?: number;
  receiptLinePrice?: number;
  optionGroupPricingMode?: OptionGroupPricingMode;
  externalPriceAmount?: number;
  splitOrigin?: SplitOrigin;
}

// Loyalty information
export interface AppliedLoyaltyInfo extends ToastEntity {
  loyaltyIdentifier?: string;
  maskedLoyaltyIdentifier?: string;
  vendor?: LoyaltyVendor;
  accrualFamilyGuid?: string;
  accrualText?: string;
}

// Service charges
export interface AppliedServiceCharge extends ToastEntity {
  chargeAmount?: number;
  serviceCharge?: ServiceCharge;
  chargeType?: ChargeType;
  name?: string;
  delivery?: boolean;
  takeout?: boolean;
  dineIn?: boolean;
  gratuity?: boolean;
  taxable?: boolean;
  appliedTaxes?: AppliedTax[];
  serviceChargeCalculation?: ServiceChargeCalculation;
  refundDetails?: RefundDetails;
  serviceChargeCategory?: ServiceChargeCategory;
  paymentGuid?: string;
}

// Payment information
export interface PaymentRefund {
  refundAmount?: number;
  tipRefundAmount?: number;
  refundDate?: string;
  refundBusinessDate?: number;
  refundTransaction?: RefundTransaction;
}

export interface VoidInfo {
  voidUser?: ToastEntity | null;
  voidApprover?: ToastEntity | null;
  voidDate?: string;
  voidBusinessDate?: number;
  voidReason?: VoidReason | null;
}

export interface Payment extends ToastEntity {
  paidDate?: string;
  paidBusinessDate?: number;
  type?: PaymentType;
  cardEntryMode?: CardEntryMode;
  amount?: number;
  tipAmount?: number;
  amountTendered?: number;
  cardType?: CardType;
  last4Digits?: string;
  originalProcessingFee?: number;
  server?: Server;
  cashDrawer?: CashDrawer;
  refundStatus?: RefundStatus;
  refund?: PaymentRefund;
  paymentStatus?: PaymentStatus;
  voidInfo?: VoidInfo;
  houseAccount?: HouseAccount;
  otherPayment?: OtherPayment;
  createdDevice?: Device;
  lastModifiedDevice?: Device;
  mcaRepaymentAmount?: number;
  cardPaymentId?: string;
  orderGuid?: string;
  checkGuid?: string;
  tenderTransactionGuid?: string;
}

// Check (receipt) information
export interface Check extends ToastEntity {
  createdDate?: string;
  openedDate?: string;
  closedDate?: string;
  modifiedDate?: string;
  deletedDate?: string;
  deleted?: boolean;
  selections?: Selection[];
  customer?: OrderCustomer;
  appliedLoyaltyInfo?: AppliedLoyaltyInfo;
  taxExempt?: boolean;
  displayNumber?: string;
  appliedServiceCharges?: AppliedServiceCharge[];
  amount?: number;
  taxAmount?: number;
  totalAmount?: number;
  payments?: Payment[];
  tabName?: string;
  paymentStatus?: PaymentStatus;
  appliedDiscounts?: AppliedDiscount[];
  voided?: boolean;
  voidDate?: string;
  voidBusinessDate?: number;
  paidDate?: string;
  createdDevice?: Device;
  lastModifiedDevice?: Device;
  duration?: number;
  openedBy?: Server;
}

// Delivery information
export interface DeliveryEmployee extends ToastEntity {}

export interface DeliveryInfo {
  address1?: string;
  address2?: string;
  city?: string;
  administrativeArea?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
  deliveredDate?: string;
  dispatchedDate?: string;
  deliveryEmployee?: DeliveryEmployee;
  deliveryState?: DeliveryState;
}

// Curbside pickup information
export interface CurbsidePickupInfo extends ToastEntity {
  transportColor?: string;
  transportDescription?: string;
  notes?: string;
}

// Marketplace tax information
export interface MarketplaceTax extends ToastEntity {
  taxRate?: TaxRate;
  name?: string;
  rate?: number;
  taxAmount?: number;
  type?: TaxType;
  facilitatorCollectAndRemitTax?: boolean;
  displayName?: string;
  jurisdiction?: string;
  jurisdictionType?: string;
}

export interface MarketplaceFacilitatorTaxInfo {
  facilitatorCollectAndRemitTaxOrder?: boolean;
  taxes?: MarketplaceTax[];
}

// Packaging information
export interface AppliedPackagingItem extends ToastEntity {
  itemConfigId?: string;
  inclusion?: PackagingInclusion;
  itemTypes?: string[];
  guestDisplayName?: string;
}

export interface AppliedPackagingInfo extends ToastEntity {
  appliedPackagingItems?: AppliedPackagingItem[];
}

// Main Order interface
export interface Order extends ToastEntity {
  openedDate?: string;
  modifiedDate?: string;
  promisedDate?: string;
  channelGuid?: string;
  diningOption?: DiningOption;
  checks?: Check[];
  table?: Table;
  serviceArea?: ServiceArea;
  restaurantService?: RestaurantService;
  revenueCenter?: RevenueCenter;
  source?: string;
  duration?: number;
  deliveryInfo?: DeliveryInfo;
  requiredPrepTime?: string;
  estimatedFulfillmentDate?: string;
  numberOfGuests?: number;
  voided?: boolean;
  voidDate?: string;
  voidBusinessDate?: number;
  paidDate?: string;
  closedDate?: string;
  deletedDate?: string;
  deleted?: boolean;
  businessDate?: number;
  server?: Server;
  pricingFeatures?: PricingFeature[];
  approvalStatus?: ApprovalStatus;
  createdDevice?: Device;
  createdDate?: string;
  lastModifiedDevice?: Device;
  curbsidePickupInfo?: CurbsidePickupInfo;
  marketplaceFacilitatorTaxInfo?: MarketplaceFacilitatorTaxInfo;
  createdInTestMode?: boolean;
  appliedPackagingInfo?: AppliedPackagingInfo;
  excessFood?: boolean;
  displayNumber?: string;
}

// API Request/Response types
export interface OrdersBulkParams {
  businessDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
  startDate?: string;
  restaurantExternalId: string; // Required header
}

export interface OrdersBulkResponse {
  orders: Order[];
}

export interface GetOrderParams {
  guid: string;
  restaurantExternalId: string; // Required header
}
