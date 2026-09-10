<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Helpers\Response;
use App\Helpers\Validator;
use App\Middleware\AuthMiddleware;
use App\Models\Address;
use App\Models\User;
use App\Services\AuthService;

class UserController {
    public static function updateProfile(array $body): void {
        $user = AuthMiddleware::handle();

        $validator = Validator::make($body, [
            'first_name' => 'required|min:2|max:50',
            'last_name' => 'required|min:2|max:50',
            'email' => 'required|email',
            'phone' => 'required|phone',
        ]);

        if ($validator->fails()) {
            Response::validationError($validator->errors());
        }

        User::updateProfile((int)$user['id'], $body);
        $updated = User::findById((int)$user['id']);

        Response::success(['user' => $updated], 'Profile updated successfully.');
    }

    public static function changePassword(array $body): void {
        $user = AuthMiddleware::handle();

        $validator = Validator::make($body, [
            'current_password' => 'required',
            'new_password' => 'required|min:6',
        ]);

        if ($validator->fails()) {
            Response::validationError($validator->errors());
        }

        try {
            AuthService::changePassword((int)$user['id'], $body['current_password'], $body['new_password']);
            Response::success([], 'Password updated successfully.');
        } catch (\InvalidArgumentException $e) {
            Response::error($e->getMessage(), 400);
        }
    }

    public static function getAddresses(): void {
        $user = AuthMiddleware::handle();
        $addresses = Address::getByUserId((int)$user['id']);
        Response::success(['addresses' => $addresses], 'User saved addresses.');
    }

    public static function addAddress(array $body): void {
        $user = AuthMiddleware::handle();

        $validator = Validator::make($body, [
            'fullName' => 'required|min:2',
            'phone' => 'required|phone',
            'pincode' => 'required|pincode',
            'addressLine' => 'required|min:10',
        ]);

        if ($validator->fails()) {
            Response::validationError($validator->errors());
        }

        $addressId = Address::create((int)$user['id'], $body);
        $addresses = Address::getByUserId((int)$user['id']);

        Response::success(['id' => $addressId, 'addresses' => $addresses], 'New address saved successfully.', 201);
    }

    public static function deleteAddress(array $params): void {
        $user = AuthMiddleware::handle();
        $id = $params['id'] ?? '';

        if (empty($id)) {
            Response::error('Address ID is required.', 400);
        }

        Address::delete((int)$user['id'], $id);
        $addresses = Address::getByUserId((int)$user['id']);

        Response::success(['addresses' => $addresses], 'Address removed successfully.');
    }
}
