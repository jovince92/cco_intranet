<?php

use App\Models\User;
use App\Models\UserAttendance;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});




Route::middleware('api')->post('/attendance/', function (Request $request) {
    $search=$request->search;
    $dt=!$search?Carbon::now()->format('Y-m-d'):Carbon::parse($search)->format('Y-m-d');
    $cco_users = User::select('company_id')->where('department','CCO')->get();
    $ids = $cco_users->pluck('company_id');
    
    
    $config=[
        'token' => 'JIGQ0PAI7AI3D152IOJVM',
        'id_number'=>$ids,
        //'log_date'=>'2024-03-21'
        'log_date'=>$dt
    ];
    $hrms_response1 = Http::retry(10, 100)->withoutVerifying()->asForm()->post('idcsi-officesuites.com:8080/mail/api/getDailyAttendance',[
        'postData'=>json_encode($config)
    ]);
    $hrms_response2 = Http::retry(10, 100)->withoutVerifying()->asForm()->post('idcsi-officesuites.com:8082/mail/api/getDailyAttendance',[
        'postData'=>json_encode($config)
    ]);
    $response=array_merge($hrms_response2['message'],$hrms_response1['message']);
    /*
    response type = {
        id_number:string
        time_in:string
        time_out:string
    }[]
    */
    DB::transaction(function () use ($response,$dt){
        foreach($response as $res){
            $user_id = User::where('company_id',$res['id_number'])->first()->id;
            $attendance = UserAttendance::where('user_id',$user_id)->where('date',$dt)->first();
            if($attendance){
                if($attendance->edited_time_in==0){
                    $attendance->update([
                        'time_in'=>$res['time_in']=='0000-00-00 00:00:00'?null:Carbon::parse($res['time_in']),
                    ]);
                }
                if($attendance->edited_time_out==0){
                    $attendance->update([
                        'time_out'=>$res['time_out']=='0000-00-00 00:00:00'?null:Carbon::parse($res['time_out'])
                    ]);
                }
            }
            if(!$attendance){
                UserAttendance::create([
                    'user_id'=>$user_id,
                    'date'=>$dt,
                    'time_in'=>$res['time_in']=='0000-00-00 00:00:00'?null:Carbon::parse($res['time_in']),
                    'time_out'=>$res['time_out']=='0000-00-00 00:00:00'?null:Carbon::parse($res['time_out'])
                ]);
            }
            /*
            UserAttendance::firstOrCreate([
                'user_id'=>User::where('company_id',$res['id_number'])->first()->id,
                'date'=>$dt
            ],[
                //set as null if either starts with 0000-00-00
                'shift_id'=>User::where('company_id',$res['id_number'])->first()->shift_id,
                'time_in'=>$res['time_in']=='0000-00-00 00:00:00'?null:Carbon::parse($res['time_in']),
                'time_out'=>$res['time_out']=='0000-00-00 00:00:00'?null:Carbon::parse($res['time_out'])
            ]);
            */
        }
    });

    return User::with(['shift','attendances'=>function ($q) use ($dt) {
        $q->where('date',$dt);
    }])->where('department','CCO')->get();

})->name('api.attendances');



Route::middleware('api')->get('/raw', function (Request $request) {
    $search=$request->search;
    $dt=!$search?Carbon::now()->format('Y-m-d'):Carbon::parse($search)->format('Y-m-d');
    $cco_users = User::select('company_id')->where('department','CCO')->get();
    $ids = $cco_users->pluck('company_id');
    
    
    $config=[
        'token' => 'JIGQ0PAI7AI3D152IOJVM',
        'id_number'=>$ids,
        //'log_date'=>'2024-03-21'
        'log_date'=>$dt
    ];
    $hrms_response1 = Http::retry(10, 100)->withoutVerifying()->asForm()->post('idcsi-officesuites.com:8080/mail/api/getDailyAttendance',[
        'postData'=>json_encode($config)
    ]);
    $hrms_response2 = Http::retry(10, 100)->withoutVerifying()->asForm()->post('idcsi-officesuites.com:8082/mail/api/getDailyAttendance',[
        'postData'=>json_encode($config)
    ]);
    $response=array_merge($hrms_response2['message'],$hrms_response1['message']);
    return $response;

})->name('api.raw');