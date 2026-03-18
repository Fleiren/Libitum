<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateArtistProfileRequest extends FormRequest
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
        return [
            'bio'=>'nullable|string|max:1000',
            'spotify_url'=>'nullable|url|max:255',
            'instagram_url'=>'nullable|url|max:255',
            'youtube_url'=>'nullable|url|max:255',
            'tiktok_url'=>'nullable|url|max:255',
            'donation_url'=>'nullable|url|max:255',
        ];
    }
}
