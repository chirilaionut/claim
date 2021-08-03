import { CosmWasmClient } from 'secretjs';
import { unlockToken } from '../../../constants/keplr';
// import { divDecimals } from "../../../utils/numberFormat"

export interface Snip20TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
  total_supply?: string;
}

export const Snip20GetBalance = async (params: {
  secretjs: CosmWasmClient;
  token: string;
  address: string;
  key: string;
}) => {
  const { secretjs, address, token, key } = params;

  let balanceResponse;
  try {
    balanceResponse = await secretjs.queryContractSmart(token, {
      balance: {
        address,
        key,
      },
    });
  } catch (e) {
    // console.log(e);
    return unlockToken;
  }

  if (balanceResponse.viewing_key_error) {
    return 'Fix Unlock';
  }

  if (Number(balanceResponse.balance.amount) === 0) {
    return '0';
  }
  return balanceResponse.balance.amount;
};
