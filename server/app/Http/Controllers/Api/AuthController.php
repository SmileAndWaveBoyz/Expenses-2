<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Requests\LoginRequest;
use App\Http\Controllers\Controller;
use App\Http\Requests\SignupRequest;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    
    public function signup(SignupRequest $request) {
        $data = $request->validated();
        /** @var \App\Models\User $user */
        $user = User::create([
            'name' => $data['name'],
            'surname' => $data['surname'],
            'email' => $data['email'],
            'password' => $data['password']
        ]);
        
        $token = $user->createToken("main")->plainTextToken;
        
        return response([
            "user" => $user,
            "token" => $token
        ]);
        
    }
    
    public function login(LoginRequest $request) 
    {
        $credentials = $request->validated();

        if (!Auth::attempt($credentials)) {
            return response([
                "message" => "Email or password is incorrect"
            ],422);
        }

        /** @var User $user*/
        $user = Auth::user();
        $token = $user->createToken("main")->plainTextToken;
        
        return response([
            "user" => $user,
            "token" => $token
        ]);
    }

    public function logout(Request $request) 
    {
        /** @var User $user */   
        $user = $request->user();
        $user->currentAccessToken()->delete();
        return response("", 204);
    }

}
