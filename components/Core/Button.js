import React from 'react';
import styled from 'styled-components';
import {
  color,
  background,
  space,
  border,
  typography,
  shadow,
  flexbox,
  layout,
} from 'styled-system';

import styles from './Button.module.css';

const ButtonSolid = styled.button`
  padding: 0.85rem 1.75rem;
  min-width: 250px;
  min-height: 85px;
  font-size: 17px;
  font-weight: 500;
  letter-spacing: -0.66px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transform: perspective(1px) translateZ(0);
  position: relative;
  overflow: hidden;
  outline: none !important;
  white-space: nowrap;
  ${color};
  ${background};
  ${border};
  ${space};
  ${typography};
  ${shadow};
  ${flexbox};
  ${layout};

  &:before {
    content: '';
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${(props) =>
      props.darkMode ? ' rgba(0, 0, 0, 0.03)' : 'rgba(255, 255, 255, 0.1)'};
    transform: scaleX(0);
    transform-origin: 100% 50%;
    transition-property: transform;
    transition-duration: 0.5s;
    transition-timing-function: ease-out;
  }

  &:hover:before,
  &:focus:before,
  &:active:before {
    transform: scaleX(1);
    transition-timing-function: cubic-bezier(0.52, 1.64, 0.37, 0.66);
  }
`;

const ButtonOutline = styled(ButtonSolid)`
  background: transparent;

  &:before {
    background: ${({ theme, color }) => theme.colors[color]};
  }

  &:hover,
  &:focus,
  &:active {
    color: ${({ theme }) => theme.colors.white};
  }
  &:hover:before,
  &:focus:before,
  &:active:before {
    transform: scaleX(1);
    transition-timing-function: cubic-bezier(0.52, 1.64, 0.37, 0.66);
    background: ${({ theme, color }) => theme.colors[color]};
  }
`;

const Img = styled.img`
  width: 26px;
  height: 26px;
  margin-right: 15px;
  margin-left: -10px;
`;

const Button = ({
  variant = 'solid',
  color = 'white',
  bg = 'primary',
  isLoading = false,
  buttonText = 'Ok',
  withIcon = false,
  iconSrc = '',
  darkMode = false,
  ...rest
}) => {
  return variant === 'solid' ? (
    <ButtonSolid
      className={`${isLoading ? 'lds-ellipsis' : ''}`}
      color={color}
      border={`none`}
      borderColor={bg}
      bg={bg}
      darkMode={darkMode}
      {...rest}
    >
      {isLoading && (
        <div className={styles.spinner}>
          <div className={styles.bounce1}></div>
          <div className={styles.bounce2}></div>
          <div className={styles.bounce3}></div>
        </div>
      )}

      {!isLoading && (
        <>
          {withIcon && <Img src={iconSrc} />}

          <div>{buttonText}</div>
        </>
      )}
    </ButtonSolid>
  ) : (
    <ButtonOutline color={color} bg={bg} border={`1px solid`} borderColor={color} {...rest}>
      {isLoading && (
        <div className={styles.spinner}>
          <div className={styles.bounce1}></div>
          <div className={styles.bounce2}></div>
          <div className={styles.bounce3}></div>
        </div>
      )}

      {!isLoading && <div>{buttonText}</div>}
    </ButtonOutline>
  );
};

export default Button;
