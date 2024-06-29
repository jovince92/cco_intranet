<?php

namespace App\Http\Controllers;

use App\Models\IndividualPerformanceMetric;
use App\Models\IndividualPerformanceUserMetric;
use App\Models\Project;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\HttpException;

class IndividualPerformanceController extends Controller
{
    public function index(Request $request,$project_id=null){
        if(!$project_id) return $this->redirectIfNoProjectId(false);
        $agents = $this->is_admin()||$this->is_team_lead()?User::where('project_id',$project_id)->get():User::where('project_id',$project_id)->where('id',Auth::id())->get();
        $company_id = $request->company_id;
        $from=isset($request->date['from'])?Carbon::parse($request->date['from'])->format('Y-m-d'):null;
        $to=isset($request->date['to'])?Carbon::parse($request->date['to'])->addDay()->format('Y-m-d'):$from;
        $user=$company_id?User::where('company_id',$company_id)->where('project_id',$project_id)->firstOrFail():null;
        
        $user_metrics = $user? IndividualPerformanceUserMetric::with(['metric'])
            ->when($from && !$to,function($query) use($from){
                $query->where('date',$from);
            })
            ->when($from && $to,function($query) use($from,$to){
                $query->whereBetween('date',[$from,$to]);
            })
            ->where('user_id',$user->id)
            ->get()
            :null;
        return Inertia::render('IndividualPerformanceDashboard',[
            'is_admin'=>$this->is_admin(),
            'is_team_leader'=>$this->is_team_lead(),
            'project'=>Project::findOrFail($project_id),
            'agents'=>$agents,
            'user_metrics'=>$user_metrics,
            'date_range'=>$request->date,
            'agent'=>$user,
        ]);
    }

    public function team($project_id=null){
        if(!$project_id) return $this->redirectIfNoProjectId(true);
        /**
         * TODO: TEAM DASHBOARD
         */
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

    public function destroy($metric_id){
        if(!$this->is_admin()) abort(403);
        $metric=IndividualPerformanceMetric::findOrFail($metric_id);
        $metric->delete();
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
