/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
declare const Parse: any;
import { ethers } from 'ethers';

Parse.Cloud.define('getPluginSpecs', () => {
  // Not implemented, only excists to remove client-side errors when using the moralis-v1 package
  return [];
});

Parse.Cloud.define('watchContractEvent', () => {
  // Not implemented, only excists to remove client-side errors when using the moralis-v1 package

  console.log('watchContractEvent HEllloooooooo');
  const ItemBought = Parse.Object.extend('ItemBought');
  const itemBought = new ItemBought();
  itemBought.set('buyer', 'Saeed Abdo');
  itemBought.set('nftAddress', '0x056757625');
  itemBought.set('tokenId', 6);
  itemBought.set('price', 0.05);
  itemBought.save();
  return { success: true };
});
