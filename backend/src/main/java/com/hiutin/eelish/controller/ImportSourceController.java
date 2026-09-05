package com.hiutin.eelish.controller;

import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hiutin.eelish.common.response.ApiResponse;
import com.hiutin.eelish.common.response.PageResponse;
import com.hiutin.eelish.dto.request.ImportSourceRequest;
import com.hiutin.eelish.dto.response.ImportSourceDto;
import com.hiutin.eelish.service.ImportSourceService;

@RestController
@RequestMapping("/api/import-sources")
public class ImportSourceController {
    private final ImportSourceService service;

    public ImportSourceController(ImportSourceService service) {
        this.service = service;
    }

    @GetMapping
    public ApiResponse<PageResponse<ImportSourceDto>> findAll(Pageable pageable) {
        return ApiResponse.success(service.findAll(pageable));
    }

    @GetMapping("/{id}")
    public ApiResponse<ImportSourceDto> findById(@PathVariable UUID id) {
        return ApiResponse.success(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ImportSourceDto>> create(@RequestBody ImportSourceRequest request) {
        return ResponseEntity.status(201).body(ApiResponse.created(service.create(request)));
    }

    @PutMapping("/{id}")
    public ApiResponse<ImportSourceDto> update(@PathVariable UUID id, @RequestBody ImportSourceRequest request) {
        return ApiResponse.success(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}