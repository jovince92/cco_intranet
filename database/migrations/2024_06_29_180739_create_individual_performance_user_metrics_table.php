<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateIndividualPerformanceUserMetricsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('individual_performance_user_metrics', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('individual_performance_metric_id')->index('metric_id');
            $table->unsignedBigInteger('user_id')->index();
            $table->integer('value');
            $table->date('date');
            $table->timestamps();

            $table->foreign('individual_performance_metric_id','metric_id')->references('id')->on('individual_performance_metrics')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('individual_performance_user_metrics');
    }
}
