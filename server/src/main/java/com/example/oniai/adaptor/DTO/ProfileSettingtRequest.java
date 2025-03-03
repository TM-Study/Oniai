package com.example.oniai.adaptor.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProfileSettingtRequest {

    private Integer userId;

    private Profile profile;

    
    @AllArgsConstructor
    @NoArgsConstructor
    @Data
    @Builder
    public static class Profile {

        private Integer id;

        private Integer userId;

        private String image;

        private String name;

        private Integer age;

        private String residence;

        private String freeDescription;

    }

}
