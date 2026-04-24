package com.example.echo.core.entity.sharedkernel.appservices;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${app.upload.dir}")
    private String uploadDir;

    @Value("${app.base-url}")
    private String baseUrl;

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

        return baseUrl + "/uploads/" + subDir + "/" + filename;
    }

    public void delete(String fileUrl) {
        if (fileUrl == null || !fileUrl.startsWith(baseUrl))
            return;
        String relativePath = fileUrl.replace(baseUrl + "/uploads/", "");
        Path file = Paths.get(uploadDir, relativePath);
        try {
            Files.deleteIfExists(file);
        } catch (IOException ignored) {
        }
    }
}