import {DepositedToken} from "@/constants/types/token";
import {formatEther} from "ethers/lib/utils";

export default function TokensTable({
                                        tokens,
                                        isFetchingData
                                    }: {
    tokens: DepositedToken[]
    isFetchingData: boolean
}) {

    return (
        <div className="overflow-x-auto w-full">
            <table className="table text-info">
                <thead>
                <tr className="text-info text-[#8C8B94] border-b border-[#2F2F40]">
                    <th>Token</th>
                    <th>Amount</th>
                    <th>Eigenlayer Points</th>
                    <th>LRT Points</th>
                </tr>
                </thead>
                <tbody>
                {
                    tokens.map((token, index) => {
                        const {
                            symbol: name,
                            balance: amount,
                            elPoints,
                            protocolPoints
                        } = token;

                        return (
                            <tr key={index} className="border-t border-[#2F2F40]">
                                <th>{name}</th>
                                <td className="flex flex-row items-center gap-2">{formatEther(amount)} {isFetchingData &&
                                    <span className="loading loading-spinner"/>}</td>
                                <td>{elPoints || 0}</td>
                                <td>{protocolPoints || 0}</td>
                            </tr>
                        );
                    })
                }
                </tbody>
            </table>
        </div>
    );
}