import axios from "axios";
import { MessageDTO } from "@/types/messageDTO";

// メッセージ一覧を取得
export const fetchMessageList = async(senderUserId: number, recipientUserId: number) => {
  const token = localStorage.getItem('token');
  const response = await axios.post<MessageDTO[]>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/get-message-list`,
    { senderUserId, recipientUserId },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    }
  );
  return response.data;
}