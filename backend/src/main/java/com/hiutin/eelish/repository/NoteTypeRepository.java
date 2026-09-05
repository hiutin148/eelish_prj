package com.hiutin.eelish.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hiutin.eelish.entity.NoteType;

public interface NoteTypeRepository extends JpaRepository<NoteType, UUID> {
}