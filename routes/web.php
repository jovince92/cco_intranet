<?php

use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\HRMSController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProjectHistoryController;
use App\Http\Controllers\SkillController;
use App\Http\Controllers\ViolationController;
use App\Models\Announcement;
use App\Models\ProjectHistory;
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
        Route::post('/archive/{id}',[EmployeeController::class,'archive'])->name('archive');
        Route::post('/supervisor/{id}',[EmployeeController::class,'supervisor'])->name('supervisor');
    });

    Route::middleware(['head_only'])->prefix('project')->name('project.')->group(function(){
        Route::post('/store',[ProjectController::class,'store'])->name('store');
        Route::post('/update/{id}',[ProjectController::class,'update'])->name('update');
    });

    Route::middleware(['head_only'])->prefix('project_history')->name('project_history.')->group(function(){
        Route::get('/{user_id}',[ProjectHistoryController::class,'index'])->name('index');
        Route::post('/store',[ProjectHistoryController::class,'store'])->name('store');
    });

    Route::prefix('skills')->name('skills.')->group(function(){
        Route::post('/store',[SkillController::class,'store'])->name('store');
        Route::post('/destroy/{id}',[SkillController::class,'destroy'])->name('destroy');
    });

    Route::prefix('violation')->name('violation.')->group(function(){
        Route::post('/store',[ViolationController::class,'store'])->name('store');
        Route::post('/destroy/{id}',[ViolationController::class,'destroy'])->name('destroy');
    });

    Route::post('sync', [HRMSController::class, 'sync'])->name('hrms.sync');

    Route::post('shift/store',function(Request $request){
        Shift::create([
            'start_time'=>$request->start_time,
            'end_time'=>$request->end_time,
        ]);
        return redirect()->back();
    })->name('shift.store');
    
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
