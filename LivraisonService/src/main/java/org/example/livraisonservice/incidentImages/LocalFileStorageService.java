package org.example.livraisonservice.incidentImages;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class LocalFileStorageService implements FileStorageService {
    private final Path rootLocation = Paths.get("uploads/incidents");

    @PostConstruct
    public void init() throws IOException {
        Files.createDirectories(rootLocation);
    }

    @Override
    public String uploadFile(MultipartFile file, String subPath) throws IOException {
        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path destination = rootLocation.resolve(subPath).resolve(filename);
        Files.createDirectories(destination.getParent());
        Files.copy(file.getInputStream(), destination);
        return "/uploads/" + subPath + "/" + filename; // URL publique ou relative
    }
}