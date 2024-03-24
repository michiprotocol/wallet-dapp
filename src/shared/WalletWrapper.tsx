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
      <div className="flex flex-row justify-between font-bold px-4 py-4" style={{background: 'linear-gradient(90deg, rgba(218, 99, 255, 0.2) 0%, rgba(52, 55, 250, 0.2) 100%)'}}>
        <span>{name} #{index}</span>
        <div className="flex flex-row items-center px-2 py-2 gap-2 font=normal" style={{borderRadius:"10px",border: '1px solid', borderImage: 'linear-gradient(90deg, #DA63FF 0%, #3437FA 100%) 1'}}>
          <span className="whitespace-nowrap gradient-text" >Linked Wallet:</span>
          <a href={`${defaultChain.blockExplorers.default.url}/address/${address}`} target="_blank">{formatCryptoAddress(address)}</a>
        </div>
      </div>
      {children}
    </div>
  )
}