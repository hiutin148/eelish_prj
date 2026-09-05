package com.hiutin.eelish.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hiutin.eelish.entity.Note;

public interface NoteRepository extends JpaRepository<Note, UUID> {
}