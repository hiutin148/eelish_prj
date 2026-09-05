package com.hiutin.eelish.controller;

import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hiutin.eelish.common.response.ApiResponse;
import com.hiutin.eelish.common.response.PageResponse;
import com.hiutin.eelish.dto.request.CardRequest;
import com.hiutin.eelish.dto.response.CardDto;
import com.hiutin.eelish.service.CardService;

@RestController
@RequestMapping("/api/cards")
public class CardController {
    private final CardService service;

    public CardController(CardService service) {
        this.service = service;
    }

    @GetMapping
    public ApiResponse<PageResponse<CardDto>> findAll(Pageable pageable) {
        return ApiResponse.success(service.findAll(pageable));
    }

    @GetMapping("/{id}")
    public ApiResponse<CardDto> findById(@PathVariable UUID id) {
        return ApiResponse.success(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CardDto>> create(@RequestBody CardRequest request) {
        return ResponseEntity.status(201).body(ApiResponse.created(service.create(request)));
    }

    @PutMapping("/{id}")
    public ApiResponse<CardDto> update(@PathVariable UUID id, @RequestBody CardRequest r) {
        return ApiResponse.success(service.update(id, r));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}