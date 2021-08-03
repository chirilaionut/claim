import React from 'react';
import styled from 'styled-components';
import defaultColors from '../../styles/theme';

interface Props {
  onClick: React.MouseEventHandler;
  icon?: string | boolean;
  iconPosition?: boolean;
  text?: string | JSX.Element;
  containerStyle?: React.CSSProperties;
  fontSize: string;
  width: string;
  height: string;
  disabled?: boolean;
}

const ClaimButton = ({
  onClick,
  text,
  icon,
  containerStyle,
  fontSize,
  width,
  height,
  disabled,
}: Props) => {
  return (
    <ClaimBtn style={containerStyle} onClick={onClick} disabled={disabled}>
      <span style={{ fontSize: fontSize }}>{text}</span>
      {icon && <Img src={icon.toString()} width={width} height={height} alt="Wallet" />}
    </ClaimBtn>
  );
};

export default ClaimButton;

const Img = styled.img``;

const ClaimBtn = styled.button<{
  disabled?: boolean;
}>`
  background: ${(props) =>
    props.disabled ? defaultColors.colors.disabledBlue : defaultColors.colors.swapBlue};
  color: ${defaultColors.colors.light};
  cursor: pointer;
  border: none;
  width: 236px;
  height: 48px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-content: center;
  align-items: center;
  outline: none;

  &:hover {
    opacity: 0.75;
  }

  :focus {
    outline: none;
  }

  > img {
    margin-left: 10px;
  }
`;
