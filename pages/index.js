import Image from "next/image"
import { Inter } from "next/font/google"
import { useMoralisQuery, useMoralis } from "react-moralis"
import NFTBox from "../components/NFTBox"

const inter = Inter({ subsets: ["latin"] })

export default function Home() {
    const { isWeb3Enabled } = useMoralis()
    const { data: listedNfts, isFetching: fetchingListedNfts } =
        useMoralisQuery("ActiveItem", (query) =>
            query.limit(20).descending("tokenId"),
        )
    console.log(listedNfts)
    let counter = 0

    return (
        <main
            className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
        >
            {" "}
            <div className="container mx-auto">
                <h1 className="py-4 px-3 font-bold text-2xl">
                    Recently Listed
                </h1>
                <div className="flex flex-wrap">
                    {isWeb3Enabled ? (
                        fetchingListedNfts ? (
                            <div>Loading...</div>
                        ) : (
                            listedNfts.map((nft) => {
                                const {
                                    price,
                                    nftAddress,
                                    tokenId,
                                    marketplaceAddress,
                                    seller,
                                } = nft.attributes
                                return (
                                    <div>
                                        <NFTBox
                                            price={price}
                                            nftAddress={nftAddress}
                                            tokenId={parseInt(tokenId.hex)}
                                            marketplaceAddress={
                                                marketplaceAddress
                                            }
                                            seller={seller}
                                            key={`${nftAddress}-${
                                                tokenId.hex
                                            }-${counter++}`}
                                        />
                                    </div>
                                )
                            })
                        )
                    ) : (
                        <div>Web3 currently Not Enabled</div>
                    )}
                </div>
            </div>
        </main>
    )
}
