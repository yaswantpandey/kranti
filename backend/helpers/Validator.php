<?php
declare(strict_types=1);

namespace App\Helpers;

class Validator {
    private array $data;
    private array $errors = [];

    public function __construct(array $data) {
        $this->data = $data;
    }

    public static function make(array $data, array $rules): self {
        $validator = new self($data);
        $validator->validate($rules);
        return $validator;
    }

    public function validate(array $rules): void {
        foreach ($rules as $field => $fieldRules) {
            $value = $this->data[$field] ?? null;
            $ruleList = is_string($fieldRules) ? explode('|', $fieldRules) : $fieldRules;

            foreach ($ruleList as $rule) {
                if ($rule === 'required' && ($value === null || (is_string($value) && trim($value) === ''))) {
                    $this->addError($field, "The {$field} field is required.");
                    break;
                }

                if ($value === null || $value === '') {
                    continue;
                }

                if ($rule === 'email' && !filter_var($value, FILTER_VALIDATE_EMAIL)) {
                    $this->addError($field, "Invalid email address format.");
                }

                if (str_starts_with($rule, 'min:')) {
                    $min = (int) substr($rule, 4);
                    if (is_string($value) && mb_strlen($value) < $min) {
                        $this->addError($field, "The {$field} must be at least {$min} characters.");
                    } elseif (is_numeric($value) && $value < $min) {
                        $this->addError($field, "The {$field} must be at least {$min}.");
                    }
                }

                if (str_starts_with($rule, 'max:')) {
                    $max = (int) substr($rule, 4);
                    if (is_string($value) && mb_strlen($value) > $max) {
                        $this->addError($field, "The {$field} may not be greater than {$max} characters.");
                    } elseif (is_numeric($value) && $value > $max) {
                        $this->addError($field, "The {$field} may not be greater than {$max}.");
                    }
                }

                if ($rule === 'numeric' && !is_numeric($value)) {
                    $this->addError($field, "The {$field} must be a number.");
                }

                if ($rule === 'pincode' && (!is_string($value) || !preg_match('/^\d{6}$/', $value))) {
                    $this->addError($field, "Please enter a valid 6-digit Indian PIN code.");
                }

                if ($rule === 'phone' && (!is_string($value) || strlen(preg_replace('/\D/', '', $value)) < 10)) {
                    $this->addError($field, "Please enter a valid 10-digit mobile number.");
                }
            }
        }
    }

    public function addError(string $field, string $message): void {
        if (!isset($this->errors[$field])) {
            $this->errors[$field] = $message;
        }
    }

    public function fails(): bool {
        return !empty($this->errors);
    }

    public function errors(): array {
        return $this->errors;
    }

    public static function sanitize(string $input): string {
        return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
    }
}
