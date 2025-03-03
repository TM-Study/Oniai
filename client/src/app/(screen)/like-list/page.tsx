'use client'

import { useState, useEffect, useCallback } from 'react';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

// コンポーネント
import PageTitle from '../_components/label/pageTitle';

// DTO
import { ProfileDTO } from '@/types/profileDTO';

// カスタムフック・utils
import useAuthUser from '@/customHooks/useAuthUser';
import { fetchLikedProfileList } from '@/utils/fetchLikedProfileList';

const LikeListPage = () => {
  const {userId} = useAuthUser();
  const [profiles, setProfiles] = useState<ProfileDTO[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // いいねを受け取ったユーザ情報一覧を取得
  const fetchLikedProfiles = useCallback(async (userId: number) => {
    setLoading(true);
    setError(null);
    try {
      const fetchedProfiles: ProfileDTO[] = await fetchLikedProfileList(userId);
      setProfiles(fetchedProfiles);
    } catch {
      setError('データの取得に失敗しました。');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchLikedProfiles(userId);
    }
  }, [userId]);

  if (loading) return <div>ロード中...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <PageTitle pageTitle="新着いいね"/>
      <div className="pb-4">
        <ul role="list">
          {profiles?.[0]?.userId ? 
            // 受け取ったいいねがある場合
            profiles?.map((profile) => (
              <Link key = {profile?.id} href = {{pathname: 'profile-details', query: {id: btoa(profile.userId!.toString())}}} className="group">
                <li key={profile.userId} >
                  <div className="flex p-4 gap-x-4 border border-gray-300 ">
                    {/* アイコン */}
                    {profile?.image ? (
                        <img
                        src={`data:image/jpeg;base64,${profile.image}`}
                        alt=""
                        className="size-full w-14 h-14 flex rounded-full"
                        />
                    ) : (
                        <UserCircleIcon className='w-40 h-40'/>
                    )}
                    {/* 名前・年齢・居住地 */}
                    <div className='flex-auto'>
                      <p className="text-sm/6 font-semibold text-gray-900">{profile.name}</p>
                      <p className="mt-1 truncate text-xs/5 text-gray-500">{profile.age}歳 {profile.residence}</p>
                    </div>
                  </div>
                </li>
              </Link>
            )):
            // 受け取ったいいねがない場合
            <li key="">
              <div className="flex justify-center p-4 gap-x-4 border border-gray-300 ">
                受け取った新着の「いいね！」はありません
              </div>
            </li>
          }
        </ul>
      </div>
    </>
  );
};

export default LikeListPage;
