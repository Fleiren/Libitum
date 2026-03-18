<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\ArtistProfile;
use \App\Models\Event;
use App\Http\Requests\UpdateUserRequest;

class AdminUserController extends Controller
{
    public function index(Request $request)
    {
        if(!Auth::user()->hasRole('admin')){       
            return response()->json(['error' => true, 'message' => 'Solo los administradores pueden acceder a esta sección.', 'code' => 403], 403);         
        }

        //Cambiar más adelante a paginate para no cargar todos los usuarios de golpe.
        $users = User::with(['roles', 'artistProfile'])->get();

        
        return response()->json(['error' => false, 'message' => 'Lista de usuarios recuperada', 'data' => $users, 'code' => 200], 200);
        

        
    }

    public function show(Request $request, $id){
        $user = User::with(['roles', 'artistProfile'])->findOrFail($id);
        $roleName = $user->getRoleNames()->first() ?? 'spectator';
       
        return response()->json(['error' => false, 'message' => 'Usuario recuperado', 'data' => $user, 'role' => $roleName, 'code' => 200], 200);
        
        
    }

    public function update(UpdateUserRequest $request, $id){
         $user = User::findOrFail($id);

        DB::transaction(function () use ($user, $request) {
            // Actualizamos los datos básicos
            $user->update($request->only(['name', 'surname', 'email']));

            // Si el admin ha mandado un rol nuevo, usamos Spatie para cambiarlo
            if ($request->has('role')) {
                $newRole = $request->role;
                // syncRoles borra el rol anterior y le pone el nuevo
                $user->syncRoles([$newRole]); 

                //creamos la tabla de artista si el nuevo rol es artist y no tiene perfil de artista.
                if($newRole === 'artist' && !$user->artistProfile){
                    ArtistProfile::create([
                        'user_id' => $user->id,
                    ]);
                }
            }
        });

        $user->load(['roles', 'artistProfile']); // Recargamos las relaciones para que el frontend tenga la info actualizada.
        $roleName = $user->getRoleNames()->first() ?? 'spectator';

        
            return response()->json([
                'error' => false, 
                'message' => 'Usuario actualizado correctamente', 
                'data' => [
                    'user' => $user,
                    'role_name' => $roleName
                ],
                'code' => 200
            ], 200);
        

        
    }

    public function destroy(Request $request, $id){
        $user = User::findOrFail($id);

        if($user->id === Auth::id()){
            return response()->json(['error' => true, 'message' => 'No puedes borrarte a ti mismo', 'code' => 403], 403);
        }

        DB::transaction(function () use ($user) {
            if ($user->artistProfile) {
                $user->artistProfile()->delete();
            }
            $user->following()->detach(); 
            $user->followers()->detach(); 
            $user->events()->detach(); 
            Event::where('user_id', $user->id)->delete();

            $user->delete();
        });

        
        return response()->json(['error' => false, 'message' => 'Usuario eliminado por el administrador', 'code' => 200], 200);
        

        
    }
}
