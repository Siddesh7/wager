"use client";
import {toast} from "@/components/ui/use-toast";
import {Sdk} from "@circles-sdk/sdk";
import {BrowserProvider} from "ethers";
import {ethers} from "ethers";
import {useEffect, useState} from "react";
import {useAccount, useWalletClient} from "wagmi";

const chainConfig = {
  pathfinderUrl: "https://pathfinder.aboutcircles.com",
  circlesRpcUrl: "https://chiado-rpc.aboutcircles.com",
  v1HubAddress: "0xdbf22d4e8962db3b2f1d9ff55be728a887e47710",
  v2HubAddress: "0x2066CDA98F98397185483aaB26A89445addD6740",
  migrationAddress: "0x2A545B54bb456A0189EbC53ed7090BfFc4a6Af94",
};
function useCircles() {
  const [sdk, setSdk] = useState<any>();

  const [isSDKInitialized, setSDKInitialized] = useState(false);
  const [avatarInfo, setAvatar] = useState<any>(null);
  const [trustedCircles, setTrustedCircles] = useState<any[]>([]);
  const [untrustedCircles, setUntrustedCircles] = useState<any[]>([]);
  const [trustRelations, setTrustRelations] = useState<any[]>([]);
  const [mintableAmount, setMintableAmount] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const provider = new ethers.BrowserProvider(window.ethereum as any);

  async function initializeSdk() {
    const browserProvider = new BrowserProvider(window.ethereum as any);
    const signer = await browserProvider.getSigner();
    const address = await signer.getAddress();
    console.log("Signer address:", address);
    console.log("Signer:", signer);

    let sdk = new Sdk(chainConfig, {
      runner: signer as any,
      address: address as any,
    });
    setSDKInitialized(true);
    setSdk(sdk);
    return sdk;
  }

  const handleAvatarCheckAndRegister = async (sdk?: any) => {
    try {
      console.log("sdk", sdk);
      if (!isSDKInitialized || !sdk) {
        throw new Error("SDK is not initialized");
      }
      const browserProvider = new BrowserProvider(window.ethereum as any);
      const signer = await browserProvider.getSigner();
      const address = await signer.getAddress();
      const avatarInfo = await sdk.getAvatar(address);
      console.log("Avatar found:", avatarInfo);
      setAvatar(avatarInfo);

      const trustRelations = await avatarInfo.getTrustRelations("");
      console.log("Trust Relations:", trustRelations);

      // Update trusted circles state
      setTrustedCircles(trustRelations.map((rel: any) => rel.objectAvatar));

      const mappedRelations = trustRelations.map((rel: any) => ({
        timestamp: rel.timestamp, // Assuming date is a property in the trust relation object
        objectAvatar: rel.objectAvatar,
        relations: rel.relation, // Assuming relation is a property in the trust relation object
      }));

      setTrustRelations(mappedRelations);
      console.log(mappedRelations, "got mapped data");

      // Fetch additional avatar details
      const mintableAmount = await avatarInfo.getMintableAmount(address);
      const totalBalance = await avatarInfo.getTotalBalance(address);
      setMintableAmount(mintableAmount);
      setTotalBalance(totalBalance);
    } catch (error) {
      console.log("Avatar not found, registering as human...");
      try {
        const newAvatar = await sdk.registerHuman();
        toast({
          title: "User Registered in Circles",
          description:
            "You have been registered in circles and you can now mint and start adding trusted people in your circle",
        });
        setAvatar(newAvatar);
      } catch (registerError) {
        console.error("Error registering avatar:", registerError);
      }
    }
  };

  const initCircles = async () => {
    try {
      if (!isSDKInitialized) {
        let sdk = await initializeSdk();
        setSdk(sdk);
        console.log("SDK after initialization:", sdk);
      }

      await handleAvatarCheckAndRegister(sdk);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };
  async function updateBalance() {
    const browserProvider = new BrowserProvider(window.ethereum as any);
    const signer = await browserProvider.getSigner();
    const address = await signer.getAddress();
    const totalBalance = await avatarInfo?.getTotalBalance(address);
    setTotalBalance(totalBalance);
  }

  const trustNewCircle = async (newCircle: any) => {
    try {
      if (!avatarInfo) {
        throw new Error("Avatar not found");
      }

      await avatarInfo.trust(newCircle);
      setTrustedCircles([...trustedCircles, newCircle]);
      setUntrustedCircles(untrustedCircles.filter((c) => c !== newCircle));
    } catch (error) {
      console.error("Error trusting new circle:", error);
    }
  };

  const untrustCircle = async (circle: any) => {
    try {
      if (!avatarInfo) {
        throw new Error("Avatar not found");
      }

      await avatarInfo.untrust(circle);
      setUntrustedCircles([...untrustedCircles, circle]);
      setTrustedCircles(trustedCircles.filter((c) => c !== circle));

      // Call getTrustRelations after updating circles
    } catch (error) {
      console.error("Error untrusting circle:", error);
    }
  };

  return {
    totalBalance,
    avatarInfo,
    trustedCircles,
    trustRelations,
    trustNewCircle,
    untrustCircle,

    updateBalance,

    initCircles,
  };
}

export default useCircles;
