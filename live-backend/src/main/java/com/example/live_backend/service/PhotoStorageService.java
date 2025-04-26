package com.example.live_backend.service;

// Java standard imports
import java.net.URI;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.UUID;

// Spring imports
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

// AWS imports
import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;

// Project imports
import com.example.live_backend.dto.photo.UploadPhotoResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PhotoStorageService {
    
    private final AmazonS3 amazonS3;

    @Value("${app.s3.bucket}")
    private String bucketName;

    /**
     * Deletes a photo from S3 bucket using its URL
     * @param photoUrl The complete URL of the photo to delete
     */
    public void deletePhoto(String photoUrl) {
        String key = parseKeyFromUrl(photoUrl);
        amazonS3.deleteObject(bucketName, key);
    }

    /**
     * Generates a pre-signed URL for photo upload and returns both upload and public URLs
     * @param fileName The name of the file to be uploaded
     * @return UploadPhotoResponse containing both the pre-signed upload URL and the future public URL
     */
    public UploadPhotoResponse generatePresignedUploadUrl(String fileName) {
        String key = UUID.randomUUID().toString() + "_" + fileName;

        GeneratePresignedUrlRequest generatePresignedUrlRequest =
                new GeneratePresignedUrlRequest(bucketName, key)
                        .withMethod(HttpMethod.PUT)
                        .withExpiration(Date.from(Instant.now().plus(15, ChronoUnit.MINUTES)));

        String uploadUrl  = amazonS3.generatePresignedUrl(generatePresignedUrlRequest).toString();
        String publicUrl  = amazonS3.getUrl(bucketName, key).toString();
        return new UploadPhotoResponse(uploadUrl, publicUrl);
    }

    /**
     * Generates a public URL for accessing a photo in S3
     * @param key The S3 object key
     * @return String containing the public URL
     */
    public String generatePublicUrl(String key) {
        return amazonS3.getUrl(bucketName, key).toString();
    }

    /**
     * Extracts the S3 object key from a full URL
     * @param photoUrl The complete URL of the photo
     * @return String containing the extracted key
     */
    private String parseKeyFromUrl(String photoUrl) {
        URI uri = URI.create(photoUrl);
        String path = uri.getPath(); 
        return path.startsWith("/") ? path.substring(1) : path;
    }
}
