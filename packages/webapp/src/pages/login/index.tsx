import React from 'react';
import { Button, Form, Input, message } from 'antd';
import styles from '~/pages/login/index.module.scss';
import { globalConfig } from '~/config';
import { login } from './service';
import { useNavigate } from 'react-router-dom';

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

export const Login: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    const r = await login(values);
    if (r.statusCode === 1) {
      message.success('登录成功');
      navigate('/');
    } else {
      message.error('登录失败');
    }
  };

  return (
    <div className={styles.loginRight}>
      <div style={{ width: '600px' }}>
        <div className={styles.loginTitle}>{globalConfig.header}</div>
        <Form onFinish={onFinish} autoComplete="off" layout="vertical">
          <Form.Item<FieldType> label="用户名" name="username" rules={[{ required: true, message: '请输入用户名!' }]}>
            <Input placeholder="请输入用户名" />
          </Form.Item>

          <Form.Item<FieldType> label="密码" name="password" rules={[{ required: true, message: '请输入密码!' }]}>
            <Input.Password placeholder="请输入密码" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
