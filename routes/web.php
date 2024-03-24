<?php

use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\HRMSController;
use App\Models\Announcement;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;

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
        'announcements' => Announcement::with('user')->orderBy('id','desc')->paginate(7)->withQueryString(),
    ]);
})->name('welcome');


// require __DIR__.'/auth.php';



//AUTH ROUTE GROUP
Route::middleware(['auth'])->group(function () {
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
    Route::name('settings.')->prefix('settings')->group(function(){
        Route::get('/',[AnnouncementController::class,'index'])->name('index');
    });
});

Route::middleware(['guest'])->post('login', [HRMSController::class, 'store'])->name('hrms.login');;




Route::get('/public', function () {
    return null;
})->name('public_route');
