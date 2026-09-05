package com.hiutin.eelish.service;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.hiutin.eelish.dto.request.ImportSourceRequest;
import com.hiutin.eelish.dto.response.ImportSourceDto;
import com.hiutin.eelish.common.response.PageResponse;
import com.hiutin.eelish.entity.ImportSource;
import com.hiutin.eelish.mapper.EntityDtoMapper;
import com.hiutin.eelish.repository.ImportSourceRepository;

@Service
@Transactional
public class ImportSourceService {
    private final ImportSourceRepository repository;
    private final EntityDtoMapper mapper;

    public ImportSourceService(ImportSourceRepository repository, EntityDtoMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public PageResponse<ImportSourceDto> findAll(Pageable pageable) {
        Page<ImportSource> page = repository.findAll(pageable);
        return PageResponse.from(page.map(mapper::toDto));
    }

    @Transactional(readOnly = true)
    public ImportSourceDto findById(UUID id) {
        return mapper.toDto(find(id));
    }

    public ImportSourceDto create(ImportSourceRequest r) {
        return mapper.toDto(repository.save(toEntity(r)));
    }

    public ImportSourceDto update(UUID id, ImportSourceRequest r) {
        ImportSource e = find(id);
        e.setFileType(r.fileType());
        e.setFileName(r.fileName());
        e.setImportedAt(r.importedAt());
        return mapper.toDto(repository.save(e));
    }

    public void delete(UUID id) {
        repository.delete(find(id));
    }

    private ImportSource find(UUID id) {
        return repository.findById(id).orElseThrow(() -> notFound(id));
    }

    private ImportSource toEntity(ImportSourceRequest r) {
        ImportSource e = new ImportSource();
        e.setFileType(r.fileType());
        e.setFileName(r.fileName());
        e.setImportedAt(r.importedAt());
        return e;
    }

    private ResponseStatusException notFound(UUID id) {
        return new ResponseStatusException(HttpStatus.NOT_FOUND, "Import source not found: " + id);
    }
}