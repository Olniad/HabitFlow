<?php

return [
    'defaults' => [
        'guard' => 'api',  // Alterado para 'api' como padrão
        'passwords' => 'usuarios',  // Alterado para 'usuarios'
    ],

    'guards' => [
        'web' => [
            'driver' => 'session',
            'provider' => 'usuarios',  // Alterado para 'usuarios'
        ],
        
        'api' => [
            'driver' => 'sanctum',  // Usando Sanctum para API
            'provider' => 'usuarios',
            'hash' => false,
        ],
    ],

    'providers' => [
        'usuarios' => [  // Nome do provider alterado
            'driver' => 'eloquent',
            'model' => App\Models\Usuario::class,  // Model correto
        ],
    ],

    'passwords' => [
        'usuarios' => [  // Nome do broker alterado
            'provider' => 'usuarios',
            'table' => 'password_reset_tokens',
            'expire' => 60,
            'throttle' => 60,
        ],
    ],

    'password_timeout' => 10800,
];
