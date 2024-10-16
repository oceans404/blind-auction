import { type FC, useState, useEffect } from "react";
import { useNilComputeOutput } from "@nillion/client-react-hooks";
import { ComputeOutputId } from "@nillion/client-core";

interface ComputeOutputProps {
  data: any;
}

export const ComputeOutput: FC<ComputeOutputProps> = ({ data = "" }) => {
  const nilComputeOutput = useNilComputeOutput();
  const [computeId, setComputeId] = useState<ComputeOutputId | string>(data);
  const [revealed, setRevealed] = useState<boolean>(false);

  useEffect(() => {
    setComputeId(data);
  }, [data]);

  useEffect(() => {
    setRevealed(false);
  }, [computeId]);

  const handleClick = () => {
    if (!computeId) throw new Error("compute-output: Compute id is required");
    nilComputeOutput.execute({ id: computeId });
    setRevealed(true);
  };

  let computeOutput = "idle";
  if (nilComputeOutput.isSuccess) {
    computeOutput = JSON.stringify(nilComputeOutput.data, (key, value) => {
      if (typeof value === "bigint") {
        return value.toString();
      }
      return value;
    });
  }

  return (
    <div className="border border-[rgb(25,118,210)] rounded-lg p-4 w-full">
      <h2 className="text-2xl font-bold mb-4">Blind Auction Results</h2>
      {/* <input
        className="w-full p-2 mb-4 border border-gray-300 rounded text-black"
        placeholder="Compute output id"
        value={computeId}
        onChange={(e) => setComputeId(e.target.value)}
      /> */}
      {!revealed && (
        <button
          className={`flex items-center justify-center px-4 py-2 border rounded text-black  ${
            !computeId || nilComputeOutput.isLoading
              ? "opacity-50 cursor-not-allowed bg-gray-200"
              : "bg-white hover:bg-gray-100"
          }`}
          onClick={handleClick}
          disabled={!computeId || nilComputeOutput.isLoading}
        >
          {nilComputeOutput.isLoading ? (
            <div className="w-5 h-5 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></div>
          ) : (
            "👀 Reveal winner"
          )}
        </button>
      )}

      {nilComputeOutput?.status === "success" && revealed && (
        <div>
          <h3>
            <span className="font-bold">
              Bidder {JSON.parse(computeOutput).winning_index}
            </span>{" "}
            won the blind auction with a secret bid of{" "}
            <span className="font-bold">
              {JSON.parse(computeOutput).highest_bid}
            </span>
            .
          </h3>
        </div>
      )}
      {/* <ul className="list-disc pl-5 mt-4">
        <li className="mt-2">Status: {nilComputeOutput.status}</li>
        <li className="mt-2">Output: {computeOutput}</li>
      </ul> */}
    </div>
  );
};
