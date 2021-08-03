import React from 'react';
import { Drawer } from 'antd';
import styled from 'styled-components';
import { DrawerProps } from 'antd/es';

const TheDrawer = styled(Drawer)`
  pointer-events: initial;
`;

const CloseIcon = styled.img`
  outline: none;
  border: none;
  cursor: pointer;
  pointer-events: initial;
`;

interface TheDrawerWrapperProps {
  onClose: () => void;
  visible: boolean;
  children: React.ReactNode;
  placement?: string;
  width?: string;
  title?: React.ReactElement;
  bodyStyle?: React.CSSProperties;
  headerStyle?: React.CSSProperties;
  style?: React.CSSProperties;
}
export const TheDrawerWrapper = ({
  onClose,
  visible,
  placement = 'right',
  width = '100%',
  title,
  bodyStyle,
  headerStyle,
  children,
  style,
}: TheDrawerWrapperProps) => {
  return (
    <TheDrawer
      title={title}
      placement={placement as DrawerProps['placement']}
      closable
      onClose={onClose}
      visible={visible}
      key={placement}
      getContainer={false}
      mask
      maskClosable
      maskStyle={{ background: 'transparent', position: 'fixed' }}
      width={width}
      destroyOnClose={false}
      style={{ position: 'absolute', ...style }}
      bodyStyle={bodyStyle}
      headerStyle={headerStyle}
      closeIcon={<CloseIcon src="/icons/close-icon.svg" />}
    >
      {children}
    </TheDrawer>
  );
};
