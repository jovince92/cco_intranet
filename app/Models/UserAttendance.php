<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserAttendance extends Model
{
    use HasFactory;
    protected $guarded=[];
    protected $appends = ['is_tardy'];
    public function user(){
        return $this->belongsTo(User::class);
    }

    public function getIsTardyAttribute(){
        $user=$this->user;
        // if the users has no shift_id, return 'Shift not set'
        if(!$user->shift_id ) return 'Shift not set';
        //if the user has no time_in, return empty string
        if(!$this->time_in) return 'No Time In/Absent';
        //get the shift of the user
        $shift = $this->user->shift;
        //get the time in of the user in seconds
        $time_in = strtotime($this->time_in);
        //get the time in of the shift in seconds
        $shift_time_in = strtotime($shift->start_time);
        //calculate the difference between the time in of the user and the time in of the shift
        $diff =  $time_in-$shift_time_in  ;
        //if $diff is greater than 0 and less than 8 hours, return $diff in hh:mm:ss format
        if($diff > 0 && $diff < 28800) return $this->secondsToTime($diff);
        //use this if the shift is night shift
        if($diff < -43200){
            $diff = abs(abs($diff) - 86400);
            return $this->secondsToTime($diff);
        }
        return 'No';
    }

    //function to convert time to seconds
    private function timeToSeconds($time) {
        $strTime = strval($time);
        $parts = explode(':', $strTime);
        $hours = (int)$parts[0];
        $minutes = (int)$parts[1];
        $seconds = (int)$parts[2];
    
        return ($hours * 3600) + ($minutes * 60) + $seconds;
    }
    //reverse the function above
    function secondsToTime($seconds) {
        $seconds = abs($seconds);
        $hours = floor($seconds / 3600);
        $minutes = floor(($seconds % 3600) / 60);
        $seconds = $seconds % 60;
    
        return sprintf("%02d:%02d:%02d", $hours, $minutes, $seconds);
    }
    
}
