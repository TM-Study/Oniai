package com.example.oniai.domain.model.DTO;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class UserAlreadyExistsException extends RuntimeException {
  public UserAlreadyExistsException(String message) {
      super(message);
  }
}
