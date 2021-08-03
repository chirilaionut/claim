import { css } from 'styled-components';

export const hoverSupported = (style: any) => css`
  @media not all and (pointer: coarse) {
    ${style};
  }
`;
