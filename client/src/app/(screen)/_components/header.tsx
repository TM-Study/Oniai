'use client'

import Link from 'next/link';
import Image from 'next/image';

import { useEffect } from 'react';

import useStompClient from '@/customHooks/useStompClient';
import useAuthUser from '@/customHooks/useAuthUser';

export default function Header() {
  const {userId} = useAuthUser();
  const {stompClient} = useStompClient();
  
  useEffect(() => {
    if (!stompClient?.connected || !userId) return;

    stompClient.subscribe(`/user/${userId}`, receivedMessage => {
      if (receivedMessage.body) {
        alert(receivedMessage.body);
      }
    }); 
  }, [stompClient?.connected, userId]);

  return (
    <header>
      <div className="flex justify-center">
        <Link href={{ pathname: '/top' }}>
          <Image
            src="/images/logo.jpg"
            alt="ロゴ"
            width={100}
            height={100}
          />
        </Link>
      </div>
      <nav className="p-4">
        <div className="mx-auto flex justify-between items-center">
          
          {/* 検索 */}
          <Link href={{ pathname: '/top' }} className="mx-auto flex justify-between items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </Link>

          {/* いいね */}
          <Link href={{ pathname: '/like-list' }} className="mx-auto flex justify-between items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          </Link>

          {/* トーク */}
          <Link href={{ pathname: '/talk-list' }} className="mx-auto flex justify-between items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
            </svg>
          </Link>

          {/* プロフィール */}
          <Link href={{ pathname: '/profile-details' }} className="mx-auto flex justify-between items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
          </Link>
        </div>
      </nav>
      <hr className="border-t-1 border-black" />
    </header>
  )
}
