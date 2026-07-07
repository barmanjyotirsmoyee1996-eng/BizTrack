<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MeetingRequest extends FormRequest
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
            'client_id' => 'required|exists:clients,id',
            'meeting_date' => 'required|date',
            'meeting_time' => 'required',
            'meeting_type' => 'required|string|in:Online,Offline',
            'status' => 'required|string|in:Upcoming,Completed,Cancelled',
            'notes' => 'nullable|string',
        ];
    }
}
