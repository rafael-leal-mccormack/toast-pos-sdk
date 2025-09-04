/**
 * Toast Restaurants API Type Definitions
 */

/**
 * Restaurant information from Toast API
 */
export interface Restaurant {
  /** Unique identifier for the restaurant */
  restaurantGuid: string;
  /** Management group GUID this restaurant belongs to */
  managementGroupGuid: string;
  /** Whether the restaurant has been deleted */
  deleted: boolean;
  /** Display name of the restaurant */
  restaurantName: string;
  /** Location name/address of the restaurant */
  locationName: string;
  /** Email address of the user who created this restaurant */
  createdByEmailAddress: string;
  /** External reference for the group */
  externalGroupRef?: string;
  /** External reference for the restaurant */
  externalRestaurantRef?: string;
  /** Modified date as Unix timestamp in milliseconds */
  modifiedDate: number;
  /** Created date as Unix timestamp in milliseconds */
  createdDate: number;
  /** Modified date in ISO format */
  isoModifiedDate: string;
  /** Created date in ISO format */
  isoCreatedDate: string;
}

/**
 * Query parameters for listing restaurants
 */
export interface RestaurantsListParams {
  /** 
   * Filter restaurants modified after this date
   * Format: YYYY-MM-DD or ISO date string
   */
  lastModified?: string;
}

/**
 * Response type for restaurant list API
 */
export type RestaurantsListResponse = Restaurant[];

// Detailed Restaurant API Types (from /restaurants/v1/restaurants/{guid})

/**
 * General restaurant information
 */
export interface RestaurantGeneral {
  /** Restaurant name */
  name: string;
  /** Location name */
  locationName: string;
  /** Location code */
  locationCode: string;
  /** Restaurant description */
  description: string;
  /** Time zone */
  timeZone: string;
  /** Closeout hour */
  closeoutHour: number;
  /** Management group GUID */
  managementGroupGuid: string;
  /** Currency code */
  currencyCode: string;
  /** First business date */
  firstBusinessDate: number;
  /** Whether the restaurant is archived */
  archived: boolean;
}

/**
 * Restaurant URLs and social media links
 */
export interface RestaurantUrls {
  /** Website URL */
  website: string;
  /** Facebook URL */
  facebook: string;
  /** Twitter URL */
  twitter: string;
  /** Online ordering URL */
  orderOnline: string;
  /** Purchase gift card URL */
  purchaseGiftCard: string;
  /** Check gift card URL */
  checkGiftCard: string;
}

/**
 * Restaurant location information
 */
export interface RestaurantLocation {
  /** Address line 1 */
  address1: string;
  /** Address line 2 */
  address2: string;
  /** City */
  city: string;
  /** State code */
  stateCode: string;
  /** Administrative area */
  administrativeArea: string;
  /** ZIP code */
  zipCode: string;
  /** Country */
  country: string;
  /** Phone number */
  phone: string;
  /** Phone country code */
  phoneCountryCode: string;
  /** Latitude coordinate */
  latitude: number;
  /** Longitude coordinate */
  longitude: number;
}

/**
 * Service hours information
 */
export interface ServiceHours {
  /** Start time */
  startTime: string;
  /** End time */
  endTime: string;
}

/**
 * Service information
 */
export interface RestaurantOperatingService {
  /** Service name */
  name: string;
  /** Service hours */
  hours: ServiceHours;
  /** Whether service runs overnight */
  overnight: boolean;
}

/**
 * Day schedule information
 */
export interface DaySchedule {
  /** Schedule name */
  scheduleName: string;
  /** List of services */
  services: RestaurantOperatingService[];
  /** Opening time */
  openTime: string;
  /** Closing time */
  closeTime: string;
}

/**
 * Week schedule mapping days to schedule identifiers
 */
export interface WeekSchedule {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

/**
 * Restaurant schedules
 */
export interface RestaurantSchedules {
  /** Day schedules with dynamic properties */
  daySchedules: {
    identifier: string;
    [key: string]: DaySchedule | string;
  };
  /** Week schedule */
  weekSchedule: WeekSchedule;
}

/**
 * Delivery configuration
 */
export interface RestaurantDelivery {
  /** Whether delivery is enabled */
  enabled: boolean;
  /** Minimum order amount for delivery */
  minimum: number;
  /** Delivery area description */
  area: string;
}

/**
 * Payment options for a service type
 */
export interface ServicePaymentOptions {
  /** Cash payments accepted */
  cash: boolean;
  /** Credit card same day */
  ccSameDay: boolean;
  /** Credit card future orders */
  ccFuture: boolean;
  /** Credit card in store (takeout only) */
  ccInStore?: boolean;
}

/**
 * Online ordering payment options
 */
export interface OnlineOrderingPaymentOptions {
  /** Delivery payment options */
  delivery: ServicePaymentOptions;
  /** Takeout payment options */
  takeout: ServicePaymentOptions;
  /** Credit card tip enabled */
  ccTip: boolean;
}

/**
 * Online ordering configuration
 */
export interface RestaurantOnlineOrdering {
  /** Whether online ordering is enabled */
  enabled: boolean;
  /** Whether scheduling is enabled */
  scheduling: boolean;
  /** Whether special requests are allowed */
  specialRequests: boolean;
  /** Special requests message */
  specialRequestsMessage: string;
  /** Payment options */
  paymentOptions: OnlineOrderingPaymentOptions;
}

/**
 * Prep times configuration
 */
export interface RestaurantPrepTimes {
  /** Delivery prep time in minutes */
  deliveryPrepTime: number;
  /** Delivery time after open in minutes */
  deliveryTimeAfterOpen: number;
  /** Delivery time before close in minutes */
  deliveryTimeBeforeClose: number;
  /** Takeout prep time in minutes */
  takeoutPrepTime: number;
  /** Takeout time after open in minutes */
  takeoutTimeAfterOpen: number;
  /** Takeout time before close in minutes */
  takeoutTimeBeforeClose: number;
  /** Takeout throttling time in minutes */
  takeoutThrottlingTime: number;
  /** Delivery throttling time in minutes */
  deliveryThrottlingTime: number;
}

/**
 * Detailed restaurant information from /restaurants/v1/restaurants/{guid}
 */
export interface DetailedRestaurant {
  /** Restaurant GUID */
  guid: string;
  /** General restaurant information */
  general: RestaurantGeneral;
  /** Restaurant URLs */
  urls: RestaurantUrls;
  /** Location information */
  location: RestaurantLocation;
  /** Schedule information */
  schedules: RestaurantSchedules;
  /** Delivery configuration */
  delivery: RestaurantDelivery;
  /** Online ordering configuration */
  onlineOrdering: RestaurantOnlineOrdering;
  /** Prep times configuration */
  prepTimes: RestaurantPrepTimes;
}

/**
 * Query parameters for getting detailed restaurant by ID
 */
export interface GetRestaurantByIdParams {
  /** Restaurant GUID */
  restaurantGUID: string;
  /** Restaurant external ID for header */
  restaurantExternalId: string;
  /** Whether to include archived restaurants */
  includeArchived?: boolean;
}

/**
 * Query parameters for getting restaurants by management group
 */
export interface GetRestaurantsByManagementGroupParams {
  /** Management group GUID */
  managementGroupGUID: string;
  /** Restaurant external ID for header */
  restaurantExternalId: string;
}

/**
 * Simple restaurant reference (from management group endpoint)
 */
export interface RestaurantReference {
  /** Restaurant GUID */
  guid: string;
}
