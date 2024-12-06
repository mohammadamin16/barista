import axios from "axios";
import { Address } from "../store";

export async function sendVerificationCode(phoneNumber: string) {
  try {
    const response = await axios.post(
      "https://snappfood.ir/mobile/v4/user/loginMobileWithNoPass",
      new URLSearchParams({ cellphone: phoneNumber, captcha: "", local: "" }),
      {
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        params: {
          client: "PWA",
          optionalClient: "PWA",
          deviceType: "PWA",
          appVersion: "5.6.6",
          optionalVersion: "5.6.6",
          UDID: "33844208-4a43-446e-b18b-027ea09465d5",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}

// interface VerifyCodeResponse  data: {
//     user: {
//       id: 13284421,
//       username: '09912147018',
//       firstname: 'محمدامین',
//       lastname: 'توتونچی',
//       cellphone: '0991 214 7018',
//       email: '',
//       birthday: '',
//       credit: 0,
//       vipDiscount: 0,
//       profilePicture: '',
//       point: 0,
//       levelName: 'مبتدی',
//       levelNumber: 1,
//       memberships: [],
//       hasPassword: false,
//       otpDisabled: false,
//       userMembershipAcquaintanceId: null,
//       vendorsList: [],
//       emailSubscribed: null,
//       smsSubscribed: null,
//       cardNumber: null,
//       UDID: 'd292716e-a709-4aa5-8979-00eb81489242',
//       addresses: [Array]
//     },
//     time: 1733479657,
//     vipDiscountPlans: [],
//     vipDeliveryDiscount: 0,
//     vip_badge: '',
//     isLoyal: true,
//     nested_jwt: 'eyJhbGciOiJSUzI1NiJ9.eyJyb2xlcyI6W10sInVzZXJuYW1lIjoiMDk5MTIxNDcwMTgiLCJpZCI6MTMyODQ0MjEsInVkaWQiOiIzMzg0NDIwOC00YTQzLTQ0NmUtYjE4Yi0wMjdlYTA5NDY1ZDUiLCJleHAiOjE3NjUwMTU2NTcsImlhdCI6MTczMzQ3OTY1N30.HETqtR_UIeBi6uJNLzE9VtPodwA05MqOnIBTe_yAAxlQwHEPf9_7C6vlPKGmfNX1HGV-_f3eYAvjdh6NhTnUM46_cvYOpFu_RYdFPLAbAGNY0-0qiu0RKiQdF-2EbjGXhZku9kvJqHp5AOqaKX6y7ZYpz-T3fpE9ZiiigYXFvu52-YzsfMcUNgioe9xglTjOuwf7K7NP8OnwqDUI6C3k7B2ms16BGShB8nrgD6PA0_kZrDvuh5ZO6K9pq5oSzb4e5AZPWntqA9rYbgGNTXkPx-BeP0ObY4qr6c3fAHQA0sKy-TwHoEbEaGXhzgzMzzzDkJ8t88GZkwM-9H3eegaHjx7bDMzA2_2Rt0cs16oCGnBJ6JdDcyo8SzWBb8qYvUt1f7At4JdTVWkDPM-dwaPx7dk5ALcHvQ2eXwv-OTqEZvJOMh_pVzTwb_aasCImUhk5u07XDkPEveMeKxoNUBz5wPe8H-K1ljPjou1w047r8Hv64JDeF2vNq7eRTaXbSv6wh0jYwsuMnq6pa0f5O2Hfz97RqwPjH1SfVt0tdOfnjeJcJJOrtG-4NLQmmiRDTT00BkAX7zjKXgCXh36y2v5Olvo7dKCg1ndbBpb5HDN7l6GOFQ6k7CcIuGmKejhxPamMl2CBy3Z8CinS7kNUGD79yVsI02T_zSL4TkxBwU3om8M',
//     playerId: null
//   }
interface VerifyCodeResponse {
  user: {
    id: number;
    username: string;
    firstname: string;
    lastname: string;
    cellphone: string;
    email: string;
    birthday: string;
    credit: number;
    vipDiscount: number;
    profilePicture: string;
    point: number;
    levelName: string;
    levelNumber: number;
    memberships: any[];
    hasPassword: boolean;
    otpDisabled: boolean;
    userMembershipAcquaintanceId: any;
    vendorsList: any[];
    emailSubscribed: any;
    smsSubscribed: any;
    cardNumber: any;
    UDID: string;
    addresses: any[];
  };
  time: number;
  vipDiscountPlans: any[];
  vipDeliveryDiscount: number;
  vip_badge: string;
  isLoyal: boolean;
  nested_jwt: string;
  playerId: any;
}

export async function verifyCode(
  phoneNumber: string,
  verificationCode: string
) {
  try {
    const response = await axios.post(
      "https://snappfood.ir/mobile/v2/user/loginMobileWithToken",
      new URLSearchParams({
        code: verificationCode,
        cellphone: phoneNumber,
        local: "",
      }),
      {
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        params: {
          client: "PWA",
          optionalClient: "PWA",
          deviceType: "PWA",
          appVersion: "5.6.6",
          optionalVersion: "5.6.6",
          UDID: "33844208-4a43-446e-b18b-027ea09465d5",
        },
      }
    );
    console.log("Verification login successful:", response.data);
    const data: VerifyCodeResponse = response.data.data;
    
    return data;
  } catch (error) {
    console.error("Verification login failed:", error);
    throw error;
  }
}
