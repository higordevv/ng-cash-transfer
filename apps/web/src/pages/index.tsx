import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button, Flex, Icon } from "@chakra-ui/react";
import { MdPerson, MdLock } from "react-icons/md";
import LoginPage from "../components/Login";
import RegisterPage from "../components/Register";

const Web = () => {
  const [showLogin, setShowLogin] = useState(true);

  const togglePage = () => {
    setShowLogin(!showLogin);
  };

  return (
    <Flex
      direction={{ base: "column", md: "column-reverse" }}
      gap={6}
      alignItems="center"
      justifyContent="center"
      height="full"
      w="2xl"
    >
      <Button
        variant="ghost"
        colorScheme="blue"
        fontWeight="bold"
        size={{ base: "sm", md: "lg" }}
        maxW={{ base: "sm", md: "2xl" }}
        leftIcon={showLogin ? <Icon as={MdPerson} /> : <Icon as={MdLock} />}
        rightIcon={!showLogin ? <Icon as={MdPerson} /> : <Icon as={MdLock} />}
        _hover={{
          bg: "blue.200",
          color: "blue.900",
          transform: "scale(1.1)",
        }}
        onClick={togglePage}
      >
        {showLogin
          ? "Não tem conta? Clique para se registrar!"
          : "Já tem conta? Clique para fazer login!"}
      </Button>
      <AnimatePresence>
        {showLogin ? <LoginPage /> : <RegisterPage />}
      </AnimatePresence>
    </Flex>
  );
};

export default Web;
