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
import '@ant-design/v5-patch-for-react-19';

// localStorage.removeItem('userInfo');
// localStorage.removeItem('token');
// localStorage.removeItem('isRemember');

const container = document.getElementById('root') as HTMLDivElement;
const root = createRoot(container);

root.render(
  <StrictMode>
    <BrowserRouter>
      {/* 注册全局样式 */}
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#4EA4DC',
            borderRadius: 16,
          },
          components: {
            Tree: { indentSize: 0 },
          },
        }}
        locale={zhCN}
      >
        <App />
      </ConfigProvider>
    </BrowserRouter>
  </StrictMode>,
);
