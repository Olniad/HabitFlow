<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Habitos extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'nome',
        'contador',
        'meta_diaria',
        'usuario_id',
    ];

    protected $casts = [
        'data_criacao' => 'datetime',
        'data_atualizacao' => 'datetime',
        'meta_diaria' => 'integer',
        'contador' => 'integer',
    ];

    // Relacionamento com usuário
    public function usuario()
    {
        return $this->belongsTo(Usuarios::class, 'usuario_id');
    }

    // Escopo para hábitos com meta alcançada
    public function scopeMetaAlcancada($query)
    {
        return $query->whereColumn('contador', '>=', 'meta_diaria');
    }

    // Mutator para nome
    public function setNomeAttribute($value)
    {
        $this->attributes['nome'] = ucfirst(strtolower($value));
    }
}