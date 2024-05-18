<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TrainingTopic extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function versions()
    {
        return $this->hasMany(TrainingTopicVersion::class);
    }

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function current_version(){
        return $this->hasOne(TrainingTopicVersion::class)->where('is_active',1);
    }
}
