import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
interface BetCardProps {
  betId: string;
  description: string;
  stake: string;
  people: string[];
  criteria: string;
}
const BetCard: React.FC<BetCardProps> = ({
  betId,
  description,
  stake,
  people,
  criteria,
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Bet #{betId}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        Stake = {Number(stake) * people.length}
        <br />
        People ={" "}
        {people
          .map((person) => `${person.substring(0, 4)}...${person.slice(-4)}`)
          .join(", ")}
        <br />
        Criteria = {criteria}
      </CardContent>
    </Card>
  );
};

export default BetCard;
