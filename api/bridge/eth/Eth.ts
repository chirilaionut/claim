import { BigNumber } from 'bignumber.js';
import { Contract } from 'web3-eth-contract';
import Web3 from 'web3';
import { ethToWei, getGasPrice } from './helpers';

export interface IEthMethodsInitParams {
  web3: Web3;
  ethManagerContract: Contract;
}

export class EthMethods {
  private web3: Web3;
  private ethManagerContract: Contract;

  constructor(params: IEthMethodsInitParams) {
    this.web3 = params.web3;
    this.ethManagerContract = params.ethManagerContract;
  }

  swapEth = async (userAddr: string, amount: string | number) => {
    const accounts = await window.ethereum.enable();

    const secretAddrHex = this.web3.utils.fromAscii(userAddr);
    // TODO: add validation

    const estimateGas = await this.ethManagerContract.methods.swap(secretAddrHex).estimateGas({
      value: ethToWei(amount),
      from: accounts[0],
    });

    const gasLimit = BigNumber.maximum(
      new BigNumber(estimateGas).multipliedBy(0.3).plus(estimateGas),
      new BigNumber(process.env.ETH_GAS_LIMIT)
    ).toNumber();

    return await this.ethManagerContract.methods.swap(secretAddrHex).send({
      value: ethToWei(amount),
      from: accounts[0],
      gas: gasLimit,
      gasPrice: await getGasPrice(this.web3),
    });
  };
}
