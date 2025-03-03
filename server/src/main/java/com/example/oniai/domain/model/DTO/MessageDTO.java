package com.example.oniai.domain.model.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MessageDTO {

  private Integer senderUserId;

  private Integer recipientUserId;

  private String content;
  
}
