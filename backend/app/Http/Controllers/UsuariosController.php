<?php

namespace App\Http\Controllers;

use App\Models\Usuarios;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

class UsuariosController extends Controller
{

    public function index()
{
    $usuarios = \App\Models\Usuarios::all();

    return response()->json([
        'status' => 200,
        'usuarios' => $usuarios
    ], 200);
}

    /**
     * Registra um novo usuário (simplificado)
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nome' => 'required|string|max:100',
            'email' => 'required|email|unique:usuarios',
            'senha' => 'required|confirmed|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->messages()
            ], 422);
        }

        $usuario = Usuarios::create([
            'nome' => $request->nome,
    'email' => $request->email,
    'senha' => Hash::make($request->senha)
        ]);

        return response()->json([
            'status' => 201,
            'message' => 'Usuário criado com sucesso',
            'usuario' => $usuario
        ], 201);
    }

    /**
     * Login simulado (sem token)
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'senha' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->messages()
            ], 422);
        }

        $usuario = Usuarios::where('email', $request->email)->first();

        if (!$usuario || !Hash::check($request->senha, $usuario->senha)) {
            return response()->json([
                'status' => 401,
                'message' => 'Credenciais inválidas'
            ], 401);
        }

        return response()->json([
            'status' => 200,
            'message' => 'Login simulado com sucesso',
            'usuario' => $usuario
        ], 200);
    }

    /**
     * Atualiza os dados do usuário (versão simplificada)
     */
    public function update(Request $request, $id)
    {
        $usuario = Usuarios::find($id);
        
        if (!$usuario) {
            return response()->json([
                'status' => 404,
                'message' => 'Usuário não encontrado'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'nome' => 'sometimes|string|max:100',
            'email' => 'sometimes|email|unique:usuarios,email,'.$usuario->id,
            'senha' => 'sometimes|confirmed|min:8'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->messages()
            ], 422);
        }

        $data = [
            'nome' => $request->nome ?? $usuario->nome,
            'email' => $request->email ?? $usuario->email
        ];

        if ($request->has('senha')) {
            $data['senha'] = Hash::make($request->senha);
        }

        $usuario->update($data);

        return response()->json([
            'status' => 200,
            'message' => 'Dados atualizados com sucesso',
            'usuario' => $usuario
        ], 200);
    }

    /**
     * Remove um usuário (versão simplificada)
     */
    public function destroy($id)
    {
        $usuario = Usuarios::find($id);
        
        if (!$usuario) {
            return response()->json([
                'status' => 404,
                'message' => 'Usuário não encontrado'
            ], 404);
        }

        $usuario->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Usuário removido com sucesso'
        ], 200);
    }
}