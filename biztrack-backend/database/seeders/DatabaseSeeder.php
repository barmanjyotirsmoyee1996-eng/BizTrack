<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Client;
use App\Models\Meeting;
use App\Models\Expense;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // 1. Seed Administrator Account
        $admin = User::updateOrCreate(
            ['email' => 'admin@biztrack.com'],
            [
                'name' => 'Jyoti Ranjan',
                'password' => Hash::make('password'),
            ]
        );

        // 2. Seed Realistic Corporate Clients
        $clientsData = [
            [
                'name' => 'Sarah Jenkins',
                'company' => 'Apex Digital Solutions',
                'phone' => '+1 (555) 019-2834',
                'email' => 's.jenkins@apexdigital.com',
                'address' => 'Floor 12, Tower B, Metro Park, San Francisco, CA'
            ],
            [
                'name' => 'David Chen',
                'company' => 'Starlight Ventures',
                'phone' => '+1 (555) 014-9982',
                'email' => 'dchen@starlight.vc',
                'address' => '84 Innovation Way, Tech District, Boston, MA'
            ],
            [
                'name' => 'Elena Rostova',
                'company' => 'Nordic Logistics Group',
                'phone' => '+45 89 20 14 55',
                'email' => 'elena.r@nordiclogistics.dk',
                'address' => 'Vestergade 44, Copenhagen, Denmark'
            ],
            [
                'name' => 'Marcus Vance',
                'company' => 'Vance & Associates LLC',
                'phone' => '+1 (555) 017-3388',
                'email' => 'marcus@vancelawyers.com',
                'address' => 'Suite 500, Financial Plaza, Chicago, IL'
            ],
            [
                'name' => 'Hiroshi Tanaka',
                'company' => 'Mirai Robotics Corp',
                'phone' => '+81 3 5555 0122',
                'email' => 'tanaka@mirai-robotics.co.jp',
                'address' => 'Chiyoda-ku 3-2-1, Tokyo, Japan'
            ],
            [
                'name' => 'Olivia Martinez',
                'company' => 'Verdant Agritech',
                'phone' => '+1 (555) 018-4721',
                'email' => 'omartinez@verdantagri.org',
                'address' => 'Route 9 South, Farmingdale, NJ'
            ]
        ];

        $clients = [];
        foreach ($clientsData as $c) {
            $clients[] = Client::updateOrCreate(['email' => $c['email']], $c);
        }

        // 3. Seed Realistic Meetings
        $meetingsData = [
            [
                'client_id' => $clients[0]->id,
                'meeting_date' => Carbon::now()->addDays(2)->toDateString(),
                'meeting_time' => '10:00:00',
                'meeting_type' => 'Online',
                'status' => 'Upcoming',
                'notes' => 'Q3 roadmap review and contract renewal negotiation.'
            ],
            [
                'client_id' => $clients[1]->id,
                'meeting_date' => Carbon::now()->addDays(5)->toDateString(),
                'meeting_time' => '14:30:00',
                'meeting_type' => 'Offline',
                'status' => 'Upcoming',
                'notes' => 'Pitching our new CRM consulting modules. Meeting at their local tech district office.'
            ],
            [
                'client_id' => $clients[2]->id,
                'meeting_date' => Carbon::now()->toDateString(), // Today!
                'meeting_time' => '16:00:00',
                'meeting_type' => 'Online',
                'status' => 'Upcoming',
                'notes' => 'Weekly operational sync. Discussing onboarding flow adjustments.'
            ],
            [
                'client_id' => $clients[3]->id,
                'meeting_date' => Carbon::now()->subDays(3)->toDateString(),
                'meeting_time' => '11:00:00',
                'meeting_type' => 'Online',
                'status' => 'Completed',
                'notes' => 'Introductory discovery call. Identified key pain points in billing automation.'
            ],
            [
                'client_id' => $clients[4]->id,
                'meeting_date' => Carbon::now()->subDays(7)->toDateString(),
                'meeting_time' => '09:30:00',
                'meeting_type' => 'Online',
                'status' => 'Completed',
                'notes' => 'Technical alignment call with their dev leads regarding API integrations.'
            ],
            [
                'client_id' => $clients[0]->id,
                'meeting_date' => Carbon::now()->addDays(10)->toDateString(),
                'meeting_time' => '15:00:00',
                'meeting_type' => 'Online',
                'status' => 'Upcoming',
                'notes' => 'Follow up on security compliance questionnaires.'
            ],
            [
                'client_id' => $clients[5]->id,
                'meeting_date' => Carbon::now()->subDays(2)->toDateString(),
                'meeting_time' => '13:00:00',
                'meeting_type' => 'Offline',
                'status' => 'Cancelled',
                'notes' => 'Client postponed. Will reschedule for late July.'
            ]
        ];

        foreach ($meetingsData as $m) {
            Meeting::create($m);
        }

        // 4. Seed Realistic Expenses
        $expensesData = [
            [
                'client_id' => $clients[0]->id,
                'category' => 'Marketing',
                'amount' => 1250.00,
                'payment_mode' => 'Card',
                'expense_date' => Carbon::now()->subDays(4)->toDateString(),
                'notes' => 'Co-marketing campaign ads on LinkedIn for Apex launch.'
            ],
            [
                'client_id' => $clients[1]->id,
                'category' => 'Travel',
                'amount' => 450.50,
                'payment_mode' => 'Bank Transfer',
                'expense_date' => Carbon::now()->subDays(8)->toDateString(),
                'notes' => 'Flights and transport for onsite engineering workshop.'
            ],
            [
                'client_id' => null, // General
                'category' => 'Software & Tools',
                'amount' => 299.00,
                'payment_mode' => 'Card',
                'expense_date' => Carbon::now()->subDays(12)->toDateString(),
                'notes' => 'Monthly AWS hosting & hosting server resource bill.'
            ],
            [
                'client_id' => $clients[2]->id,
                'category' => 'Travel',
                'amount' => 85.00,
                'payment_mode' => 'Cash',
                'expense_date' => Carbon::now()->subDays(1)->toDateString(),
                'notes' => 'Business lunch meeting with Elena at Copenhagen center.'
            ],
            [
                'client_id' => null,
                'category' => 'Office Supplies',
                'amount' => 140.20,
                'payment_mode' => 'UPI',
                'expense_date' => Carbon::now()->subDays(15)->toDateString(),
                'notes' => 'Whiteboards and stationery setup for team war room.'
            ],
            [
                'client_id' => null,
                'category' => 'Utilities',
                'amount' => 180.00,
                'payment_mode' => 'Bank Transfer',
                'expense_date' => Carbon::now()->subDays(20)->toDateString(),
                'notes' => 'Office high-speed fiber internet subscription.'
            ],
            [
                'client_id' => $clients[4]->id,
                'category' => 'Other',
                'amount' => 500.00,
                'payment_mode' => 'Bank Transfer',
                'expense_date' => Carbon::now()->subDays(6)->toDateString(),
                'notes' => 'Local translation and legal consulting services for Tokyo compliance.'
            ]
        ];

        foreach ($expensesData as $e) {
            Expense::create($e);
        }
    }
}
