import {abi, michiChestHelperAddress, michiChestOriginAddress} from "@/constants/contracts/MichiChest";
import {DepositedToken, Token} from "@/constants/types/token";
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
        platform: string;
        data: PointData | { error: string; url: string };
    }>;
}

async function fetchPoints(address: string): Promise<ApiResponse> {
    try {
        const response = await axios.get<ApiResponse>(`${import.meta.env.VITE_SERVER_URL}/getPoints?address=${address}`);
        console.log(response.data);
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
            "decimals": "18",
            balance: 0
        },
        {
            "token_address": "0xf28db483773e3616da91fdfa7b5d4090ac40cc59",
            "symbol": "YT-weETH-25APR2024",
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

    const fetchTokenBalances = async (acc: Address, isDeposited?: boolean) => {
        setIsFetchingData(true);
        try {
            axios.post(`${import.meta.env.VITE_SERVER_URL}/token-balances`, {
                tokenboundAccount: acc,
                chain: defaultChain.id
            }).then(({data}: { data: Token[] }) => {
                const newTokens = data.filter(token => {
                    return approvedTokens.data!.some(approvedToken => approvedToken.toLowerCase() === token.token_address);
                });

                if (isDeposited) {
                    // Keep disabled until deployed to Mainnet

                    // fetchPoints("0x0561e5b036DdcF2401c2B6b486f85451d75760A2")
                    //   .then(data => console.log(data))
                    //   .catch(error => console.error(error));

                    setDepositedTokens(newTokens as DepositedToken[]);
                } else {
                    const mergedTokens = [...newTokens, ...tokens];
                    const arr: Token["token_address"][] = [];
                    const uniqueTokens = mergedTokens.filter((token) => {
                        if (arr.includes(token.token_address)) {
                            return false;
                        }
                        arr.push(token.token_address);
                        return true;
                    });
                    setTokens(uniqueTokens);
                    setIsFetchingData(false);
                }
            });
        } catch (e) {
            console.error(e);
            setIsFetchingData(false);
        }
    };

    const fetchTokensData = useCallback(() => {
        if (approvedTokens.data) {
            if (account.address) {
                fetchTokenBalances(account.address);
            }
            if (tokenboundAccount) {
                fetchTokenBalances(tokenboundAccount, true);
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