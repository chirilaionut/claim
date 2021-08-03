import React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useBreakpoint } from '../../hooks/breakpoints';
import { isMobileView } from '../../utils';

const NavBarLogo: React.FC = () => {
  const router = useRouter();
  const breakpoint = useBreakpoint();
  const isMobile = isMobileView(breakpoint);

  const onClick = () => {
    router.reload();
  };

  return (
    <Container onClick={onClick} isMobile={isMobile}>
      <Img src={'icons/logo-dark.svg'} alt="Logo" width={137} height="100%" />
    </Container>
  );
};

export default NavBarLogo;

const Img = styled.img``;

const Container = styled.div<{ isMobile: boolean }>`
  cursor: pointer;
  position: absolute;
  padding: ${({ isMobile }) => (isMobile ? '40px 0 0px 0px' : '40px 0 0px 40px')};
  z-index: 3;
  display: flex;
  justify-content: center;
  align-items: center;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -o-user-select: none;
  user-select: none;
`;
