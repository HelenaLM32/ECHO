package com.example.echo.core.entity.sharedkernel.appservices;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
import java.util.regex.Pattern;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;

@Service
public class FileStorageService {

    private static final Logger logger = LoggerFactory.getLogger(FileStorageService.class);
    private static final Pattern SAFE_EXTENSION = Pattern.compile("\\.[a-zA-Z0-9]{1,10}");

    @Value("${app.upload.dir}")
    private String uploadDir;

    @Value("${app.base-url}")
    private String baseUrl;
    @Value("${server.servlet.context-path:}")
    private String contextPath;

    private Path uploadPath;

    @PostConstruct
    public void init() {
        this.uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        logger.info("Upload directory configured at: {}", this.uploadPath);
        try {
            Files.createDirectories(uploadPath);
            logger.info("Upload directory ready");
        } catch (IOException e) {
            logger.error("Failed to create upload directory: {}", e.getMessage());
        }
    }

    public String store(MultipartFile file, String subDir) throws IOException {
        String originalName = file.getOriginalFilename();
        String ext = (originalName != null && originalName.contains("."))
                ? originalName.substring(originalName.lastIndexOf("."))
                : ".jpg";
        if (!SAFE_EXTENSION.matcher(ext).matches()) {
            ext = ".bin";
        }

        String filename = UUID.randomUUID() + ext;

        Path dir = uploadPath.resolve(subDir).normalize();
        if (!dir.startsWith(uploadPath)) {
            throw new IOException("Invalid upload directory");
        }
        Files.createDirectories(dir);

        Path destination = dir.resolve(filename);
        file.transferTo(destination);
        
        logger.info("File stored successfully at: {}", destination);

        // Return a proxy-friendly relative URL so it works across environments.
        return buildPublicUploadPath(subDir, filename);
    }

    public void delete(String fileUrl) {
        if (fileUrl == null || fileUrl.isBlank()) {
            return;
        }

        String relativePath = extractRelativeUploadPath(fileUrl);
        if (relativePath == null || relativePath.isBlank()) {
            return;
        }

        Path file = uploadPath.resolve(relativePath).normalize();
        if (!file.startsWith(uploadPath)) {
            logger.warn("Refusing to delete file outside upload directory: {}", file);
            return;
        }
        try {
            Files.deleteIfExists(file);
            logger.info("File deleted: {}", file);
        } catch (IOException e) {
            logger.error("Failed to delete file: {}", e.getMessage());
        }
    }

    private String buildPublicBaseUrl() {
        String normalizedBase = (baseUrl == null) ? "" : baseUrl.trim();
        if (normalizedBase.endsWith("/")) {
            normalizedBase = normalizedBase.substring(0, normalizedBase.length() - 1);
        }

        String ctx = (contextPath == null) ? "" : contextPath.trim();
        if (ctx.equals("/") || ctx.isEmpty()) {
            return normalizedBase;
        }
        if (!ctx.startsWith("/")) {
            ctx = "/" + ctx;
        }
        if (normalizedBase.endsWith(ctx)) {
            return normalizedBase;
        }
        return normalizedBase + ctx;
    }

    private String buildPublicUploadPath(String subDir, String filename) {
        String ctx = (contextPath == null) ? "" : contextPath.trim();
        if (ctx.equals("/")) {
            ctx = "";
        }
        if (!ctx.isEmpty() && !ctx.startsWith("/")) {
            ctx = "/" + ctx;
        }
        return ctx + "/uploads/" + subDir + "/" + filename;
    }

    private String extractRelativeUploadPath(String fileUrl) {
        String value = fileUrl.trim();
        String[] acceptedPrefixes = {
                "/uploads/",
                "/api/uploads/",
                buildPublicBaseUrl() + "/uploads/"
        };

        for (String prefix : acceptedPrefixes) {
            if (value.startsWith(prefix)) {
                return value.substring(prefix.length());
            }
        }

        return null;
    }
}