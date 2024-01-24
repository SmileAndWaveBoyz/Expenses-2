<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class InvoiceController extends Controller
{
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'clientAddress_city' => 'required|string',
            'clientAddress_country' => 'required|string',
            'clientAddress_postCode' => 'required|string',
            'clientAddress_street' => 'required|string',
            'clientEmail' => 'required|email',
            'clientName' => 'required|string',
            'createdAt' => 'required|date',
            'description' => 'required|string',
            'paymentTerms' => 'required|integer',
            'senderAddress_city' => 'required|string',
            'senderAddress_country' => 'required|string',
            'senderAddress_postCode' => 'required|string',
            'senderAddress_street' => 'required|string',
            'status' => 'required|string',
            'items.*.name' => 'required|string',
            'items.*.quantity' => 'required|integer',
            'items.*.price' => 'required|numeric',
        ]);

        $paymentTerms = $validatedData['paymentTerms'];
        $createdAt = $validatedData['createdAt'];
        
        
        // Calculate paymentDue by adding paymentTerms days to createdAt
        $paymentDue = date('Y-m-d', strtotime($createdAt . ' + ' . $paymentTerms . ' days'));
        
        $validatedData['paymentDue'] = $paymentDue;
        $validatedData['total'] = 0;

        foreach ($validatedData['items'] as $itemData) {
            $validatedData['total'] += $itemData["price"] * $itemData["quantity"];

        }

        $invoiceID = $this->generateUniqueInvoiceID();
        $validatedData['invoiceID'] = $invoiceID;
        
        
        // Create a new invoice
        $invoice = Invoice::create($validatedData);

        // Log::info($invoice);
        
        foreach ($validatedData['items'] as $itemData) {
            $itemData["total"] = $itemData["price"] * $itemData["quantity"];
            $item = new Item($itemData);
            $invoice->items()->save($item);
        }

        return response()->json(['message' => 'Invoice created successfully']);
    }

    public function draft(Request $request)
    {
        $validatedData = $request->validate([
            'clientAddress_city' => 'nullable |string',
            'clientAddress_country' => 'nullable |string',
            'clientAddress_postCode' => 'nullable |string',
            'clientAddress_street' => 'nullable |string',
            'clientEmail' => 'nullable |email',
            'clientName' => 'nullable |string',
            'createdAt' => 'nullable |date',
            'description' => 'nullable |string',
            'paymentTerms' => 'nullable |integer',
            'senderAddress_city' => 'nullable |string',
            'senderAddress_country' => 'nullable |string',
            'senderAddress_postCode' => 'nullable |string',
            'senderAddress_street' => 'nullable |string',
            'status' => 'nullable |string',
            'items.*.name' => 'nullable |string',
            'items.*.quantity' => 'nullable |integer',
            'items.*.price' => 'nullable |numeric',
        ]);
        


        $paymentTerms = $validatedData['paymentTerms'];
        $createdAt = $validatedData['createdAt'];
        
        
        // Calculate paymentDue by adding paymentTerms days to createdAt
        $paymentDue = date('Y-m-d', strtotime($createdAt . ' + ' . $paymentTerms . ' days'));
        
        $validatedData['paymentDue'] = $paymentDue;
        $validatedData['total'] = 0;

        foreach ($validatedData['items'] as $itemData) {
            $validatedData['total'] += $itemData["price"] * $itemData["quantity"];
        }

        $invoiceID = $this->generateUniqueInvoiceID();
        $validatedData['invoiceID'] = $invoiceID;
        
        
        // // Create a new invoice
        $invoice = Invoice::create($validatedData);

        // Log::info($invoice);
        
        foreach ($validatedData['items'] as $itemData) {
            $itemData["total"] = $itemData["price"] * $itemData["quantity"];
            $item = new Item($itemData);
            $invoice->items()->save($item);
        }

        return response()->json(['message' => 'Draft created successfully']);
    }

    public function index()
    {
        $invoices = Invoice::all();

        return response()->json(['invoices' => $invoices], 200);
    }

    private function generateUniqueInvoiceID()
    {
        $letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $numbers = '0123456789';

        $randomLetters = $letters[random_int(0, strlen($letters) - 1)] . $letters[random_int(0, strlen($letters) - 1)];
        $randomNumbers = '';

        // Generate four random numbers
        for ($i = 0; $i < 4; $i++) {
            $randomNumbers .= $numbers[random_int(0, strlen($numbers) - 1)];
        }

        $invoiceID = $randomLetters . $randomNumbers;

        // Check if the generated invoiceID is unique, generate a new one if not
        while (Invoice::where('invoiceID', $invoiceID)->exists()) {
            $invoiceID = $this->generateUniqueInvoiceID();
        }

        return $invoiceID;
    }

    public function destroy($id)
    {
        
        try {
            $invoice = Invoice::findOrFail($id);

            // Delete the corresponding items
            $invoice->items()->delete();

            $invoice->delete();

            return response()->json(null, 204); // Respond with a 204 No Content status
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error deleting invoice'], 500);
        }
    }

    public function update(Request $request, $id)
    {
        // Log::info($id);
        // Log::info($request);
        
        $invoice = Invoice::findOrFail($id);

        // Validate the request data
        $validatedData = $request->validate([
            'clientAddress_city' => 'required|string',
            'clientAddress_country' => 'required|string',
            'clientAddress_postCode' => 'required|string',
            'clientAddress_street' => 'required|string',
            'clientEmail' => 'required|email',
            'clientName' => 'required|string',
            'createdAt' => 'required|date',
            'description' => 'required|string',
            'paymentTerms' => 'required|integer',
            'senderAddress_city' => 'required|string',
            'senderAddress_country' => 'required|string',
            'senderAddress_postCode' => 'required|string',
            'senderAddress_street' => 'required|string',
            'status' => 'required|string',
            'items.*.name' => 'required|string',
            'items.*.quantity' => 'required|integer',
            'items.*.price' => 'required|numeric',
        ]);

        $paymentTerms = $validatedData['paymentTerms'];
        $createdAt = $validatedData['createdAt'];

        $paymentDue = date('Y-m-d', strtotime($createdAt . ' + ' . $paymentTerms . ' days'));
    
        $validatedData['paymentDue'] = $paymentDue;
        $validatedData['total'] = 0;

        foreach ($validatedData['items'] as $itemData) {
            $validatedData['total'] += $itemData["price"] * $itemData["quantity"];
        }

        // Update the invoice attributes
        $invoice->update($validatedData);

        // Delete existing items associated with the invoice
        $invoice->items()->delete();

        // Create and associate new items based on the updated data
        foreach ($validatedData['items'] as $itemData) {
            $itemData['total'] = $itemData['price'] * $itemData['quantity'];
            $item = new Item($itemData);
            $invoice->items()->save($item);
        }

        return response()->json(['message' => 'Invoice updated successfully']);
    }

    public function updateDraft(Request $request, $id)
    {
        // Log::info($id);
        // Log::info($request);
        
        $invoice = Invoice::findOrFail($id);

        // Validate the request data
        $validatedData = $request->validate([
            'clientAddress_city' => 'nullable |string',
            'clientAddress_country' => 'nullable |string',
            'clientAddress_postCode' => 'nullable |string',
            'clientAddress_street' => 'nullable |string',
            'clientEmail' => 'nullable |email',
            'clientName' => 'nullable |string',
            'createdAt' => 'nullable |date',
            'description' => 'nullable |string',
            'paymentTerms' => 'nullable |integer',
            'senderAddress_city' => 'nullable |string',
            'senderAddress_country' => 'nullable |string',
            'senderAddress_postCode' => 'nullable |string',
            'senderAddress_street' => 'nullable |string',
            'status' => 'nullable |string',
            'items.*.name' => 'nullable |string',
            'items.*.quantity' => 'nullable |integer',
            'items.*.price' => 'nullable |numeric',
        ]);

        $paymentTerms = $validatedData['paymentTerms'];
        $createdAt = $validatedData['createdAt'];

        $paymentDue = date('Y-m-d', strtotime($createdAt . ' + ' . $paymentTerms . ' days'));
    
        $validatedData['paymentDue'] = $paymentDue;
        $validatedData['total'] = 0;

        foreach ($validatedData['items'] as $itemData) {
            $validatedData['total'] += $itemData["price"] * $itemData["quantity"];
        }

        // Update the invoice attributes
        $invoice->update($validatedData);

        // Delete existing items associated with the invoice
        $invoice->items()->delete();

        // Create and associate new items based on the updated data
        foreach ($validatedData['items'] as $itemData) {
            $itemData['total'] = $itemData['price'] * $itemData['quantity'];
            $item = new Item($itemData);
            $invoice->items()->save($item);
        }

        return response()->json(['message' => 'Draft updated successfully']);
    }

    public function markAsPaid(Request $request, $id) {
        Log::info($id);
        Log::info($request);

        $invoice = Invoice::findOrFail($id);

        $validatedData = $request->validate([
            'status' => 'nullable |string',
        ]);

        $invoice->update($validatedData);

        return response()->json(['message' => 'Paid, updated successfully']);
    }

}
