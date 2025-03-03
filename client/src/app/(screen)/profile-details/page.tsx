'use client'

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserCircleIcon } from '@heroicons/react/24/outline';

// DTO
import { ProfileDTO } from '@/types/profileDTO';
import { MessageDTO } from '@/types/messageDTO';

// コンポーネント
import PageTitle from '../_components/label/pageTitle';

// カスタムフック・utils
import useAuthUser from '@/customHooks/useAuthUser';
import useStompClient from '@/customHooks/useStompClient';
import { fetchProfile } from '@/utils/fetchProfile';
import { fetchMatchedProfileList } from '@/utils/fetchMatchedProfileList';

const ProfileDetails = () =>{
  const {userId} = useAuthUser();
  const {stompClient} = useStompClient();
  const [profile, setProfile] = useState<ProfileDTO>();
  const [editable, setEditable] = useState<boolean>(false);
  const [matched, setMatched] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const query = useSearchParams();
  const router = useRouter();

  // 戻るボタン押下時イベント
  const handleReturnButtonClick = useCallback(() => {
    router.push(`/top`);
  }, [router])

  // いいねボタン押下時イベント
  const handleLikeButtonClick = useCallback(async() => {

    // プロフィールを設定していない場合
    const fetchedProfile: ProfileDTO = await fetchProfile(userId!);
    if(!fetchedProfile.userId){
      alert("プロフィールを設定しないと「いいね！」を送れません");
      return ;
    }

    // いいね送信処理
    if(stompClient?.connected){
      const sendMessage: MessageDTO = {
        senderUserId: userId!,
        recipientUserId: profile?.userId,
        content: ""
      }
      stompClient.publish({destination: "/app/send/like", body: JSON.stringify(sendMessage)});
      alert("「いいね！」を送りました");
    }
  }, [userId, profile, stompClient]);

  // プロフィール詳細情報を取得
  const fetchProfilesByUserId = useCallback(async (userId: number) => {
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

  // マッチしているかの判定
  const setIsMatched = useCallback(async(userId: number, profile: ProfileDTO)=>{
    setLoading(true);
    setError(null);
    try {
      const fetchedProfile: ProfileDTO[] = await fetchMatchedProfileList(userId);
      fetchedProfile.forEach(e => {
        if (e.userId == profile?.userId){
          setMatched(true);
        }
      });
    } catch {
      setError('データの取得に失敗しました。');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      const userIdFromQuery = query.get('id'); // クエリパラメータからidを取得
      if (userIdFromQuery) {
        // 他ユーザのプロフィール詳細画面となる場合
        setEditable(false);
        const decodedUserId: number = Number(atob(userIdFromQuery)); // base64でコード
        fetchProfilesByUserId(decodedUserId);
      } else {
        // 自分のプロフィール詳細画面となる場合
        setEditable(true);
        fetchProfilesByUserId(userId);
      }
      setIsMatched(userId, profile!);
    }
  }, [query, userId]);

  if (loading) return <div>ロード中...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
    {editable ? <PageTitle pageTitle="Myプロフィール"/> : ""}
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-8 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">

        {/* 写真 */}
        <div className="flex justify-center">
          {profile?.image ? (
              <img
                src={`data:image/jpeg;base64,${profile.image}`}
                alt=""
                className="aspect-square w-40 h-40 rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-[7/8]"
              />
          ) : (
              <UserCircleIcon className='w-40 h-40'/>
          )}
        </div>

        {/* 名前・年齢・居住地 */}
        <h3 className="mt-4 text-lg font-medium text-gray-700 flex flex-col justify-center items-center">
          {profile?.name ? profile?.name : "ニックネーム未設定"}
          <span className="mt-1 text-sm text-gray-900">{profile?.age ? `${profile?.age}歳` : ""} {profile?.residence ? profile?.residence : ""}</span>
        </h3>

        {/* 自由記述欄 */}
        <div className='flex-col my-10'>
            <div className="m-2 font-bold">【自己紹介】</div>
            <div className="my-2 border-t border-gray-400"></div>
            {profile?.freeDescription ? profile.freeDescription?.split('\n').map((line, idx) => (
              <span key={idx}>
                {line}
                <br />
              </span>
            )) : "未設定"}
        </div>
        
        {/* 戻るボタン・いいねボタン */}
        {(editable || matched) ? "":(
          <div className="mt-4 flex justify-center  space-x-6">
            {/* スキップボタン */}
            <button onClick={handleReturnButtonClick} className="bg-gray-400 text-white p-4 rounded-full flex items-center justify-center hover:bg-gray-600 transition duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
              </svg>
            </button>

            {/* いいねボタン */}
            <button onClick={handleLikeButtonClick} className="bg-rose-400 text-white p-4 rounded-full flex items-center justify-center hover:bg-rose-600 transition duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
            </button>
          </div>
        )}

        {/* 編集ボタン */}
        {editable && (
          <Link
            href={{ pathname: '/profile-setting'}}
            className="mt-4 flex w-full justify-center rounded-md px-3 py-1.5 text-sm/6 font-semibold text-black shadow-sm border border-black hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            編集
          </Link>
        )}

      </div>
    </div>
    </>
  );
}

const ProfileDetailsPage = () => {
  return (
    <Suspense fallback={<div>読み込み中...</div>}>
      <ProfileDetails />
    </Suspense>
  );
};

export default ProfileDetailsPage;