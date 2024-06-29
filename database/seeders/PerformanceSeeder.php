<?php

namespace Database\Seeders;

use App\Models\IndividualPerformanceMetric;
use App\Models\Project;
use App\Models\User;
use Faker\Factory;
use Illuminate\Database\Seeder;

class PerformanceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    /*
        Schema::create('individual_performance_metrics', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('project_id')->index();
            $table->unsignedBigInteger('user_id')->index(); //creator
            $table->string('metric_name');
            $table->integer('goal')->default(0);
            $table->enum('format',[
                'number',
                'percentage',
                'duration',
                'rate',
            ])->default('number');
            $table->string('unit')->nullable();
            //if enum is rate
            $table->string('rate_unit')->nullable();
            $table->timestamps();

            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
        Schema::create('individual_performance_user_metrics', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('individual_performance_metric_id')->index('metric_id');
            $table->unsignedBigInteger('user_id')->index();
            $table->string('value');
            $table->date('date');
            $table->timestamps();

            $table->foreign('individual_performance_metric_id','metric_id')->references('id')->on('individual_performance_metrics')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    */
    /**
     * Call Center Performance Metrics Seeder for Testing Purposes
     */
    public function run()
    {
        $faker = Factory::create();
        $users_with_no_project_id = User::whereNull('project_id')->get();
        foreach($users_with_no_project_id as $user){
            $user->update([
                'project_id'=>Project::all()->random()->id,
            ]);
        }

        $projects = Project::all();

        $metric_names = [
            'Average Handle Time',
            'First Call Resolution',
            'Customer Satisfaction',
            'Net Promoter Score',
            'Service Level',
            'Occupancy Rate',
            'Adherence',
            'Average Speed of Answer',
            'Abandonment Rate',
            'Call Quality',
            'Email Quality',
            'Chat Quality',
            'Schedule Adherence',
            'Average Response Time',
            'Average Resolution Time',
            'Average Wait Time',
            'Number of Calls',
            'Number of Emails',
            'Number of Chats',
        ];

        $number_or_rate_units = [
            'Calls',
            'Emails',
            'Chats',
            'Tickets',
            'Issues',
            'Problems',
            'Complaints',
            'Queries',
            'Requests',            
        ];
        $duration_unit = 'Minutes';
        $percentage_unit = '%';
        $rate_measurement_unit = [
            'Hour',
            'Second',
            'Minute',
            '30 Minutes',
            '90 Minutes',
        ];
        $formats= ['number', 'percentage', 'duration', 'rate'];
        foreach($projects as $project){
            
            $number_of_metrics = $faker->numberBetween(5,12);
            for($m=0;$m<=$number_of_metrics;$m++){
                $project_users = $project->users;
                $format = $faker->randomElement($formats);
                $unit = $format=='number'||$format=='rate'? 
                    $faker->randomElement($number_or_rate_units)
                        :
                        ($format=='duration'?$duration_unit:$percentage_unit);
                $rate_unit = $format=='rate'?$faker->randomElement($rate_measurement_unit):null;
                $goal=$format=='percentage'?$faker->numberBetween(60,90):$faker->numberBetween(50,250);
                $metric = IndividualPerformanceMetric::create([
                    'project_id'=>$project->id,
                    'user_id'=>User::all()->random()->id,
                    'metric_name'=>$faker->randomElement($metric_names),
                    'goal'=>$goal,
                    'format'=>$format,
                    'unit'=>$unit,
                    'rate_unit'=>$rate_unit,
                ]);
                $dates_from_now = [];
                //number of days
                $max_days = $faker->numberBetween(5,50);
                for($i=0;$i<=$max_days;$i++){
                    //go back 1 day from now until $max_days is reached             
                    $dates_from_now[] = date('Y-m-d',strtotime('-'.$i.' days'));
                }
                foreach($project_users as $user){
                    foreach($dates_from_now as $date){                        
                        $min_possible_score = $goal-($goal-50);
                        $max_possible_score = $goal+($goal+100); 
                        $metric->user_metrics()->create([
                            'individual_performance_metric_id'=>$metric->id,
                            'user_id'=>$user->id,
                            'value'=>$format=='percentage'?$faker->numberBetween(0,100):$faker->numberBetween($min_possible_score,$max_possible_score),
                            'date'=>$date,
                        ]);
                    }
                }
            }           

        }
    }
}
