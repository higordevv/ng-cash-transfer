import { useEffect, useState } from "react";
import * as S from "@chakra-ui/react";
import * as z from "zod";

import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import api from "../service/api";
import { useRouter } from "next/router";
import { zodResolver } from "@hookform/resolvers/zod";
import { calculatePasswordStrength } from "../utils/PasswordStrength";
import { motion } from "framer-motion";

export const UserSchema = z
  .object({
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
    confirmPassword: z.string().min(8),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
      });
    }
  });
type UserBody = z.infer<typeof UserSchema>;

export const postRegister = async ({ username, password }: UserBody) => {
  const response = await api.post("/user/register", { username, password });
  return response.data;
};
export default function Register() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<UserBody>({
    mode: "all",
    resolver: zodResolver(UserSchema),
    criteriaMode: "all",
    defaultValues: { username: "" },
  });
  const toast = S.useToast();
  const router = useRouter();

  const mutation = useMutation((data: UserBody) => postRegister(data), {
    onSuccess: () => {
      toast({
        title: "Registro realizado com sucesso!",
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
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
    >
      <S.Box maxW={{ base: "sm", md: "2xl" }} mx="auto" mt={6} p={4}>
        <S.Heading textAlign="center" mb={8}>
          Registro
        </S.Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <S.FormControl id="username" mb={4}>
            <S.FormLabel>Nome de usuário</S.FormLabel>
            <S.Input
              type="text"
              {...register("username", { required: true })}
            />
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
          <S.FormControl id="password" mb={4}>
            <S.FormLabel>Confirme a senha</S.FormLabel>
            <S.Input type="password" {...register("confirmPassword")} />
            {errors.confirmPassword && (
              <S.FormErrorMessage>
                {errors.confirmPassword.message}
              </S.FormErrorMessage>
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
    </motion.div>
  );
}
