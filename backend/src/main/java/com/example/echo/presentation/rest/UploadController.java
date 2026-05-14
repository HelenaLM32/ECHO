package com.example.echo.presentation.rest;

import java.io.IOException;
import java.util.Arrays;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

import com.example.echo.core.entity.sharedkernel.appservices.FileStorageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/uploads")
public class UploadController {

    private static final Logger logger = LoggerFactory.getLogger(UploadController.class);

    private final FileStorageService fileStorageService;
    private final Set<String> allowedContentTypes;
    private final Set<String> allowedSubdirs;
    private final long maxFileSizeBytes;

    public UploadController(
            FileStorageService fileStorageService,
            @Value("${app.upload.allowed-content-types:image/jpeg,image/png,image/webp,image/gif,video/mp4,audio/mpeg,audio/wav,audio/webm,application/pdf}") String allowedContentTypes,
            @Value("${app.upload.allowed-subdirs:images,avatars,banners,events,venues,audio,video}") String allowedSubdirs,
            @Value("${app.upload.max-file-size-bytes:26214400}") long maxFileSizeBytes) {
        this.fileStorageService = fileStorageService;
        this.allowedContentTypes = parseCsv(allowedContentTypes);
        this.allowedSubdirs = parseCsv(allowedSubdirs);
        this.maxFileSizeBytes = maxFileSizeBytes;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> upload(@RequestParam("file") MultipartFile file,
            @RequestParam(value = "subDir", required = false) String subDir) {
        String targetDir;
        try {
            targetDir = resolveTargetDirectory(subDir);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }

        if (file == null || file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No file provided.");
        }

        if (file.getSize() > maxFileSizeBytes) {
            return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
                    .body("File exceeds maximum allowed size.");
        }

        String contentType = file.getContentType();
        if (contentType == null || !allowedContentTypes.contains(contentType.toLowerCase(Locale.ROOT))) {
            return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
                    .body("File type is not allowed.");
        }

        try {
            String url = fileStorageService.store(file, targetDir);
            return ResponseEntity.ok(url);
        } catch (IOException e) {
            logger.error("Upload failed for subDir '{}': {}", targetDir, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Could not store file.");
        }
    }

    private String resolveTargetDirectory(String subDir) {
        String dir = (subDir == null || subDir.isBlank()) ? "images" : subDir.trim().toLowerCase(Locale.ROOT);
        if (!allowedSubdirs.contains(dir)) {
            throw new IllegalArgumentException("Invalid upload directory.");
        }
        return dir;
    }

    private static Set<String> parseCsv(String csv) {
        return Arrays.stream(csv.split(","))
                .map(value -> value.trim().toLowerCase(Locale.ROOT))
                .filter(value -> !value.isEmpty())
                .collect(Collectors.toUnmodifiableSet());
    }
}
