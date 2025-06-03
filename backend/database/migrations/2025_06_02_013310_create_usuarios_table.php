<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('usuarios', function (Blueprint $table) {
            $table->id();
            $table->string('nome');
            $table->string('email')->unique();
            $table->string('senha');
            $table->rememberToken();
            $table->timestamp('email_verified_at')->nullable();
            $table->timestamps(); // Cria automaticamente 'data_criacao' e 'data_atualizacao'
        });
    }

    public function down()
    {
        Schema::dropIfExists('usuarios');
    }
};