'use client'

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// DTO
import { ProfileDTO } from '@/types/profileDTO';

// コンポーネント
import ImageUpload from '../_components/input/ImageUpload';
import ResidenceSelection from '../_components/input/ResidenceSelection';
import ButtonArea from '../_components/button/ButtonArea';
import TextInput from '../_components/input/TextInputArea';
import PageTitle from '../_components/label/pageTitle';
import TextArea from '../_components/input/TextArea';

// カスタムフック・utils
import useAuthUser from '@/customHooks/useAuthUser';
import { fetchProfile } from '@/utils/fetchProfile';
import { upsertProfile } from '@/utils/upsertProfile';

const ProfileSettingPage = () => {
  const {userId} = useAuthUser();
  const [profile, setProfile] = useState<ProfileDTO>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // 保存ボタン押下時処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if(userId == undefined || profile== undefined) return;

    try {
      const upsertedProfile: ProfileDTO = await upsertProfile(userId, profile);
      setProfile(upsertedProfile);
      router.push('/profile-details');
    } catch {
      setError('*プロフィールの保存に失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  // ユーザ情報を取得
  const fetchProfiles = useCallback(async (userId: number) => {
    setLoading(true);
    setError(null);
    try {
      const fetchedProfile: ProfileDTO = await fetchProfile(userId);
      setProfile(fetchedProfile);
    } catch {
      setError('データの取得に失敗しました。');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchProfiles(userId);
    }
  }, [userId]);

  if (loading) return <div>ロード中...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
    <PageTitle pageTitle="プロフィール編集"/>
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-8 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">

        <form onSubmit={handleSubmit}>

          {/* 写真 */}
          <ImageUpload
            value={profile?.image}
            onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setProfile(prev => ({
                      ...prev,
                      image: reader.result
                    }));
                  };
                  reader.readAsDataURL(file);
                }
              }
            }
          />

          {/* ニックネーム */}
          <TextInput
            title='ニックネーム'
            id='name'
            type='text'
            value={profile?.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfile((prevState) => ({...prevState, name: e.target.value}))}
          />

          {/* 年齢 */}
          <TextInput
            title='年齢'
            id='age'
            type='number'
            value={profile?.age}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfile((prevState) => ({...prevState, age: Number(e.target.value)}))}
          />

          {/* 居住地 */}
          <ResidenceSelection
            value={profile?.residence}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setProfile((prevState) => ({...prevState, residence: e.target.value}))}
          />

          {/* 自由記述欄 */}
          <TextArea
            title='自己紹介'
            id='freeDescription'
            value={profile?.freeDescription}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setProfile((prevState) => ({...prevState, freeDescription: e.target.value}))}
          />

          {/* 保存ボタン */}
          <ButtonArea
            text='保存'
            disabled={loading}
            errorMsg={error!}
          />
        </form>

      </div>
    </div>
    </>
  );
}

export default ProfileSettingPage;