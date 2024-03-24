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
    "YT-ezETH": "renzo",
    "YT-rsETH": "kelp",
    // Add other mappings here, e.g., "YT-rsETH": "renzo",
};

export const tokenTypes = [
    {
        "token_address": "0x28df0f193d8e45073bc1db6f2347812c031ba818",
        "symbol": "YT-rsETH-25APR2024",
        "platform": "kelp",
        "decimals": "18",
        balance: 0,
        elPoints: 0,
        protocolPoints: 0
    },
    {
        "token_address": "0xf28db483773e3616da91fdfa7b5d4090ac40cc59",
        "symbol": "YT-weETH-25APR2024",
        "platform": "etherfi",
        "decimals": "18",
        balance: 0,
        elPoints: 0,
        protocolPoints: 0
    }, {

        "token_address": "0x05735b65686635f5c87aa9d2dae494fb2e838f38",
        "symbol": "YT-ezETH-27JUN2024",
        "platform": "renzo",
        "decimals": "18",
        balance: 0,
        elPoints: 0,
        protocolPoints: 0
    }
];