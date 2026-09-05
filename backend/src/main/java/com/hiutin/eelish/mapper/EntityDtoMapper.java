package com.hiutin.eelish.mapper;

import java.util.List;

import org.springframework.stereotype.Component;

import com.hiutin.eelish.dto.response.CardDto;
import com.hiutin.eelish.dto.response.DeckDto;
import com.hiutin.eelish.dto.response.FieldDefinitionDto;
import com.hiutin.eelish.dto.response.FieldDefinitionSummaryDto;
import com.hiutin.eelish.dto.response.ImportSourceDto;
import com.hiutin.eelish.dto.response.ImportSourceSummaryDto;
import com.hiutin.eelish.dto.response.NoteDto;
import com.hiutin.eelish.dto.response.NoteSummaryDto;
import com.hiutin.eelish.dto.response.NoteTypeDto;
import com.hiutin.eelish.dto.response.NoteTypeSummaryDto;
import com.hiutin.eelish.dto.response.DeckSummaryDto;
import com.hiutin.eelish.entity.Card;
import com.hiutin.eelish.entity.Deck;
import com.hiutin.eelish.entity.FieldDefinition;
import com.hiutin.eelish.entity.ImportSource;
import com.hiutin.eelish.entity.Note;
import com.hiutin.eelish.entity.NoteType;

@Component
public class EntityDtoMapper {
    public ImportSourceDto toDto(ImportSource entity) {
        return new ImportSourceDto(entity.getId(), entity.getFileType(), entity.getFileName(), entity.getImportedAt());
    }

    public NoteTypeDto toDto(NoteType entity) {
        List<FieldDefinitionSummaryDto> fields = entity.getFieldDefinitions() == null ? List.of()
            : entity.getFieldDefinitions().stream()
                .map(field -> new FieldDefinitionSummaryDto(field.getId(), field.getFieldName(),
                    field.getDisplayOrder()))
                .toList();
        return new NoteTypeDto(entity.getId(), entity.getName(), fields);
    }

    public FieldDefinitionDto toDto(FieldDefinition entity) {
        return new FieldDefinitionDto(entity.getId(), toNoteTypeSummary(entity.getNoteType()),
                entity.getFieldName(), entity.getDisplayOrder());
    }

    public NoteDto toDto(Note entity) {
        return new NoteDto(entity.getId(), toNoteTypeSummary(entity.getNoteType()),
                toImportSourceSummary(entity.getSource()), entity.getFieldValues(),
                entity.getCreatedAt());
    }

    public CardDto toDto(Card entity) {
        return new CardDto(entity.getId(), toNoteSummary(entity.getNote()), toDeckSummary(entity.getDeck()), entity.getTemplateName(),
                entity.getIntervalDays(), entity.getEaseFactor(), entity.getDueAt());
    }

    public DeckDto toDto(Deck entity) {
        return new DeckDto(entity.getId(), entity.getName(), toDeckSummary(entity.getParentDeck()));
    }

    private NoteSummaryDto toNoteSummary(Note entity) {
        return entity == null ? null : new NoteSummaryDto(entity.getId(), entity.getFieldValues(), entity.getCreatedAt());
    }

    private DeckSummaryDto toDeckSummary(Deck entity) {
        return entity == null ? null : new DeckSummaryDto(entity.getId(), entity.getName());
    }

    private NoteTypeSummaryDto toNoteTypeSummary(NoteType entity) {
        return entity == null ? null : new NoteTypeSummaryDto(entity.getId(), entity.getName());
    }

    private ImportSourceSummaryDto toImportSourceSummary(ImportSource entity) {
        return entity == null ? null : new ImportSourceSummaryDto(entity.getId(), entity.getFileType(),
                entity.getFileName(), entity.getImportedAt());
    }

    public List<ImportSourceDto> toImportSourceDtos(List<ImportSource> entities) {
        return entities.stream().map(this::toDto).toList();
    }

    public List<NoteTypeDto> toNoteTypeDtos(List<NoteType> entities) {
        return entities.stream().map(this::toDto).toList();
    }

    public List<FieldDefinitionDto> toFieldDefinitionDtos(List<FieldDefinition> entities) {
        return entities.stream().map(this::toDto).toList();
    }

    public List<NoteDto> toNoteDtos(List<Note> entities) {
        return entities.stream().map(this::toDto).toList();
    }

    public List<CardDto> toCardDtos(List<Card> entities) {
        return entities.stream().map(this::toDto).toList();
    }

    public List<DeckDto> toDeckDtos(List<Deck> entities) {
        return entities.stream().map(this::toDto).toList();
    }
}