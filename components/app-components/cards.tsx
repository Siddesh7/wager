import React, {useEffect, useState} from "react";
import TinderCard from "react-tinder-card";
import BetCard from "./bet-card";
import {useReadContract} from "wagmi";
import {WAGER_ABI, WAGER_ADDRESS} from "@/constants";
import {Plus} from "lucide-react";
import CreateBetcard from "./create-bet-card";

function CardBets() {
  const [allBets, setAllBets] = useState([]);
  const [wagerAllowance, setWagerAllowance] = useState(500);
  const [showCreateBetCard, setShowCreateBetCard] = useState(false);
  const [lastLocation, setLastLocation] = useState("");
  const swiped = (direction, nameToDelete) => {
    console.log("removing: " + nameToDelete);
    setLastLocation(direction);
    if (direction === "right") setWagerAllowance((prev) => prev - 100);
  };

  const outOfFrame = (name) => {
    console.log(name + " left the screen!");
  };

  const {data: bets} = useReadContract({
    abi: WAGER_ABI,
    address: WAGER_ADDRESS,
    functionName: "getAllBets",
  });

  useEffect(() => {
    setAllBets(bets as any);
    console.log(bets);
  }, [bets]);

  return (
    <div>
      <div className="flex flex-row justify-between items-center w-[90%] m-auto my-4">
        <p>Wagers: {wagerAllowance}</p>
        <Plus
          size={32}
          onClick={() => {
            setShowCreateBetCard(!showCreateBetCard);
          }}
        />
      </div>
      {showCreateBetCard && <CreateBetcard />}
      <div className="flex flex-wrap relative w-[90%] m-auto">
        {allBets &&
          allBets.map((bet: any) => {
            if (bet.votingClosed) return null;
            return (
              <TinderCard
                className="absolute top-0 left-0 w-full"
                key={bet.id}
                onSwipe={(dir) => swiped(dir, bet.id)}
                onCardLeftScreen={() => outOfFrame(bet.id)}
              >
                <BetCard
                  betId={bet.id}
                  description={bet.info}
                  stake={String(bet.initialStake)}
                  people={bet.peopleArray}
                  criteria={bet.winningCriteria}
                />
              </TinderCard>
            );
          })}

        {lastLocation && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <h2 className="text-white">You swiped {lastLocation}</h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default CardBets;
