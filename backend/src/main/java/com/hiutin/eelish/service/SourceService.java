package com.hiutin.eelish.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.hiutin.eelish.common.exception.ImportException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.hiutin.eelish.dto.anki.AnkiCard;
import com.hiutin.eelish.dto.anki.AnkiCollection;
import com.hiutin.eelish.dto.anki.AnkiField;
import com.hiutin.eelish.dto.anki.AnkiModel;
import com.hiutin.eelish.dto.anki.AnkiNote;
import com.hiutin.eelish.dto.anki.AnkiTemplate;
import com.hiutin.eelish.entity.Card;
import com.hiutin.eelish.entity.Deck;
import com.hiutin.eelish.entity.FieldDefinition;
import com.hiutin.eelish.entity.ImportSource;
import com.hiutin.eelish.entity.Note;
import com.hiutin.eelish.entity.NoteType;
import com.hiutin.eelish.repository.CardRepository;
import com.hiutin.eelish.repository.DeckRepository;
import com.hiutin.eelish.repository.FieldDefinitionRepository;
import com.hiutin.eelish.repository.ImportSourceRepository;
import com.hiutin.eelish.repository.NoteRepository;
import com.hiutin.eelish.repository.NoteTypeRepository;
import com.hiutin.eelish.util.apkg.ApkgExtractor;
import com.hiutin.eelish.util.apkg.ApkgParser;

@Service
public class SourceService {

    private final DeckRepository deckRepository;
    private final ImportSourceRepository importSourceRepository;
    private final NoteTypeRepository noteTypeRepository;
    private final FieldDefinitionRepository fieldDefinitionRepository;
    private final NoteRepository noteRepository;
    private final CardRepository cardRepository;
    private final ApkgExtractor apkgExtractor;
    private final ApkgParser apkgParser;

    public SourceService(
            DeckRepository deckRepository,
            ImportSourceRepository importSourceRepository,
            NoteTypeRepository noteTypeRepository,
            FieldDefinitionRepository fieldDefinitionRepository,
            NoteRepository noteRepository,
            CardRepository cardRepository,
            ApkgExtractor apkgExtractor,
            ApkgParser apkgParser) {
        this.deckRepository = deckRepository;
        this.importSourceRepository = importSourceRepository;
        this.noteTypeRepository = noteTypeRepository;
        this.fieldDefinitionRepository = fieldDefinitionRepository;
        this.noteRepository = noteRepository;
        this.cardRepository = cardRepository;
        this.apkgExtractor = apkgExtractor;
        this.apkgParser = apkgParser;
    }

    /**
     * Main entry point: unpack the .apkg, then persist everything step by step.
     * Each step is its own method below so this method reads like a checklist.
     */
    @Transactional
    public void importDeckFromApkg(MultipartFile file) {
        Path tempDir = null;
        try {
            tempDir = extractApkgToTempDir(file);
            AnkiCollection collection = apkgParser.parse(tempDir.resolve("extracted").toString());

            ImportSource importSource = saveImportSource(file.getOriginalFilename());
            NoteTypeImportResult noteTypes = importNoteTypes(collection.models());
            Map<Long, Note> notesByAnkiId = importNotes(collection.notes(), noteTypes.byAnkiModelId, importSource);
            Map<Long, Deck> decksByAnkiId = importDecks(collection);
            importCards(collection.cards(), notesByAnkiId, decksByAnkiId, noteTypes.modelByNoteTypeId);

        } catch (Exception e) {
            throw new ImportException("Failed to import Anki deck: " + file.getOriginalFilename(), e);
        } finally {
            deleteRecursivelyQuietly(tempDir);
        }
    }

    // ---------------------------------------------------------------------
    // Step 1: unzip the uploaded .apkg into a temp folder
    // ---------------------------------------------------------------------

    private Path extractApkgToTempDir(MultipartFile file) throws IOException {
        Path tempDir = Files.createTempDirectory("apkg-source-");
        Path tempFilePath = tempDir.resolve(file.getOriginalFilename());
        file.transferTo(tempFilePath.toFile());

        Path extractedDir = tempDir.resolve("extracted");
        Files.createDirectories(extractedDir);
        apkgExtractor.extractApkg(tempFilePath.toString(), extractedDir.toString());
        return tempDir;
    }

    private void deleteRecursivelyQuietly(Path dir) {
        if (dir == null) {
            return;
        }
        try (var paths = Files.walk(dir)) {
            paths.sorted(Comparator.reverseOrder()).forEach(p -> {
                try {
                    Files.deleteIfExists(p);
                } catch (IOException ignored) {
                    // best-effort cleanup, don't fail the import over it
                }
            });
        } catch (IOException ignored) {
            // best-effort cleanup, don't fail the import over it
        }
    }

    // ---------------------------------------------------------------------
    // Step 2: import source record
    // ---------------------------------------------------------------------

    private ImportSource saveImportSource(String fileName) {
        ImportSource importSource = new ImportSource(null, "apkg", fileName, Instant.now(), List.of());
        return importSourceRepository.save(importSource);
    }

    // ---------------------------------------------------------------------
    // Step 3: Anki models -> NoteType + FieldDefinition
    // ---------------------------------------------------------------------

    /**
     * Small holder so importNoteTypes can return two lookup maps at once.
     */
    private record NoteTypeImportResult(
            Map<Long, NoteType> byAnkiModelId,
            Map<UUID, AnkiModel> modelByNoteTypeId) {
    }

    private NoteTypeImportResult importNoteTypes(List<AnkiModel> models) {
        List<NoteType> shells = models.stream().map(this::toNoteTypeShell).toList();
        List<NoteType> savedNoteTypes = noteTypeRepository.saveAll(shells);

        List<FieldDefinition> allFieldDefinitions = new ArrayList<>();
        Map<Long, NoteType> byAnkiModelId = new HashMap<>();
        Map<UUID, AnkiModel> modelByNoteTypeId = new HashMap<>();

        for (int i = 0; i < models.size(); i++) {
            AnkiModel model = models.get(i);
            NoteType noteType = savedNoteTypes.get(i);

            List<FieldDefinition> fields = model.fields().stream()
                    .map(field -> toFieldDefinition(field, noteType))
                    .toList();
            noteType.setFieldDefinitions(fields);
            allFieldDefinitions.addAll(fields);

            byAnkiModelId.put(model.id(), noteType);
            modelByNoteTypeId.put(noteType.getId(), model);
        }
        fieldDefinitionRepository.saveAll(allFieldDefinitions);

        return new NoteTypeImportResult(byAnkiModelId, modelByNoteTypeId);
    }

    private NoteType toNoteTypeShell(AnkiModel model) {
        NoteType noteType = new NoteType();
        noteType.setName(model.name());
        noteType.setFieldDefinitions(List.of());
        noteType.setNotes(List.of());
        return noteType;
    }

    private FieldDefinition toFieldDefinition(AnkiField field, NoteType noteType) {
        FieldDefinition fieldDefinition = new FieldDefinition();
        fieldDefinition.setNoteType(noteType);
        fieldDefinition.setFieldName(field.name());
        fieldDefinition.setDisplayOrder(field.ord() == null ? 0 : field.ord());
        return fieldDefinition;
    }

    // ---------------------------------------------------------------------
    // Step 4: Anki notes -> Note (tab-separated field values)
    // ---------------------------------------------------------------------

    private Map<Long, Note> importNotes(List<AnkiNote> ankiNotes, Map<Long, NoteType> noteTypesByAnkiId,
            ImportSource importSource) {
        List<Note> notes = ankiNotes.stream()
                .map(ankiNote -> toNote(ankiNote, noteTypesByAnkiId, importSource))
                .toList();
        List<Note> savedNotes = noteRepository.saveAll(notes);

        // saveAll() preserves input order for new entities in Spring Data JPA,
        // so we can zip the two lists by index to build the lookup map.
        Map<Long, Note> notesByAnkiId = new HashMap<>();
        for (int i = 0; i < ankiNotes.size(); i++) {
            notesByAnkiId.put(ankiNotes.get(i).id(), savedNotes.get(i));
        }
        return notesByAnkiId;
    }

    private Note toNote(AnkiNote ankiNote, Map<Long, NoteType> noteTypesByAnkiId, ImportSource importSource) {
        Note note = new Note();
        note.setNoteType(noteTypesByAnkiId.get(ankiNote.modelId()));
        note.setSource(importSource);
        note.setFieldValues(toFieldValues(ankiNote.fields(), note.getNoteType()));
        note.setCreatedAt(Instant.now());
        note.setCards(List.of());
        return note;
    }

    private Map<String, Object> toFieldValues(String rawFields, NoteType noteType) {
        Map<String, Object> values = new LinkedHashMap<>();
        if (noteType == null || noteType.getFieldDefinitions() == null) {
            return values;
        }
        String[] fieldValues = rawFields == null ? new String[0] : rawFields.split("\u001F", -1);
        for (FieldDefinition field : noteType.getFieldDefinitions()) {
            int index = field.getDisplayOrder();
            values.put(field.getFieldName(), index < fieldValues.length ? fieldValues[index] : "");
        }
        return values;
    }

    // ---------------------------------------------------------------------
    // Step 5: Anki decks -> Deck (name is "Parent::Child::Grandchild")
    // ---------------------------------------------------------------------

    private Map<Long, Deck> importDecks(AnkiCollection collection) {
        Map<String, Deck> deckByPath = new LinkedHashMap<>();
        Map<Long, Deck> decksByAnkiId = new HashMap<>();

        for (var ankiDeck : collection.decks()) {
            Deck leafDeck = getOrCreateDeckPath(ankiDeck.name(), deckByPath);
            if (leafDeck != null) {
                decksByAnkiId.put(ankiDeck.id(), leafDeck);
            }
        }
        deckRepository.saveAll(deckByPath.values());
        return decksByAnkiId;
    }

    /**
     * "A::B::C" -> ensures Deck A, A::B, A::B::C all exist in deckByPath, returns
     * C.
     */
    private Deck getOrCreateDeckPath(String fullName, Map<String, Deck> deckByPath) {
        String[] segments = fullName.split("::");
        if (segments.length == 0) {
            return null;
        }

        Deck parent = null;
        StringBuilder pathBuilder = new StringBuilder();
        for (String segment : segments) {
            if (pathBuilder.length() > 0) {
                pathBuilder.append("::");
            }
            pathBuilder.append(segment);
            String path = pathBuilder.toString();

            Deck deck = deckByPath.get(path);
            if (deck == null) {
                deck = new Deck();
                deck.setName(segment);
                deck.setParentDeck(parent);
                deck.setCards(List.of());
                deck.setChildDecks(List.of());
                deckByPath.put(path, deck);
            }
            parent = deck;
        }
        return parent; // last one built/found = the leaf deck
    }

    // ---------------------------------------------------------------------
    // Step 6: Anki cards -> Card
    // ---------------------------------------------------------------------

    private void importCards(List<AnkiCard> ankiCards, Map<Long, Note> notesByAnkiId,
            Map<Long, Deck> decksByAnkiId, Map<UUID, AnkiModel> modelByNoteTypeId) {
        List<Card> cards = ankiCards.stream()
                .filter(ankiCard -> notesByAnkiId.containsKey(ankiCard.noteId())
                        && decksByAnkiId.containsKey(ankiCard.deckId()))
                .map(ankiCard -> toCard(ankiCard, notesByAnkiId, decksByAnkiId, modelByNoteTypeId))
                .toList();
        cardRepository.saveAll(cards);
    }

    private Card toCard(AnkiCard ankiCard, Map<Long, Note> notesByAnkiId,
            Map<Long, Deck> decksByAnkiId, Map<UUID, AnkiModel> modelByNoteTypeId) {
        Note note = notesByAnkiId.get(ankiCard.noteId());

        Card card = new Card();
        card.setNote(note);
        card.setDeck(decksByAnkiId.get(ankiCard.deckId()));
        card.setTemplateName(findTemplateName(note, ankiCard.templateOrd(), modelByNoteTypeId));
        card.setIntervalDays(0);
        card.setEaseFactor(0.0f);
        card.setDueAt(null);
        return card;
    }

    private String findTemplateName(Note note, Integer templateOrd, Map<UUID, AnkiModel> modelByNoteTypeId) {
        if (note == null || note.getNoteType() == null || templateOrd == null) {
            return null;
        }
        AnkiModel model = modelByNoteTypeId.get(note.getNoteType().getId());
        if (model == null || model.templates() == null) {
            return null;
        }
        for (AnkiTemplate template : model.templates()) {
            if (templateOrd.equals(template.ord())) {
                return template.name();
            }
        }
        return null;
    }
}