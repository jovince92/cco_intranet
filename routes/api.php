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


// Route::post('test',function(Request $request){
//     return $request->postData;
//     $config=['api_token' => 'JIGQ0PAI7AI3D152IOJVM'];
//     $hrms_response = Http::withoutVerifying()->asForm()->post('idcsi-officesuites.com:8080/mail/api/getDepDailyLog',[
//         'postData'=>json_encode($config)
//     ]);
//     return $hrms_response;
// });


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
    $hrms_response1 = Http::withoutVerifying()->asForm()->post('idcsi-officesuites.com:8080/mail/api/getDailyAttendance',[
        'postData'=>json_encode($config)
    ]);
    $hrms_response2 = Http::withoutVerifying()->asForm()->post('idcsi-officesuites.com:8082/mail/api/getDailyAttendance',[
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
            UserAttendance::firstOrCreate([
                'user_id'=>User::where('company_id',$res['id_number'])->first()->id,
                'date'=>$dt
            ],[
                //set as null if either starts with 0000-00-00
                'time_in'=>$res['time_in']=='0000-00-00 00:00:00'?null:Carbon::parse($res['time_in']),
                'time_out'=>$res['time_out']=='0000-00-00 00:00:00'?null:Carbon::parse($res['time_out'])
            ]);
        }
    });

    return User::with(['shift','attendances'=>function ($q) use ($dt) {
        $q->where('date',$dt);
    }])->where('department','CCO')->get();

})->name('api.attendances');