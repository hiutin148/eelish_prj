package com.hiutin.eelish.repository;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.hiutin.eelish.entity.Deck;

public interface DeckRepository extends JpaRepository<Deck, UUID> {
    public Page<Deck> findAll(Pageable pageable);
}
