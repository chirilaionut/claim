import Web3 from 'web3';
import { CosmWasmClient, SigningCosmWasmClient } from 'secretjs';

declare global {
  interface Window {
    web3?: Web3;
    ethereum?: any;
    keplr?: any;
    secretjs?: CosmWasmClient;
    secretjsSend?: SigningCosmWasmClient;
    getOfflineSigner: any;
    getEnigmaUtils: any;
  }
}
