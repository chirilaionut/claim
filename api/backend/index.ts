import * as agent from 'superagent';
import { ITokenInfo, ISecretToken, tokenFromSecretToken } from '../../interfaces';

const backendUrl = (url: string, isSienna = false) => {
  if (isSienna) {
    return `${process.env.SIENNA_BACKEND_URL}${url}`;
  }
  return `${process.env.BACKEND_URL}${url}`;
};

export const doGetTokensInfo = async (params: any) => {
  const url = backendUrl('/tokens/', true);

  const secretTokenListUrl = backendUrl('/sienna_tokens/', true);

  const [tokensResponse, secretTokensResponse] = await Promise.all([
    agent.get(url, params),
    agent.get(secretTokenListUrl, params), // the lp tokens
  ]);

  const tokens: ITokenInfo[] = tokensResponse.body.tokens;
  const secretTokens: ISecretToken[] = secretTokensResponse.body.tokens;

  const content = tokens
    .map((t: ITokenInfo) => {
      if (t.display_props.proxy) {
        if (t.display_props.symbol === 'SIENNA' || t.display_props.symbol === 'WSIENNA') {
          t.display_props.proxy_address = process.env.SIENNA_PROXY_CONTRACT;
          t.dst_address = process.env.SIENNA_CONTRACT;
          t.display_props.proxy_symbol = 'SIENNA';
        } else if (t.display_props.symbol === 'SSCRT' || t.display_props.symbol === 'WSCRT') {
          t.display_props.proxy_address = process.env.WSCRT_PROXY_CONTRACT;
          t.dst_address = process.env.SSCRT_CONTRACT;
          t.display_props.proxy_symbol = 'WSCRT';
        } else {
          console.log(`Proxy Token ${t.display_props.symbol} not found`);
        }
      }
      return t;
    })
    .map((t) => {
      if (t?.display_props?.usage === undefined) {
        t.display_props.usage = ['BRIDGE', 'REWARDS', 'SWAP'];
      }
      return t;
    });

  const sTokens = secretTokens.map((t) => {
    return tokenFromSecretToken(t);
  });

  content.push(...sTokens);

  return { content };
};
