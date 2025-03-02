import { compileFile } from 'cashc';
import {
  MockNetworkProvider,
  Contract,
  SignatureTemplate,
  randomUtxo,
  randomNFT
} from 'cashscript';
import {
  hexToBin,
  binToHex,
  cashAddressToLockingBytecode
} from '@bitauth/libauth';

import { alicePriv, aliceAddress, aliceTokenAddress, alicePkh, alicePub } from './common.js';
export { alicePriv, aliceAddress, aliceTokenAddress, alicePkh, alicePub };


const Foo = compileFile(new URL('./contracts/Foo.cash', import.meta.url));
const Bar = compileFile(new URL('./contracts/Bar.cash', import.meta.url));
const Baz = compileFile(new URL('./contracts/Baz.cash', import.meta.url));

export const provider = new MockNetworkProvider();
export const addressType = 'p2sh32';
export const options = { provider, addressType }

export const aliceTemplate = new SignatureTemplate(alicePriv);

export const randomNFTFooUtxo = randomNFT({satoshis: 10_000n, nft: {commitment: undefined, capability: 'none'}});
export const barCategory = randomNFTFooUtxo.category
export const reverseBarTokenCategory = binToHex(hexToBin(barCategory).reverse())

export const randomNFTBazUtxo = randomNFT({satoshis: 10_000n, nft: {commitment: undefined, capability: 'none'}});
export const bazCategory = randomNFTBazUtxo.category
export const reverseBazTokenCategory = binToHex(hexToBin(bazCategory).reverse())


// Export all the contracts

export const FooContract = new Contract(Foo, [], options);
export const FooContractLockingBytecode = cashAddressToLockingBytecode(FooContract.address)

export const BarContract = new Contract(Bar, [ reverseBarTokenCategory], options);
export const BarContractLockingBytecode = binToHex(cashAddressToLockingBytecode(BarContract.address).bytecode);


export const BazContract = new Contract(Baz, [ reverseBazTokenCategory], options);
export const BazContractLockingBytecode = binToHex(cashAddressToLockingBytecode(BazContract.address).bytecode);


provider.addUtxo(BarContract.address, randomUtxo());
provider.addUtxo(BazContract.address, randomUtxo());
provider.addUtxo(FooContract.address, randomUtxo());