package com.hiutin.eelish.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.hiutin.eelish.common.response.ApiResponse;
import com.hiutin.eelish.service.SourceService;

@RestController
@RequestMapping("/upload")
class SourceController {
    private final SourceService sourceService;
    @Value("${app.tmp.dir}")
    private String uploadDir;

    SourceController(SourceService sourceService) {
        this.sourceService = sourceService;
    }

    @PostMapping("/decks")
    public ResponseEntity<ApiResponse<String>> handleFileUpload(
            @RequestParam("file") MultipartFile file) {
        sourceService.importDeckFromApkg(file);
        return ResponseEntity.ok(
                ApiResponse.success("File uploaded: " + file.getOriginalFilename()));
    }
}