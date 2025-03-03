package com.example.oniai.adaptor.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetMessageListRequest {

  private Integer senderUserId;

  private Integer recipientUserId;

}
