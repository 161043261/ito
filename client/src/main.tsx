import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import zhCN from 'antd/es/locale/zh_CN';
import { BrowserRouter } from 'react-router';
import { ConfigProvider } from 'antd';
import App from './App';
//! tailwindcss
import '@/assets/styles/tailwind.css';
//! global.scss
import '@/assets/styles/global.scss';

const container = document.getElementById('root') as HTMLDivElement;
const root = createRoot(container);

root.render(
  <StrictMode>
    <BrowserRouter>
      {/* 注册全局样式 */}
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#8bc34a',
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
