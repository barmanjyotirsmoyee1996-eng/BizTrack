<?php

namespace App\Http\Controllers;

use App\Models\Meeting;
use App\Http\Requests\MeetingRequest;
use Illuminate\Http\Request;

class MeetingController extends Controller
{
    public function index(Request $request)
    {
        $query = Meeting::with('client');

        if ($request->has('status') && $request->status != '') {
            $query->where('status', $request->status);
        }

        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->whereHas('client', function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('company', 'like', "%{$search}%");
            });
        }

        // Return sorted by date/time
        $meetings = $query->orderBy('meeting_date', 'desc')
                          ->orderBy('meeting_time', 'desc')
                          ->paginate(10);

        return response()->json($meetings);
    }

    public function store(MeetingRequest $request)
    {
        $meeting = Meeting::create($request->validated());
        $meeting->load('client');

        return response()->json($meeting, 201);
    }

    public function show(Meeting $meeting)
    {
        $meeting->load('client');
        return response()->json($meeting);
    }

    public function update(MeetingRequest $request, Meeting $meeting)
    {
        $meeting->update($request->validated());
        $meeting->load('client');

        return response()->json($meeting);
    }

    public function destroy(Meeting $meeting)
    {
        $meeting->delete();

        return response()->json(['message' => 'Meeting deleted successfully']);
    }
}
