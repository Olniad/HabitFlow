<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HabitosController;
use App\Http\Controllers\UsuariosController;

Route::get('/test', function() {
    return response()->json(['status' => 'ok']);
});

// Rotas de saúde da API
Route::get('/health', function () {
    return response()->json([
        'status' => 'online',
        'version' => '1.0.0',
        'timestamp' => now()->toDateTimeString()
    ]);
});

Route::put('/usuarios/{id}', [UsuariosController::class, 'update']);
Route::post('/teste-post', function(Request $request) {
    return response()->json(['message' => 'POST recebido!', 'data' => $request->all()]);
});


// Rotas de hábitos (totalmente públicas)
Route::get('/habitos', [HabitosController::class, 'index']);           // Listar todos hábitos
Route::post('/habitos', [HabitosController::class, 'store']);         // Criar novo hábito
Route::get('/habitos/{id}', [HabitosController::class, 'show']);       // Mostrar hábito específico
Route::put('/habitos/{id}', [HabitosController::class, 'update']);     // Atualizar hábito
Route::delete('/habitos/{id}', [HabitosController::class, 'destroy']); // Deletar hábito
Route::post('/habitos/{id}/increment', [HabitosController::class, 'increment']); // Incrementar contador
Route::post('/habitos/reset-counters', [HabitosController::class, 'resetDailyCounters']); // Resetar contadores

// Rotas de usuário (simuladas sem autenticação)
Route::post('/simulate-register', [UsuariosController::class, 'register']);
Route::post('/simulate-login', [UsuariosController::class, 'login']);

Route::get('/usuarios', [UsuariosController::class, 'index']);        // Listar todos
Route::post('/usuarios/register', [UsuariosController::class, 'register']); // Registrar usuário
Route::delete('/usuarios/{id}', [UsuariosController::class, 'destroy']); // Deletar usuário
