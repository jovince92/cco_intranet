<?php

use Illuminate\Http\Request;
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


Route::post('test',function(Request $request){
    return $request->postData;
    $config=['api_token' => 'JIGQ0PAI7AI3D152IOJVM'];
    $hrms_response = Http::withoutVerifying()->asForm()->post('idcsi-officesuites.com:8080/mail/api/getDepDailyLog',[
        'postData'=>json_encode($config)
    ]);
    return $hrms_response;
});