<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserAttendance;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($search="")
    {
        $dt=$search!=""?Carbon::parse($search)->format('Y-m-d'):Carbon::now()->format('Y-m-d');
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
                    'time_in'=>$res['time_in'],
                    'time_out'=>$res['time_out']
                ]);
            }
        });
        

        return Inertia::render('Attendance');
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
