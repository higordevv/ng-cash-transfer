import { useEffect, useState } from "react";
import * as S from "@chakra-ui/react";
import Image from "next/image";


export default function Web() {
  const handleLogin = () => {
    // lógica de autenticação aqui
  };

  return (
    <S.Box maxW="sm" mx="auto" mt={8} p={5}  border={"1px"} borderRadius={"2xl"} borderColor={"facebook.500"} >
      <S.Heading textAlign="center" mb={8}>
        Faça login na sua conta
      </S.Heading>
      <S.FormControl id="username" mb={4}>
        <S.FormLabel>Nome de usuário</S.FormLabel>
        <S.Input
          type="text"
        />
      </S.FormControl>
      <S.FormControl id="password" mb={4}>
        <S.FormLabel>Senha</S.FormLabel>
        <S.Input
          type="password"
        />
      </S.FormControl>
      <S.Button colorScheme="blue" onClick={handleLogin}>
        Entrar
      </S.Button>
    </S.Box>
  );
}
