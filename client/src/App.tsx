import { App as AntdApp } from 'antd';
import RouterPage from './router';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
`;

export default function App() {
  return (
    <AntdApp>
      {/* 注册全局样式 */}
      <GlobalStyle />
      <RouterPage />
    </AntdApp>
  );
}
