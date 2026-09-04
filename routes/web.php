<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WeatherController;
use App\Http\Controllers\ForecastController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\SatelliteController;
use App\Http\Controllers\AlertController;
use App\Http\Controllers\RiskController;

Route::prefix('weather')->group(function () {
    Route::get('/current', [WeatherController::class, 'current']);
    Route::get('/forecast', [ForecastController::class, 'index']);
    Route::get('/risk', [RiskController::class, 'show']);
    Route::get('/alerts', [AlertController::class, 'index']);
});

Route::prefix('location')->group(function () {
    Route::get('/search', [LocationController::class, 'search']);
    Route::get('/reverse', [LocationController::class, 'reverse']);
});

Route::prefix('satellite')->group(function () {
    Route::get('/frames', [SatelliteController::class, 'frames']);
});