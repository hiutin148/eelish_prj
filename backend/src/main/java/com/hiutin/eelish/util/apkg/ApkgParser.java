package com.hiutin.eelish.util.apkg;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.hiutin.eelish.dto.anki.AnkiCard;
import com.hiutin.eelish.dto.anki.AnkiCollection;
import com.hiutin.eelish.dto.anki.AnkiDeck;
import com.hiutin.eelish.dto.anki.AnkiField;
import com.hiutin.eelish.dto.anki.AnkiModel;
import com.hiutin.eelish.dto.anki.AnkiNote;
import com.hiutin.eelish.dto.anki.AnkiTemplate;

@Service
public class ApkgParser {
    private final ObjectMapper objectMapper = new ObjectMapper();

    public AnkiCollection parse(String extractedDirPath) {
        Path collectionPath = Paths.get(extractedDirPath, "collection.anki21");
        if (!collectionPath.toFile().exists()) {
            collectionPath = Paths.get(extractedDirPath, "collection.anki2");
        }
        String url = "jdbc:sqlite:" + collectionPath;

        try (Connection conn = DriverManager.getConnection(url)) {

            List<AnkiModel> models = getListFromJsonColumn(conn, "models", this::mapToModel);
            List<AnkiDeck> decks = getListFromJsonColumn(conn, "decks", this::mapToDeck);

            List<AnkiNote> notes = getListFromRelationalTable(conn, "notes", this::mapToNote);
            List<AnkiCard> cards = getListFromRelationalTable(conn, "cards", this::mapToCard);

            return new AnkiCollection(decks, models, notes, cards, null);
        } catch (SQLException e) {
            throw new RuntimeException("Failed to parse APKG collection", e);
        }
    }

    private AnkiModel mapToModel(JsonNode node) {
        List<AnkiField> fields = readList(node, "flds", new TypeReference<List<AnkiField>>() {
        });
        List<AnkiTemplate> templates = readList(node, "tmpls", new TypeReference<List<AnkiTemplate>>() {
        });
        List<List<Object>> req = readList(node, "req", new TypeReference<List<List<Object>>>() {
        });

        return new AnkiModel(
                readLong(node, "id"),
                readString(node, "name"),
                readInt(node, "type"),
                readLong(node, "mod"),
                readInt(node, "usn"),
                readInt(node, "sortf"),
                readLong(node, "did"),
                templates,
                fields,
                readString(node, "css"),
                readString(node, "latexPre"),
                readString(node, "latexPost"),
                readBoolean(node, "latexsvg"),
                req);
    }

    private AnkiDeck mapToDeck(JsonNode node) {
        return new AnkiDeck(
                readLong(node, "id"),
                readString(node, "name"),
                readString(node, "desc"));
    }

    private AnkiNote mapToNote(JsonNode node) {
        return new AnkiNote(
                readLong(node, "id"),
                readLong(node, "mid"),
                readString(node, "flds"),
                readString(node, "tags"));
    }

    private AnkiCard mapToCard(JsonNode node) {
        return new AnkiCard(
                readLong(node, "id"),
                readLong(node, "nid"),
                readLong(node, "did"),
                readInt(node, "ord"));
    }

    /**
     * Reads a JSON-blob column (e.g. "models", "decks") from the single-row "col"
     * table.
     * Each top-level property of the JSON object becomes one item.
     */
    private <T> List<T> getListFromJsonColumn(Connection conn, String columnName, Function<JsonNode, T> mapper) {
        String sql = "SELECT " + columnName + " FROM col";
        try (PreparedStatement stmt = conn.prepareStatement(sql);
                ResultSet rs = stmt.executeQuery()) {

            List<T> items = new ArrayList<>();
            if (!rs.next()) {
                return items;
            }

            String json = rs.getString(columnName);
            if (json == null || json.isBlank()) {
                return items;
            }

            JsonNode root = objectMapper.readTree(json);
            Iterator<Map.Entry<String, JsonNode>> it = root.properties().iterator();
            while (it.hasNext()) {
                items.add(mapper.apply(it.next().getValue()));
            }
            return items;
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse '" + columnName + "' column from col table", e);
        }
    }

    /**
     * Reads every row of a real relational table (e.g. "notes", "cards") into a
     * JsonNode
     * per row, so the same readLong/readString-style mappers can be reused.
     */
    private <T> List<T> getListFromRelationalTable(Connection conn, String tableName, Function<JsonNode, T> mapper) {
        String sql = "SELECT * FROM " + tableName;
        try (PreparedStatement stmt = conn.prepareStatement(sql);
                ResultSet rs = stmt.executeQuery()) {

            List<T> items = new ArrayList<>();
            ResultSetMetaData metaData = rs.getMetaData();
            int columnCount = metaData.getColumnCount();

            while (rs.next()) {
                ObjectNode row = objectMapper.createObjectNode();
                for (int i = 1; i <= columnCount; i++) {
                    row.putPOJO(metaData.getColumnLabel(i), rs.getObject(i));
                }
                items.add(mapper.apply(row));
            }
            return items;
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse '" + tableName + "' table", e);
        }
    }

    private Long readLong(JsonNode node, String fieldName) {
        JsonNode value = node.get(fieldName);
        if (value == null || value.isNull() || value.asText().isBlank()) {
            return null;
        }
        return value.asLong();
    }

    private Integer readInt(JsonNode node, String fieldName) {
        JsonNode value = node.get(fieldName);
        if (value == null || value.isNull() || value.asText().isBlank()) {
            return null;
        }
        return value.asInt();
    }

    private Boolean readBoolean(JsonNode node, String fieldName) {
        JsonNode value = node.get(fieldName);
        if (value == null || value.isNull()) {
            return null;
        }
        return value.asBoolean();
    }

    private String readString(JsonNode node, String fieldName) {
        JsonNode value = node.get(fieldName);
        if (value == null || value.isNull()) {
            return null;
        }
        String text = value.asText();
        return text.isBlank() ? null : text;
    }

    private <T> List<T> readList(JsonNode node, String fieldName, TypeReference<List<T>> typeRef) {
        JsonNode value = node.get(fieldName);
        if (value == null || value.isNull()) {
            return List.of();
        }
        return objectMapper.convertValue(value, typeRef);
    }
}