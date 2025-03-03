package com.example.oniai.apps;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.oniai.domain.logic.CommonLogic;
import com.example.oniai.domain.model.DTO.ProfileDTO;
import com.example.oniai.domain.model.entity.Like;
import com.example.oniai.domain.model.entity.Message;
import com.example.oniai.domain.model.entity.Profile;
import com.example.oniai.domain.model.entity.User;

@Service
public class CommonService {

    @Autowired
    private CommonLogic logic;

    /**
     * いいね情報を保存・更新
     * @param senderId
     * @param recipientId
     * @return
     */
    public Like upsertLike(Integer senderId, Integer recipientId){
        return logic.upsertLike(senderId, recipientId);
    }

    /**
     * ユーザーIDでいいねを送ってくれたユーザーのプロフィール情報一覧を取得
     * @param userId
     * @return
     */
    public List<Profile> getLikedProfiles(Integer userId){
        return logic.getLikedProfiles(userId);
    }

    /**
     * ユーザーIDでマッチしているユーザーのプロフィール情報一覧を取得
     * @param userId
     * @return
     */
    public List<Profile> getMatchedProfiles(Integer userId){
        return logic.getMatchedProfiles(userId);
    }

    /**
     * メッセージ情報を保存
     * @param message
     * @return
     */
    public Message upsertMessage(Message message){
        return logic.upsertMessage(message);
    }
   
    /**
     * 受取ユーザーと送信ユーザーのユーザーIDでユーザー
     * @param senderUserId
     * @param recipientUserId
     * @return
     */
    public List<Message> getMessagesBySenderUserIdAndRecipientUserId(Integer senderUserId, Integer recipientUserId){
        return logic.getMessagesBySenderUserIdAndRecipientUserId(senderUserId, recipientUserId);
    }

    /**
     * ユーザーIDで異性のプロフィール情報一覧を取得
     * @param userId
     * @return
     */
    public List<Profile> getOppositeSexAllProfiles(Integer userId) {
        return logic.getOppositeSexAllProfiles(userId);
    }

    /**
     * ユーザーIDでプロフィール情報を取得
     * @param userId
     * @return
     */
    public Profile getProfileByUserId(Integer userId){
        return logic.getProfileByUserId(userId);
    }

    /**
     * プロフィール情報を保存する
     * @param profile
     * @return
     */
    public Profile upsertProfile(Integer userId, ProfileDTO profile){
        return logic.upsertProfile(userId, profile);
    }

    /**
     * メールアドレスでユーザー情報を取得
     * @param email
     * @return
     */
    public User getUserByEmail(String email){
        return logic.getUserByEmail(email);
    }

    /**
     * ユーザー情報を登録・更新
     * @param name
     * @param sex
     * @param email
     * @param password
     * @return
     */
    public User upsertUser(String name, String sex, String email, String password) {
        return logic.upsertUser(name, sex, email, password);
    }

    /**
     * ログイン用サービス
     * @param email
     * @param password
     * @return
     */
    public String login(String email, String password){
        return logic.login(email, password);
    }
    
}
