import { registerApi } from '@/apis/user';
import useToast from '@/hooks/use_toast';
import { ILoginReqData } from '@/types/user';
import { BaseState } from '@/utils/constants';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import styled from 'styled-components';
import bg from '@/assets/images/bg.jpg';

import styles from './register.module.scss';
import { Button, Form, Input } from 'antd';

// styled-components
const BgContainer = styled.div`
  background: center no-repeat;
  background-size: cover;
  background-image: url(${bg});
  width: 100vw;
  height: 100vh;
`;

export default function Register() {
  type IRegisterForm = ILoginReqData & {
    confirmPwd: string;
  };
  const navigate = useNavigate();
  const toast = useToast();

  const [isLoading, setLoading] = useState(false);

  const handleSubmit = async (form: IRegisterForm) => {
    const { email, password, confirmPwd } = form;
    if (password !== confirmPwd) {
      return toast.error('两次输入的密码不同');
    }
    setLoading(true);
    try {
      const reqData = {
        email,
        password,
        avatar: '',
      };
      const res = await registerApi(reqData);
      setLoading(false);
      if (res.code === BaseState.Success) {
        toast.success('注册成功');
        navigate('/login');
      } else {
        toast.error(res.msg);
      }
    } catch (err) {
      console.error('[pages/register]', err);
      setLoading(false);
      toast.error('注册失败');
    }
  };

  return (
    <BgContainer>
      <div
        className={`${styles.registerContainer} absolute top-[50%] left-[10%] w-100 translate-y-[-50%] px-7`}
      >
        <h1 className="my-5 text-3xl text-slate-700">欢迎注册</h1>
        <Form onFinish={handleSubmit}>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { max: 30, message: '邮箱最多 30 个字符' },
            ]}
          >
            <Input placeholder="请输入邮箱" maxLength={30} />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { max: 15, message: '密码最多 15 个字符' },
            ]}
          >
            <Input placeholder="请输入密码" maxLength={15} />
          </Form.Item>
          <Form.Item
            name="confirmPwd"
            rules={[
              { required: true, message: '请确认密码' },
              { max: 15, message: '密码最多 15 个字符' },
            ]}
          >
            <Input placeholder="请确认密码" maxLength={15} />
          </Form.Item>
          <Form.Item>
            <div className="flex items-center justify-center gap-5">
              <Button type="primary" loading={isLoading} htmlType="submit">
                注册
              </Button>
              <div className="">
                <Link to="/login">已有账号? 去登录</Link>
              </div>
            </div>
          </Form.Item>
        </Form>
      </div>
    </BgContainer>
  );
}
