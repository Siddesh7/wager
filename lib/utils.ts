import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";
import {ChainConfig} from "@circles-sdk/sdk";
import axios from "axios";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const chainConfig: ChainConfig = {
  pathfinderUrl: "https://pathfinder.aboutcircles.com",
  circlesRpcUrl: "https://chiado-rpc.aboutcircles.com",
  v1HubAddress: "0xdbf22d4e8962db3b2f1d9ff55be728a887e47710",
  v2HubAddress: "0x2066CDA98F98397185483aaB26A89445addD6740",
  migrationAddress: "0x2A545B54bb456A0189EbC53ed7090BfFc4a6Af94",
};

export const getUserTransactions = async (address: string) => {
  try {
    const {data} = await axios.get(
      `https://eth.blockscout.com/api/v2/transactions`
    );
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};
