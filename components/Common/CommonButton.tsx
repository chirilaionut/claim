import React from 'react';
import styled from 'styled-components';

import { Span } from '../Shared';

export const Button = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    opacity: 0.8;
  }
`;

export const ButtonText = styled(Span)`
  margin-left: 10px;
  font-weight: bold;
`;

interface Props {
  withText?: boolean;
  buttonText?: string;
  onClick: React.MouseEventHandler<HTMLDivElement>;
  style: React.CSSProperties;
  lightModeIcon: string;
}

const CommonButton = ({
  withText = true,
  buttonText = '',
  onClick,
  style,
  lightModeIcon,
}: Props) => {
  return (
    <Button onClick={onClick} style={style}>
      <img src={lightModeIcon} alt="" />
      {withText && <ButtonText>{buttonText}</ButtonText>}
    </Button>
  );
};

export default CommonButton;
