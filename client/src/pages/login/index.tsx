import useToast from '@/hooks/use_toast';
import useTokenStore, { ITokenState } from '@/store/token';
import useUserInfoStore, { IUserInfo } from '@/store/user_info';
import { decrypt, encrypt, genRandStr } from '@/utils/crypt';
import { Button, Checkbox, Form, Input } from 'antd';
import { useEffect, useState } from 'react';
import { ILoginReqData } from './type';
import { Link, useNavigate } from 'react-router';
import { loginApi } from './api';
import { BaseState } from '@/utils/constants';
import styled from 'styled-components';
import bg from '@/assets/images/bg.jpg';

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
  const token_ = localStorage.getItem('');
  if (!userInfoStr || !token_) {
    return null;
  }
  const userInfo: IUserInfo = JSON.parse(await decrypt(userInfoStr));
  const token = await decrypt(token_);
  return { userInfo, token };
}

// styled-components
const BgContainer = styled.div`
  background: no-repeat center;
  background-size: cover;
  background-image: url(${bg});
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// styled-components
const LoginContainer = styled.div`
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
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
  const [modalMount, setModalMount] = useState(false);

  const handleFinish = async (form: ILoginForm) => {
    const { email, password } = form;
    const ret = await readLocal();
    if (ret && ret.userInfo.email === email) {
      // sessionStorage.setItem('token', res.token);
      // sessionStorage.setIte(JSON.stringify(res.userInfo))
      tokenStore.setToken(ret.token);
      userInfoStore.setUserInfo(ret.userInfo);
      toast.success('Login successful');
      return navigate('/');
    }

    setLoading(true);
    const params = { email, password };
    const res = await loginApi(params);
    if (res.code === BaseState.Success && res.data) {
      toast.success('Login successful');
      setLoading(false);
      const { token, userInfo } = res.data;
      tokenStore.setToken(token);
      userInfoStore.setUserInfo(userInfo);
      if (isRemember) {
        writeLocal(tokenStore, userInfo);
      }
      return navigate('/');
    }

    toast.error('Login failed');
    setLoading(false);
  };

  const handleRemember = () => {
    const newIsRemember = !isRemember;
    setRemember(newIsRemember); // 异步
    if (newIsRemember) {
      localStorage.setItem('isRemember', `${newIsRemember}`);
      localStorage.setItem('token', tokenStore.token);
      localStorage.setItem('userInfo', JSON.stringify(userInfoStore.getUserInfo()));
    } else {
      // localStorage.clear()
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
    }
  };

  const handleForgetModal = (doMount: boolean) => {
    setModalMount(doMount);
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
    <BgContainer>
      <LoginContainer className="z-10 w-100 px-5">
        <h1 className="my-3 text-3xl text-slate-50">Welcome</h1>
        <Form onFinish={handleFinish} form={loginForm}>
          <Form.Item name="email" rules={[{ required: true, message: 'Please enter your email' }]}>
            <Input placeholder="Please enter your email" maxLength={15} />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input placeholder="Please enter your password" maxLength={15} />
          </Form.Item>
          <Form.Item>
            <div className="flex cursor-pointer flex-row-reverse gap-5 text-slate-300">
              <div className="" onClick={() => handleForgetModal(true)}>
                Forget password
              </div>
              <Checkbox onChange={handleRemember} checked={isRemember}>
                <div className="text-slate-300">Remember me</div>
              </Checkbox>
            </div>
          </Form.Item>
          <Form.Item>
            <div className="flex items-center justify-center gap-5">
              <Button type="primary" loading={isLoading} htmlType="submit">
                Login
              </Button>
              <div className="">
                <Link to="/register">Register</Link>
              </div>
            </div>
          </Form.Item>
        </Form>

        {modalMount && (
          // todo: ForgetPwdModal
          <></>
        )}
      </LoginContainer>
    </BgContainer>
  );
};

export default Login;
