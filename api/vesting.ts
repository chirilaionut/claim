import { SigningCosmWasmClient } from 'secretjs';

// Claims vested tokens. Useful for investors.
export const claimVestedTokens = (secretjs: SigningCosmWasmClient, address: string) => {
  return secretjs.execute(address, {
    claim: {},
  });
};
