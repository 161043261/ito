import { App } from 'antd';

export default function useToast() {
  const { message } = App.useApp();
  return (
    type: 'info' | 'success' | 'error' | 'warning' | 'loading',
    text: string,
    duration?: number,
  ) => {
    message[type](text, duration ?? 1.5);
  };
}
