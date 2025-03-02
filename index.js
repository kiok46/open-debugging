import { TransactionBuilder } from 'cashscript';
import { binToHex, hexToBin, cashAddressToLockingBytecode, lockingBytecodeToCashAddress } from '@bitauth/libauth';
import {
  FooContract,
  BarContract,
  BazContract,
  provider,
  reverseBarTokenCategory,
  reverseBazTokenCategory
} from './setup.js';

export const main = async () => {

  const fooUtxos = await provider.getUtxos(FooContract.address);
  const fooUtxo = fooUtxos[0];
  const barUtxos = await provider.getUtxos(BarContract.address);
  const barUtxo = barUtxos[0];
  const bazUtxos = await provider.getUtxos(BazContract.address);
  const bazUtxo = bazUtxos[0];

  const fooLockingBytecode = binToHex(cashAddressToLockingBytecode(FooContract.address).bytecode);
  const barLockingBytecode = binToHex(cashAddressToLockingBytecode(BarContract.address).bytecode);
  const bazLockingBytecode = binToHex(cashAddressToLockingBytecode(BazContract.address).bytecode);

  console.log(FooContract.address)
  const fooCashAddress = lockingBytecodeToCashAddress({ prefix: 'bchtest', bytecode: hexToBin(fooLockingBytecode)});
  console.log('fooCashAddress: ', fooCashAddress)

  const fooFromCashAddress = lockingBytecodeToCashAddress({ prefix: 'bchtest', bytecode: hexToBin('aa2067774086d772be0228ffb2cb1197d56c0859f349cca45f76f170dc7259056e0387')});
  console.log('fooFromCashAddress: ', fooFromCashAddress)
  // const barCashAddress = lockingBytecodeToCashAddress(barLockingBytecode);
  // const bazCashAddress = lockingBytecodeToCashAddress(bazLockingBytecode);
  
  console.log('fooLockingBytecode: ', fooLockingBytecode)
  console.log('barLockingBytecode: ', barLockingBytecode)
  console.log('bazLockingBytecode: ', bazLockingBytecode)
  const tx = await new TransactionBuilder({ provider })
    .addInput(fooUtxo, FooContract.unlock.call())
    .addInput(barUtxo, BarContract.unlock.call(reverseBarTokenCategory))
    .addInput(bazUtxo, BazContract.unlock.call(reverseBazTokenCategory))  
    .addOutput({ to: BarContract.address, amount: 800n })
    // .send()
    .bitauthUri()

  console.log(tx)
}

main();