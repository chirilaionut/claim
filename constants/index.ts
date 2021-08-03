export const SWAP_STEP = {
  SELECT_TOKEN: 'SELECT_TOKEN',
  ENTER_AN_AMOUNT: 'ENTER_AN_AMOUNT',
  DO_YOUR_SWAP: 'DO YOUR SWAP',
  DO_ANOTHER_SWAP: 'DO_ANOTHER_SWAP',
};

const SIENNA_WEBSITE_URL = 'https://sienna.network';

export const SIENNA_WEBSITE_LINKS = {
  HOME: `${SIENNA_WEBSITE_URL}/`,
  ABOUT_SWAP: `${SIENNA_WEBSITE_URL}/swap`,
  DISCORD: 'https://discord.gg/PD4pGnB7up',
  TWITTER: 'https://twitter.com/sienna_network',
  TELEGRAM: 'https://t.me/GoSiennaNetwork',
  BLOG: 'https://medium.com/sienna-network',
  REDDIT: 'https://www.reddit.com/r/SiennaNetwork',
  SWAP: `${SIENNA_WEBSITE_URL}/swap`,
  AMM: `${SIENNA_WEBSITE_URL}/automated-market-maker`,
};

export const SECRET_EXPLORER_URL = `https://secretnodes.com/secret/chains/${process.env.CHAIN_ID}`;

export enum CurrentSwapTab {
  SWAP,
  POOL,
  EARN,
}

export const rewardsDepositKey = (key) => `${key}RewardsDeposit`;

export const rewardsKey = (key) => `${key}Rewards`;

export const NO_VIEWING_KEY = 'No viewing key';
