<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Habitos;
use Illuminate\Support\Facades\Validator;

class HabitosController extends Controller
{
    /**
     * Lista todos os hábitos
     */
    public function index()
    { 
        $habitos = Habitos::all();

        return response()->json([
            'status' => 200,
            'habitos' => $habitos
        ], 200);
    }

    /**
     * Cria um novo hábito
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nome' => 'required|string|max:50',
            'meta_diaria' => 'nullable|integer|min:1',
            'usuario_id' => 'required|exists:usuarios,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->messages()
            ], 422);
        }

        $habito = Habitos::create([
            'nome' => $request->nome,
            'meta_diaria' => $request->meta_diaria,
            'usuario_id' => $request->usuario_id,
            'contador' => 0 // Inicia com zero
        ]);

        return response()->json([
            'status' => 201,
            'message' => 'Hábito criado com sucesso!',
            'habito' => $habito
        ], 201);
    }

    /**
     * Mostra um hábito específico
     */
    public function show($id)
    {
        $habito = Habitos::find($id);
        
        if (!$habito) {
            return response()->json([
                'status' => 404,
                'message' => 'Hábito não encontrado'
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'habito' => $habito
        ], 200);
    }

    /**
     * Atualiza um hábito
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'nome' => 'sometimes|string|max:50',
            'meta_diaria' => 'nullable|integer|min:1',
            'contador' => 'sometimes|integer|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->messages()
            ], 422);
        }

        $habito = Habitos::find($id);
        
        if (!$habito) {
            return response()->json([
                'status' => 404,
                'message' => 'Hábito não encontrado'
            ], 404);
        }

        $habito->update($request->only(['nome', 'meta_diaria', 'contador']));

        return response()->json([
            'status' => 200,
            'message' => 'Hábito atualizado com sucesso',
            'habito' => $habito
        ], 200);
    }

    /**
     * Incrementa o contador de um hábito
     */
    public function increment($id)
    {
        $habito = Habitos::find($id);
        
        if (!$habito) {
            return response()->json([
                'status' => 404,
                'message' => 'Hábito não encontrado'
            ], 404);
        }

        $habito->increment('contador');

        return response()->json([
            'status' => 200,
            'message' => 'Contador incrementado',
            'contador' => $habito->contador
        ], 200);
    }

    /**
     * Remove um hábito
     */
    public function destroy($id)
    {
        $habito = Habitos::find($id);
        
        if (!$habito) {
            return response()->json([
                'status' => 404,
                'message' => 'Hábito não encontrado'
            ], 404);
        }

        $habito->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Hábito removido com sucesso'
        ], 200);
    }

    /**
     * Reseta os contadores diários (para ser chamado por um cron job)
     */
    public function resetDailyCounters()
    {
        Habitos::query()->update(['contador' => 0]);

        return response()->json([
            'status' => 200,
            'message' => 'Contadores resetados'
        ], 200);
    }
}