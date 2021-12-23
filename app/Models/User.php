<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'biographie',
        "photoProfil"
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function projet()
    {
        return $this->hasMany(Projet::class);
    }

    public function projetFinances()
    {
        return $this->belongsToMany(Projet::class,"contributions")->withPivot("montant");
    }

    public function roles()
    {
        return $this->belongsToMany(Role::class,"role_user");
    }

    public function liker()
    {
        return $this->belongsToMany(Projet::class,"likes");
    }
    public function enregistrer()
    {
        return $this->belongsToMany(Projet::class,"save");
    }

    public function isAdmin()
    {
        if($this->roles->where("libelle","admin")->first())
            return true;
        else return false;

    }
}
