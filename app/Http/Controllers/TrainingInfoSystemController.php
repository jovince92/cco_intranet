<?php

namespace App\Http\Controllers;

use App\Models\TrainingTopic;
use App\Models\TrainingTopicVersion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;

class TrainingInfoSystemController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Inertia::render('TrainingInformationSystem');
    }

    public function admin()
    {
        $topics = TrainingTopic::with(['current_version','user'])->get();
        return Inertia::render('TrainingInformationSystemAdmin',['topics'=>$topics]);
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
        $topic=TrainingTopic::create([
            'user_id'=>Auth::id(),
            'title'=>'Untitled Topic',
        ]);

        TrainingTopicVersion::create([
            'training_topic_id'=>$topic->id,
            'user_id'=>Auth::id(),
            'content'=>'',
            'version'=>'0.1',
            'is_active'=>1,
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
    public function edit($id)
    {
        $topic = TrainingTopic::with(['current_version','user','versions'])->findOrFail($id);        
        return Inertia::render('TrainingInformationSystem/Admin/TrainingInfoEdit',['topic'=>$topic]);
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
        dd($request);
        $topic = TrainingTopic::findOrFail($id);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        TrainingTopic::findOrFail($id)->delete();
        return redirect()->back();
    }


    public function upload_video(Request $request,$id):string
    {
        
        $request->validate([
            'video'=>'required|mimes:mp4',
        ]);

        $video = $request->file('video') ;
        $video_name=strval($id).'_'.$this->removeSpecialChars($video->getClientOriginalName()).'.'.$video->getClientOriginalExtension();        
        $location='uploads/topic/topic_'.strval($id).'/';
        $path=public_path($location);
        if (!file_exists($path)) {
            File::makeDirectory($path,0777,true);
        }
        $new_video = $location.$video_name;
        $request->file('video')->move($path, $new_video);
        return url('/').'/public/'.$new_video;
    }

    public function upload_image(Request $request,$id):string
    {
        
        $request->validate([
            'image'=>'required|mimes:jpeg,png,jpg',
        ]);

        $image = $request->file('image') ;
        $image_name=strval($id).'_'.$this->removeSpecialChars($image->getClientOriginalName()).'.'.$image->getClientOriginalExtension();        
        $location='uploads/topic/topic_'.strval($id).'/';
        $path=public_path($location);
        if (!file_exists($path)) {
            File::makeDirectory($path,0777,true);
        }
        $new_image = $location.$image_name;
        $request->file('image')->move($path, $new_image);
        return url('/').'/public/'.$new_image;

    }

    private function removeSpecialChars($string) {
        // Use a regular expression to replace any character that is not a letter, a number, or a period with an empty string
        $newString = preg_replace('/[^a-zA-Z0-9.]/', '', $string);
        // Return the new string
        return $newString;
    }
}
