"use client";
import {use, useEffect} from "react";
import {useWalletClient} from "wagmi";
import useCircles from "./hooks/circle";
import CardBets from "@/components/app-components/cards";

export default function Home() {
  const {data: signer} = useWalletClient();
  const {initCircles} = useCircles();

  useEffect(() => {
    initCircles();
  }, [signer]);
  return (
    <main>

      <CardBets />
    </main>
  );
}
