import type { MenuTheme } from 'antd';
export const BASE_URL = '';

export const globalConfig: {
  footer: string;
  header: string;
  collapsed: boolean;
  menuTheme: MenuTheme;
} = {
  collapsed: false,
  menuTheme: 'light',
  footer: '中资科技',
  header: '工资条信息通知',
};
