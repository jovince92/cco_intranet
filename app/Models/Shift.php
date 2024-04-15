<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shift extends Model
{
    use HasFactory;
    protected $guarded = [];
    protected $appends = ['schedule'];
    public function getScheduleAttribute(){
        //remove seconds from time
        $start_time = substr($this->start_time,0,5);
        $end_time = substr($this->end_time,0,5);
        return $start_time.' - '.$end_time;
    }

    protected static function boot()
    {
        parent::boot();

        static::addGlobalScope('order', function (Builder $builder) {
            $builder->orderBy('end_time', 'asc');
        });
    }
}
