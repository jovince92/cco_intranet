<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\ValidationException;

class HRMSController extends Controller
{
    public function store(Request $request){
        $company_id=$request->company_id;

        $check = Http::asForm()->post('idcsi-officesuites.com:8080/hrms/api.php',[
            'idno' => $company_id,
            'what' => 'is_id_exists',
            'apitoken' => 'IUQ0PAI7AI3D162IOKJH'
        ]);

        $manila=$check['code']=="0"?1:0;
    

        $password=$request->password;

        $url = $manila==1?'idcsi-officesuites.com:8080/hrms/sso.php':'idcsi-officesuites.com:8082/hrms/sso.php';


        $response = Http::asForm()->post($url,[
            'username' => $company_id,
            'password' => $password
        ]);

        if($response['code']!="0"){
            throw ValidationException::withMessages(['company_id'=>$response['message']??'Invalid Credentials']);
        }

        
        $api = $manila==1?'idcsi-officesuites.com:8080/hrms/api.php':'idcsi-officesuites.com:8082/hrms/api.php';
        
        $hrms_response = Http::asForm()->post($api,[
            'idno' => $company_id,
            'what' => 'getinfo',
            'field' => 'personal',
            'apitoken' => 'IUQ0PAI7AI3D162IOKJH'
        ]);

        
        
        $message= $hrms_response['message'];
        $imageContent = file_get_contents($message['picture_location']);
        $location='uploads/photos/user_'.$company_id.'/';
        $path=public_path($location);
        if (!file_exists($path)) {
            File::makeDirectory($path,0777,true);
        }
        $email=$message['work_email']??"";
        if($imageContent){
            @File::put(str_replace('/','\\',$path).$company_id,$imageContent,true);
        }
        $user=User::updateOrCreate(
        ['company_id'=>$company_id],
        [
            'first_name'=>$message['first_name'],
            'last_name'=>$message['last_name'],
            'photo'=>$imageContent?$location.$company_id:null,
            'email'=>strlen($email)>10?$message['work_email']:null,
            'date_of_birth'=>Carbon::parse($message['date_of_birth']),
            'password'=>bcrypt('password'),
            'position'=>$message['job_job_title'],
            'department'=>$message['project'],
        ]);
        

        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->intended(RouteServiceProvider::HOME);
    }

    public function sync(){
        
        $api1="idcsi-officesuites.com:8080/hrms/api.php";
        $api2="idcsi-officesuites.com:8082/hrms/api.php";

        //FOR NOW, UTILIZE SQL INJECTION TO GET ALL CCO EMPLOYEES - THIS IS UNSAFE AND SHOULD BE CHANGED IN THE FUTURE
        $hrms_response1 = Http::retry(10, 100)->asForm()->post($api1,[
            'idno' => "X' or d.divisions='CCO' or c.location like 'CCO%' or c.jobcode='CCO",
            'what' => 'getinfo',
            'field' => 'acctg',
            'apitoken' => 'IUQ0PAI7AI3D162IOKJH'
        ]);

        

        $hrms_response2 = Http::retry(10, 100)->asForm()->post($api2,[
            'idno' => "X' or d.divisions='CCO' or c.location like 'CCO%' or c.jobcode='CCO",
            'what' => 'getinfo',
            'field' => 'acctg',
            'apitoken' => 'IUQ0PAI7AI3D162IOKJH'
        ]);

        $users = array_merge($hrms_response1['message'],$hrms_response2['message']);

        

        DB::transaction(function () use ($users){
            
            foreach($users as $user){
                User::withoutGlobalScopes()->updateOrCreate(
                    ['company_id'=>$user['idno']],
                    [
                        'first_name'=>$user['first_name'],
                        'last_name'=>$user['last_name'],
                        'middle_name'=>$user['middle_name'],
                        'date_of_birth'=>Carbon::parse($user['birthdate']),
                        'position'=>$user['job_job_title'],
                        'department'=>$user['divisions'],
                        //'project'=>$user['jobcode'],
                        'site'=>$user['job_location'],
                        'date_hired'=>Carbon::parse($user['joined_date']),
                        'password'=>bcrypt('password'),
                        'schedule'=>'',                        
                    ]
                );
            }
            /*
            
            */
        });
        

        
        
        return redirect()->back();
    }

    public function auto_create_teams(){
        $team_leads = User::where('position','like','%lead%')->get();
        foreach($team_leads as $team_lead){
            Team::firstOrCreate(
                [
                    'user_id'=>$team_lead->id
                ],
                [
                'name'=>'Team '.$team_lead->first_name,
            ]);
        }
        return redirect()->route('team.index',['team_id'=>Team::first()->id]);
    }

    public function get_leave_credits(Request $request){
        $res1=DB::connection('mysql_hrms_manila')->table('leave_usage_tbl')
            ->select('employee_id', DB::raw('SUM(leave_value_count) as leave_credits'))
            ->where('leave_status', 'UNUSED')
            ->where('employee_id', $request->employee_id)
            ->groupBy('employee_id')
            ->first();

        if($res1) return $res1;

        $res2=DB::connection('mysql_hrms_leyte')->table('leave_usage_tbl')
            ->select('employee_id', DB::raw('SUM(leave_value_count) as leave_credits'))
            ->where('leave_status', 'UNUSED')
            ->where('employee_id', $request->employee_id)
            ->groupBy('employee_id')
            ->first();

        if($res2) return $res2;
        return [];
    }
}


