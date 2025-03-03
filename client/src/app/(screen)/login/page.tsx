'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

// DTO
import { loginDTO } from '@/types/loginDTO';
import { accessTokenDTO } from '@/types/accessTokenDTO';

// コンポーネント
import Logo from '../_components/Images/Logo';
import Link from '../_components/link/Link';
import TextInputArea from '../_components/input/TextInputArea';
import ButtonArea from '../_components/button/ButtonArea';

const LoginPage = () => {
  const [loginData, setLoginData] = useState<loginDTO>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>();
  const router = useRouter();

  // ログインボタン押下時イベント関数
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post<accessTokenDTO>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/login`,
        loginData
      );

      const accessTokenDTO: accessTokenDTO = response.data;
      localStorage.setItem('token', accessTokenDTO.accessToken);
      router.push('/top');
    } catch {
      setError('*ユーザーが見つかりません。メールアドレスとパスワードを確認してください。');
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

        {/* ログインフォーム */}
        <form onSubmit={handleSubmit}>

          {/* メールアドレス入力エリア */}
          <TextInputArea
            title='メールアドレス'
            id='email'
            type='email'
            value={loginData?.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLoginData((prevState) => ({...prevState, email: e.target.value}))}
          />

          {/* パスワード入力エリア */}
          <TextInputArea
            title='パスワード'
            id='password'
            type='password'
            value={loginData?.password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLoginData((prevState) => ({...prevState, password: e.target.value}))}
          />

          {/* ログインボタンエリア */}
          <ButtonArea
            text='ログイン' 
            disabled={loading}
            errorMsg={error!}
          />
          
        </form>

        {/* 新規登録ページ遷移リンク */}
        <Link
          text='新規登録はこちら'
          href='/sign-up'
        />

      </div>
    </div>
    </>
  );
};

export default LoginPage;
