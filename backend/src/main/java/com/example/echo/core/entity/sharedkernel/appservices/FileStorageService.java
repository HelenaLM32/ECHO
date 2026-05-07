package com.example.echo.core.entity.sharedkernel.appservices;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {

    @Value("${app.upload.dir}")
    private String uploadDir;

    @Value("${app.base-url}")
    private String baseUrl;
    @Value("${server.servlet.context-path:}")
    private String contextPath;

    public String store(MultipartFile file, String subDir) throws IOException {
        String originalName = file.getOriginalFilename();
        String ext = (originalName != null && originalName.contains("."))
                ? originalName.substring(originalName.lastIndexOf("."))
                : ".jpg";

        String filename = UUID.randomUUID() + ext;

        Path dir = Paths.get(uploadDir, subDir);
        Files.createDirectories(dir);

        Path destination = dir.resolve(filename);
        file.transferTo(destination);

        String ctx = (contextPath == null) ? "" : contextPath.trim();
        if (ctx.equals("/")) ctx = "";
        return (ctx.isEmpty() ? "" : ctx) + "/uploads/" + subDir + "/" + filename;
    }

    public void delete(String fileUrl) {
        if (fileUrl == null || fileUrl.isBlank()) return;
        String ctx = (contextPath == null) ? "" : contextPath.trim();
        if (ctx.equals("/")) ctx = "";
        String relativePrefix = (ctx.isEmpty() ? "" : ctx) + "/uploads/";
        String absolutePrefix = baseUrl + relativePrefix;
        String relativePath;
        if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) {
            if (!fileUrl.startsWith(absolutePrefix)) return;
            relativePath = fileUrl.substring(absolutePrefix.length());
        } else {
            if (!fileUrl.startsWith(relativePrefix)) return;
            relativePath = fileUrl.substring(relativePrefix.length());
        }
        Path file = Paths.get(uploadDir).resolve(relativePath).normalize();
        if (!file.startsWith(Paths.get(uploadDir).toAbsolutePath().normalize())) return;
        try {
            Files.deleteIfExists(file);
        } catch (IOException ignored) {
        }
    }
}