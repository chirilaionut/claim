import { AbiItem } from 'web3-utils';
import { Contract } from 'web3-eth-contract';
import Web3 from 'web3';
import { mulDecimals } from '../../../utils/numberFormat';
import { getGasPrice } from './helpers';
import { BigNumber } from 'bignumber.js';

import MyERC20Json from '../out/MyERC20.json';
const MyERC20JsonAbi = MyERC20Json.abi as AbiItem[];

const MAX_UINT = new BigNumber(2).exponentiatedBy(256).minus(1);
export interface IEthMethodsInitParams {
  web3: Web3;
  ethManagerContract: Contract;
  ethManagerAddress: string;
}

export class EthMethodsERC20 {
  private readonly web3: Web3;
  private ethManagerContract: Contract;
  private ethManagerAddress: string;

  constructor(params: IEthMethodsInitParams) {
    this.web3 = params.web3;
    this.ethManagerContract = params.ethManagerContract;
    this.ethManagerAddress = params.ethManagerAddress;
  }

  getAllowance = async (erc20Address: string) => {
    const accounts = await window.ethereum.enable();

    const erc20Contract = new this.web3.eth.Contract(MyERC20JsonAbi, erc20Address);

    return await erc20Contract.methods.allowance(accounts[0], this.ethManagerAddress).call();
  };

  callApprove = async (
    erc20Address: string,
    amount: string | number,
    decimals: string | number
  ) => {
    const accounts = await window.ethereum.enable();

    const erc20Contract = new this.web3.eth.Contract(MyERC20JsonAbi, erc20Address);

    amount = Number(mulDecimals(amount, decimals));

    const allowance = await this.getAllowance(erc20Address);

    if (Number(allowance) < Number(amount)) {
      await erc20Contract.methods.approve(this.ethManagerAddress, MAX_UINT).send({
        from: accounts[0],
        gas: process.env.ETH_GAS_LIMIT,
        gasPrice: await getGasPrice(this.web3),
        amount,
      });
    }
  };

  swapToken = async (
    erc20Address: string,
    userAddr: string,
    amount: string | number,
    decimals: string | number
  ) => {
    const accounts = await window.ethereum.enable();

    const secretAddrHex = this.web3.utils.fromAscii(userAddr);
    // TODO: add validation

    const estimateGas = await this.ethManagerContract.methods
      .swapToken(secretAddrHex, mulDecimals(amount, decimals), erc20Address)
      .estimateGas({ from: accounts[0] });

    const gasLimit = BigNumber.maximum(
      new BigNumber(estimateGas).multipliedBy(0.3).plus(estimateGas),
      new BigNumber(process.env.ETH_GAS_LIMIT)
    ).toNumber();

    return await this.ethManagerContract.methods
      .swapToken(secretAddrHex, mulDecimals(amount, decimals), erc20Address)
      .send({
        from: accounts[0],
        gas: gasLimit,
        gasPrice: await getGasPrice(this.web3),
      });
  };

  checkEthBalance = async (erc20Address: string, addr: string) => {
    const erc20Contract = new this.web3.eth.Contract(MyERC20JsonAbi, erc20Address);

    return await erc20Contract.methods.balanceOf(addr).call();
  };

  tokenDetails = async (erc20Address: string) => {
    if (!this.web3.utils.isAddress(erc20Address)) {
      throw new Error('Invalid token address');
    }

    const erc20Contract = new this.web3.eth.Contract(MyERC20JsonAbi, erc20Address);

    let name = '';
    let symbol = '';
    // maker has some weird encoding for these.. so whatever
    if (erc20Address === '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2') {
      name = 'Maker';
      symbol = 'MKR';
    } else {
      name = await erc20Contract.methods.name().call();
      symbol = await erc20Contract.methods.symbol().call();
    }
    // todo: check if all the erc20s we care about have the decimals method (it's not required by the standard)
    const decimals = await erc20Contract.methods.decimals().call();

    return { name, symbol, decimals, erc20Address };
  };
}
