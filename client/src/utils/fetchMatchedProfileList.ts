import axios from "axios";
import { ProfileDTO } from "@/types/profileDTO";

// ユーザIDでマッチしているプロフィール一覧を取得
export const fetchMatchedProfileList = async(userId: number) => {
  const token = localStorage.getItem('token');
  const response = await axios.post<ProfileDTO[]>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/get-matched-profile-list`,
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