import { ConnectButton } from "web3uikit"
import Link from "next/link"

export default function Header() {
    return (
        <nav className="p-5 border-b-2 flex flex-row justify-between items-center">
            <h1 className="py-4 px-4 font-bold text-3xl">NFT Marketplace</h1>
            <div className="flex flex-row items-center">
                <Link href="/">Home</Link>{" "}
            </div>
            <div className="flex flex-row items-center">
                <Link href="/sell-nft">Sell NFT</Link>
            </div>
            <div className="flex flex-row items-center">
                <> </>
            </div>
            <ConnectButton moralisAuth={false} />
        </nav>
    )
}
