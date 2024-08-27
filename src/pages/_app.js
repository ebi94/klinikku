import Head from 'next/head';
import { Router } from 'next/router';
import { store } from 'src/store';
import { Provider } from 'react-redux';
import NProgress from 'nprogress';
import { CacheProvider } from '@emotion/react';
import 'src/configs/i18n';
import { defaultACLObj } from 'src/configs/acl';
import themeConfig from 'src/configs/themeConfig';
import 'src/@fake-db';
import { Toaster } from 'react-hot-toast';
import UserLayout from 'src/layouts/UserLayout';
import AclGuard from 'src/@core/components/auth/AclGuard';
import ThemeComponent from 'src/@core/theme/ThemeComponent';
import AuthGuard from 'src/@core/components/auth/AuthGuard';
import GuestGuard from 'src/@core/components/auth/GuestGuard';
import Spinner from 'src/@core/components/spinner';
import { AuthProvider } from 'src/context/AuthContext';
import { SettingsConsumer, SettingsProvider } from 'src/@core/context/settingsContext';
import ReactHotToast from 'src/@core/styles/libs/react-hot-toast';
import { createEmotionCache } from 'src/@core/utils/create-emotion-cache';
import useBgColor from 'src/@core/hooks/useBgColor';
import { lighten, useTheme } from '@mui/material/styles';
import 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'react-perfect-scrollbar/dist/css/styles.css';
import 'src/iconify-bundle/icons-bundle-react';
import '../../styles/globals.css';

const clientSideEmotionCache = createEmotionCache();

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start();
  });
  Router.events.on('routeChangeError', () => {
    NProgress.done();
  });
  Router.events.on('routeChangeComplete', () => {
    NProgress.done();
  });
}

const Guard = ({ children, authGuard, guestGuard }) => {
  if (guestGuard) {
    return <GuestGuard fallback={<Spinner />}>{children}</GuestGuard>;
  } else if (!guestGuard && !authGuard) {
    return <>{children}</>;
  } else {
    return <AuthGuard fallback={<Spinner />}>{children}</AuthGuard>;
  }
};

// ** Configure JSS & ClassName
const App = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const bgColors = useBgColor();

  // Variables
  const contentHeightFixed = Component.contentHeightFixed ?? false;

  const getLayout =
    Component.getLayout ??
    ((page) => <UserLayout contentHeightFixed={contentHeightFixed}>{page}</UserLayout>);
  const setConfig = Component.setConfig ?? undefined;
  const authGuard = Component.authGuard ?? true;
  const guestGuard = Component.guestGuard ?? false;
  const aclAbilities = Component.acl ?? defaultACLObj;

  return (
    <Provider store={store}>
      <CacheProvider value={emotionCache}>
        <Head>
          <title>{`${themeConfig.templateName} - Backoffice`}</title>
          <meta name="description" content={`${themeConfig.templateName} – Backoffice`} />
          <meta name="keywords" content={`${themeConfig.templateName} – Backoffice`} />
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>

        <AuthProvider>
          <SettingsProvider {...(setConfig ? { pageSettings: setConfig() } : {})}>
            <SettingsConsumer>
              {({ settings }) => {
                return (
                  <ThemeComponent settings={settings}>
                    <Guard authGuard={authGuard} guestGuard={guestGuard}>
                      <AclGuard
                        aclAbilities={aclAbilities}
                        guestGuard={guestGuard}
                        authGuard={authGuard}>
                        {getLayout(<Component {...pageProps} />)}
                      </AclGuard>
                    </Guard>
                    <ReactHotToast>
                      <Toaster
                        position={settings.toastPosition}
                        toastOptions={{
                          className: 'react-hot-toast',
                          success: {
                            style: {
                              color: bgColors.successLight.color,
                              background: lighten(bgColors.successFilled.backgroundColor, 0.88)
                            }
                          },
                          error: {
                            style: {
                              color: bgColors.errorLight.color,
                              background: lighten(bgColors.errorFilled.backgroundColor, 0.88)
                            }
                          }
                        }}
                      />
                    </ReactHotToast>
                  </ThemeComponent>
                );
              }}
            </SettingsConsumer>
          </SettingsProvider>
        </AuthProvider>
      </CacheProvider>
    </Provider>
  );
};

export default App;
