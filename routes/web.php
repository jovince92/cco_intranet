<?php

use App\Http\Controllers\AgentAssessmentController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\HRMSController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProjectHistoryController;
use App\Http\Controllers\SkillController;
use App\Http\Controllers\TrainingAssessmentController;
use App\Http\Controllers\TrainingFolderController;
use App\Http\Controllers\TrainingInfoSystemController;
use App\Http\Controllers\ViolationController;
use App\Models\Announcement;
use App\Models\Project;
use App\Models\ProjectHistory;
use App\Models\Shift;
use App\Models\TrainingTopicVersion;
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
        Route::post('/store/{user_id}/{date}',[AttendanceController::class,'store'])->name('store');
        Route::post('/update/{id}',[AttendanceController::class,'update'])->name('update');
        Route::post('/generate_report',[AttendanceController::class,'generate_report'])->name('generate_report');
    });

    Route::middleware(['head_only'])->name('employee.')->prefix('employee')->group(function(){
        Route::get('/',[EmployeeController::class,'index'])->name('index');
        Route::post('/shift/{id}/{date}',[EmployeeController::class,'shift'])->name('shift');
        Route::post('/archive/{id}',[EmployeeController::class,'archive'])->name('archive');
        Route::post('/supervisor/{id}',[EmployeeController::class,'supervisor'])->name('supervisor');        
        Route::get('/search/{params}',[EmployeeController::class,'search'])->name('search');
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

    Route::prefix('training_info_system')->name('training_info_system.')->group(function(){
        Route::get('/',[TrainingInfoSystemController::class,'index'])->name('index');
        Route::get('/admin/{id?}/{sub_folder_id?}',[TrainingInfoSystemController::class,'admin'])->name('admin');
        Route::post('/store',[TrainingInfoSystemController::class,'store'])->name('store');
        Route::post('/destroy/{id}',[TrainingInfoSystemController::class,'destroy'])->name('destroy');
        Route::get('/edit/{id}/{version?}',[TrainingInfoSystemController::class,'edit'])->name('edit');
        Route::get('/edit/beta/{main_folder_id}/{id}/{version?}',[TrainingInfoSystemController::class,'edit2'])->name('edit2');
        Route::post('/update/{id}',[TrainingInfoSystemController::class,'update'])->name('update');
        Route::post('/upload_video/{id}',[TrainingInfoSystemController::class,'upload_video'])->name('upload_video');
        Route::post('/upload_image/{id}',[TrainingInfoSystemController::class,'upload_image'])->name('upload_image');        
        Route::post('/save_draft/{id}/{version}',[TrainingInfoSystemController::class,'save_draft'])->name('save_draft');        
        Route::post('/save_as_new/{id}/',[TrainingInfoSystemController::class,'save_as_new'])->name('save_as_new');
    });

    Route::prefix('training_folder')->name('training_folder.')->group(function(){
        Route::post('/store',[TrainingFolderController::class,'store'])->name('store');
        Route::post('/destroy/{id}',[TrainingFolderController::class,'destroy'])->name('destroy');        
        Route::post('/update/{id}',[TrainingFolderController::class,'update'])->name('update');
        Route::prefix('sub')->name('sub.')->group(function(){
            Route::post('/store',[TrainingFolderController::class,'sub_store'])->name('store');
            Route::post('/update/{id}',[TrainingFolderController::class,'sub_update'])->name('update');
            Route::post('/destroy/{id}',[TrainingFolderController::class,'sub_destroy'])->name('destroy');
        });
    });
    
    Route::middleware(['team_leader'])->prefix('assessment')->name('assessment.')->group(function(){
        //admin side
        Route::get('/',[TrainingAssessmentController::class,'index'])->name('index');
        Route::post('/store/',[TrainingAssessmentController::class,'store'])->name('store');
        Route::post('/destroy/{id}',[TrainingAssessmentController::class,'destroy'])->name('destroy');
        Route::post('/update/{id}',[TrainingAssessmentController::class,'update'])->name('update');
        Route::get('/edit/{main_folder_id}/{id}',[TrainingAssessmentController::class,'edit'])->name('edit');
        Route::prefix('questions')->name('questions.')->group(function(){
            Route::post('/store',[TrainingAssessmentController::class,'question_store'])->name('store');
            Route::post('/update/{id}',[TrainingAssessmentController::class,'question_update'])->name('update');
            Route::post('/destroy/{id}',[TrainingAssessmentController::class,'question_destroy'])->name('destroy');
            Route::post('/upload_video/{id}',[TrainingAssessmentController::class,'question_upload_video'])->name('upload_video');
            Route::post('/upload_image/{id}',[TrainingAssessmentController::class,'question_upload_image'])->name('upload_image');
        });
        Route::prefix('links')->name('links.')->group(function(){
            Route::post('/store',[TrainingAssessmentController::class,'link_store'])->name('store');
        });

        Route::prefix('agent')->name('agent.')->group(function(){            
            Route::get('/show/{uuid}',[AgentAssessmentController::class,'show'])->name('show');
            Route::post('/store',[AgentAssessmentController::class,'store'])->name('store');
        });
        
        Route::post('manual_check',[TrainingAssessmentController::class,'manual_check'])->name('manual_check');
    });

    

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



Route::get('/test/', function (Request $request) {
    
    echo $request->id;
    
})->name('test');
