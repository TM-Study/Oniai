package com.example.oniai.domain.model.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class ProfileDTO {

    private Integer id;

    private Integer userId;

    private String image;

    private String name;

    private Integer age;

    private String residence;

    private String freeDescription;

}
