<?php

namespace App\Http\Controllers;

use App\Models\IndividualPerformanceMetric;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\HttpException;

class IndividualPerformanceController extends Controller
{
    public function index($project_id=null){
        if(!$project_id) return $this->redirectIfNoProjectId(false);
        return Inertia::render('IndividualPerformanceDashboard',[
            'is_admin'=>$this->is_admin(),
            'is_team_leader'=>$this->is_team_lead(),
            'project'=>Project::findOrFail($project_id),
            'agents'=>User::where('project_id',$project_id)->get()
        ]);
    }

    public function team($project_id=null){
        if(!$project_id) return $this->redirectIfNoProjectId(true);
        return Inertia::render('IndividualPerformanceDashboard',[
            'is_admin'=>$this->is_admin(),
            'is_team_leader'=>$this->is_team_lead(),
            'project'=>Project::findOrFail($project_id),
            'agents'=>User::where('project_id',$project_id)->get()
        ]);
    }

    public function settings($project_id=null){
        if(!$this->is_admin()) abort(403);
        return Inertia::render('IndividualPerformanceSettings',[
            'metrics'=>!$project_id?null:IndividualPerformanceMetric::where('project_id',$project_id)->get(),
            'project'=>$project_id?Project::findOrFail($project_id):null
        ]);
    }

    public function store(Request $request){
        if(!$this->is_admin()) abort(403);
        $request->validate([
            'project_id'=>'required|exists:projects,id',
            'metric_name'=>'required',
            'goal'=>'required|numeric',
            'format'=>'required|in:number,percentage,duration,rate',
            'unit'=>'nullable',
            'rate_unit'=>'nullable'
        ]);
        IndividualPerformanceMetric::create([
            'project_id'=>$request->project_id,
            'user_id'=>Auth::id(),
            'metric_name'=>$request->metric_name,
            'goal'=>$request->goal,
            'format'=>$request->format,
            'unit'=>$request->unit,
            'rate_unit'=>$request->rate_unit
        ]);
        return redirect()->back();
    }

    public function update(Request $request,$metric_id){
        if(!$this->is_admin()) abort(403);
        $request->validate([
            'metric_name'=>'required',
            'goal'=>'required|numeric',
            'format'=>'required|in:number,percentage,duration,rate',
            'unit'=>'nullable',
            'rate_unit'=>'nullable'
        ]);
        $metric=IndividualPerformanceMetric::findOrFail($metric_id);
        $metric->update([
            'metric_name'=>$request->metric_name,
            'goal'=>$request->goal,
            'format'=>$request->format,
            'unit'=>$request->unit,
            'rate_unit'=>$request->rate_unit
        ]);
        return redirect()->back();
    }

    private function is_admin():bool{
        $user=Auth::user();
        return $user->position =='OPERATIONS MANAGER'||
            $user->position =='GENERAL MANAGER'||
            $user->position =='PROGRAMMER'||
            $user->position =='OPERATIONS SUPERVISOR'||
            $user->position =='OPERATIONS SUPERVISOR 2'||
            $user->position =='QUALITY ASSURANCE AND TRAINING SUPERVISOR';
    }

    private function is_team_lead():bool{
        $user=Auth::user();
        return $user->position =='TEAM LEADER' ||          
            $user->position =='TEAM LEADER 1'||
            $user->position =='TEAM LEADER 2'||
            $user->position =='TEAM LEADER 3'||
            $user->position =='TEAM LEADER 4'||
            $user->position =='TEAM LEADER 5'||
            $user->position =='TEAM LEADER 6'||
            $this->is_admin();
    }

    private function redirectIfNoProjectId(bool $team){
        $user=Auth::user();
        if(!$this->is_admin() && !$user->project_id) abort(403,'This account is not assigned to any project. Please contact your administrators.');
        if($this->is_admin() && !$team) return redirect()->route('individual_performance_dashboard.index',['project_id'=>Project::first()->id]);
        if($this->is_admin() && $team) return redirect()->route('individual_performance_dashboard.team',['project_id'=>Project::first()->id]);
        if(!$this->is_admin() && !$team) return redirect()->route('individual_performance_dashboard.index',['project_id'=>$user->project_id]);
        if(!$this->is_admin() && $team) return redirect()->route('individual_performance_dashboard.team',['project_id'=>$user->project_id]);
    }
}
