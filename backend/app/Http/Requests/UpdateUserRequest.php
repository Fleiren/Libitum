<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Utilizamos true ya que esto lo controlamos mediante middleware en el controlador, y así evitamos problemas con la validación de roles en esta clase.
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $userId = $this->route('id'); // Obtenemos el ID del usuario desde la ruta
        return [
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,'.$userId, // Validamos que el email sea único, pero ignoramos el email del usuario actual
            'role' => 'sometimes|string|in:admin,artist,spectator' // Validamos que el rol exista
        ];
    }
}
