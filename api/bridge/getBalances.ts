import { AbiItem } from 'web3-utils';
import { web3 } from './eth';

export const getErc20Balance = async (
  ethAddress: string,
  tokenAddress: string
): Promise<string> => {
  try {
    const minimumErc20Abi: AbiItem[] = [
      {
        constant: true,
        inputs: [
          {
            name: '_owner',
            type: 'address',
          },
        ],
        name: 'balanceOf',
        outputs: [
          {
            name: 'balance',
            type: 'uint256',
          },
        ],
        type: 'function',
      },
    ];

    const contract = new web3.eth.Contract(minimumErc20Abi, tokenAddress);

    return await contract.methods.balanceOf(ethAddress).call();
  } catch (error) {
    return '0';
  }
};
