package com.hiutin.eelish.controller;

import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hiutin.eelish.common.response.ApiResponse;
import com.hiutin.eelish.common.response.PageResponse;
import com.hiutin.eelish.dto.request.FieldDefinitionRequest;
import com.hiutin.eelish.dto.response.FieldDefinitionDto;
import com.hiutin.eelish.service.FieldDefinitionService;

@RestController
@RequestMapping("/api/field-definitions")
public class FieldDefinitionController {
    private final FieldDefinitionService service;

    public FieldDefinitionController(FieldDefinitionService service) {
        this.service = service;
    }

    @GetMapping
    public ApiResponse<PageResponse<FieldDefinitionDto>> findAll(Pageable pageable) {
        return ApiResponse.success(service.findAll(pageable));
    }

    @GetMapping("/{id}")
    public ApiResponse<FieldDefinitionDto> findById(@PathVariable UUID id) {
        return ApiResponse.success(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<FieldDefinitionDto>> create(@RequestBody FieldDefinitionRequest request) {
        return ResponseEntity.status(201).body(ApiResponse.created(service.create(request)));
    }

    @PutMapping("/{id}")
    public ApiResponse<FieldDefinitionDto> update(@PathVariable UUID id, @RequestBody FieldDefinitionRequest request) {
        return ApiResponse.success(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}