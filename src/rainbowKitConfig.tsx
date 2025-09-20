'use client'
import { anvil, zksync } from 'wagmi/chains';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';

const config = getDefaultConfig({
  appName: 'tsender',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  chains: [anvil,zksync],
  ssr: false,
});
export default config;