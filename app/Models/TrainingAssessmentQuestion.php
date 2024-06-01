<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TrainingAssessmentQuestion extends Model
{
    use HasFactory;
    protected $guarded=[];

    public function getContentAttribute($value)    {
        
        return json_decode($value); 
    }
}
