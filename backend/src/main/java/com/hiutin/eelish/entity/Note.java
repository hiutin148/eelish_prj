package com.hiutin.eelish.entity;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "note")
@Getter
@Setter
public class Note {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "note_type_id")
    private NoteType noteType;

    @ManyToOne
    @JoinColumn(name = "source_id")
    private ImportSource source;

    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Object> fieldValues;

    private Instant createdAt;

    @OneToMany(mappedBy = "note")
    private List<Card> cards;
}