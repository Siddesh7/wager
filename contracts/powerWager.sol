// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract powerWager {
    IERC20 public usdc;  // USDC token contract

    struct Bet {
        uint256 id;
        uint256 initialStake;
        address[] peopleArray;
        string info;
        string dueTime;
        string winningCriteria;
        address winner;
        address[] bettors;
        mapping(address => uint8) votes; // Votes for each address
        mapping(address => bool) hasDeposited; // Tracks deposits
        mapping(address => bool) hasVoted; // Tracks votes
        uint256 depositCount; // Tracks number of deposits
        uint256 voteCount; // Tracks number of votes
        bool votingClosed; // Indicates if voting is closed
    }

    struct BetDetails {
        uint256 id;
        uint256 initialStake;
        address[] peopleArray;
        string info;
        string dueTime;
        string winningCriteria;
        address winner;
        address[] bettors;
        uint256 depositCount;
        uint256 voteCount;
        bool votingClosed;
    }

    mapping(uint256 => Bet) public bets;
    uint256 public nextBetId;

    // Event emitted when a new bet is created
    event BetCreated(
        uint256 id,
        uint256 initialStake,
        address[] peopleArray,
        string info,
        string dueTime,
        string winningCriteria,
        address winner
    );

    // Event emitted when a winner is set for a bet
    event WinnerSet(uint256 id, address winner);

    // Event emitted when a new bettor is added to a bet
    event BettorAdded(uint256 id, address bettor);

    // Event emitted when a vote is cast
    event VoteCast(uint256 id, address voter, address candidate);

    // Event emitted when a deposit is made
    event DepositMade(uint256 id, address depositor);

    constructor(address _usdcAddress) {
        usdc = IERC20(_usdcAddress);
    }

    // Function to create a new bet
    function createBet(
        uint256 _initialStake,
        address[] memory _peopleArray,
        string memory _info,
        string memory _dueTime,
        string memory _winningCriteria
    ) public {
        Bet storage newBet = bets[nextBetId];
        newBet.id = nextBetId;
        newBet.initialStake = _initialStake;
        newBet.peopleArray = _peopleArray;
        newBet.info = _info;
        newBet.dueTime = _dueTime;
        newBet.winningCriteria = _winningCriteria;
        newBet.votingClosed = false;
        newBet.depositCount = 0;
        newBet.voteCount = 0;
        emit BetCreated(nextBetId, _initialStake, _peopleArray, _info, _dueTime, _winningCriteria, address(0));
        nextBetId++;
    }

    // Function to fetch all bets
    function getAllBets() public view returns (BetDetails[] memory) {
        BetDetails[] memory result = new BetDetails[](nextBetId);
        for (uint256 i = 0; i < nextBetId; i++) {
            Bet storage bet = bets[i];
            result[i] = BetDetails(
                bet.id,
                bet.initialStake,
                bet.peopleArray,
                bet.info,
                bet.dueTime,
                bet.winningCriteria,
                bet.winner,
                bet.bettors,
                bet.depositCount,
                bet.voteCount,
                bet.votingClosed
            );
        }
        return result;
    }

    // Function to fetch a specific bet by id
    function getBet(uint256 _id) public view returns (BetDetails memory) {
        require(_id < nextBetId, "Bet does not exist");
        Bet storage bet = bets[_id];
        return BetDetails(
            bet.id,
            bet.initialStake,
            bet.peopleArray,
            bet.info,
            bet.dueTime,
            bet.winningCriteria,
            bet.winner,
            bet.bettors,
            bet.depositCount,
            bet.voteCount,
            bet.votingClosed
        );
    }

    // Function to delete a bet
    function deleteBet(uint256 _id) public {
        require(_id < nextBetId, "Bet does not exist");
        delete bets[_id];
    }

    // Function to update a bet
    function updateBet(
        uint256 _id,
        uint256 _initialStake,
        address[] memory _peopleArray,
        string memory _info,
        string memory _dueTime,
        string memory _winningCriteria,
        address _winner
    ) public {
        require(_id < nextBetId, "Bet does not exist");
        Bet storage bet = bets[_id];
        bet.initialStake = _initialStake;
        bet.peopleArray = _peopleArray;
        bet.info = _info;
        bet.dueTime = _dueTime;
        bet.winningCriteria = _winningCriteria;
        bet.winner = _winner;
    }

    // Function to set a winner for a bet
    function setWinner(uint256 _id) public {
        require(_id < nextBetId, "Bet does not exist");
        Bet storage bet = bets[_id];
        require(!bet.votingClosed, "Voting is already closed");
        require(bet.depositCount == bet.peopleArray.length, "Not all participants have deposited the initial stake");
        require(bet.voteCount == bet.peopleArray.length, "Not all participants have voted");

        address winningAddress;
        uint8 maxVotes = 0;

        // Count votes and determine the winner
        for (uint256 i = 0; i < bet.peopleArray.length; i++) {
            address candidate = bet.peopleArray[i];
            if (bet.votes[candidate] > maxVotes) {
                maxVotes = bet.votes[candidate];
                winningAddress = candidate;
            }
        }

        bet.winner = winningAddress;
        bet.votingClosed = true;
        uint256 totalStake = bet.initialStake * bet.peopleArray.length;
        require(usdc.transfer(winningAddress, totalStake), "USDC transfer failed");
        emit WinnerSet(_id, winningAddress);
    }

    // Function to add a bettor to a bet
    function addBettor(uint256 _id, address _bettor) public {
        require(_id < nextBetId, "Bet does not exist");
        bets[_id].bettors.push(_bettor);
        emit BettorAdded(_id, _bettor);
    }

    // Function to get the bettors of a specific bet by id
    function getBettors(uint256 _id) public view returns (address[] memory) {
        require(_id < nextBetId, "Bet does not exist");
        return bets[_id].bettors;
    }

    // Function to cast a vote
    function vote(uint256 _id, address _candidate) public {
        require(_id < nextBetId, "Bet does not exist");
        Bet storage bet = bets[_id];
        require(!bet.votingClosed, "Voting is closed");

        // Check if the voter is in the peopleArray
        bool isVoterAllowed = false;
        for (uint256 i = 0; i < bet.peopleArray.length; i++) {
            if (bet.peopleArray[i] == msg.sender) {
                isVoterAllowed = true;
                break;
            }
        }
        require(isVoterAllowed, "You are not allowed to vote");

        // Check if the candidate is in the peopleArray
        bool isCandidateAllowed = false;
        for (uint256 i = 0; i < bet.peopleArray.length; i++) {
            if (bet.peopleArray[i] == _candidate) {
                isCandidateAllowed = true;
                break;
            }
        }
        require(isCandidateAllowed, "Candidate is not valid");

        // Ensure the voter hasn't already voted
        require(!bet.hasVoted[msg.sender], "You have already voted");

        // Cast the vote
        bet.votes[_candidate]++;
        bet.hasVoted[msg.sender] = true;
        bet.voteCount++;
        emit VoteCast(_id, msg.sender, _candidate);
    }

    // Function for participants to deposit the initial stake
    function deposit(uint256 _id) public {
        require(_id < nextBetId, "Bet does not exist");
        Bet storage bet = bets[_id];
        
        // Check if the depositor is in the peopleArray
        bool isDepositorAllowed = false;
        for (uint256 i = 0; i < bet.peopleArray.length; i++) {
            if (bet.peopleArray[i] == msg.sender) {
                isDepositorAllowed = true;
                break;
            }
        }
        require(isDepositorAllowed, "You are not allowed to deposit");

        // Ensure the depositor hasn't already deposited
        require(!bet.hasDeposited[msg.sender], "You have already deposited");

        // Transfer USDC to the contract
        require(usdc.transferFrom(msg.sender, address(this), bet.initialStake), "USDC transfer failed");

        // Mark the depositor as having deposited and increment the deposit count
        bet.hasDeposited[msg.sender] = true;
        bet.depositCount++;
        
        emit DepositMade(_id, msg.sender);
    }
}
