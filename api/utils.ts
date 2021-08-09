import { StdFee } from 'secretjs/types/types';

export const sleep = (duration: number) => new Promise((res) => setTimeout(res, duration));

export function getFeeForExecute(gas: number): StdFee {
    return {
        amount: [{ amount: String(gas), denom: 'uscrt' }],
        gas: String(gas),
    };
}
