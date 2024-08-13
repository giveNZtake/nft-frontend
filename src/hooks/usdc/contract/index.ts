import { readContract, simulateContract, writeContract } from "@wagmi/core";
import { config } from "../../../config";
import { CONTRACT } from "../../../constants";
import {
    approveUSDCABI,
    balanceOfUSDCABI
} from "../../../contracts";

export function useReadUSDCContract() {
    async function balanceOfUSDC(account: string) {
        const result = await readContract(config, {
            abi: balanceOfUSDCABI,
            // @ts-ignore
            address: CONTRACT.USDC_ADDRESS,
            functionName: "balanceOf",
            // @ts-ignore
            args: [account],
        });
        return result;
    }
    
    return {
        balanceOfUSDC,
    };
}

export function useWriteUSDCContract() {
    async function approveUSDC(spender: string, amount: bigint) {
        const { request } = await simulateContract(config, {
            abi: approveUSDCABI,
            // @ts-ignore
            address: CONTRACT.USDC_ADDRESS,
            functionName: "approve",
            // @ts-ignore
            args: [spender, amount],
        });
        const result = await writeContract(config, request);
        return result;
    }
    
    return {
        approveUSDC,
    };
}
