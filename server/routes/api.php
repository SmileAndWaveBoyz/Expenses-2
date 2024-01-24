<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\Api\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->group(function(){
    Route::get("/user", function (Request $request) {
        return $request->user();
    });
    Route::post("/logout", [AuthController::class, "logout"]);
    Route::get('/invoices', [InvoiceController::class, 'index']);
    Route::get('/items', [ItemController::class, 'index']);
    Route::post('/newInvoice', [InvoiceController::class, 'store']);
    Route::post('/newDraft', [InvoiceController::class, 'draft']);
    Route::delete('/invoices/{id}', [InvoiceController::class, 'destroy']);
    Route::put('/invoices/{id}', [InvoiceController::class, 'update']);
    Route::put('/updateDraft/{id}', [InvoiceController::class, 'updateDraft']);
    Route::put('/markAsPaid/{id}', [InvoiceController::class, 'markAsPaid']);
});


Route::post("/signup", [AuthController::class, "signup"]);
Route::post("/login", [AuthController::class, "login"]);