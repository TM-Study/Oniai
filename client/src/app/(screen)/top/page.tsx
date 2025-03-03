'use client'

import { useState, useEffect, useCallback } from 'react';

// DTO
import { ProfileDTO } from '@/types/profileDTO';

// コンポーネント
import ProfileCards from '../_components/label/profileCards';

// カスタムフック・utils
import useAuthUser from '@/customHooks/useAuthUser';
import { fetchProfileList } from '@/utils/fetchProfileList';

const TopPage = () => {
  const {userId} = useAuthUser();
  const [profiles, setProfiles] = useState<ProfileDTO[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // プロファイル情報の取得
  const fetchProfiles = useCallback(async (userId: number) => {
    setLoading(true);
    setError(null);

    try {
      const fetchedProfiles: ProfileDTO[] = await fetchProfileList(userId);
      setProfiles(fetchedProfiles);
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
      <div className="mx-auto max-w-2xl p-8">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          <ProfileCards profiles = {profiles}/>
        </div>
      </div>
    </>
  );
};

export default TopPage;
