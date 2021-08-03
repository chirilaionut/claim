import { notification } from 'antd';
import SwapNotify from '../components/SwapNotify';

const error = (msg: string, duration = 0, title?: string, animationText?: string) => {
  notification.open({
    message: '',
    className: 'swap-notify',
    description: (
      <SwapNotify
        title={title || 'Warning'}
        msg={msg}
        isError={true}
        animationText={animationText}
      />
    ),
    duration, // 0 will make it persistent
  });
};
const success = (
  msg: string,
  duration = 0,
  title?: string,
  animationText?: string,
  linkText?: string,
  linkHref?: string
) => {
  notification.open({
    message: '',
    className: 'swap-notify',
    description: (
      <SwapNotify
        title={title || 'Success'}
        msg={msg}
        animationText={animationText || null}
        withLink={!!linkText}
        linkHref={linkHref}
        linkText={linkText}
      />
    ),
    duration, // 0 will make it persistent
  });
};

const notify = { error, success };
export default notify;
