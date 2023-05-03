import React from "react";
import { createContext } from "react";
import { QueryClientProvider, QueryClient } from "react-query";
const queryClient = new QueryClient();
import theme from "../styles/theme";
import { ChakraProvider } from "@chakra-ui/react";
import { CacheProvider } from "@chakra-ui/next-js";
import AuthContextProvider from "./AuthContext";
function AppContextProvider({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <AuthContextProvider>{children}</AuthContextProvider>
        </QueryClientProvider>
      </ChakraProvider>
    </CacheProvider>
  );
}

export default AppContextProvider;
