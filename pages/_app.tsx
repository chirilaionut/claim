import 'bootstrap/dist/css/bootstrap-grid.min.css';
import 'antd/dist/antd.css';

import App from 'next/app';
import { END } from 'redux-saga';
import { PersistGate } from 'redux-persist/integration/react';
import { useStore } from 'react-redux';
import { wrapper } from '../redux/store';
import { appWithTranslation } from 'next-i18next';
import { BreakpointProvider } from '../hooks/breakpoints';
import { queries } from '../styles/breakpoints';
import { AppProps } from 'next/dist/next-server/lib/router/router';
import StyleProvider from '../components/StyleProvider';
import Head from '../components/Head';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const store: any = useStore();

  return (
    <PersistGate persistor={store.__persistor}>
      <StyleProvider>
        <Head />
        <BreakpointProvider queries={queries}>
          <Component {...pageProps} />
        </BreakpointProvider>
      </StyleProvider>
    </PersistGate>
  );
};

MyApp.getInitialProps = async (appContext) => {
  // const appProps = await App.getInitialProps(appContext)

  const appProps = {
    ...(App.getInitialProps ? await App.getInitialProps(appContext) : {}),
  };

  if (appContext.req) {
    appContext.store.dispatch(END);
    await appContext.store.sagaTask.toPromise();
  }
  return { ...appProps };
};

export default wrapper.withRedux(appWithTranslation(MyApp));
