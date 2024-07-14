"use client";
import useCircles from "@/app/hooks/circle";
import {DynamicWidget} from "@dynamic-labs/sdk-react-core";
import Image from "next/image";
import React, {useEffect} from "react";
import {useAccount, useEnsName} from "wagmi";

const Navbar = () => {
  const {avatarInfo} = useCircles();
  const {address} = useAccount();

  const {data: name} = useEnsName({
    address: address!,
    chainId: 1,
  });
  return (
    <div className="flex flex-row items-center justify-between w-[95%] m-auto my-4">
      <Image src="/logo.png" alt="logo" width={100} height={100} />
      <div className="flex flex-row gap-2">
        <p>{name}</p>
        <DynamicWidget
          buttonClassName="btn-primary h-[10px] w-[300px]"
          buttonContainerClassName="bg-yellow border-2"
        />
      </div>
    </div>
  );
};

export default Navbar;
