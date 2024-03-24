import {abi, michiChestHelperAddress, michiChestOriginAddress} from "@/constants/contracts/MichiChest";
import {DepositedToken, symbolToPlatformMapping, Token, tokenTypes} from "@/constants/types/token";
import {Wallet} from "@/constants/types/wallet";
import TransferWallet from "@/features/TransferWallet";
import WalletViewComponent from "@/features/WalletView";
import {cn} from "@/lib/utils";
import TokensTable from "@/shared/TokensTable";
import WalletWrapper from "@/shared/WalletWrapper";
import {defaultChain, wagmiConfig} from "@/wagmi";
import {TokenboundClient} from "@tokenbound/sdk";
import axios from "axios";
import {useCallback, useEffect, useMemo, useState} from "react";
import {Address} from "viem";
import {useAccount, useReadContract, useWalletClient} from "wagmi";
import "./walletItem.css";

interface PointData {
    elPoints: number;
    points: number;
}

interface ApiResponse {
    address: string;
    results: Array<{
        points: number;
        elPoints: number;
        platform: string;
        data: PointData | { error: string; url: string };
    }>;
}

async function fetchPoints(address: string): Promise<ApiResponse> {
    try {
        const response = await axios.get<ApiResponse>(`${import.meta.env.VITE_SERVER_URL}/getPoints?address=${address}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Error fetching points:", error.message);
            throw new Error(error.message);
        } else {
            console.error("Unexpected error:", error);
            throw new Error("An unexpected error occurred");
        }
    }
}

export enum WalletView {
    DEPOSIT,
    WITHDRAW,
    TRANSFER,
    NONE,
    // in case of adding any other views, have to edit logic of WalletView component
}

export default function WalletItem({
                                       wallet,
                                       index,
                                       removeWallet
                                   }: { wallet: Wallet, index: number, removeWallet: (tokenId: Wallet["tokenId"]) => void }) {
    const account = useAccount();
    const [view, setView] = useState<WalletView>(WalletView.NONE);
    const [isFetchingData, setIsFetchingData] = useState(true);
    const [tokens, setTokens] = useState<Token[]>([
        {
            "token_address": "0x28df0f193d8e45073bc1db6f2347812c031ba818",
            "symbol": "YT-rsETH-25APR2024",
            "platform": "kelp",
            "decimals": "18",
            balance: 0,
        },
        {
            "token_address": "0xf28db483773e3616da91fdfa7b5d4090ac40cc59",
            "symbol": "YT-weETH-25APR2024",
            "platform": "etherfi",
            "decimals": "18",
            balance: 0
        }, {

            "token_address": "0x05735b65686635f5c87aa9d2dae494fb2e838f38",
            "symbol": "YT-ezETH-27JUN2024",
            "platform": "renzo",
            "decimals": "18",
            balance: 0
        }
    ]);
    const [depositedTokens, setDepositedTokens] = useState<DepositedToken[]>([]);
    const closeWalletView = useCallback(() => setView(WalletView.NONE), [setView]);

    const {data: walletClient} = useWalletClient({
        chainId: defaultChain.id,
    });
    const tokenboundClient = new TokenboundClient({
        walletClient: walletClient as any,
        chain: defaultChain as any,
    });

    const tokenboundAccount = tokenboundClient.getAccount({
        tokenContract: michiChestOriginAddress,
        tokenId: wallet.tokenId,
    });

    const canWithdraw = useMemo(() => {
        return depositedTokens.length > 0;
    }, [depositedTokens.length]);

    const approvedTokens: { data: Token["token_address"][] | undefined } = useReadContract({
        abi,
        config: wagmiConfig,
        chainId: defaultChain.id,
        address: michiChestHelperAddress,
        functionName: "getApprovedTokens",
    });

    const fetchTokenBalances = async (acc: Address) => {
        setIsFetchingData(true);
        try {
            const {data} = await axios.post(`${import.meta.env.VITE_SERVER_URL}/token-balances`, {
                tokenboundAccount: acc,
                chain: defaultChain.id
            });

            const tokenMap = new Map(tokens.map(token => [token.token_address, token]));
            console.log("Token Map:", tokenMap);

            // @ts-ignore
            const newTokens = data.filter(token => approvedTokens.data!.some(approvedToken => approvedToken.toLowerCase() === token.token_address));

            // @ts-ignore
            newTokens.forEach(newToken => {
                const existingToken = tokenMap.get(newToken.token_address);
                // Update the token in the map if it does not exist or if the new token has a non-zero balance
                if (!existingToken || newToken.balance > 0) {
                    tokenMap.set(newToken.token_address, newToken);
                }
            });

            const mergedTokens = Array.from(tokenMap.values());

            setTokens(mergedTokens);
            setIsFetchingData(false);
        } catch (e) {
            console.error(e);
            setIsFetchingData(false);
        }
    };


    // @ts-ignore
    const fetchDepositedTokens = async (acc) => {
        setIsFetchingData(true);
        try {
            const {data: tokensData} = await axios.post(`${import.meta.env.VITE_SERVER_URL}/token-balances`, {
                tokenboundAccount: acc,
                chain: defaultChain.id
            });

            console.log("Token Data", tokensData);

            const pointsResponse = await fetchPoints(acc); // Fetching points data

            // Enhance tokensData with platform data
            // @ts-ignore
            const enhancedTokensData = tokensData.map((token) => {
                const platform = Object.keys(symbolToPlatformMapping).find(key =>
                    token.symbol.startsWith(key)
                );
                return {
                    ...token,
                    // @ts-ignore
                    platform: platform ? symbolToPlatformMapping[platform] : undefined,
                };
            });

            // Filter tokensData that are approved and have a known platform
            // @ts-ignore
            const approvedAndKnownPlatformTokens = enhancedTokensData.filter((token) =>
                // @ts-ignore
                approvedTokens.data.some(approvedToken =>
                    approvedToken.toLowerCase() === token.token_address) && token.platform
            );

            // Now we map over tokenTypes to include data from pointsResponse and newTokens
            const tokensWithPoints = tokenTypes.map((tokenType) => {
                const pointsData = pointsResponse.results.find(result => result.platform === tokenType.platform);
                // @ts-ignore
                const matchingNewToken = approvedAndKnownPlatformTokens.find(newToken => newToken.token_address === tokenType.token_address);

                return {
                    ...tokenType,
                    balance: matchingNewToken ? matchingNewToken.balance : tokenType.balance, // Use balance from newTokens if available
                    elPoints: pointsData?.elPoints?.toFixed(2) || 0,
                    protocolPoints: pointsData?.points?.toFixed(2) || 0,
                };
            });

            // Filter tokens to exclude those with all zero values for balance, elPoints, and protocolPoints
            let results = tokensWithPoints.filter(token =>
                !(token.balance === 0 && Number(token.elPoints) === 0 && Number(token.protocolPoints) === 0)
            );

            console.log(results)
            // @ts-ignore
            setDepositedTokens(results);
        } catch (e) {
            console.error(e);
        } finally {
            setIsFetchingData(false);
        }
    };


    const fetchTokensData = useCallback(() => {
        if (approvedTokens.data) {
            if (account.address) {
                fetchTokenBalances(account.address);
            }
            if (tokenboundAccount) {
                fetchDepositedTokens(tokenboundAccount);
            }
        }
    }, [approvedTokens.data, tokenboundAccount, account.address]);

    useEffect(() => {
        fetchTokensData();
    }, [tokenboundAccount, approvedTokens.data]);

    return (
        <WalletWrapper address={tokenboundAccount} name="Michi Wallet NFT" index={wallet.tokenId}>
            <>
                <div className={
                    cn(
                        "flex bg-transparent text-secondary w-full rounded-lg",
                    )}
                >
                    {view === WalletView.NONE ? (
                        canWithdraw ?
                            <TokensTable tokens={depositedTokens} isFetchingData={isFetchingData}/> :
                            <div className="mx-auto">
                                {isFetchingData ? (
                                    <span className="loading loading-spinner"/>
                                ) : (
                                    <span className="text-center">No assets deposited.</span>
                                )
                                }
                            </div>
                    ) : view === WalletView.TRANSFER ? (
                        <TransferWallet
                            closeWalletView={closeWalletView}
                            walletTokenId={wallet.tokenId}
                            removeWallet={() => removeWallet(wallet.tokenId)}
                        />
                    ) : (
                        <WalletViewComponent
                            tokenboundAccount={tokenboundAccount}
                            view={view}
                            closeWalletView={closeWalletView}
                            tokens={tokens}
                            depositedTokens={depositedTokens}
                            fetchTokensData={fetchTokensData}
                        />
                    )}
                </div>
                {WalletView.NONE === view && (
                    <div className="flex flex-row justify-center gap-5 mt-1">
                        <button
                            className="btn btn-sm btn-gradient text-white rounded-lg"
                            onClick={() => setView(WalletView.DEPOSIT)}
                        >
                            Deposit
                        </button>
                        {canWithdraw && (
                            <button
                                className="px-2 btn-outline rounded-lg"
                                onClick={() => setView(WalletView.WITHDRAW)}
                            >
                                Withdraw
                            </button>
                        )}
                        {/*<button*/}
                        {/*  className="btn btn-md"*/}
                        {/*  onClick={() => setView(WalletView.TRANSFER)}*/}
                        {/*>*/}
                        {/*  Sell wallet*/}
                        {/*</button>*/}
                    </div>
                )}
            </>
        </WalletWrapper>
    );
}