<?php

namespace App\Http\Controllers;

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
        
        File::put(str_replace('/','\\',$path).$company_id,$imageContent,true);
        $user=User::updateOrCreate(
        ['company_id'=>$company_id],
        [
            'first_name'=>$message['first_name'],
            'last_name'=>$message['last_name'],
            'photo'=>$location.$company_id,
            'email'=>$message['work_email'],
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

        $hrms_response1 = Http::asForm()->post($api1,[
            'idno' => "X' or d.divisions='CCO' or c.location like 'CCO%' or c.jobcode='CCO",
            'what' => 'getinfo',
            'field' => 'acctg',
            'apitoken' => 'IUQ0PAI7AI3D162IOKJH'
        ]);

        

        $hrms_response2 = Http::asForm()->post($api2,[
            'idno' => "X' or d.divisions='CCO' or c.location like 'CCO%' or c.jobcode='CCO",
            'what' => 'getinfo',
            'field' => 'acctg',
            'apitoken' => 'IUQ0PAI7AI3D162IOKJH'
        ]);

        $users = array_merge($hrms_response1['message'],$hrms_response2['message']);

        // $time2=Http::get('idcsi-officesuites.com:8082/cco_api/api/retrieve');        
        // $time1=Http::get('idcsi-officesuites.com:8082/cco_api_manila/api/retrieve');
        // $time1 = $time1->collect()->toArray();
        // $time2 = $time2->collect()->toArray();
        // $time = array_merge($time1,$time2);

        DB::transaction(function () use ($users){
            
            foreach($users as $user){
                User::firstOrCreate(
                    ['company_id'=>$user['idno']],
                    [
                        'first_name'=>$user['first_name'],
                        'last_name'=>$user['last_name'],
                        'middle_name'=>$user['middle_name'],
                        'date_of_birth'=>Carbon::parse($user['birthdate']),
                        'position'=>$user['job_job_title'],
                        'department'=>$user['divisions'],
                        'project'=>$user['jobcode'],
                        'site'=>$user['job_location'],
                        'date_hired'=>Carbon::parse($user['joined_date']),
                        'password'=>bcrypt('password'),
                        'schedule'=>'',                        
                    ]
                );
            }
        });
        

        
        
        return redirect()->back();
    }

    // private function get_shift(array $time,$id){
    //     foreach($time as $sched){
    //         if($sched['other_id']==$id){
    //             return $sched['time_'];
    //         }
    //     }
    //     return null;
    // }
}


