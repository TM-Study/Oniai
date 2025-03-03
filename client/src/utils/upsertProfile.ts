import axios from "axios";
import { ProfileDTO } from "@/types/profileDTO";

// プロフィール情報をupsert
export const upsertProfile = async(userId: number, profile: ProfileDTO) => {
  const token = localStorage.getItem('token');
  const response = await axios.post<ProfileDTO>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/profile-setting`,
    { userId, profile },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    }
  );
  return response.data;
}