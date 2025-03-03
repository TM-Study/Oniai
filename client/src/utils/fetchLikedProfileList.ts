import axios from "axios";
import { ProfileDTO } from "@/types/profileDTO";

// ユーザIDで当該プロフィール情報を取得
export const fetchLikedProfileList = async(userId: number) => {
  const token = localStorage.getItem('token');
  const response = await axios.post<ProfileDTO[]>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/get-liked-profile-list`,
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