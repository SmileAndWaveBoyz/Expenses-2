<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ItemController extends Controller
{
    public function index()
    {
        $items = Item::all();
        Log::info($items);
        return response()->json(['items' => $items], 200);
    }
}
