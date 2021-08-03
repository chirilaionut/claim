declare namespace NodeJS {
  interface ProcessEnv {
    ENV: string;
    ETH_GAS_PRICE: string;
    ETH_GAS_LIMIT: string;
    ETH_GAS_PRICE: string;
    BACKEND_URL: string;
    SCRT_SWAP_CONTRACT: string;
    ETH_MANAGER_CONTRACT: string;
    SWAP_FEE: string;
    ETH_EXPLORER_URL: string;
    SCRT_EXPLORER_URL: string;
    CHAIN_ID: string;
    CHAIN_NAME: string;
    SECRET_RPC: string;
    SECRET_LCD: string;
    SECRET_POST_ADDRESS: string;
    SSCRT_CONTRACT: string;
    WSCRT_PROXY_CONTRACT: string;
    AMM_FACTORY_CONTRACT: string;
    SIENNA_CONTRACT: string;
    SIENNA_PROXY_CONTRACT: string;
    SIENNA_REWARDS_CONTRACT: string;
    SIENNA_BACKEND_URL: string;
    MGMT_CONTRACT: string;
  }
}
