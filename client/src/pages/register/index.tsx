import useToast from '@/hooks/use_toast';
import { ILoginReqData } from '@/types/user';
import { genBase64Img } from '@/utils/img';
import { useState } from 'react';
import { useNavigate } from 'react-router';

export default function Register() {
  type IRegisterForm = ILoginReqData & {
    confirmPwd: string
  }
  const navigate = useNavigate();
  const toast = useToast();

  const [isLoading, setLoading] = useState(false);

  const handleSubmit = async (form: IRegisterForm) => {
    const { email, password, confirmPwd } = form
    if (password !== confirmPwd) {
      return toast.error('两次密码不同')
    }
    setLoading(true);
    try {
      const params = {
        email,
        password,
        avatar: genBase64Img()
      };
      const res = registerApi(params);
    }
  }
  return (<div>


  </div>);
}
