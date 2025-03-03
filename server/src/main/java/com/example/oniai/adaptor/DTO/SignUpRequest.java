package com.example.oniai.adaptor.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SignUpRequest {

  private String name;

  private String sex;

  private String email;

  private String password;

}
