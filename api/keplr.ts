import { CosmWasmClient, SigningCosmWasmClient } from 'secretjs';
import { divDecimals, formatWithSixDecimals, toFixedTrunc } from '../utils/numberFormat';
import { getViewingKey, Snip20GetBalance } from '../api/bridge/scrt';
import { unlockToken, fixUnlockToken } from '../constants/keplr';
import { ITokenInfo } from '../interfaces';

const chainId = process.env.CHAIN_ID;

export interface Keplr {
  suggestToken: any;
  experimentalSuggestChain: any;
  enable: any;
  getSecret20ViewingKey: any;
}

export const getKeplr = (): Keplr | undefined => {
  if (window.keplr) {
    return window.keplr;
  }
  return undefined;
};

export const getKeplrOrFail = (): Keplr => {
  const keplr = getKeplr();
  if (keplr) {
    return keplr;
  }
  throw new Error('Global variable keplr is undefined.');
};

export const keplrCheckPromise = async () => {
  return new Promise(async (resolve, reject) => {
    // 1. Every one second, check if Keplr was injected to the page
    try {
      const keplrCheckInterval = setInterval(async () => {
        try {
          const keplr = getKeplr();
          const isKeplrWallet = !!keplr && !!window.getOfflineSigner && !!window.getEnigmaUtils;

          if (isKeplrWallet) {
            // Keplr is present, stop checking
            clearInterval(keplrCheckInterval);
            resolve({ keplr, isKeplrWallet });
            return;
          }
        } catch (error) {
          console.error(error);
        }
      }, 1000);
    } catch (error) {
      reject(error);
    }
  });
};

export const signInKeplr = async () => {
  try {
    const chainId = process.env.CHAIN_ID;
    const keplr = getKeplrOrFail();

    // Setup Secret Testnet (not needed on mainnet)
    if (process.env.ENV !== 'MAINNET') {
      await keplr.experimentalSuggestChain({
        chainId,
        chainName: process.env.CHAIN_NAME,
        rpc: process.env.SECRET_RPC,
        rest: process.env.SECRET_LCD,
        bip44: {
          coinType: 529,
        },
        coinType: 529,
        stakeCurrency: {
          coinDenom: 'SCRT',
          coinMinimalDenom: 'uscrt',
          coinDecimals: 6,
        },
        bech32Config: {
          bech32PrefixAccAddr: 'secret',
          bech32PrefixAccPub: 'secretpub',
          bech32PrefixValAddr: 'secretvaloper',
          bech32PrefixValPub: 'secretvaloperpub',
          bech32PrefixConsAddr: 'secretvalcons',
          bech32PrefixConsPub: 'secretvalconspub',
        },
        currencies: [
          {
            coinDenom: 'SCRT',
            coinMinimalDenom: 'uscrt',
            coinDecimals: 6,
          },
        ],
        feeCurrencies: [
          {
            coinDenom: 'SCRT',
            coinMinimalDenom: 'uscrt',
            coinDecimals: 6,
          },
        ],
        gasPriceStep: {
          low: 0.1,
          average: 0.25,
          high: 0.4,
        },
        features: ['secretwasm'],
      });
    }

    // Ask the user for permission
    await keplr.enable(chainId);

    const keplrOfflineSigner = window.getOfflineSigner(chainId);
    const accounts = await keplrOfflineSigner.getAccounts();
    const address = accounts[0].address;

    const secretjsSend = initSecretJS(process.env.SECRET_POST_ADDRESS, true, address, chainId);
    const secretjs = initSecretJS(process.env.SECRET_LCD, false, address, chainId);

    // window.secretjs = secretjs;
    // window.secretjsSend = secretjsSend

    return { keplrOfflineSigner, address, accounts, secretjs, secretjsSend, chainId };
  } catch (error) {
    throw new Error(error);
  }
};

const initSecretJS = (
  address: string,
  isSigner: boolean,
  walletAddress: string,
  chainId: string
) => {
  try {
    const client = isSigner
      ? new SigningCosmWasmClient(
          address,
          walletAddress,
          window.getOfflineSigner(chainId),
          window.getEnigmaUtils(chainId),
          {
            init: {
              amount: [{ amount: '300000', denom: 'uscrt' }],
              gas: '300000',
            },
            exec: {
              amount: [{ amount: '500000', denom: 'uscrt' }],
              gas: '500000',
            },
          }
        )
      : new CosmWasmClient(address);
    return client;
  } catch (error) {
    console.log('keplr login error', error);
    return undefined;
  }
};

export const getSnip20Balance = async (
  snip20Address: string,
  secretjs: any,
  walletAddress: string,
  decimals?: string | number
) => {
  try {
    if (!secretjs) {
      return '0';
    }

    const keplr = getKeplrOrFail();
    const viewingKey = await getViewingKey({
      keplr,
      chainId: chainId,
      address: snip20Address,
    });

    if (!viewingKey) {
      return 'Unlock';
    }

    const rawBalance = await Snip20GetBalance({
      secretjs: secretjs,
      token: snip20Address,
      address: walletAddress,
      key: viewingKey,
    });

    if (isNaN(Number(rawBalance))) {
      return fixUnlockToken;
    }

    if (decimals) {
      const decimalsNum = Number(decimals);
      return divDecimals(rawBalance, decimalsNum);
    }

    return rawBalance;
  } catch (error) {
    throw new Error(error);
  }
};

export const getSIENNABalance = async (walletAddress: string, secretjs: CosmWasmClient) => {
  return new Promise(async (resolve, reject) => {
    let balanceSIENNA = {};

    try {
      const balance = await getSnip20Balance(
        process.env.SIENNA_CONTRACT,
        secretjs,
        walletAddress,
        18
      );

      if (balance.includes(unlockToken)) {
        balanceSIENNA = balance;
        resolve(balanceSIENNA);
      } else {
        balanceSIENNA = formatWithSixDecimals(toFixedTrunc(balance, 6));
      }
    } catch (error) {
      balanceSIENNA = unlockToken;
      reject(error);
    } finally {
      resolve(balanceSIENNA);
    }
  });
};

export const getSecretToken = async (
  symbol: string,
  tokenAddress: string,
  walletAddress: string,
  secretjs: CosmWasmClient,
  tokens: ITokenInfo[]
) => {
  return new Promise(async (resolve, reject) => {
    const balanceToken = {};
    const balanceTokenMin = {};

    if (!symbol && tokenAddress) {
      try {
        symbol = tokens.find((t) => t.dst_address === tokenAddress).display_props.symbol;
      } catch (error) {
        console.log('Error finding symbol for SNIP20 address', tokenAddress, error);
        reject(error);
      }
    }
    if (!symbol) {
      return;
    }

    const token = tokens.find((t) => t.display_props.symbol === symbol);

    try {
      const balance = await getSnip20Balance(
        token.dst_address,
        secretjs,
        walletAddress,
        token.decimals
      );
      if (balance.includes(unlockToken)) {
        balanceToken[token.src_coin] = balance;
      } else {
        balanceToken[token.src_coin] = formatWithSixDecimals(toFixedTrunc(balance, 6));
      }
    } catch (error) {
      balanceToken[token.src_coin] = unlockToken;
      reject(error);
    }

    try {
      balanceTokenMin[token.src_coin] = token.display_props.min_from_scrt;
    } catch (error) {
      reject(error);
      // Ethereum?
    }

    resolve({ balanceToken, balanceTokenMin });
  });
};

// The token address is the SNIP-20 destination address for the given token
export const unlockTokenBalance = async (tokenAddress: string) => {
  try {
    const keplr = getKeplrOrFail();
    return await keplr.suggestToken(chainId, tokenAddress);
  } catch (error) {
    console.error(error);
  }
};
