"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
require("./generated/evmApi");
require("./generated/solApi");
const authService_1 = require("../auth/authService");
Parse.Cloud.define('requestMessage', async ({ params }) => {
    const { address, chain, networkType } = params;
    const message = await (0, authService_1.requestMessage)({
        address,
        chain,
        networkType,
    });
    return { message };
});
Parse.Cloud.define('getPluginSpecs', () => {
    // Not implemented, only excists to remove client-side errors when using the moralis-v1 package
    return [];
});
Parse.Cloud.define('getServerTime', () => {
    // Not implemented, only excists to remove client-side errors when using the moralis-v1 package
    return null;
});
Parse.Cloud.define('watchContractEvent', async ({ params, user, ip }) => {
    let provider;
    if (params['chainId'] == 1337) {
        // use yarn ngrok http 8545
        provider = new ethers_1.ethers.providers.WebSocketProvider('http://127.0.0.1:8545/');
        //provider = new ethers.providers.WebSocketProvider('http://127.0.0.1:8545/');
    }
    else {
        provider = new ethers_1.ethers.providers.WebSocketProvider(process.env.SEPOLIA_RPC_URL);
    }
    const contractAddress = params['address'];
    const contract = new ethers_1.ethers.Contract(contractAddress, [params['abi']], provider);
    if (params['tableName'] == 'ItemBought') {
        contract.on('ItemBought', (buyer, nftAddress, tokenId, price, event) => {
            const ItemBought = Parse.Object.extend('ItemBought');
            const itemBought = new ItemBought();
            itemBought.set('buyer', buyer);
            itemBought.set('nftAddress', nftAddress);
            itemBought.set('tokenId', tokenId);
            itemBought.set('price', ethers_1.ethers.utils.formatUnits(price, 6));
            itemBought.save();
        });
        return { success: true };
    }
    if (params['tableName'] == 'ItemListed') {
        contract.on('ItemListed', (seller, nftAddress, tokenId, price, event) => {
            const ItemListed = Parse.Object.extend('ItemListed');
            const itemListed = new ItemListed();
            itemListed.set('seller', seller);
            itemListed.set('nftAddress', nftAddress);
            itemListed.set('tokenId', tokenId);
            itemListed.set('price', ethers_1.ethers.utils.formatUnits(price, 6));
            itemListed.save();
        });
        return { success: true };
    }
    if (params['tableName'] == 'ItemCanceled') {
        contract.on('ItemCanceled', (seller, nftAddress, tokenId, event) => {
            const ItemCanceled = Parse.Object.extend('ItemCanceled');
            const itemCanceled = new ItemCanceled();
            itemCanceled.set('seller', seller);
            itemCanceled.set('nftAddress', nftAddress);
            itemCanceled.set('tokenId', tokenId);
            itemCanceled.save();
        });
        return { success: true };
    }
    return { success: false };
});
//# sourceMappingURL=main.js.map