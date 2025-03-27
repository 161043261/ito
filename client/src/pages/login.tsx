import useToast from '@/hooks/use_toast';
import useTokenStore, { ITokenState } from '@/store/token';
import useUserInfoStore from '@/store/user_info';
import { decrypt, encrypt, genRandStr } from '@/utils/crypt';
import { Button, Checkbox, Form, Input } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { loginApi } from '@/apis/user';
import { BaseState } from '@/utils/constants';
import styled from 'styled-components';
import bg from '@/assets/images/bg.jpg';
import { IUserInfo, ILoginReqData } from '@/types/user';

import styles from './login.module.scss';

// styled-components
const Background = styled.div`
  background: center no-repeat;
  background-size: cover;
  background-image: url(${bg});
  width: 100vw;
  height: 100vh;
`;

const Login: React.FC = () => {
  type ILoginForm = ILoginReqData;

  const tokenStore = useTokenStore();
  const userInfoStore = useUserInfoStore();

  const navigate = useNavigate();
  const toast = useToast();

  const [isLoading, setLoading] = useState(false);
  const [isRemember, setRemember] = useState(false);
  const [loginForm] = Form.useForm<ILoginForm>();
  const [mountModal, setMountModal] = useState(false);

  async function writeLocal(tokenStore: ITokenState, userInfo: IUserInfo) {
    const userInfoStr = await encrypt(JSON.stringify(userInfo));
    const { token: token_ } = tokenStore;
    const token = await encrypt(token_ ?? sessionStorage.getItem('token'));
    if (userInfoStr && token) {
      localStorage.setItem('userInfo', userInfoStr);
      localStorage.setItem('token', token);
    }
  }

  async function readLocal() {
    const userInfoStr = localStorage.getItem('userInfo');
    const token_ = localStorage.getItem('token');
    if (!userInfoStr || !token_) {
      return;
    }
    const userInfo: IUserInfo = JSON.parse(await decrypt(userInfoStr));
    const token = await decrypt(token_);
    return { userInfo, token };
  }

  const handleSubmit = async (form: ILoginForm) => {
    const { email, password } = form;
    const ret = await readLocal();
    if (ret && ret.userInfo.email === email) {
      // sessionStorage.setItem('token', res.token);
      // sessionStorage.setIte(JSON.stringify(res.userInfo))
      tokenStore.setToken(ret.token);
      userInfoStore.setUserInfo(ret.userInfo);
      toast.success('登录成功');
      return navigate('/');
    }

    setLoading(true);
    const reqData = { email, password };
    const res = await loginApi(reqData);
    if (res.code === BaseState.Success && res.data) {
      toast.success('登录成功');
      setLoading(false);
      const { token, userInfo } = res.data;
      tokenStore.setToken(token);
      userInfoStore.setUserInfo(userInfo);
      if (isRemember) {
        writeLocal(tokenStore, userInfo);
      }
      return navigate('/');
    }

    toast.error('登录失败, 请重试');
    setLoading(false);
  };

  const handleRemember = () => {
    const newIsRemember = !isRemember;
    setRemember(newIsRemember); // 异步
    if (newIsRemember) {
      localStorage.setItem('isRemember', `${newIsRemember}`);
      localStorage.setItem('token', tokenStore.token);
      localStorage.setItem('userInfo', JSON.stringify(userInfoStore.userInfo));
    } else {
      // localStorage.clear()
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
    }
  };

  const handleMountModal = (doMount: boolean) => {
    setMountModal(doMount);
  };

  useEffect(
    () => {
      readLocal().then((val) => {
        if (val) {
          loginForm.setFieldsValue({
            email: val.userInfo.email,
            password: genRandStr(),
          });
          setRemember(true);
        } else {
          setRemember(false);
        }
      });
    },
    [] /** onMounted */,
  );

  return (
    <Background>
      <div
        className={`${styles.loginContainer} absolute top-[50%] left-[10%] w-100 translate-y-[-50%] px-7`}
      >
        <h1 className="my-5 text-3xl text-slate-700">欢迎登录</h1>
        <Form onFinish={handleSubmit} form={loginForm}>
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
          <Form.Item>
            <div className="flex cursor-pointer flex-row-reverse gap-5 text-slate-700">
              <div className="" onClick={() => handleMountModal(true)}>
                忘记密码
              </div>
              <Checkbox onChange={handleRemember} checked={isRemember}>
                <div className="text-slate-700">记住密码</div>
              </Checkbox>
            </div>
          </Form.Item>
          <Form.Item>
            <div className="flex items-center justify-center gap-5">
              <Button type="primary" loading={isLoading} htmlType="submit">
                登录
              </Button>
              <div className="">
                <Link to="/register">没有账号? 去注册</Link>
              </div>
            </div>
          </Form.Item>
        </Form>

        {mountModal && (
          // todo: ForgetPwdModal
          <></>
        )}
      </div>
    </Background>
  );
};

export default Login;
