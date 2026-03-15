import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ProductMessage {
    text: string;
    productId: bigint;
    receiverId: Principal;
    timestamp: bigint;
    senderId: Principal;
}
export interface BusinessProfile {
    createdAt: bigint;
    role: UserRole;
    businessName: string;
    avatarUrl: string;
}
export interface Order {
    id: bigint;
    status: OrderStatus;
    createdAt: bigint;
    totalCents: bigint;
    productId: bigint;
    buyerId: Principal;
    quantity: bigint;
    sellerId: Principal;
}
export interface Product {
    id: bigint;
    moq: bigint;
    name: string;
    createdAt: bigint;
    lastUpdated: bigint;
    priceFromCents: bigint;
    imageUrl: string;
    lengthOptions: Array<string>;
    manufacturerId: Principal;
    category: ProductCategory;
}
export enum OrderStatus {
    shipped = "shipped",
    pending = "pending",
    delivered = "delivered"
}
export enum ProductCategory {
    closure20Inch = "closure20Inch",
    closure16Inch = "closure16Inch",
    bundle12Inch = "bundle12Inch",
    curlyWig = "curlyWig",
    closure18Inch = "closure18Inch",
    bundle14Inch = "bundle14Inch",
    bobWig = "bobWig",
    bundle20Inch = "bundle20Inch",
    bundle16Inch = "bundle16Inch",
    closureWig = "closureWig",
    bundle18Inch = "bundle18Inch",
    supplyBundle = "supplyBundle",
    frontalWig = "frontalWig",
    blondeWig = "blondeWig",
    bodyWave = "bodyWave",
    closure12Inch = "closure12Inch",
    deepWave = "deepWave",
    closure14Inch = "closure14Inch",
    boneStraight = "boneStraight"
}
export enum UserRole {
    manufacturer = "manufacturer",
    vendor = "vendor"
}
export enum UserRole__1 {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole__1): Promise<void>;
    completeOrder(orderId: bigint): Promise<void>;
    createBusinessProfile(profile: BusinessProfile): Promise<void>;
    createProduct(name: string, category: ProductCategory, priceFromCents: bigint, lengthOptions: Array<string>, moq: bigint, imageUrl: string): Promise<bigint>;
    filterProducts(sort: string): Promise<Array<Product>>;
    getAllProducts(): Promise<Array<Product>>;
    getBusinessProfile(user: Principal): Promise<BusinessProfile | null>;
    getCallerUserProfile(): Promise<BusinessProfile | null>;
    getCallerUserRole(): Promise<UserRole__1>;
    getOrder(orderId: bigint): Promise<Order | null>;
    getOrdersForManufacturer(manufacturerId: Principal): Promise<Array<Order>>;
    getOrdersForProduct(productId: bigint): Promise<Array<Order>>;
    getOrdersForVendor(vendorId: Principal): Promise<Array<Order>>;
    getProduct(productId: bigint): Promise<Product | null>;
    getProductMessagesForProduct(productId: bigint): Promise<Array<ProductMessage>>;
    getProductQuantities(): Promise<Array<[bigint, bigint]>>;
    getProductQuantity(productId: bigint): Promise<bigint>;
    getProductsByCategory(category: ProductCategory): Promise<Array<Product>>;
    getProductsForManufacturer(manufacturerId: Principal): Promise<Array<Product>>;
    getUserProfile(user: Principal): Promise<BusinessProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isManufacturer(profileId: Principal): Promise<boolean>;
    isVendor(profileId: Principal): Promise<boolean>;
    placeOrder(productId: bigint, quantity: bigint): Promise<bigint>;
    saveCallerUserProfile(profile: BusinessProfile): Promise<void>;
    searchProducts(searchTerm: string): Promise<Array<Product>>;
    seedData(): Promise<void>;
    sendProductMessage(receiverId: Principal, productId: bigint, text: string): Promise<void>;
    setProductQuantity(productId: bigint, quantity: bigint): Promise<void>;
    updateBusinessProfile(profile: BusinessProfile): Promise<void>;
    updateProduct(productId: bigint, name: string, priceFromCents: bigint, lengthOptions: Array<string>, moq: bigint, imageUrl: string): Promise<void>;
}
