"use client";

import React, { FC, useState, useEffect } from "react";
import {
  NadaValue,
  NadaValues,
  NamedValue,
  PartyName,
  ProgramBindings,
  ProgramId,
} from "@nillion/client-core";
import { useNilCompute, useNillion } from "@nillion/client-react-hooks";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

interface ComputeProps {
  storedProgramId: string; // Define the required prop type
  onDataChange: (data: string) => void; // Add this prop for the effect
  disableInputs?: boolean; // Add disableInputs prop
}

export const Compute: FC<ComputeProps> = ({
  storedProgramId,
  onDataChange,
  disableInputs = false, // Set default value
}: ComputeProps) => {
  const { client } = useNillion();
  const nilCompute = useNilCompute();
  const [programId, setProgramId] = useState<ProgramId | string>(
    storedProgramId,
  );
  const [copiedComputeOutputID, setCopiedComputeOutputID] = useState(false);
  const [bids, setBids] = useState<number[]>([0, 0, 0, 0, 0]); // State for bids

  const handleBidChange = (index: number, value: number | number[]) => {
    const newBids = [...bids];
    newBids[index] = value as number; // Update the specific bid
    setBids(newBids);
  };

  const handleClick = () => {
    if (!programId) throw new Error("compute: program id required");

    const bindings = ProgramBindings.create(programId)
      .addInputParty(PartyName.parse("bidder_0"), client.partyId)
      .addInputParty(PartyName.parse("bidder_1"), client.partyId)
      .addInputParty(PartyName.parse("bidder_2"), client.partyId)
      .addInputParty(PartyName.parse("bidder_3"), client.partyId)
      .addInputParty(PartyName.parse("bidder_4"), client.partyId)
      .addOutputParty(PartyName.parse("auctioneer"), client.partyId);

    // Use dynamic bids from state
    const values = NadaValues.create()
      .insert(NamedValue.parse("bid_0"), NadaValue.createSecretInteger(bids[0]))
      .insert(NamedValue.parse("bid_1"), NadaValue.createSecretInteger(bids[1]))
      .insert(NamedValue.parse("bid_2"), NadaValue.createSecretInteger(bids[2]))
      .insert(NamedValue.parse("bid_3"), NadaValue.createSecretInteger(bids[3]))
      .insert(
        NamedValue.parse("bid_4"),
        NadaValue.createSecretInteger(bids[4]),
      );

    nilCompute.execute({ bindings, values });
  };

  // Effect to send nilCompute.data to the parent when it changes
  useEffect(() => {
    // @ts-ignore
    if (nilCompute && nilCompute.data) {
      // @ts-ignore
      onDataChange(nilCompute.data); // Call the function passed from the parent
    }
  }, [nilCompute.status]);

  return (
    <div
      className={`border rounded-lg p-4 w-full ${!disableInputs ? "border-[rgb(25,118,210)]" : "border-gray-400"}`}
    >
      <h2 className="text-2xl font-bold mb-4">Submit Secret Bids</h2>
      <p className="mb-4">
        Each bidder submits a secret bid to the blind auction.
      </p>
      <div
        className="bidders-container"
        style={{ display: "flex", justifyContent: "space-around" }}
      >
        {bids.map((bid, index) => (
          <div key={index} className="bidder-container">
            <h3 className="text-center font-bold">{`Bidder ${index}`}</h3>
            <Box
              sx={{
                height: 300,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Slider
                orientation="vertical"
                value={bid}
                min={0}
                max={100}
                onChange={(e, newValue) => handleBidChange(index, newValue)}
                valueLabelDisplay="auto"
                aria-label={`Bid ${index} Slider`}
                disabled={disableInputs} // Set disabled based on prop
              />
              {/* <div
                className="bid-price noselect pt-4"
                id={`bid-price-${index}`}
              >
                Bid: {bid}
              </div> */}
            </Box>
          </div>
        ))}
      </div>
      <button
        className={`flex items-center justify-center px-4 py-2 border rounded text-black mb-4 mt-5 ${
          nilCompute.isLoading || !programId
            ? "opacity-50 cursor-not-allowed bg-gray-200"
            : "bg-white hover:bg-gray-100"
        }`}
        onClick={handleClick}
        disabled={disableInputs || nilCompute.isLoading || !programId}
      >
        {nilCompute.isLoading ? (
          <div className="w-5 h-5 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></div>
        ) : (
          "Compute auction results"
        )}
      </button>
      {/* <ul className="list-disc pl-5 mt-4">
        <li className="mt-2">Status: {nilCompute.status}</li>
        <li className="mt-2">
          Compute output id:
          {nilCompute.isSuccess ? (
            <>
              {`${nilCompute.data?.substring(0, 4)}...${nilCompute.data?.substring(nilCompute.data.length - 4)}`}
              <button
                onClick={() => {
                  setCopiedComputeOutputID(true);
                  navigator.clipboard.writeText(nilCompute.data);
                  setTimeout(() => setCopiedComputeOutputID(false), 2000);
                }}
              >
                {!copiedComputeOutputID ? " 📋" : " ✅"}
              </button>
            </>
          ) : (
            "idle"
          )}
        </li>
      </ul> */}
    </div>
  );
};
