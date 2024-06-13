import React from 'react';
import { App } from 'antd';
import { Outlet } from 'react-router-dom';

export const BasicLayout = () => {
  return (
    <App>
      <Outlet />
    </App>
  );
};
