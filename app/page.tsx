"use client";

import { WelcomeContent } from "./components/WelcomeContent";
import { Login } from "./components/Login";
import StoreValue from "./components/StoreValue";
import FetchValue from "./components/FetchValue";
import { StoreProgram } from "./components/StoreProgram";
import { Compute } from "./components/Compute";
import { ComputeOutput } from "./components/ComputeOutput";
import { useState } from "react";

import dotenv from "dotenv";
dotenv.config();

// UPDATE THIS WITH YOUR STORED AUCTION PROGRAM ID (upload auction.nada.bin with the StoreProgram component)
const auction_program_id =
  "615UmdBm3vxJF9k44bF97Va1Eg8JjyNeRJ1pxr1qY5NivmFZAWN4zrbUVfMnXny5MA4dmPb6cYrPRAiW6AzaPPSx/auction";

export default function Home() {
  const [data, setData] = useState(null);
  const [isConnectedToNillion, setIsConnectedToNillion] = useState(false);
  const handleDataChange = (newData: any) => {
    console.log(newData);
    setData(newData);
  };

  const handleAuthChange = (authenticated: boolean) => {
    setIsConnectedToNillion(authenticated);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full flex flex-col items-center font-mono text-sm">
        <WelcomeContent />
        {/* <StoreProgram /> */}
        <div className="flex flex-col gap-4 max-w-4xl mx-auto w-full mt-5">
          <Compute
            storedProgramId={auction_program_id}
            onDataChange={handleDataChange}
            disableInputs={!isConnectedToNillion}
          />
          {data && <ComputeOutput data={data} />}
        </div>
        <Login autoLogin={true} onAuthChange={handleAuthChange} />
      </div>
    </main>
  );
}
