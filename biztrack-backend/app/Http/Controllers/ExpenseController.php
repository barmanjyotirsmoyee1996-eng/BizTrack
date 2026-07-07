<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Http\Requests\ExpenseRequest;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    public function index(Request $request)
    {
        $query = Expense::with('client');

        if ($request->has('category') && $request->category != '') {
            $query->where('category', $request->category);
        }

        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('category', 'like', "%{$search}%")
                  ->orWhere('notes', 'like', "%{$search}%")
                  ->orWhere('payment_mode', 'like', "%{$search}%")
                  ->orWhereHas('client', function($qc) use ($search) {
                      $qc->where('name', 'like', "%{$search}%");
                  });
            });
        }

        $expenses = $query->orderBy('expense_date', 'desc')->paginate(10);

        return response()->json($expenses);
    }

    public function store(ExpenseRequest $request)
    {
        $expense = Expense::create($request->validated());
        $expense->load('client');

        return response()->json($expense, 201);
    }

    public function show(Expense $expense)
    {
        $expense->load('client');
        return response()->json($expense);
    }

    public function update(ExpenseRequest $request, Expense $expense)
    {
        $expense->update($request->validated());
        $expense->load('client');

        return response()->json($expense);
    }

    public function destroy(Expense $expense)
    {
        $expense->delete();

        return response()->json(['message' => 'Expense deleted successfully']);
    }
}
