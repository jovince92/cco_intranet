<?php

use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\HRMSController;
use App\Models\Announcement;
use App\Models\Shift;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function (Request $request) {
    return Inertia::render('Welcome', [
        'announcements' => Announcement::with(['user','edited_by'])->where('status',1)->orderBy('id','desc')->paginate(7)->withQueryString(),
    ]);
})->name('welcome');


// require __DIR__.'/auth.php';



//AUTH ROUTE GROUP
Route::middleware(['auth'])->group(function () {
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
    Route::name('settings.')->prefix('settings')->group(function(){
        Route::get('/',[AnnouncementController::class,'index'])->name('index');
        Route::post('/store',[AnnouncementController::class,'store'])->name('store');
        Route::post('/update/{id}',[AnnouncementController::class,'update'])->name('update');
        Route::post('/status/{id}',[AnnouncementController::class,'status'])->name('status');
        Route::post('/destroy/{id}',[AnnouncementController::class,'destroy'])->name('destroy');
    });

    Route::name('attendance.')->prefix('attendance')->group(function(){
        Route::middleware(['team_leader'])->get('/{search?}',[AttendanceController::class,'index'])->name('index');
        Route::post('/update/{id}',[AttendanceController::class,'update'])->name('update');
        Route::post('/generate_report',[AttendanceController::class,'generate_report'])->name('generate_report');
    });

    Route::middleware(['head_only'])->name('employee.')->prefix('employee')->group(function(){
        Route::get('/',[EmployeeController::class,'index'])->name('index');
        Route::post('/shift/{id}',[EmployeeController::class,'shift'])->name('shift');
    });

    Route::post('sync', [HRMSController::class, 'sync'])->name('hrms.sync');
    
});









Route::get('/public', function () {
    return null;
})->name('public_route');

Route::middleware(['guest'])->post('login', [HRMSController::class, 'store'])->name('hrms.login');
Route::middleware(['guest'])->get('login', [AuthenticatedSessionController::class, 'create'])->name('login');



Route::get('/test', function () {
    $users = User::where('department','CCO')->limit(100)->get();
    foreach($users as $user){
        $user->update(['shift_id'=>Shift::all()->random()->id]);
    }
    return 'done';
})->name('test');
