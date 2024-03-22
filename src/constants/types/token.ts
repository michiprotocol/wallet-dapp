import {Address} from "viem";

export interface Token {
    token_address: Address;
    symbol: string;
    balance: number;
    platform: string;
    decimals: string;
}

export interface DepositedToken extends Token {
    elPoints: number;
    protocolPoints: number;
}

export const symbolToPlatformMapping = {
    "YT-weETH": "etherfi",
    // Add other mappings here, e.g., "YT-rsETH": "renzo",
};