package com.example.live_backend.controller;

// Spring imports
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;

// Project imports
import com.example.live_backend.dto.photo.UploadPhotoResponse;
import com.example.live_backend.service.PhotoStorageService;

// Lombok
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/photos")
@RequiredArgsConstructor
public class PhotoController {
    
    private final PhotoStorageService photoStorageService;

    /**
     * Generates a pre-signed URL for photo upload
     * @param fileName Name of the file to be uploaded
     * @return ResponseEntity containing upload and public URLs
     */
    @PostMapping("/upload-url")
    public ResponseEntity<UploadPhotoResponse> getUploadUrl(@RequestPart String fileName) {
        UploadPhotoResponse url = photoStorageService.generatePresignedUploadUrl(fileName);
        return ResponseEntity.ok(url);
    }

    /**
     * Deletes a photo from storage
     * @param photoUrl URL of the photo to be deleted
     * @return ResponseEntity with no content on successful deletion
     */
    @DeleteMapping
    public ResponseEntity<Void> deletePhoto(@RequestPart String photoUrl) {
        photoStorageService.deletePhoto(photoUrl);
        return ResponseEntity.ok().build();
    }
}
