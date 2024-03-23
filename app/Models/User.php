<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $guarded = [];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function getFirstNameAttribute($value)
    {
        return ucfirst(Str::of($value)->lower());
    }

    public function getLastNameAttribute($value)
    {
        return ucfirst(Str::of($value)->lower());
    }

    public function getPhotoAttribute($value){
        if($value && str_contains( strtolower($value),'http')){return $value;}
        if(!$value){return null;}
        return url('/').'/public/'. $value;
    }

    public function getCompanyIdAttribute($value)
    {
        return Str::of($value)->upper();
    }
}
