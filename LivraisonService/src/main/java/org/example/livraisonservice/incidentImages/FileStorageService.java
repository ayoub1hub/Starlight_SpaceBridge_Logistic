package org.example.livraisonservice.incidentImages;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface FileStorageService {
    String uploadFile(MultipartFile file, String path) throws IOException;
}