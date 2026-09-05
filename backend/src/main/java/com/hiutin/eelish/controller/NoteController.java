package com.hiutin.eelish.controller;

import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hiutin.eelish.common.response.ApiResponse;
import com.hiutin.eelish.common.response.PageResponse;
import com.hiutin.eelish.dto.request.NoteRequest;
import com.hiutin.eelish.dto.response.NoteDto;
import com.hiutin.eelish.service.NoteService;

@RestController
@RequestMapping("/api/notes")
public class NoteController {
    private final NoteService service;

    public NoteController(NoteService service) {
        this.service = service;
    }

    @GetMapping
    public ApiResponse<PageResponse<NoteDto>> findAll(Pageable pageable) {
        return ApiResponse.success(service.findAll(pageable));
    }

    @GetMapping("/{id}")
    public ApiResponse<NoteDto> findById(@PathVariable UUID id) {
        return ApiResponse.success(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<NoteDto>> create(@RequestBody NoteRequest request) {
        return ResponseEntity.status(201).body(ApiResponse.created(service.create(request)));
    }

    @PutMapping("/{id}")
    public ApiResponse<NoteDto> update(@PathVariable UUID id, @RequestBody NoteRequest request) {
        return ApiResponse.success(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}