import { useEffect, useState } from 'react';

import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

function useStompClient() {
  const [stompClient, setStompClient] = useState<Client>();

  useEffect(() => {

    // STOMP Clientの作成
    const socket: WebSocket = new SockJS(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ws`);
    const client: Client = new Client({
      webSocketFactory: () => socket,
      // 自動再接続設定（ミリ秒）
      reconnectDelay: 5000,
      // 接続時処理
      onConnect: () => {
        console.log('Connected to STOMP broker');
      },
      // 切断時処理
      onDisconnect: () => {
        console.log('Disconnected from STOMP broker');
      },
      // ブローカーエラー時処理
      onStompError: function (frame) {
        console.log('Broker reported error: ' + frame.headers['message']);
        console.log('Additional details: ' + frame.body);
      }
    });

    // 通信の確立
    client.activate();

    setStompClient(client);

    return () => {
      if (client.connected) {
        client.deactivate();
      }
    };
  }, []);

  return { stompClient };
}

export default useStompClient;
