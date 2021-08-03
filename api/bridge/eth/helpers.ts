import * as agent from 'superagent';
import Web3 from 'web3';
import { divDecimals, mulDecimals } from '../../../utils/numberFormat';
import { web3 } from './index';
import { BigNumber } from 'bignumber.js';

export const getGasPrice = async (web3: Web3): Promise<BigNumber> => {
  const gasPrice = new BigNumber(await web3.eth.getGasPrice()).multipliedBy(1);

  let gasPriceApi = new BigNumber(0);

  try {
    const info = await agent.get(`https://www.etherchain.org/api/gasPriceOracle`);

    gasPriceApi = new BigNumber(mulDecimals(info.body.standard, 8));
  } catch (e) {
    console.error('Error get gas price');
  }

  return gasPrice.lt(gasPriceApi) ? gasPriceApi : gasPrice;
};

export const getNetworkFee = async (gas_amount): Promise<number> => {
  const gasPrice = await getGasPrice(web3);
  const gasLimit = new BigNumber(gas_amount);

  const fee = gasLimit.multipliedBy(gasPrice);

  return Number(divDecimals(fee.toString(), 18));
};

export const ethToWei = (amount: string | number) => mulDecimals(amount, 18);
