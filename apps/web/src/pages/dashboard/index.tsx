import * as S from "@chakra-ui/react";
import Profile from "../../components/Profile";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useCallback, useContext, useEffect, useState } from "react";
import ModalTransfer from "../../components/ModalTransfer";
import { parseCookies } from "nookies";
import { GetServerSideProps } from "next";
import { recoverUserInfo } from "../../service/api";
import { useRouter } from "next/router";
import { useAuthContext } from "../../context/AuthContext";

export default function UserDashboard() {
  const { user, logout, authenticated } = useAuthContext();
  const [showBalance, setShowBalance] = useState(false);
  const { isOpen, onOpen, onClose } = S.useDisclosure();
  const toast = S.useToast();
  const router = useRouter();
  // const VerifyAuth = useCallback(async () => {
  //   if (!authenticated) return router.push("/");
  // }, []);
  // useEffect(() => {
  //   VerifyAuth();
  // }, []);
  const balance = showBalance ? "100R$" : "*********";

  return (
    <S.Box p={1}>
      <S.Flex
        flexDirection={["column", "column", "row"]}
        justifyContent={"center"}
      >
        <S.Box mb={[4, 4, 0]} mr={[0, 0, 4]}>
          <S.Heading>Olá {user?.username}</S.Heading>
          <Profile userId={"agagagaga"} username="Higor" />
          <S.Text fontSize="xl" fontWeight="bold">
            Balance: {balance}{" "}
            <S.Button
              size="md"
              variant="ghost"
              onClick={() => setShowBalance((prev) => !prev)}
              aria-label={showBalance ? "Hide balance" : "Show balance"}
              m={4}
            >
              {showBalance ? <FaEyeSlash /> : <FaEye />}
            </S.Button>
          </S.Text>
          <S.Box mb={4}>
            <S.Button colorScheme="red" onClick={logout}>
              Logout
            </S.Button>
          </S.Box>
        </S.Box>
        <S.Box flex="1">
          <S.Table variant="striped" colorScheme="gray">
            <S.TableCaption>Lista de transações</S.TableCaption>
            <S.Thead>
              <S.Tr>
                <S.Th>Data</S.Th>
                <S.Th>Tipo</S.Th>
                <S.Th isNumeric>Valor</S.Th>
              </S.Tr>
            </S.Thead>
            <S.Tbody>
              <S.Tr>
                <S.Td>01/04/2023</S.Td>
                <S.Td>Cash-in</S.Td>
                <S.Td isNumeric>50R$</S.Td>
              </S.Tr>
              <S.Tr>
                <S.Td>02/04/2023</S.Td>
                <S.Td>Cash-out</S.Td>
                <S.Td isNumeric>-30R$</S.Td>
              </S.Tr>
              <S.Tr>
                <S.Td>03/04/2023</S.Td>
                <S.Td>Cash-in</S.Td>
                <S.Td isNumeric>20R$</S.Td>
              </S.Tr>
            </S.Tbody>
          </S.Table>
          <S.Stack direction={["column", "column", "row"]} mt={4} spacing={4}>
            <S.Box>
              <S.Select placeholder="Filtrar por data">
                <option value="01/04/2023">01/04/2023</option>
                <option value="02/04/2023">02/04/2023</option>
                <option value="03/04/2023">03/04/2023</option>
              </S.Select>
            </S.Box>
            <S.Box>
              <S.Select placeholder="Tipo de transação">
                <option value="cash-in">Cash-in</option>
                <option value="cash-out">Cash-out</option>
              </S.Select>
            </S.Box>
          </S.Stack>
          {/* Seção de transferência */}
          <S.Stack direction={["column", "column", "row"]} mt={4} spacing={4}>
            <S.Box>
              <S.Text fontSize="xl" fontWeight="bold">
                Transferir para outro usuário NG:
              </S.Text>
            </S.Box>
            <S.Box>
              <S.Button colorScheme="green" onClick={onOpen}>
                Realizar transferência
              </S.Button>
              <ModalTransfer isOpen={isOpen} onClose={onClose} />
            </S.Box>
          </S.Stack>

          {/* Tabela com detalhes das transações */}
          <S.Table variant="simple" mt={8}>
            <S.Thead>
              <S.Tr>
                <S.Th>Data</S.Th>
                <S.Th>Descrição</S.Th>
                <S.Th>Tipo</S.Th>
                <S.Th>Valor</S.Th>
              </S.Tr>
            </S.Thead>
            <S.Tbody>
              <S.Tr>
                <S.Td>01/04/2023</S.Td>
                <S.Td>Cash-in</S.Td>
                <S.Td>Cash-in</S.Td>
                <S.Td>50R$</S.Td>
              </S.Tr>
              <S.Tr>
                <S.Td>02/04/2023</S.Td>
                <S.Td>Cash-out</S.Td>
                <S.Td>Cash-out</S.Td>
                <S.Td>20R$</S.Td>
              </S.Tr>
              <S.Tr>
                <S.Td>03/04/2023</S.Td>
                <S.Td>Transferência</S.Td>
                <S.Td>Outgoing</S.Td>
                <S.Td>10R$</S.Td>
              </S.Tr>
            </S.Tbody>
          </S.Table>
        </S.Box>
      </S.Flex>
    </S.Box>
  );
}
