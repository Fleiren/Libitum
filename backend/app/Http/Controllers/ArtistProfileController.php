<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use \App\Models\Event;
use App\Http\Requests\UpdateArtistProfileRequest;


class ArtistProfileController extends Controller
{
   
    public function update(UpdateArtistProfileRequest $request)
    {
        

        Auth::user()->artistProfile->update($request->validated());

        
            return response()->json([
                'error' => false,
                'message' => 'Perfil de artista actualizado correctamente',
                'code' => 200
            ], 200);
        
    }

    public function show(Request $request, $id){
        $artist = User::with(['artistProfile', 'events'])->findOrFail($id);

        if (!$artist->hasRole('artist')) {
        return response()->json(['error' => true, 'message' => 'El usuario no es un artista', 'code' => 404], 404);
        }

      
            return response()->json([
                'error' => false,
                'message' => 'Perfil del artista recuperado',
                'data' => $artist,
                'code' => 200
            ], 200);
        

       
    }

    //Esta función hay que ir ampliándola poco a poco, porque es la más compleja de todas. Aquí se irán añadiendo estadísticas y gráficos para que el artista pueda ver el impacto que tiene su perfil y sus eventos en la plataforma.
    public function statistics(Request $request){
        $artist = $request->user();
        if (!$artist->hasRole('artist')) {
            
                return response()->json(['error' => true, 'message' => 'Solo los artistas tienen estadísticas.', 'code' => 403], 403);
            
            
        }

        $totalFollowers = $artist->followers()->count();

        $newFollowersThisMonth = $artist->followers()
            ->wherePivot('created_at', '>=', now()->subDays(30))
            ->count();

        $totalEvents = Event::where('user_id', $artist->id)->count();

        $stats = [
            'audience' => [
                'total_followers' => $totalFollowers,
                'new_followers_last_30_days' => $newFollowersThisMonth,
            ],
            'events_impact' => [
                'total_events_created' => $totalEvents,
            ]
        ];

        
            return response()->json([
                'error' => false,
                'message' => 'Estadísticas generadas con éxito',
                'data' => $stats,
                'code' => 200
            ], 200);
        

       
    }
}