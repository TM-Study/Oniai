'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import StatusCodes from 'http-status-codes';

// DTO
import { ProfileDTO } from '@/types/profileDTO';
import { signUpDTO } from '@/types/signUpDTO';
import { accessTokenDTO } from '@/types/accessTokenDTO';
import { loginDTO } from '@/types/loginDTO';

// コンポーネント
import Logo from '../_components/Images/Logo';
import TextInput from '../_components/input/TextInputArea';
import ButtonArea from '../_components/button/ButtonArea';
import SexSelectionArea from '../_components/input/SexSelectionArea';

const SignUpPage = () => {
  const [signUpData, setSignUpData] = useState<signUpDTO>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>();
  const router = useRouter();

  // 登録ボタン押下時イベント関数
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.post<ProfileDTO>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/sign-up`,
        signUpData
      );

      // 新規登録後、ログインした状態でトップ画面に遷移
      const loginData: loginDTO ={
        email: signUpData?.email,
        password: signUpData?.password
      }
      const response = await axios.post<accessTokenDTO>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/login`,
        loginData
      );
      const accessTokenDTO: accessTokenDTO = response.data;
      localStorage.setItem('token', accessTokenDTO.accessToken);

      alert("登録に成功しました!");
      router.push('/top');
    } catch (e) {
      if (axios.isAxiosError(e) && e?.response?.status == StatusCodes.CONFLICT) {
        setError('*このメールアドレスは既に登録されています。');
      }else{
        setError('*登録に失敗しました。');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-8 lg:px-8">

      {/* ロゴ */}
      <Logo/>

      <div className="sm:mx-auto sm:w-full sm:max-w-sm">

        {/* 登録フォーム */}
        <form onSubmit={handleSubmit}>

          {/* 氏名入力エリア */}
          <TextInput
            title='氏名'
            caption='※他のユーザーには公開されません'
            id='name'
            type='text'
            value={signUpData?.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSignUpData((prevState) => ({...prevState, name: e.target.value}))}
          />

          {/* 性別セレクトエリア */}
          <SexSelectionArea
            value={signUpData?.sex}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSignUpData((prevState) => ({...prevState, sex: e.target.value}))}
          />

          {/* メールアドレス入力エリア */}
          <TextInput
            title='メールアドレス'
            id='email'
            type='email'
            value={signUpData?.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSignUpData((prevState) => ({...prevState, email: e.target.value}))}
          />

          {/* パスワード入力エリア */}
          <TextInput
            title='パスワード'
            id='password'
            type='password'
            value={signUpData?.password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSignUpData((prevState) => ({...prevState, password: e.target.value}))}
          />

          {/* 登録ボタンエリア */}
          <ButtonArea
            text='登録'
            disabled={loading}
            errorMsg={error!}
          />

        </form>
      </div>
    </div>
    </>
  );
};

export default SignUpPage;
