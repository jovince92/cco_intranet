<?php

namespace Database\Seeders;

use App\Models\Team;
use App\Models\TeamHistory;
use App\Models\User;
use Illuminate\Database\Seeder;

class TeamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $agents = User::where('position','not like','%lead%')
            ->where('position','not like','%manage%')
            ->where('position','not like','%super%')
            ->get();
        $team_leads = User::where('position','like','%lead%')->get();
        foreach($team_leads as $team_lead){
            Team::create([
                'user_id'=>$team_lead->id,
                'name'=>'Team '.$team_lead->first_name
            ]);
        }
        foreach($agents as $agent){
            $random_team_id=Team::all()->random()->id;
            $agent->update([
                'team_id'=>$random_team_id
            ]);
            TeamHistory::create([
                'team_id'=>$random_team_id,
                'user_id'=>$agent->id,
                'start_date'=>now()
            ]);
        }
    }
}
