<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddIsEditedToUserAttendances extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('user_attendances', function (Blueprint $table) {
            $table->tinyInteger('edited_time_in')->default(0);            
            $table->tinyInteger('edited_time_out')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('user_attendances', function (Blueprint $table) {
            $table->dropColumn('edited_time_in');
            $table->dropColumn('edited_time_out');
        });
    }
}
