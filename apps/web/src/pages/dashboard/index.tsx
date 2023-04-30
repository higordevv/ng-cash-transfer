import {
  Box,
  Text,
  Input,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Select,
} from "@chakra-ui/react";
import { SetStateAction, useState } from "react";

export default function UserDashboard() {
  // Sample data for transaction history
  const transactionData = [
    {
      id: 1,
      type: "Cash In",
      amount: "+ $50.00",
      date: "2022-04-01",
    },
    {
      id: 2,
      type: "Cash Out",
      amount: "- $20.00",
      date: "2022-04-02",
    },
    {
      id: 3,
      type: "Cash Out",
      amount: "- $30.00",
      date: "2022-04-03",
    },
    {
      id: 4,
      type: "Cash In",
      amount: "+ $100.00",
      date: "2022-04-04",
    },
  ];

  // Sample data for user balance
  const userBalance = "$200.00";

  // Sample data for user transfer
  const [transferTo, setTransferTo] = useState("");
  const handleTransfer = () => {
    // TODO: Handle transfer logic
  };

  // Sample data for filter
  const [filterType, setFilterType] = useState("All");
  const handleFilterType = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setFilterType(event.target.value);
  };

  return (
    <Box p={4}>
      <Box mb={4}>
        <Text fontSize="xl" fontWeight="bold">
          Balance: {userBalance}
        </Text>
      </Box>
      <Box mb={4}>
        <Text fontSize="lg" fontWeight="bold" mb={2}>
          Transfer
        </Text>
        <Input
          placeholder="Transfer to"
          value={transferTo}
          onChange={(event) => setTransferTo(event.target.value)}
          mb={2}
        />
        <Button colorScheme="blue" onClick={handleTransfer}>
          Transfer
        </Button>
      </Box>
      <Box mb={4}>
        <Text fontSize="lg" fontWeight="bold" mb={2}>
          Transaction History
        </Text>
        <Select value={filterType} onChange={handleFilterType} mb={2}>
          <option value="All">All</option>
          <option value="Cash In">Cash In</option>
          <option value="Cash Out">Cash Out</option>
        </Select>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Type</Th>
              <Th>Amount</Th>
              <Th>Date</Th>
            </Tr>
          </Thead>
          <Tbody>
            {transactionData
              .filter((transaction) =>
                filterType === "All" ? true : transaction.type === filterType
              )
              .map((transaction) => (
                <Tr key={transaction.id}>
                  <Td>{transaction.id}</Td>
                  <Td>{transaction.type}</Td>
                  <Td>{transaction.amount}</Td>
                  <Td>{transaction.date}</Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </Box>
      <Button colorScheme="red" onClick={() => {}}>
        Logout
      </Button>
    </Box>
  );
}
