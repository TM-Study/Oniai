'use client'

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * ルートページ
 */
const RootPage = () => {
  const router = useRouter();
  useEffect(() =>{router.push('/login')}, [router]);
  return <></>
};

export default RootPage;
