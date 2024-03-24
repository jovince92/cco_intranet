<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    use HasFactory;
    protected $guarded=[];
    protected $appends = ['status_str'];

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function getImageAttribute($value){
        if($value && str_contains( strtolower($value),'http')){return $value;}
        if(!$value){return null;}
        return url('/').'/public/'. $value;
    }

    public function getStatusStrAttribute(){
        return strval($this->status);
    }


}
