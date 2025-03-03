package com.example.oniai.domain.logic;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.oniai.adaptor.Repository.LikeRepository;
import com.example.oniai.adaptor.Repository.MessageRepository;
import com.example.oniai.adaptor.Repository.ProfileRepository;
import com.example.oniai.adaptor.Repository.UserRepository;
import com.example.oniai.domain.model.DTO.ProfileDTO;
import com.example.oniai.domain.model.DTO.UserAlreadyExistsException;
import com.example.oniai.domain.model.entity.Like;
import com.example.oniai.domain.model.entity.Message;
import com.example.oniai.domain.model.entity.Profile;
import com.example.oniai.domain.model.entity.User;

@Component
public class CommonLogic {

  @Autowired
  private LikeRepository likeRepository;

  @Autowired
  private ProfileRepository profileRepository;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private MessageRepository messageRepository;

  @Autowired
  private PasswordEncoder passwordEncoder;

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private JwtTokenProvider jwtTokenProvider; 

  /**
   * いいね受け取り済ユーザーに対してはstatusをtrueにしてupdate、その他の場合insert
   * @param senderId
   * @param recipientId
   * @return
   */
  public Like upsertLike(Integer senderId, Integer recipientId){

    // 送信済いいねの場合return
    Like existLike = likeRepository.findBySenderUserIdAndRecipientUserId(senderId, recipientId);
    if (existLike != null) {
        return existLike;
    }

    Like muturalLike = likeRepository.findBySenderUserIdAndRecipientUserId(recipientId, senderId);
    if(muturalLike != null){
        // statusをtrueにしてupdateするケース
        muturalLike.setStatus(true);
        return likeRepository.save(muturalLike);
    }else{
        // 新規でinsertするケース
        Like like = Like.builder()
            .senderUserId(senderId)
            .recipientUserId(recipientId)
            .status(false)
            .build();
        return likeRepository.save(like);
    }
  }

  /**
   * ユーザーIDでいいねを送ってくれたユーザーのプロフィール情報一覧を取得
   * @param userId
   * @return
   */
  public List<Profile> getLikedProfiles(Integer userId){
    List<Profile> profiles = new ArrayList<Profile>();
    likeRepository.findByRecipientUserIdAndStatus(userId, false)
        .forEach(like -> {
            profiles.add(profileRepository.findByUserId(like.getSenderUserId()));
        });
    return profiles;
  }

  /**
   * ユーザーIDでマッチしているユーザーのプロフィール情報一覧を取得
   * @param userId
   * @return
   */
  public List<Profile> getMatchedProfiles(Integer userId){
    List<Profile> profiles = new ArrayList<Profile>();
    likeRepository.findBySenderUserId(userId)
        .forEach(like -> {
            if(like.getStatus()){
                profiles.add(profileRepository.findByUserId(like.getRecipientUserId()));
            }
        });
    likeRepository.findByRecipientUserId(userId)
        .forEach(like -> {
            if(like.getStatus()){
                profiles.add(profileRepository.findByUserId(like.getSenderUserId()));
            }
        });
    return profiles;
  }

  /**
   * ユーザーIDで異性のプロフィール情報一覧を取得
   * @param userId
   * @return
   */
  public List<Profile> getOppositeSexAllProfiles(Integer userId) {
    List<User> oppositSexUsers = new ArrayList<User>();
    Optional<User> user = userRepository.findById(userId);
    if (user.get().getSex().equals("1")) {
        oppositSexUsers = userRepository.findBySex("2");
    }else{
        oppositSexUsers = userRepository.findBySex("1");
    }
    List<Profile> profiles = new ArrayList<>();
    oppositSexUsers.forEach(oppositSexUser -> {
        if (likeRepository.findBySenderUserIdAndRecipientUserId(userId, oppositSexUser.getId()) == null && likeRepository.findBySenderUserIdAndRecipientUserId(oppositSexUser.getId(), userId) == null) {
            Profile profile = profileRepository.findByUserId(oppositSexUser.getId());
            if(profile != null){
                profiles.add(profile);
            }
        }
    });
    return profiles;
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
    // メールアドレスが登録済の場合
    if (userRepository.findByEmail(email) != null) {
        throw new UserAlreadyExistsException("User with email already exists");
    }

    // パスワードをエンコード
    String encodedPassword = passwordEncoder.encode(password);

    // 新しいユーザーを保存
    User newUser = User.builder()
        .email(email)
        .sex(sex)
        .password(encodedPassword)
        .name(name)
        .build();

    return userRepository.save(newUser);
  }

	/**
	 * ログイン用ロジック
	 */
  public String login(String email, String password){
    // メールアドレス・パスワードをもとにAuthenticationオブジェクトを作成
    UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
        email,
        password
    );

    // Authenticationオブジェクトの認証を試み、成功の場合、資格情報を含むAuthenticationオブジェクトを作成
    Authentication authentication = authenticationManager.authenticate(usernamePasswordAuthenticationToken);
    
    // JwtProviderクラスによるJwtTokenの作成
    String jwt = jwtTokenProvider.generateToken(authentication);
		return jwt;
  }

  /**
   * プロフィール情報をupsert
   * @param requestBody
   * @return
   */
  public Profile upsertProfile(Integer userId, ProfileDTO profileDTO){

    byte[] imageBytes = new byte[0];
    if (profileDTO.getImage() != null) {
        // 画像データを調整
        String imageBase64 = profileDTO.getImage();
        String base64Data = imageBase64.split(",")[imageBase64.contains(",") ? 1 : 0];
        imageBytes = java.util.Base64.getDecoder().decode(base64Data);
    }else{
        imageBytes = null;
    }

    Profile newProfile = Profile.builder()
        .id(profileDTO.getId())
        .userId(userId)
        .image(imageBytes)
        .name(profileDTO.getName())
        .age(profileDTO.getAge())
        .residence(profileDTO.getResidence())
        .freeDescription(profileDTO.getFreeDescription())
        .build();

    return profileRepository.save(newProfile);
  }

	/**
	 * メッセージ情報をupsert
	 */
	public Message upsertMessage(Message message){
		return messageRepository.save(message);
	}

	/**
	 * メッセージを取得
	 * @param senderUserId
	 * @param recipientUserId
	 * @return
	 */
	public List<Message> getMessagesBySenderUserIdAndRecipientUserId(Integer senderUserId, Integer recipientUserId){
		return messageRepository.findMessageHistory(senderUserId, recipientUserId);
	}

	/**
	 * プロフィール情報を取得
	 */
	public Profile getProfileByUserId(Integer userId){
		return profileRepository.findByUserId(userId);
	}

	/**
	 * ユーザ情報を取得
	 */
	public User getUserByEmail(String email){
		return userRepository.findByEmail(email);
}
}
