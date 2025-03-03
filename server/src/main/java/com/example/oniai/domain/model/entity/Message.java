package com.example.oniai.domain.model.entity;

import java.io.Serializable;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "Messages")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Message implements Serializable{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    
    @Column(name = "sender_user_id")
    private Integer senderUserId;

    @Column(name = "recipient_user_id")
    private Integer recipientUserId;

    @Column(name = "content")
    private String content;

    @Column(name = "created_at")
    private LocalDateTime createTime;

    @ManyToOne()
    @JoinColumn(name = "sender_user_id", referencedColumnName = "id", nullable = false, insertable = false, updatable = false)
    private User senderUser;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_user_id", referencedColumnName = "id", nullable = false, insertable = false, updatable = false)
    private User recipientUser;
}