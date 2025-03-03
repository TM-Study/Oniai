import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

function useAuthUser() {
  const [userId, setUserId] = useState<number>();
  const router = useRouter();

  const authUser = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.get<number>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth`, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );

      setUserId(response.data);
    } catch {
      router.push('/404');
    }
  };

  useEffect(() => {
    authUser();
  }, []);

  return { userId };
}

export default useAuthUser;
