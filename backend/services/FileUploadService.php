<?php
declare(strict_types=1);

namespace App\Services;

class FileUploadService {
    public static function upload(array $file): string {
        if (!isset($file['tmp_name']) || $file['error'] !== UPLOAD_ERR_OK) {
            throw new \InvalidArgumentException('No file uploaded or upload error encountered.');
        }

        $config = require __DIR__ . '/../config/config.php';
        $uploadConfig = $config['upload'];

        // Size check
        if ($file['size'] > $uploadConfig['max_size']) {
            throw new \InvalidArgumentException('File exceeds maximum allowed size of 5MB.');
        }

        // MIME type check using finfo
        $finfo = new \finfo(FILEINFO_MIME_TYPE);
        $mime = $finfo->file($file['tmp_name']);

        if (!in_array($mime, $uploadConfig['allowed_mimes'], true)) {
            throw new \InvalidArgumentException('Invalid file type. Only JPEG, PNG, and WEBP images are allowed.');
        }

        // Extension check
        $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if (!in_array($extension, $uploadConfig['allowed_exts'], true)) {
            throw new \InvalidArgumentException('Invalid file extension.');
        }

        // Generate safe random filename
        $randomName = bin2hex(random_bytes(16)) . '.' . $extension;
        $targetDir = $uploadConfig['path'];

        if (!is_dir($targetDir)) {
            @mkdir($targetDir, 0755, true);
        }

        $targetPath = $targetDir . '/' . $randomName;

        if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
            throw new \RuntimeException('Failed to save uploaded file.');
        }

        $baseUrl = rtrim($config['app_url'], '/');
        return $baseUrl . '/uploads/' . $randomName;
    }
}
