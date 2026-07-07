<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Meeting;
use App\Models\Expense;
use Illuminate\Http\Request;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function stats()
    {
        $today = Carbon::today()->toDateString();

        $totalClients = Client::count();
        $upcomingMeetingsCount = Meeting::where('status', 'Upcoming')->count();
        $todayMeetingsCount = Meeting::whereDate('meeting_date', $today)->count();
        $totalExpenses = Expense::sum('amount');

        // Upcoming meetings table (limit 5)
        $upcomingMeetings = Meeting::with('client')
            ->where('status', 'Upcoming')
            ->orderBy('meeting_date', 'asc')
            ->orderBy('meeting_time', 'asc')
            ->limit(5)
            ->get();

        // Recent expenses table (limit 5)
        $recentExpenses = Expense::with('client')
            ->orderBy('expense_date', 'desc')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        return response()->json([
            'total_clients' => $totalClients,
            'upcoming_meetings_count' => $upcomingMeetingsCount,
            'today_meetings_count' => $todayMeetingsCount,
            'total_expenses' => (float)$totalExpenses,
            'upcoming_meetings' => $upcomingMeetings,
            'recent_expenses' => $recentExpenses
        ]);
    }
}
