<?php

namespace App\Http\Middleware;

use App\Models\Project;
use App\Models\Shift;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tightenco\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    public function version(Request $request)
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function share(Request $request)
    {
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user(),
            ],
            'shifts'=>$request->user()?Shift::all():[],
            'projects'=>$request->user()?Project::all():[],
            'ziggy' => function () {
                return (new Ziggy)->toArray();
            },
            'flash' => [
                'newLink' => fn () => $request->session()->get('newLink')
            ],
            'metric_formats'=>['number','percentage','duration','rate']
        ]);
    }
}
