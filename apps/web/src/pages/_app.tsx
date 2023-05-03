import { AppProps } from "next/app";

import * as S from "@chakra-ui/react";
import { useQueryClient, QueryClient, QueryClientProvider } from "react-query";
import AppContextProvider from "../context/AppContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppContextProvider>
      <S.Flex minH="full" maxW="100vw" flexDir="column" justifyContent="center">
        <S.Box as="header" p={4} color="white">
          <S.Flex alignItems="center" justifyContent="center">
            <S.Image
              src="https://uploads-ssl.webflow.com/6385128589ca38c0cb82b578/63971ba9c76cec80821a9332_logo.svg"
              boxSize="50px"
              width={60}
              objectFit="fill"
              alt="logo"
            />
            <S.Heading size="5px">Developed by Higor</S.Heading>
          </S.Flex>
        </S.Box>
        <S.Box
          as="main"
          flex="1"
          p={1}
          mt={{ base: 8, md: 12 }}
         w="auto"
          mx="auto"
          alignSelf={{base: "center"}}
        >
          <Component {...pageProps} />
        </S.Box>
      </S.Flex>
    </AppContextProvider>
  );
}
