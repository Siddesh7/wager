import React, {useEffect} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "../ui/input";
import {Button} from "../ui/button";
import {toast} from "../ui/use-toast";
import {useWriteContract} from "wagmi";
import {WAGER_ABI, WAGER_ADDRESS} from "@/constants";
const CreateBetcard = () => {
  const [goal, setGoal] = React.useState("");
  const [stake, setStake] = React.useState("");
  const [info, setInfo] = React.useState("");
  const [peopleArray, setPeopleArray] = React.useState([]);
  const [due, setDue] = React.useState("");
  const [criteria, setCriteria] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const {writeContractAsync} = useWriteContract();
  const handleSubmit = async () => {
    try {
      // Call the create goal function
      const hash = await writeContractAsync({
        abi: WAGER_ABI,
        address: WAGER_ADDRESS,
        functionName: "createBet",
        args: [
          Number(stake) * 10 ** 6,
          JSON.parse(peopleArray),
          info,
          due,
          criteria,
        ],
      });
      console.log(hash);
      setSuccess("Goal created successfully");
    } catch (error) {
      console.log(error);
      setError("Error creating goal");
    }
    setLoading(false);
  };

  const handleInputChange = (e: any) => {
    const {name, value} = e.target;
    if (name === "stake") {
      setStake(value);
    } else if (name === "info") {
      setInfo(value);
    } else if (name === "due") {
      setDue(value);
    } else if (name === "criteria") {
      setCriteria(value);
    } else if (name === "peopleArray") {
      setPeopleArray(value);
    }
  };

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError("");
        toast({
          title: "Error creating goal",
        });
      }, 3000);
    }
    if (success) {
      setTimeout(() => {
        setSuccess("");
        toast({
          title: "Goal created successfully",
        });
      }, 3000);
    }
  }, [error, success]);
  return (
    <div className="z-100 top-0 left-0 w-screen bg-gray-400 bg-opacity-50 fixed">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Create a goal</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Add People"
            className="w-full"
            type="text"
            value={peopleArray}
            onChange={handleInputChange}
            name="peopleArray"
          />
          <Input
            placeholder="Enter initial stake"
            className="w-full"
            type="text"
            value={stake}
            onChange={handleInputChange}
            name="stake"
          />
          <Input
            placeholder="Enter additional info"
            className="w-full"
            type="text"
            value={info}
            onChange={handleInputChange}
            name="info"
          />
          <Input
            placeholder="Enter due time"
            className="w-full"
            type="text"
            value={due}
            onChange={handleInputChange}
            name="due"
          />
          <Input
            placeholder="Enter winning criteria"
            className="w-full"
            type="text"
            value={criteria}
            onChange={handleInputChange}
            name="criteria"
          />
          <Button onClick={handleSubmit}>
            {loading ? "Creating goal..." : "Create goal"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateBetcard;
