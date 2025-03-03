package com.example.oniai.adaptor;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.example.oniai.adaptor.DTO.ErrorResponse;
import com.example.oniai.adaptor.DTO.GetMessageListRequest;
import com.example.oniai.adaptor.DTO.LoginRequest;
import com.example.oniai.adaptor.DTO.LoginResponse;
import com.example.oniai.adaptor.DTO.ProfileSettingtRequest;
import com.example.oniai.adaptor.DTO.SignUpRequest;
import com.example.oniai.adaptor.DTO.UserIdRequest;
import com.example.oniai.apps.CommonService;
import com.example.oniai.domain.model.DTO.ProfileDTO;
import com.example.oniai.domain.model.DTO.UserAlreadyExistsException;
import com.example.oniai.domain.model.DTO.UserDTO;
import com.example.oniai.domain.model.entity.Message;
import com.example.oniai.domain.model.entity.Profile;
import com.example.oniai.domain.model.entity.User;

@RestController
public class Adaptor {

    @Autowired
    private CommonService service;

    /**
     * AWSのヘルスチェック用API
     * @return
     */
    @RequestMapping(value = "/health-check", method = RequestMethod.GET)
    public ResponseEntity<String> healthCheck(){
        return ResponseEntity.ok("");
    }
    
    /**
     * 新規登録用API
     * @param requestBody
     * @return
     */
    @RequestMapping(value = "/sign-up", method = RequestMethod.POST)
    public ResponseEntity<?> signup(@RequestBody SignUpRequest requestBody) {
        try {
            UserDTO userDTO = UserDTO.fromEntity(
                service.upsertUser(
                    requestBody.getName(),
                    requestBody.getSex(),
                    requestBody.getEmail(),
                    requestBody.getPassword()
                )
            );
            return ResponseEntity.ok(userDTO);
        } catch (UserAlreadyExistsException e) {
            // メールアドレスが既に存在する場合は409 Conflictを返す
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new ErrorResponse("User already exists", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Internal server error", e.getMessage()));
        }
    }

    /**
     * ログイン用API
     * @param requestBody
     * @return
     */
    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest requestBody) {
        try {
            String jwt = service.login(requestBody.getEmail(), requestBody.getPassword());
            return ResponseEntity.ok(new LoginResponse(jwt));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("BadCredentialsException");
        }
    }

    /**
     * 認証用API
     * @param authentication
     * @return
     */
    @RequestMapping(value = "/auth", method = RequestMethod.GET)
    public ResponseEntity<?> authenticateUser(Authentication authentication) {
        try {
            User user = service.getUserByEmail(authentication.getName());
            return ResponseEntity.ok(user.getId());
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Invalid credentials");
        }
    }
    
    /**
     * 異性のプロフィール情報一覧を返すAPI
     * @param requestBody
     * @return
     */
    @RequestMapping(value = "/get-profile-list", method = RequestMethod.POST)
    public ResponseEntity<List<Profile>> getProfileListByUserId(@RequestBody UserIdRequest requestBody) {
        List<Profile> oppositeSexProfiles = service.getOppositeSexAllProfiles(requestBody.getUserId());
        return ResponseEntity.ok(oppositeSexProfiles);
    }

    /**
     * プロフィール詳細を返すAPI
     * @param requestBody
     * @return
     */
    @RequestMapping(value = "/get-profile-details", method = RequestMethod.POST)
    public ResponseEntity<Profile> getProfileByUserId(@RequestBody UserIdRequest requestBody) {
        Profile profile = service.getProfileByUserId(requestBody.getUserId());
        return ResponseEntity.ok(profile);
    }
    
    /**
     * いいねを送ってくれたユーザーのプロフィール情報一覧を返すAPI
     * @param requestBody
     * @return
     */
    @RequestMapping(value = "/get-liked-profile-list", method = RequestMethod.POST)
    public ResponseEntity<List<Profile>> getLikedProfileListByUserId(@RequestBody UserIdRequest requestBody) {
        List<Profile> profiles =service.getLikedProfiles(requestBody.getUserId());
        return ResponseEntity.ok(profiles);
    }

    /**
     * マッチしているユーザーのプロフィール情報一覧を返すAPI
     * @param requestBody
     * @return
     */
    @RequestMapping(value = "/get-matched-profile-list", method = RequestMethod.POST)
    public ResponseEntity<List<Profile>> getMatchedProfileListByUserId(@RequestBody UserIdRequest requestBody) {
        List<Profile> profiles = service.getMatchedProfiles(requestBody.getUserId());
        return ResponseEntity.ok(profiles);
    }

    /**
     * メッセージリストを返すAPI
     * @param requestBody
     * @return
     */
    @RequestMapping(value = "/get-message-list", method = RequestMethod.POST)
    public ResponseEntity<List<Message>> getMessageListByUserId(@RequestBody GetMessageListRequest requestBody) {
        List<Message> messages = service.getMessagesBySenderUserIdAndRecipientUserId(requestBody.getSenderUserId(), requestBody.getRecipientUserId());
        return ResponseEntity.ok(messages);
    }

    /**
     * プロフィールを設定するAPI
     * @param requestBody
     * @return
     */
    @RequestMapping(value = "/profile-setting", method = RequestMethod.POST)
    public ResponseEntity<Profile> upserteProfile(@RequestBody ProfileSettingtRequest requestBody){
        Integer userId = requestBody.getUserId();
        ProfileDTO profile = ProfileDTO
            .builder()
            .id(requestBody.getProfile().getId())
            .userId(requestBody.getProfile().getUserId())
            .image(requestBody.getProfile().getImage())
            .name(requestBody.getProfile().getName())
            .age(requestBody.getProfile().getAge())
            .residence(requestBody.getProfile().getResidence())
            .freeDescription(requestBody.getProfile().getFreeDescription())
            .build();
        Profile savedProfile = service.upsertProfile(userId, profile);
        return ResponseEntity.ok(savedProfile);
    }
}
