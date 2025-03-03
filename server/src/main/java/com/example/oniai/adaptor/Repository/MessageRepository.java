package com.example.oniai.adaptor.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.oniai.domain.model.entity.Message;

public interface MessageRepository extends JpaRepository<Message, Integer>{
    List<Message> findBySenderUserIdAndRecipientUserId(Integer senderUserId, Integer recipientUserId);
    List<Message> findBySenderUserId(Integer senderUserId);
    List<Message> findByRecipientUserId(Integer recipientUserId);

    @Query("SELECT m FROM Message m WHERE (m.senderUserId = :senderUserId AND m.recipientUserId = :recipientUserId) OR (m.senderUserId = :recipientUserId AND m.recipientUserId = :senderUserId) ORDER BY m.createTime ASC")
    List<Message> findMessageHistory(@Param("senderUserId") Integer senderUserId, @Param("recipientUserId") Integer recipientUserId);
}
