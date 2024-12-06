import axios from "axios";
import { Address } from "../store";

interface RestaurantVendor {
  type: "VENDOR" | string;
  data: {
    id: number;
    vendorCode: string;
    noOrder: boolean;
    title: string;
    description: string;
    rate: number;
    rating: number;
    normalized_rating: number;
    logo: string;
    defLogo: string;
    taxEnabled: boolean;
    taxIncluded: boolean;
    taxEnabledInProducts: boolean;
    taxEnabledInPackaging: boolean;
    taxEnabledInDeliveryFee: boolean;
    tax: number;
    serviceFee: number;
    deliveryArea: string;
    discount: number;
    isOpen: boolean;
    minDeliveryFee: number;
    maxDeliveryFee: number;
    deliveryTime: number;
    paymentTypes: number[];
    schedules: {
      type: number;
      weekday: number;
      allDay: boolean;
      startHour: string;
      stopHour: string;
    }[];
    minOrder: number;
    address: string;
    phone: string;
    website: string;
    status: number;
    lat: number;
    lon: number;
    restaurantClass: string;
    foodTypes: any[];
    restaurantTypes: any[];
    isFavorite: boolean;
    priority: number;
    city: string;
    area: string;
    commentCount: number;
    recommendedFor: string;
    establishment: string;
    mostPopularItems: string;
    costsForTwo: number;
    onlineOrder: boolean;
    voteCount: number;
    discountType: any;
    menuUrl: string;
    discountValue: number;
    discountForAll: boolean;
    containerFee: number;
    deliveryGuarantee: boolean;
    badges: any[];
  };
}
interface fetchRestaurantVendorsResponse {
  finalResult: RestaurantVendor[];
}

export async function fetchRestaurantVendors(
  accessToken: string,
  address: Address
) {
  try {
    const response = await axios.get(
      "https://snappfood.ir/search/api/v4/restaurant/vendors-list",
      {
        headers: {
          Accept: "application/json, text/plain, */*",
          Authorization: `Bearer ${accessToken}`,
          "x-is-bonyan": "true",
          Referer: "https://m.snappfood.ir/",
        },
        params: {
          lat: address.latitude,
          long: address.longitude,
          client: "PWA",
          optionalClient: "PWA",
          deviceType: "PWA",
          appVersion: "6.0.0",
          UDID: "d292716e-a709-4aa5-8979-00eb81489242",
          "extra-filter": JSON.stringify({
            vendor_collection: 0,
            distance_sort: false,
            vendor_count_respect: false,
            new_home: true,
            new_home_section: "SERVICES",
          }),
          filters: JSON.stringify({
            superType: [2],
            mode: "CURRENT",
            item_position: "homePage",
          }),
          page: 0,
          page_size: 10,
          updateChannels: JSON.stringify([
            "master",
            "jek",
            "twentyPercent",
            "fiftyPercent",
            "SeventyPercent",
            "D1",
            "pro",
          ]),
        },
      }
    );

    let data = response.data.data as fetchRestaurantVendorsResponse;
    const vendors = data.finalResult.filter(
      (vendor) => vendor.type === "VENDOR"
    );

    data = {
      finalResult: vendors,
    };
    return data;
  } catch (error) {
    console.error("Failed to fetch restaurant vendors:", error);
    throw error;
  }
}

interface MenuImage {
    src: string;
    thumbnailSrc: string;
}

interface MenuVariation {
    id: number;
    title: string;
    description: string;
    capacity: any;
    active: boolean;
    price: number;
    rate: number;
    categoryId: number;
    eventMenuCategoryID: number;
    eventMenuCategoryTitle: string;
    images: MenuImage[];
    discount: any;
    toppingGroups: any[];
    stock: any;
}

interface MenuProduct {
    id: any;
    alias: string;
    title: string;
    description: string;
    popularityBadge: string;
    isEco: boolean;
    rate: number;
    menuCategoryID: number;
    menuCategoryTitle: string;
    images: MenuImage[];
    variations: MenuVariation[];
}

interface MenuCategory {
    id: number;
    title: string;
    capacity: any;
    deal: any;
    products: MenuProduct[];
}

interface fetchMenuItemsResponse {
    menuCategories: MenuCategory[];
}

export async function fetchMenuItems(accessToken: string, lat: number, long: number) {
    try {
        const response = await axios.get(
            "https://apigw.snappfood.ir/menu-read-model/3dylvx",
            {
                headers: {
                    Accept: "application/json, text/plain, */*",
                    Authorization: `Bearer ${accessToken}`,
                    "x-is-bonyan": "true",
                    Referer: "https://m.snappfood.ir/",
                },
                params: {
                    lat: lat,
                    long: long,
                    optionalClient: "PWA",
                    client: "PWA",
                    deviceType: "PWA",
                    appVersion: "6.0.0",
                    UDID: "d292716e-a709-4aa5-8979-00eb81489242",
                    Bonyan: "true",
                },
            }
        );

        const data = response.data.data as fetchMenuItemsResponse;
        return data;
    } catch (error) {
        console.error("Failed to fetch menu items:", error);
        throw error;
    }
}
