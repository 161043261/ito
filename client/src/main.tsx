import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/assets/styles/tailwind.css';
import '@/assets/styles/global.scss';

// i18n
import zhCN from 'antd/es/locale/zh_CN';
import { BrowserRouter } from 'react-router';
import { ConfigProvider } from 'antd';
import App from './App';

const container = document.getElementById('root') as HTMLDivElement;
const root = createRoot(container);

root.render(
  <StrictMode>
    <BrowserRouter>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#00b96b',
            borderRadius: 16,
          },
        }}
        locale={zhCN}
      >
        <App />
      </ConfigProvider>
    </BrowserRouter>
  </StrictMode>,
);
