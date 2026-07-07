<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ExpenseRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'client_id' => 'nullable|exists:clients,id',
            'category' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'payment_mode' => 'required|string|in:Cash,Card,UPI,Bank Transfer',
            'expense_date' => 'required|date',
            'notes' => 'nullable|string',
        ];
    }
}
