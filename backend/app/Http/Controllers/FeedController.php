<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FeedController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        // 1. IDs de artistas seguidos
        $followingIds = $user->following()->pluck('artist_id');

        // 2. Query de eventos: empezamos con los de los seguidos
        $query = Event::with(['artist', 'categories', 'status'])
            ->whereIn('user_id', $followingIds);

        // 3. Aplicamos el filtro de ciudad SI el usuario lo pide (ej: .../api/feed?city=Madrid)
        if ($request->has('city')) {
            $query->whereHas('artist', function($q) use ($request) {
                $q->where('city', $request->city);
            });
        }

        // 4. Obtenemos los resultados ordenados por fecha
        $events = $query->latest()->paginate(10);

        return response()->json([
            'error' => false,
            'data' => $events
        ]);
    }
}