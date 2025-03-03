package com.example.oniai.domain.model.DTO;

import com.example.oniai.domain.model.entity.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class UserDTO {

    private Integer id;
    
    private String name;

    private String sex;

    private String email;

    private String password;

    public static UserDTO fromEntity(User userEntity){
        return UserDTO
            .builder()
            .id(userEntity.getId())
            .name(userEntity.getName())
            .sex(userEntity.getEmail())
            .email(userEntity.getEmail())
            .password(userEntity.getPassword())
            .build();
    }
}