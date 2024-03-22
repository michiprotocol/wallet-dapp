import { ReactNode } from "react"
import { Address } from "viem"
import { formatCryptoAddress } from "./helpers/formatCryptoAddress"
import { defaultChain } from "@/wagmi"

export default function WalletWrapper({ address, name, index, children }: {
  address: Address,
  name: string,
  index: string,
  children: ReactNode
}) {

  return (
    <div key={index} className="rounded-md flex flex-col gap-3 text-info pb-4" style={{border: '2px solid', borderImage: 'linear-gradient(90deg, #DA63FF 0%, #3437FA 100%) 1'}} >
      <div className="flex flex-row justify-between font-normal px-4 py-4" style={{background: 'linear-gradient(90deg, rgba(218, 99, 255, 0.2) 0%, rgba(52, 55, 250, 0.2) 100%)'}}>
        <span>{name} #{index}</span>
        <div className="flex flex-row items-center gap-2">
          <span className="whitespace-nowrap">Linked Wallet:</span>
          <a href={`${defaultChain.blockExplorers.default.url}/address/${address}`} target="_blank">{formatCryptoAddress(address)}</a>
        </div>
      </div>
      {children}
    </div>
  )
}