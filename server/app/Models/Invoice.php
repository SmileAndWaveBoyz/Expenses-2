<?php

namespace App\Models;

use App\Models\Item;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Invoice extends Model
{
    protected $fillable = [
        'clientAddress_city',
        'clientAddress_country',
        'clientAddress_postCode',
        'clientAddress_street',
        'clientEmail',
        'clientName',
        'createdAt',
        'description',
        'paymentTerms',
        'senderAddress_city',
        'senderAddress_country',
        'senderAddress_postCode',
        'senderAddress_street',
        'status',
        'paymentDue',
        'total',
        'invoiceID',
    ];

    public function items()
    {
        return $this->hasMany(Item::class);
    }
}
