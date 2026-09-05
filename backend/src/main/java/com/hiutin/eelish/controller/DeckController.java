package com.hiutin.eelish.controller;

import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hiutin.eelish.common.response.ApiResponse;
import com.hiutin.eelish.common.response.PageResponse;
import com.hiutin.eelish.dto.request.DeckRequest;
import com.hiutin.eelish.dto.response.DeckDto;
import com.hiutin.eelish.service.DeckCrudService;

@RestController
@RequestMapping("/api/decks")
public class DeckController {
    private final DeckCrudService service;

    public DeckController(DeckCrudService service) {
        this.service = service;
    }

    @GetMapping
    public ApiResponse<PageResponse<DeckDto>> findAll(Pageable pageable) {
        return ApiResponse.success(service.findAll(pageable));
    }

    @GetMapping("/{id}")
    public ApiResponse<DeckDto> findById(@PathVariable UUID id) {
        return ApiResponse.success(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<DeckDto>> create(@RequestBody DeckRequest r) {
        return ResponseEntity.status(201).body(ApiResponse.created(service.create(r)));
    }

    @PutMapping("/{id}")
    public ApiResponse<DeckDto> update(@PathVariable UUID id, @RequestBody DeckRequest r) {
        return ApiResponse.success(service.update(id, r));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}