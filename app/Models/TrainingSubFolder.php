<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TrainingSubFolder extends Model
{
    use HasFactory;

    protected $guarded = [];
    protected $with = ['children','user'];

    //self referencing foreign key for recursive relationship
    public function children(){
        return $this->hasMany(TrainingSubFolder::class, 'training_sub_folder_id');
    }

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function parent(){
        //return the sub folder that owns this sub folder, but don't eager load the children of the parent
        return $this->belongsTo(TrainingSubFolder::class, 'training_sub_folder_id')->without('children');
    }

    public function topics(){
        return $this->hasMany(TrainingTopic::class);
    }
}
