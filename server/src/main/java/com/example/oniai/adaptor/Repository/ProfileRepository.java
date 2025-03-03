package com.example.oniai.adaptor.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.oniai.domain.model.entity.Profile;

public interface ProfileRepository extends JpaRepository<Profile, Integer>{
    Profile findByUserId(Integer userId);
}

