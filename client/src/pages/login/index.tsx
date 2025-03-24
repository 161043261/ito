import useTokenStore, { ITokenState } from '@/store/token';
import { IUserInfo } from '@/store/user_info';
import { decrypt, encrypt } from '@/utils/crypt';

async function storePwd(tokenStore: ITokenState, userInfo: IUserInfo) {
  const userInfoStr = await encrypt(JSON.stringify(userInfo));
  const { token: token_ } = tokenStore;
  const token = await encrypt(token_ ?? sessionStorage.getItem('token'));
  if (userInfoStr && token) {
    localStorage.setItem('userInfo', userInfoStr);
    localStorage.setItem('token', token);
  }
}

async function getLocalUserInfo() {
  const userInfoStr = localStorage.getItem('userInfo');
  const token_ = localStorage.getItem('');
  if (!userInfoStr || !token_) {
    return null;
  }
  const userInfo = JSON.parse(await decrypt(userInfoStr));
  const token = decrypt(token_);
  return { userInfo, token };
}

const Login: React.FC = () => {
  const tokenStore = useTokenStore();

  return <div>Login</div>;
};

export default Login;
