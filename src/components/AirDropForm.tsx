'use client';
import { chainsToTSender, erc20Abi, tsenderAbi } from '@/constants';
import { useState,useMemo } from 'react';
import { useChainId, useConfig, useAccount, useWriteContract } from 'wagmi';
import {readContract, waitForTransactionReceipt} from '@wagmi/core';
import { calculateTotal } from '@/utils/calculateTotal/calculateTotal';

const AirDropForm = () => {
  const [tokenAddress, setTokenAddress] = useState('');
  const [recipients, setRecipients] = useState('');
  const [amounts, setAmounts] = useState('');
  const chainId = useChainId();
  const config = useConfig();
  const account = useAccount();
  const total: number = useMemo(() => {calculateTotal(amounts)}, [amounts]);
  const {data:hash, isPending, writeContractAsync} = useWriteContract();

  const getApprovedAmount = async (tSenderAddress: string | null) : Promise<bigint> => {
    if (!tSenderAddress) {
      alert("TSender contract not found for this chain");
      return BigInt(0);
    }

    const response = await readContract(config, {
      abi: erc20Abi,
      address: tokenAddress as `0x${string}`,
      functionName: "allowance",
      args: [account.address, tSenderAddress as `0x${string}`],
    })

    return response as bigint;
  }

  const handleSubmit = async () => {
    
    const tSenderAddresses = chainsToTSender[chainId]["tsender"];
    const approvedAmount = await getApprovedAmount(tSenderAddresses);
    console.log("Approved Amount: ", approvedAmount);

    if(approvedAmount < total) {
      const approvalHash = await writeContractAsync( {
        abi: erc20Abi,
        address: tokenAddress as `0x${string}`,
        functionName: "approve",
        args: [tSenderAddresses as `0x${string}`, BigInt(total)],
      })
      const approvalReceipt = await waitForTransactionReceipt(config,{
        hash:approvalHash
      });
      await writeContractAsync({
        abi: tsenderAbi,
        address: tSenderAddresses as `0x${string}`,
        functionName: "airdropERC20",
        args: [
          tokenAddress,
          // Comma or new line separated
          recipients.split(/[,\n]+/).map(addr => addr.trim()).filter(addr => addr !== ''),
          amounts.split(/[,\n]+/).map(amt => amt.trim()).filter(amt => amt !== ''),
          BigInt(total),
        ],
      })
    }else{
      await writeContractAsync({
        abi: tsenderAbi,
        address: tSenderAddresses as `0x${string}`,
        functionName: "airdropERC20",
        args: [
          tokenAddress,
          // Comma or new line separated
          recipients.split(/[,\n]+/).map(addr => addr.trim()).filter(addr => addr !== ''),
          amounts.split(/[,\n]+/).map(amt => amt.trim()).filter(amt => amt !== ''),
          BigInt(total),
        ],
      })
    }
    
  };
 
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <form className="p-8 bg-gray-800 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Airdrop</h2>
        <div className="mb-4">  
          <label htmlFor="tokenAddress" className="block mb-2">Token Address</label>
          <input
            type="text"
            id="tokenAddress"
            value={tokenAddress}
            placeholder='0x...'
            onChange={(e) => setTokenAddress(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="recipients" className="block mb-2">Addresses (comma-separated)</label>
          <input
            type="text"
            id="recipients"
            placeholder='0x...,0x...,0x...'
            value={recipients}
            onChange={(e) => setRecipients(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="amounts" className="block mb-2">Amount per Address</label>
          <input
            type="text"
            id="amounts"
            placeholder='100,200,300'
            value={amounts}
            onChange={(e) => setAmounts(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition duration-200"
        >
          Submit Token
        </button>
      </form>
    </div>
  );
};

export default AirDropForm;
