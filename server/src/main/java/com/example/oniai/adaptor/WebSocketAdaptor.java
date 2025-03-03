package com.example.oniai.adaptor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;

import com.example.oniai.apps.CommonService;
import com.example.oniai.domain.model.DTO.MessageDTO;
import com.example.oniai.domain.model.entity.Message;

@RestController
public class WebSocketAdaptor {

    @Autowired
    private CommonService service;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    /**
     * いいね送信
     * @param message
     */
    @MessageMapping("/send/like")
	public void sendLike(@Payload MessageDTO message) {
        // いいね管理TBLを更新
        service.upsertLike(message.getSenderUserId(), message.getRecipientUserId());
        
        // 特定のクライアントにいいねが送られたことをブロードキャスト
        String senderName = service.getProfileByUserId(message.getSenderUserId()).getName();
        messagingTemplate.convertAndSend("/user/" + message.getRecipientUserId(), senderName + "さんからいいねが届きました!");
	}

    /**
     * メッセージ送信
     * @param message
     */
    @MessageMapping("/send/message")
	public void sendMessage(@Payload MessageDTO message) {
        // トークの永続化
        Message receivedMessage = Message.builder()
            .senderUserId(message.getSenderUserId())
            .recipientUserId(message.getRecipientUserId())
            .content(message.getContent())
            .build();
        service.upsertMessage(receivedMessage);
        messagingTemplate.convertAndSend("/message/" + message.getRecipientUserId() + "/" + message.getSenderUserId(), message.getContent());
	}
}


