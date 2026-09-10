<?php
declare(strict_types=1);

/**
 * Kranti Furnitures & Electronics - Backend REST API Entry Point
 */

// Basic Class Autoloader
spl_autoload_register(function ($class) {
    $prefix = 'App\\';
    $baseDir = __DIR__ . '/';

    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        return;
    }

    $relativeClass = substr($class, $len);
    
    // Map App\Config\X to config/X.php, App\Controllers\X to controllers/X.php, etc.
    $parts = explode('\\', $relativeClass);
    $folder = strtolower($parts[0]);
    
    if (count($parts) > 1) {
        $fileName = $parts[count($parts) - 1] . '.php';
        array_pop($parts);
        $subPath = implode('/', array_map('strtolower', $parts));
        $file = $baseDir . $subPath . '/' . $fileName;
    } else {
        $file = $baseDir . strtolower($relativeClass) . '.php';
    }

    if (file_exists($file)) {
        require_once $file;
    }
});

// Require config & routes
require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/routes/api.php';

try {
    \App\Routes\Router::dispatch();
} catch (\Throwable $e) {
    \App\Helpers\Logger::log('CRITICAL', 'Unhandled Exception: ' . $e->getMessage(), [
        'file' => $e->getFile(),
        'line' => $e->getLine(),
    ]);
    \App\Helpers\Response::serverError('An unexpected error occurred. Please try again later.');
}
