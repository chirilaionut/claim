import React from 'react';
import styled from 'styled-components';

import Btn from '../Core/Button';

import { defaultColors } from '../../styles/theme';

interface Props {
  buttonText: string;
  onClick: (e: React.SyntheticEvent) => void;
}
const ConnectWalletButton: React.FC<Props> = ({ buttonText, onClick }) => {
  return (
    <Button
      bg={defaultColors.primary}
      color={'white'}
      withIcon
      buttonText={buttonText}
      onClick={onClick}
      iconSrc={'/icons/thick-connect-icon-light.svg'}
    ></Button>
  );
};

export default ConnectWalletButton;

const Button = styled(Btn)`
  position: fixed;
  right: 0px;
  top: 0px;
  z-index: 9;
  cursor: pointer;
`;
