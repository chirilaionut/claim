import Web3 from 'web3';
import { EthMethods } from './Eth';
import { EthMethodsERC20 } from './EthERC20';
import { AbiItem } from 'web3-utils';

import ethManagerJson from '../out/MultiSigSwapWallet.json';

const ethManagerJsonAbi = ethManagerJson.abi as AbiItem[];

const initWeb3 = () => {
  if (typeof window !== 'undefined') {
    return window.web3 ? window.web3.currentProvider : process.env.ETH_NODE_URL;
  }

  return undefined;
};

export const web3 = new Web3(initWeb3());

const ethManagerContract = new web3.eth.Contract(
  ethManagerJsonAbi,
  process.env.ETH_MANAGER_CONTRACT
);

export const ethMethodsERC20 = new EthMethodsERC20({
  web3,
  ethManagerContract,
  ethManagerAddress: process.env.ETH_MANAGER_CONTRACT,
});

export const ethMethodsETH = new EthMethods({
  web3,
  ethManagerContract,
});
