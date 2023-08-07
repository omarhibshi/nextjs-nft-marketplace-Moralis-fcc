import Image from "next/image"
import { Inter } from "next/font/google"
import { useWeb3Contract, useMoralis } from "react-moralis"
import { Form } from "web3uikit"
import { ethers } from "ethers"
import nftAbi from "../constants/BasicNFT.json"
import nftmarketplaceAbi from "../constants/NFTMarketplace.json"
import { Card, useNotification } from "web3uikit"
import networkMapping from "../constants/networkMapping.json"

//import networwMapping from "../constants/networkMapping.json"

const inter = Inter({ subsets: ["latin"] })

export default function Home() {
    const { chainId } = useMoralis()
    const dispatch = useNotification()

    // 0x234b... is the address of the NFT contract
    const chainIdString = chainId ? parseInt(chainId).toString() : "31337"
    const marketplaceAddress = networkMapping[chainIdString].NFTMarketplace[0]

    const { runContractFunction } = useWeb3Contract()

    async function approveAndListNFT(data) {
        console.log("Approving ...")
        const nftAddress = data.data[0].inputResult
        const tokenId = data.data[1].inputResult
        const price = ethers.utils
            .parseUnits(data.data[2].inputResult, "ether")
            .toString()
        //
        const approveOptions = {
            abi: nftAbi,
            contractAddress: nftAddress,
            functionName: "approve",
            params: {
                to: marketplaceAddress,
                tokenId: tokenId,
            },
        }
        // **** Another way to use the runContractFunction hook
        await runContractFunction({
            params: approveOptions,
            onSuccess: () => {
                console.log("Approved!")
                handleApproveSuccess(nftAddress, tokenId, price)
            },
            onError: (e) => console.log(e),
        })
    }

    async function handleApproveSuccess(nftAddress, tokenId, price) {
        //
        console.log("Listing ...")
        //
        const listOptions = {
            abi: nftmarketplaceAbi,
            contractAddress: marketplaceAddress,
            functionName: "listItem",
            params: {
                nftAddress: nftAddress,
                tokenId: tokenId,
                price: price,
            },
        }
        await runContractFunction({
            params: listOptions,
            onSuccess: handleListingSuccess,
            onError: (e) => {
                console.log(e)
                console.log("error occured here")
            },
        })

        async function handleListingSuccess(tx) {
            await tx.wait(1)
            dispatch({
                type: "Success",
                message: "NFT Listing!",
                title: "NFT listed success - please refresh (and move blocks)",
                position: "topR",
            })
        }
    }
    return (
        <main
            className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
        >
            {" "}
            <div className="container mx-auto">
                <Form
                    onSubmit={approveAndListNFT}
                    data={[
                        {
                            name: "NFT Address",
                            type: "text",
                            inputWidth: "50%",
                            value: "",
                            key: "nftAddress",
                        },
                        {
                            name: "Token ID",
                            type: "number",
                            value: "",
                            key: "tokenId",
                        },
                        {
                            name: "Price in (ETH)",
                            type: "number",
                            value: "",
                            key: "price",
                        },
                    ]}
                    title="Sell your NFT"
                    id="main-form"
                />
            </div>{" "}
        </main>
    )
}
