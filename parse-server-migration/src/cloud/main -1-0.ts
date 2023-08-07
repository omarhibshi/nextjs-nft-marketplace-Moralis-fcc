/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
declare const Parse: any
import { ethers } from "ethers"
import "./generated/evmApi"
import "./generated/solApi"
import { requestMessage } from "../auth/authService"

Parse.Cloud.define("requestMessage", async ({ params }: any) => {
    const { address, chain, networkType } = params

    const message = await requestMessage({
        address,
        chain,
        networkType,
    })

    return { message }
})

Parse.Cloud.define("getPluginSpecs", () => {
    // Not implemented, only excists to remove client-side errors when using the moralis-v1 package
    return []
})

Parse.Cloud.define("getServerTime", () => {
    // Not implemented, only excists to remove client-side errors when using the moralis-v1 package
    return null
})
Parse.Cloud.define("watchContractEvent", async ({ params, user, ip }: any) => {
    async function updateActiveItem(
        actionRequested: string,
        nftAddress: any,
        tokenId: any,
    ) {
        const ActiveItem = Parse.Object.extend("ActiveItem")
        const query = new Parse.Query(ActiveItem)
        query.equalTo("marketplaceAddress", contractAddress)
        query.equalTo("nftAddress", nftAddress)
        query.equalTo("tokenId.hex", tokenId._hex)
        console.log("______________________________________")
        const foundItemByTokenId = await query.find()
        console.log("foundItemByTokenId : ", foundItemByTokenId)
        if (foundItemByTokenId.length > 0) {
            console.log(
                `${actionRequested} Item Id : ${foundItemByTokenId[0].id}`,
            )
            console.log(`${actionRequested} details`, foundItemByTokenId)
            query.equalTo("objectId", foundItemByTokenId[0].id)
            const itemByObjectId = await query.first()
            console.log(
                `item ${actionRequested} to be removed from ActiveItem`,
                itemByObjectId,
            )
            await itemByObjectId.destroy()
        } else {
            console.log("no item found")
        }
    }
    let provider: any
    if (params["chainId"] == 1337) {
        provider = new ethers.providers.WebSocketProvider(
            "http://127.0.0.1:8545/",
        )
    } else {
        provider = new ethers.providers.WebSocketProvider(
            process.env.SEPOLIA_RPC_URL!,
        )
    }

    const contractAddress = params["address"]

    const contract = new ethers.Contract(
        contractAddress,
        [params["abi"]],
        provider,
    )

    if (params["tableName"] == "ItemBought") {
        contract.on(
            "ItemBought",
            async (buyer, nftAddress, tokenId, price, event) => {
                const ItemBought = Parse.Object.extend("ItemBought")
                const itemBought = new ItemBought()
                itemBought.set("buyer", buyer)
                itemBought.set("nftAddress", nftAddress)
                itemBought.set("tokenId", parseInt(tokenId._hex, 16))
                itemBought.set("price", parseInt(price, 10))
                console.log("itembought tokenId ", parseInt(tokenId._hex, 16))
                itemBought.save()
                await updateActiveItem("Bought", nftAddress, tokenId)
            },
        )
        return { success: true }
    }
    if (params["tableName"] == "ItemListed") {
        contract.on(
            "ItemListed",
            async (seller, nftAddress, tokenId, price, event) => {
                /// Check if item isn't listed already ////////////

                const ActiveItem = Parse.Object.extend("ActiveItem")
                const query = new Parse.Query(ActiveItem)
                query.equalTo("marketplaceAddress", contractAddress)
                query.equalTo("nftAddress", nftAddress)
                query.equalTo("seller", seller)
                query.equalTo("tokenId.hex", tokenId._hex)
                const foundItemByTokenId = await query.find()
                if (foundItemByTokenId.length > 0) {
                    query.equalTo("objectId", foundItemByTokenId[0].id)
                    const itemByObjectId = await query.first()
                    if (itemByObjectId) {
                        console.log(`Already listed ${itemByObjectId}`)
                        await itemByObjectId.destroy()
                    }
                }
                ////////////////////////////////////////////////////
                const ItemListed = Parse.Object.extend("ItemListed")
                const itemListed = new ItemListed()
                itemListed.set("seller", seller)
                itemListed.set("nftAddress", nftAddress)
                itemListed.set("tokenId", tokenId)
                itemListed.set("price", price.toString())
                itemListed.save() //
                // const ActiveItem = Parse.Object.extend("ActiveItem")
                const activeItem = new ActiveItem()
                activeItem.set("marketplaceAddress", contractAddress)
                activeItem.set("nftAddress", nftAddress)
                activeItem.set("tokenId", tokenId)
                activeItem.set("price", price.toString())
                activeItem.set("seller", seller)
                activeItem.save() //
            },
        )
        return { success: true }
    }
    if (params["tableName"] == "ItemCanceled") {
        contract.on(
            "ItemCanceled",
            async (seller, nftAddress, tokenId, event) => {
                const ItemCanceled = Parse.Object.extend("ItemCanceled")
                const itemCanceled = new ItemCanceled()
                itemCanceled.set("seller", seller)
                itemCanceled.set("nftAddress", nftAddress)
                itemCanceled.set("tokenId", tokenId)
                itemCanceled.save()
                await updateActiveItem("Canceled", nftAddress, tokenId)
            },
        )
        return { success: true }
    }
    return { success: false }
})
