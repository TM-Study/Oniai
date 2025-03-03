import axios from "axios";
import { ProfileDTO } from "@/types/profileDTO";

// ユーザIDで異性のプロフィール一覧を取得
export const fetchProfileList = async(userId: number) =>{
  const token = localStorage.getItem('token');
  const response = await axios.post<ProfileDTO[]>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/get-profile-list`,
    userId,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    }
  );
  return response.data;
}