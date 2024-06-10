<?php

namespace App\Http\Controllers;

use App\Models\TrainingAssessment;
use App\Models\TrainingAssessmentLink;
use App\Models\TrainingAssessmentResult;
use App\Models\TrainingAssessmentResultAnswer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AgentAssessmentController extends Controller
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
        $assessment = TrainingAssessment::findOrFail($request->training_assessment_id);
        $max_score = $assessment->questions->sum('points');
        $result = TrainingAssessmentResult::create([
            'training_assessment_id '=>$assessment->id,
            'user_id'=>Auth::user()->id,
            'max_score'=>$max_score,
            'user_score'=>0,
            'passing_score'=>$assessment->passing_score,
        ]);

        foreach($request->userAnswers as $userAnswer){
            $question = $assessment->questions->where('id',$userAnswer['question_id'])->first();
            $question_text = $question->question;
            if($question->question_type===1){
                $score = $question->answer === $userAnswer['answer']?$question->points:0;
                TrainingAssessmentResultAnswer::create([
                    'training_assessment_result_id'=>$result->id,
                    'question'=>$question_text,
                    'correct_answer'=>$question->answer,
                    'user_answer'=>$userAnswer['answer'],
                    'score'=>$score,
                    'points'=>$question->points,
                ]);
            }

            if($question->question_type===1){
                $userAnswers = explode('|',$userAnswer['answer']);
                $correctAnswers = explode('|',$question->answer);
                //intersect userAnswers and correctAnswers - the number of elements in the resulting array is the score
                $score = count(array_intersect($userAnswers,$correctAnswers));
            }
        }

        return redirect()->back();
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($uuid)
    {
        //get link from TrainingAssessmentLink where uuid is equal to $uuid, valid_until is greater than now and archived is 0
        $link = TrainingAssessmentLink::where('uuid',$uuid)->where('valid_until','>',now())->where('archived',0)->first();
        $assessment = $link->assessment??null;
        if (!$assessment) return Inertia::render('TrainingInformationSystem/Agent/TrainingAssessmentNotFoundPage');

        //check if logged in user has already taken the assessment
        $result = TrainingAssessmentResult::where('user_id',auth()->user()->id)->where('training_assessment_id',$assessment->id)->first();
        if($result) return Inertia::render('TrainingInformationSystem/Agent/TrainingAssessmentResultPage',['assessment_title'=>$assessment->title]);
        //remove answer from $assessment->questions
        foreach($assessment->questions as $question){
            $question->answer = "";
        }
        //also remove enum_items from $assessment->questions
        foreach($assessment->questions as $question){
            $question->enum_items = [];
        }
        return Inertia::render('TrainingInformationSystem/Agent/TrainingAssessmentPage',['assessment'=>$link->assessment,'uuid'=>$uuid]);
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
