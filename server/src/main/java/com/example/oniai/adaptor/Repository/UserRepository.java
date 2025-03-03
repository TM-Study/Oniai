package com.example.oniai.adaptor.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.oniai.domain.model.entity.User;

public interface UserRepository extends JpaRepository<User, Integer>{
    User findByEmail(String email);
    List<User> findBySex(String sex);
}
