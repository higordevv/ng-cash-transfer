import { AppProps } from "next/app";

import {
  ChakraProvider,
  Box,
  Flex,
  Heading,
  Image,
} from "@chakra-ui/react";

import {
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "react-query";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      
        <Flex minH="100vh" flexDir="column">
          <Box as="header" p={4} color="white">
            <Flex alignItems="center" justifyContent="center">
              <Image
                src="https://uploads-ssl.webflow.com/6385128589ca38c0cb82b578/63971ba9c76cec80821a9332_logo.svg"
                boxSize="50px"
                width={60}
                objectFit="fill"
                alt="logo"
              />
            </Flex>
          </Box>
          <Box as="main" flex="1" p={4}>
          <QueryClientProvider client={queryClient}>
            <Component {...pageProps} />
            </QueryClientProvider>
          </Box>
          <Box as="footer" p={4} textAlign="center">
            <Heading size="5px">Developed by Higor</Heading>
          </Box>
        </Flex>
    </ChakraProvider>
  );
}
