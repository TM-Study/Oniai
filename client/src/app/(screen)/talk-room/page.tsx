'use client'

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { UserCircleIcon } from '@heroicons/react/16/solid';

// DTO
import { ProfileDTO } from '@/types/profileDTO';
import { MessageDTO } from '@/types/messageDTO';

// コンポーネント
import SmallButtonArea from '../_components/button/SsmallButtonArea';
import TextArea from '../_components/input/TextArea';

// カスタムフック・utils
import useAuthUser from '@/customHooks/useAuthUser';
import useStompClient from '@/customHooks/useStompClient';
import { fetchProfile } from '@/utils/fetchProfile';
import { fetchMessageList } from '@/utils/fetchMessageList';

const TalkRoom = () => {
  const {userId} = useAuthUser();
  const {stompClient} = useStompClient();
  const [profile, setProfile] = useState<ProfileDTO | null>(null);
  const [messages, setMessages] = useState<MessageDTO[] | null>(null);
  const [message, setMessage] = useState<MessageDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const query = useSearchParams();

  // 送信ボタン押下自イベント
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!stompClient?.connected || !userId || !profile || !message?.content?.trim()) return;

    const sendMessage: MessageDTO = {
      senderUserId: userId,
      recipientUserId: profile?.userId,
      content: message?.content
    }

    stompClient.publish({destination: "/app/send/message", body: JSON.stringify(sendMessage)});

    setMessages(prevMessages => {
      return prevMessages ? [...prevMessages, sendMessage] : [sendMessage];
    });
    setMessage(null);
  }

  // プロフィール情報を取得
  const fetchProfileByUserId = useCallback(async (userId: number) => {
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

  // トーク履歴を取得
  const fetchTalk = useCallback(async (senderUserId: number, recipientUserId: number) => {
    setLoading(true);
    setError(null);
    try {
      const fetchedMessages: MessageDTO[] = await fetchMessageList(senderUserId, recipientUserId);
      setMessages(fetchedMessages);
    } catch {
      setError('データの取得に失敗しました。');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // クエリパラメータからトーク相手のIdを取得
    const profileIdFromQuery = query.get('id');

    // トーク相手と自分のIdがそろっていない場合return
    if (!profileIdFromQuery || !userId) return;

    const decodedProfileId: number = Number(atob(profileIdFromQuery));

    // ソケット通信のサブスクライブ
    if (stompClient?.connected) {
      const messageSubscription = stompClient.subscribe(`/message/${userId}/${decodedProfileId}`, receivedMessage => {
        if (receivedMessage.body) {
          const receivedMessageObj: MessageDTO = {
            senderUserId: decodedProfileId,
            recipientUserId: userId,
            content: receivedMessage.body
          }
          setMessages((prevMessages) => [
            ...(prevMessages ?? []),
            receivedMessageObj,
          ]);
        }
      });
      // クリーンアップ処理: コンポーネントがアンマウントされた場合にサブスクライブを解除
      return () => messageSubscription.unsubscribe();
    }

    // トーク相手のユーザ情報を取得
    fetchProfileByUserId(decodedProfileId);

    // トーク履歴を取得
    fetchTalk(userId, decodedProfileId);

  }, [query, userId, stompClient?.connected]);
  
  if (loading) return <div>ロード中...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>

    {/* トーク相手のプロフィール情報 */}
    <Link key = {profile?.id} href = {{pathname: 'profile-details', query: {id: btoa(profile?.userId?.toString() ? profile?.userId.toString() : "")}}} className="group">
      
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
            <p className="text-sm/6 font-semibold text-gray-900">{profile?.name}</p>
            <p className="mt-1 truncate text-xs/5 text-gray-500">{profile?.age}歳 {profile?.residence}</p>
          </div>
        </div>

    </Link>

    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-8 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">

        {/* トーク内容 */}
        {messages?.map((message, index) => (
          message.senderUserId == userId ? 
              <div key={index} className="p-1 flex justify-end">
                <div className="bg-blue-500 text-white p-3 rounded-lg max-w-xs">
                  {message.content?.split('\n').map((line, idx) => (
                    <span key={idx}>
                      {line}
                      <br />
                    </span>
                  ))}
                </div>
              </div>
          : 
            <div key={index} className="p-1 flex justify-start">
              <div className="text-black p-3 rounded-lg max-w-xs border-2  border-solid border-gray-400">
                {message.content}
              </div>
            </div>
        ))}

        {/* メッセージ入力エリア */}
        <form onSubmit={handleSubmit}>
          <div className="flex justify-end w-full place-items-stretch space-x-2">

            {/* テキストエリア */}
            <TextArea
              title=''
              id='message'
              value={message?.content}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage((prevState) => ({...prevState, content: e.target.value}))}
            />
          
            {/* 送信ボタン */}
            <SmallButtonArea
              text='送信'
              disabled={loading}
              errorMsg={error!}
            />
          </div>
        </form>

      </div>
    </div>
    </>
  );
}

const TalkRoomPage = () => {
  return (
    <Suspense fallback={<div>読み込み中...</div>}>
      <TalkRoom />
    </Suspense>
  );
};

export default TalkRoomPage;
