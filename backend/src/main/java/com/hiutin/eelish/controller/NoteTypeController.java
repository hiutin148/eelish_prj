package com.hiutin.eelish.controller;

import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hiutin.eelish.common.response.ApiResponse;
import com.hiutin.eelish.common.response.PageResponse;
import com.hiutin.eelish.dto.request.NoteTypeRequest;
import com.hiutin.eelish.dto.response.NoteTypeDto;
import com.hiutin.eelish.service.NoteTypeService;

@RestController
@RequestMapping("/api/note-types")
public class NoteTypeController {
    private final NoteTypeService service;

    public NoteTypeController(NoteTypeService service) {
        this.service = service;
    }

    @GetMapping
    public ApiResponse<PageResponse<NoteTypeDto>> findAll(Pageable pageable) {
        return ApiResponse.success(service.findAll(pageable));
    }

    @GetMapping("/{id}")
    public ApiResponse<NoteTypeDto> findById(@PathVariable UUID id) {
        return ApiResponse.success(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<NoteTypeDto>> create(@RequestBody NoteTypeRequest request) {
        return ResponseEntity.status(201).body(ApiResponse.created(service.create(request)));
    }

    @PutMapping("/{id}")
    public ApiResponse<NoteTypeDto> update(@PathVariable UUID id, @RequestBody NoteTypeRequest request) {
        return ApiResponse.success(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}