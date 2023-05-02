import React from "react";
import * as S from "@chakra-ui/react";
import { FaUserAlt } from "react-icons/fa";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "react-query";
import api from "../service/api";

const TransactionSchema = z.object({
  creditedAccountUsername: z
    .string()
    .min(3, "O usuário deve ter pelo menos 3 caracteres")
    .nonempty(),
  value: z.number().positive(),
});

type TransactionBody = z.infer<typeof TransactionSchema>;

export const postTransaction = async (TransactionData: TransactionBody) => {
  const response = await api.post("/transaction/make", TransactionData);
  return response.data;
};

type ModalTransferProps = {
  isOpen: boolean;
  onClose: () => void;
};

function ModalTransfer({ isOpen, onClose }: ModalTransferProps) {
  const bgColor = S.useColorModeValue("white", "gray.800");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TransactionBody>({
    mode: "all",
    resolver: zodResolver(TransactionSchema),
    criteriaMode: "all",
    defaultValues: { creditedAccountUsername: "" },
  });
  const toast = S.useToast();

  const mutation = useMutation(
    (data: TransactionBody) => postTransaction(data),
    {
      onSuccess: () => {
        toast({
          title: "Transação Relizada com sucesso",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        onClose();
      },
      onError: () => {
        toast({
          title: "Error",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      },
    }
  );

  const onSubmit = (data: TransactionBody) => {
    console.log(data);
    mutation.mutate(data);
  };
  return (
    <S.Modal isOpen={isOpen} onClose={onClose}>
      <S.ModalOverlay />
      <S.ModalContent bgColor={bgColor}>
        <S.ModalHeader>Transferência</S.ModalHeader>
        <S.ModalCloseButton />
        <S.ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <S.Flex flexDirection="column" gap={8} p={4}>
              <S.FormControl>
                <S.FormLabel>Username:</S.FormLabel>
                <S.InputGroup>
                  <S.InputLeftElement
                    pointerEvents="none"
                    color="gray.300"
                    fontSize="1em"
                    children={<FaUserAlt />}
                  />
                  <S.Input
                    placeholder="Enter username, ex: Jhon Doe"
                    {...register("creditedAccountUsername", { required: true })}
                  />
                </S.InputGroup>
                {errors.creditedAccountUsername && (
                  <S.FormErrorMessage>
                    {errors.creditedAccountUsername.message}
                  </S.FormErrorMessage>
                )}
              </S.FormControl>
              <S.FormControl>
                <S.FormLabel>Value:</S.FormLabel>
                <S.InputGroup>
                  <S.InputLeftElement
                    pointerEvents="none"
                    color="gray.300"
                    fontSize="1.2em"
                    children="$"
                  />
                  <S.Input
                    placeholder="Enter amount"
                    {...register("value", {
                      required: true,
                      valueAsNumber: true,
                    })}
                  />
                </S.InputGroup>
                {errors.value && (
                  <S.FormErrorMessage>
                    {errors.value.message}
                  </S.FormErrorMessage>
                )}
              </S.FormControl>
              <S.Button
                mt={4}
                colorScheme="teal"
                isLoading={mutation.isLoading}
                type="submit"
              >
                Enviar
              </S.Button>
            </S.Flex>
          </form>
        </S.ModalBody>
      </S.ModalContent>
    </S.Modal>
  );
}

export default ModalTransfer;
