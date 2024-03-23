<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
            'password'=>bcrypt('password'),
            'position'=>$message['job_job_title'],
            'department'=>$message['project'],
        ]);
        

        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->intended(RouteServiceProvider::HOME);
    }
}
