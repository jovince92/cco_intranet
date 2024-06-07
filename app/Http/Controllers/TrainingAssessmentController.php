<?php

namespace App\Http\Controllers;

use App\Models\TrainingAssessment;
use App\Models\TrainingAssessmentEnumItem;
use App\Models\TrainingAssessmentQuestion;
use App\Models\TrainingAssessmentQuestionChoice;
use App\Models\TrainingFolder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TrainingAssessmentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $count = (TrainingAssessment::where('training_sub_folder_id',$request->training_sub_folder_id)->count())+1;
        TrainingAssessment::create([
            'training_sub_folder_id'=>$request->training_sub_folder_id,
            'user_id'=>Auth::id(),
            'title'=>'Untitled Assessment '.strval($count),
        ]);
        return redirect()->back();
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
    public function edit($main_folder_id,$id)
    {
        $assessment = TrainingAssessment::find($id);
        $main_folder=TrainingFolder::findOrFail($main_folder_id);
        if(!$assessment) return redirect()->route('training_info_system.admin');
        return Inertia::render('TrainingInformationSystemAdmin',['assessment'=>$assessment,'main_folder'=>$main_folder]);
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
        $assessment=TrainingAssessment::findOrFail($id);
        $assessment->delete();
        return redirect()->back();
    }

    public function question_store (Request $request){
        $question_count = TrainingAssessmentQuestion::where('training_assessment_id',$request->training_assessment_id)->count();
        TrainingAssessmentQuestion::create([
            'training_assessment_id'=>$request->training_assessment_id ,
            'question'=> '{"c119729b-a0d1-47c9-9c54-fe6e5697e66c":{"id":"c119729b-a0d1-47c9-9c54-fe6e5697e66c","value":[{"id":"4648310b-e01c-4ec4-8589-12e1c1aa2749","type":"paragraph","children":[{"text":"Untitled Question '.strval($question_count+1).'"}],"props":{"nodeType":"block"}}],"type":"Paragraph","meta":{"order":"0","depth":"0"}}}',
            'answer'=>"",
        ]);
        return redirect()->back();
    }

    public function question_update(Request $request,$id){
        $question = TrainingAssessmentQuestion::findOrFail($id);
        
        
        
        $question->update([
            //'question'=>$question_Str,
            'answer'=>($request->questionType==4 || $request->questionType==5)?'':$request->answer,
            'question_type'=>$request->questionType,
            'points'=>$request->points,
        ]);

        if($request->hasEditedQuestion){
            $question_Str = json_encode($request->question);
            //replace all instances of null with empty string
            $question_Str = str_replace('null', '""', $question_Str);
            $question->update([
                'question'=>$question_Str,
            ]);
        }

        //delete all choices
        $choices = TrainingAssessmentQuestionChoice::where('training_assessment_question_id',$id)->get();
        foreach($choices as $choice){
            $choice->delete();
        }
        //create new choices if question type is 1 or 2
        if($request->questionType==1 || $request->questionType==2){
            foreach($request->choices as $choice){
                TrainingAssessmentQuestionChoice::create([
                    'training_assessment_question_id'=>$id,
                    'choice'=>$choice,
                ]);
            }
        }

        //delete all enum items
        $enum_items = TrainingAssessmentEnumItem::where('training_assessment_question_id',$id)->get();
        foreach($enum_items as $enum_item){
            $enum_item->delete();
        }
        //create new enum items if question type is 4
        if($request->questionType==4){
            foreach($request->enumItems as $enum_item){
                //trim
                $item = trim($enum_item);
                //remove consecutive spaces
                $item = preg_replace('/\s+/', ' ', $item);
                //remove new lines
                $item = str_replace("\n", "", $item);
                TrainingAssessmentEnumItem::create([
                    'training_assessment_question_id'=>$id,
                    'item'=>$item,
                ]);
            }
        }


        return redirect()->back();
    }
}
