import { ITokens } from '../redux/reducers/tokensReducer';
import { UserProps } from '../redux/reducers/userReducer';

export interface StoreState {
  user: UserProps;
  tokens: ITokens;
}

export type TextAlign = 'left' | 'center' | 'right';

export type TOKEN_USAGE = 'BRIDGE' | 'REWARDS' | 'LPSTAKING' | 'SWAP';

export interface ITokenInfo {
  dst_coin: any;
  price: string;
  name: string;
  symbol: string;
  decimals: string;
  src_address: string;
  src_network: string;
  dst_address: string;
  dst_network: string;
  src_coin: string;
  totalLocked: string;
  totalLockedNormal: string;
  totalLockedUSD: string;
  display_props: {
    image: string;
    label: string;
    symbol: string;
    min_to_scrt: string;
    min_from_scrt: string;
    hidden: boolean;
    proxy?: string;
    proxy_symbol?: string;
    proxy_address?: string;
    is_secret_only?: boolean;
    usage: TOKEN_USAGE[];
  };
}

export interface ISecretToken {
  name: string;
  address: string;
  decimals: number;
  price: string;
  usage: TOKEN_USAGE[];
  id: string;
  hidden: boolean;
  display_props: {
    image: string;
    label: string;
    symbol: string;
  };
}

export const tokenFromSecretToken = (sToken: ISecretToken): ITokenInfo => {
  const { name, price, decimals, display_props } = sToken;

  return {
    src_coin: sToken.id,
    name,
    price,
    decimals: decimals.toString(),
    display_props: {
      ...display_props,
      hidden: sToken.hidden,
      min_from_scrt: '',
      min_to_scrt: '',
      is_secret_only: true,
      usage: sToken.usage,
    },
    dst_address: sToken.address,
    dst_coin: undefined,
    dst_network: '',
    src_address: '',
    src_network: '',
    symbol: sToken.id,
    totalLocked: '',
    totalLockedNormal: '',
    totalLockedUSD: '',
  };
};
