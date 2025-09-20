"use client"
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import config  from "../rainbowKitConfig";
import { QueryClientProvider } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
import "@rainbow-me/rainbowkit/styles.css"


export function Providers(props:{children: React.ReactNode }) {
    const queryClient = new QueryClient();
    return(
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>       
                <RainbowKitProvider>
                    {props.children}
                </RainbowKitProvider> 
            </QueryClientProvider>            
        </WagmiProvider>
    )
}