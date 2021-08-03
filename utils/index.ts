import isEmpty from 'lodash.isempty';
import { useEffect, useRef } from 'react';
import { notification } from 'antd';
import { SWAP_STEP } from '../constants';
import { BigNumber } from 'bignumber.js';

export const escapeRegExp = (string: string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
};

export const computeTruncatedAddress = (address: string, prefixAmount = 9, postFixAmount = -3) => {
  if (!address) {
    return '';
  }

  if (isEmpty(address)) {
    return address;
  }

  if (address.length <= prefixAmount) {
    return address;
  }

  const addressPrefix = address.slice(0, prefixAmount);
  const addressPostFix = address.slice(postFixAmount);
  return addressPrefix + '...' + addressPostFix;
};

export const isMobileView = (breakpoint: any) => {
  if (!breakpoint) return false;

  if (breakpoint.xs === true || breakpoint.sm === true || breakpoint.md === true) {
    return true;
  }
  return false;
};

export const computeSelectedSwapStep = (
  fromSymbol: string,
  toSymbol: string,
  fromAmount: string,
  toAmount: string
) => {
  if (isEmpty(fromSymbol) || isEmpty(toSymbol)) {
    return SWAP_STEP.SELECT_TOKEN;
  }

  if (!isEmpty(fromSymbol) && !isEmpty(toSymbol) && (isEmpty(fromAmount) || isEmpty(toAmount))) {
    return SWAP_STEP.ENTER_AN_AMOUNT;
  }

  if (!isEmpty(fromSymbol) && !isEmpty(toSymbol) && (!isEmpty(fromAmount) || !isEmpty(toAmount))) {
    return SWAP_STEP.DO_YOUR_SWAP;
  }

  return SWAP_STEP.ENTER_AN_AMOUNT;
};

function isFirstCharacterLowerCase(str) {
  const regexp = /^[a-z]/;
  return regexp.test(str);
}

export const computeTokenSymbolSrc = (tokenSymbol: string) => {
  if (tokenSymbol && typeof tokenSymbol === 'string') {
    let tokenSym = tokenSymbol;

    if (tokenSym.includes('secret')) {
      tokenSym = tokenSym.split('secret')[1];
    } else if (isFirstCharacterLowerCase(tokenSym[0]) || tokenSym[0] === 's') {
      tokenSym = tokenSym.slice(1);
    }

    if (tokenSym.includes('SECRET')) {
      tokenSym = tokenSym.split('SECRET')[1];
    }

    if (tokenSym === 'UNILP-WSCRT-ETH' || tokenSym === 'WSCRT') {
      tokenSym = 'scrt';
    }

    if (tokenSym === 'DPI') {
      return `/icons/currencies/${tokenSym.toLowerCase()}.png`;
    }

    return `/icons/currencies/${tokenSym.toLowerCase()}.svg`;
  }
  return '/icons/currencies/unknown-light.svg';
};

export const formatTokenFromURL = (symbol: string) => {
  let sym = symbol;
  if (sym.includes('SECRET')) {
    const splitTxt = sym.split('SECRET');
    const secretTxt = splitTxt[0];
    const token = splitTxt[1];
    sym = secretTxt;
    if (token) {
      sym = sym + token;
    }
    return sym;
  }
  return sym;
};

export const objectMap = (obj, fn) =>
  Object.fromEntries(Object.entries(obj).map(([k, v], i) => [k, fn(v, k, i)]));

export const onClickInstallKeplr = (e: any) => {
  if (e) e.preventDefault();

  const a = document.createElement('a');
  a.href = 'https://wallet.keplr.app/';
  a.target = '_blank';
  a.rel = 'noopener norefferer';
  a.click();
};

export const onClickInstallMetaMask = (e: any) => {
  if (e) e.preventDefault();

  const a = document.createElement('a');
  a.href = 'https://metamask.io/';
  a.target = '_blank';
  a.rel = 'noopener norefferer';
  a.click();
};

export const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

// get simu response
// get how many tokens you're receiving at that moment

// get pool, and get the share

export const copyAddress = (e: React.MouseEvent, data: string) => {
  e.stopPropagation();
  e.preventDefault();
  navigator.clipboard.writeText(data);

  notification.success({
    message: 'Copied',
    duration: 2,
    className: 'antdNotificationSuccessClass',
  });
};

interface TimeLeftProps {
  seconds: string;
  minutes: string;
  hours: string;
}

export const calculateTimeLeft = (resetTime: number): TimeLeftProps => {
  const difference = resetTime - Date.now();
  if (difference > 0) {
    const hours = new BigNumber(difference)
      .dividedBy(1000 * 60 * 60)
      .modulo(24)
      .integerValue(BigNumber.ROUND_FLOOR)
      .toString();
    const minutes = new BigNumber(difference)
      .dividedBy(1000 * 60)
      .modulo(60)
      .integerValue(BigNumber.ROUND_FLOOR)
      .toString();
    const seconds = new BigNumber(difference)
      .dividedBy(1000)
      .modulo(60)
      .integerValue(BigNumber.ROUND_FLOOR)
      .toString();
    return {
      hours: hours.length < 2 ? `0${hours}` : hours,
      minutes: minutes.length < 2 ? `0${minutes}` : minutes,
      seconds: seconds.length < 2 ? `0${seconds}` : seconds,
    };
  } else {
    return {
      hours: '00',
      minutes: '00',
      seconds: '00',
    };
  }
};

export const isClaimTimeLeft = (time: TimeLeftProps) => {
  if (time.hours === '00' && time.minutes === '00' && time.seconds === '00') {
    return false;
  }
  return true;
};
