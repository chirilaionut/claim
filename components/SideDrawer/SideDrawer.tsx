import { Drawer } from 'antd';
import styled from 'styled-components';
import { defaultColors } from '../../styles/theme';

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
  style?: React.CSSProperties;
}
const SideDrawer = ({ onClose, visible, width = '100%', children }: TheDrawerWrapperProps) => {
  return (
    <Drawer
      placement="right"
      closable
      onClose={onClose}
      visible={visible}
      getContainer={false}
      mask
      maskClosable
      maskStyle={{ background: 'transparent', position: 'fixed' }}
      width={width}
      destroyOnClose={false}
      style={{ position: 'absolute' }}
      bodyStyle={bodyStyle}
      headerStyle={headerStyle}
      closeIcon={<CloseIcon src="/icons/close-icon.svg" />}
    >
      {children}
    </Drawer>
  );
};
export default SideDrawer;

const bodyStyle: React.CSSProperties = {
  background: defaultColors.primary,
  paddingTop: 20,
  justifyContent: 'flex-start',
  display: 'flex',
  flexDirection: 'column',
};

const headerStyle = {
  background: 'white',
  border: 'none',
};
