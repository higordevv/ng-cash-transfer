import { useState } from "react";
import * as S from "@chakra-ui/react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import api from "../service/api";
import { useRouter } from "next/router";
import { zodResolver } from "@hookform/resolvers/zod";

const UserSchema = z.object({
  username: z
    .string()
    .min(3, "O usuário deve ter pelo menos 3 caracteres")
    .nonempty(),
  password: z
    .string()
    .min(
      8,
      "A senha deve ter pelo menos 8 caracteres, um número e uma letra maiúscula."
    )
    .regex(/^(?=.*[A-Z])(?=.*\d).*$/)
    .nonempty(""),
});

type UserBody = z.infer<typeof UserSchema>;

export const postLogin = async (userData: UserBody) => {
  const response = await api.post("/user", userData);
  return response.data;
};
export default function Web() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserBody>({
    mode: "all",
    resolver: zodResolver(UserSchema),
    criteriaMode: "all",
    defaultValues: { username: "" },
  });
  const toast = S.useToast();
  const router = useRouter();

  const mutation = useMutation((data: UserBody) => postLogin(data), {
    onSuccess: () => {
      toast({
        title: "Login realizado com sucesso!",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    },
    onError: () => {
      toast({
        title: "Ocorreu um erro ao tentar fazer login.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    },
  });

  const onSubmit = (data: UserBody) => {
    mutation.mutate(data);
  };

  return (
    <S.Box
      maxW="sm"
      mx="auto"
      mt={8}
      p={5}
      border={"1px"}
      borderRadius={"2xl"}
      borderColor={"facebook.500"}
    >
      <S.Heading textAlign="center" mb={8}>
        Faça login na sua conta
      </S.Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <S.FormControl id="username" mb={4}>
          <S.FormLabel>Nome de usuário</S.FormLabel>
          <S.Input type="text" {...register("username", { required: true })} />
          {errors.username && (
            <S.FormErrorMessage>{errors.username.message}</S.FormErrorMessage>
          )}
        </S.FormControl>
        <S.FormControl id="password" mb={4}>
          <S.FormLabel>Senha</S.FormLabel>
          <S.Input type="password" {...register("password")} />
          {errors.password && (
            <S.FormErrorMessage>{errors.password.message}</S.FormErrorMessage>
          )}
        </S.FormControl>
        <S.Button
          colorScheme="blue"
          isLoading={mutation.isLoading}
          type="submit"
        >
          Entrar
        </S.Button>
      </form>
    </S.Box>
  );
}
