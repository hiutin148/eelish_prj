package com.hiutin.eelish.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hiutin.eelish.entity.ImportSource;

public interface ImportSourceRepository extends JpaRepository<ImportSource, UUID> {
}