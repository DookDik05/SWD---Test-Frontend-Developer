'use client';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { ConfigProvider } from 'antd';
import '@/i18n';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#6EDA78',
            borderRadius: 8,
            fontFamily: 'Sarabun, Inter, sans-serif',
          },
          components: {
            Button: {
              colorPrimary: '#6EDA78',
              algorithm: true,
            },
            Card: {
              borderRadiusLG: 12,
            }
          }
        }}
      >
        {children}
      </ConfigProvider>
    </Provider>
  );
}
