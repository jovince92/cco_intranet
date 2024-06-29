

import { Project, TimeStamp, User } from ".";

export type MetricFormat ='number'|'percentage'|'duration'|'rate'

export interface IndividualPerformanceMetric extends TimeStamp {
    id:number;
    project_id:number;
    user_id:number;
    metric_name:string;
    goal:number;
    daily_goal:string;
    format:MetricFormat;
    unit?:string;
    rate_unit?:string;
    user:User;
    project:Project;
    user_metrics:IndividualPerformanceUserMetric[];
}


export interface IndividualPerformanceUserMetric extends TimeStamp {
    id:number;
    individual_performance_metric_id:number;
    user_id:number;
    value:number;
    date:string;

    metric:IndividualPerformanceMetric;
    user:User;
}