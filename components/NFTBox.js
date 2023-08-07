import { useState, useEffect } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import nftmarketplaceAbi from "../constants/NFTMarketplace.json"
import nftAbi from "../constants/BasicNFT.json"
import Image from "next/image"
import { Card, useNotification } from "web3uikit"
import { ethers } from "ethers"
import UpdateListingModal from "./UpdateListingModal"

// **** This will shorten the contract address to 10 characters
const truncatStr = (fullStr, StrLeng) => {
    if (fullStr.length <= StrLeng) return fullStr
    const separator = "..."
    const separatorLength = separator.length
    const charsToShow = StrLeng - separatorLength
    const frontChars = Math.ceil(charsToShow / 2)
    const backChars = Math.floor(charsToShow / 2)
    return (
        fullStr.substr(0, frontChars) +
        separator +
        fullStr.substr(fullStr.length - backChars)
    )
}

export default function NFTBox({
    price,
    nftAddress,
    tokenId,
    marketplaceAddress,
    seller,
}) {
    const { isWeb3Enabled, account } = useMoralis()
    const [imageURI, setImageURI] = useState("")
    const [tokenName, setTokenName] = useState("")
    const [tokenDescription, setTokenDescription] = useState("")
    const [showModal, setShowModal] = useState(false)
    const hideModal = () => setShowModal(false)
    const dispatch = useNotification()

    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: "tokenURI",
        params: { tokenId: tokenId },
    })

    const { runContractFunction: buyItem } = useWeb3Contract({
        abi: nftmarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "buyItem",
        msgValue: price,
        params: { nftAddress: nftAddress, tokenId: tokenId },
    })

    async function updateUI() {
        const tokenURI = await getTokenURI()
        console.log(`The TokenURI is ${tokenURI}`)
        // Get the tokenURI
        // using the image tage from the tokenURI, get the image

        if (tokenURI) {
            // IPFS Gateway: A server that will return IPFS files from a "normal" URL,
            // Basically, we make normal HTTPS call and the IPFS gateway will fetch the file from IPFS and return it to us.
            const requestURL = tokenURI.replace(
                "ipfs://",
                "https://ipfs.io/ipfs/",
            )
            const tokenURIResponse = await (await fetch(requestURL)).json()
            const imageURI = tokenURIResponse.image
            const imageURIURL = imageURI.replace(
                "ipfs://",
                "https://ipfs.io/ipfs/",
            )
            setImageURI(imageURIURL)
            setTokenName(tokenURIResponse.name)
            setTokenDescription(tokenURIResponse.description)
        }
    }
    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    // Compare the seller address (coming from the contract) with the current account address (coming from Moralis metaMask plugin "account"")
    const isOwnedByUser =
        seller.toUpperCase() == account.toUpperCase() || seller == undefined
    const formatedSellerAddress = isOwnedByUser
        ? "you"
        : truncatStr(seller || "", 15)

    const HandleCardClick = () => {
        isOwnedByUser
            ? setShowModal(true)
            : buyItem({
                  onError: (error) => {
                      console.log(error)
                      console.log("failed to buy item")
                  },
                  onSuccess: (mess) => {
                      handleBuyItemSuccess()
                      console.log(mess)
                  },
              })
    }

    const handleBuyItemSuccess = async (tx) => {
        //await tx.wait(1)
        dispatch({
            type: "Success",
            message: "Item bought!",
            title: "Item bought",
            position: "topR",
        })
    }
    return (
        <div>
            <div>
                {imageURI ? (
                    <div>
                        <UpdateListingModal
                            nftAddress={nftAddress}
                            tokenId={tokenId}
                            isVisible={showModal}
                            marketplaceAddress={marketplaceAddress}
                            onClose={hideModal}
                        />
                        <Card
                            title={tokenName}
                            description={tokenDescription}
                            onClick={HandleCardClick}
                        >
                            <div className="p-2">
                                <div className="flex flex-col items-end gap-2">
                                    <div># {tokenId}</div>
                                    <div className="italic text-sm">
                                        Owned by {formatedSellerAddress}
                                    </div>

                                    <Image
                                        loader={() => imageURI}
                                        src={imageURI}
                                        height="200"
                                        width="200"
                                    />
                                    <div className="font-bold">
                                        {ethers.utils.formatUnits(
                                            price,
                                            "ether",
                                        )}{" "}
                                        ETH
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                ) : (
                    <div> Loading ...</div>
                )}
            </div>
        </div>
    )
}
