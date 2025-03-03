package com.example.oniai.domain.model.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class LikeDTO{

    private Integer id;
    
    private Integer senderUserId;

    private Integer recipientUserId;

    private Boolean status;

}