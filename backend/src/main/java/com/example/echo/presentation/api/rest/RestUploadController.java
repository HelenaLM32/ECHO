package com.example.echo.presentation.api.rest;

import com.example.echo.core.entity.sharedkernel.appservices.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/uploads")
public class RestUploadController {

    @Autowired
    private FileStorageService fileStorageService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> upload(@RequestParam("file") MultipartFile file,
            @RequestParam(value = "subDir", required = false) String subDir) {
        try {
            String dir = (subDir == null || subDir.isBlank()) ? "images" : subDir;
            String url = fileStorageService.store(file, dir);
            return ResponseEntity.ok(url);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error uploading file: " + e.getMessage());
        }
    }
}
