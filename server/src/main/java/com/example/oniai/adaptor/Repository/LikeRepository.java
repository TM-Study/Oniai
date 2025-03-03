package com.example.oniai.adaptor.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.oniai.domain.model.entity.Like;

public interface LikeRepository extends JpaRepository<Like, Integer>{
    Like findBySenderUserIdAndRecipientUserId(Integer senderUserId, Integer recipientUserId);
    List<Like> findBySenderUserId(Integer senderUserId);
    List<Like> findByRecipientUserId(Integer recipientUserId);
    List<Like> findByRecipientUserIdAndStatus(Integer recipientUserId, Boolean status);
}
