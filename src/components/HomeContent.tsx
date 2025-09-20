"use client"
import React from 'react'
import AirDropForm from './AirDropForm' 
import { useAccount } from 'wagmi';

const HomeContent = () => {
    const {isConnected} = useAccount();
  return (
    <div>
        {isConnected ? (
            <div>
                <AirDropForm />
            </div>
        ):(
            <div>
                <h1>Please Connect a Wallet...</h1>
            </div>
        )}
    </div>
  )
}

export default HomeContent