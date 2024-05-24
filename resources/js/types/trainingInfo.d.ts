import { YooptaContentValue } from "@yoopta/editor";
import { Project, TimeStamp, User } from ".";

export interface TrainingTopic extends TimeStamp {
    id: number;
    user_id: number;
    title: string;
    description?:string;
    is_active: 1|0;

    user:User;
    versions:TrainingTopicVersion[];
    current_version?:TrainingTopicVersion;
}

export interface TrainingTopicVersion extends TimeStamp {
    id: number;
    training_topic_id: number;
    user_id: number;
    content?:string;
    version?:string;
    is_active: 1|0;

    user:User;
    training_topic:TrainingTopic;
}

export interface TrainingFolder extends TimeStamp {
    id:number;
    user_id:number;
    name:string;
    user:User;
    projects:Project[];
    sub_folders:TrainingSubFolder[];
    sub_folder_count:number;
}

export interface TrainingSubFolder extends TimeStamp {
    id:number;
    training_folder_id?:number; //relation to the model above
    training_sub_folder_id?:number; //relation to self for recursive sub folders
    user_id:number;
    name:string;

    user:User;
    children:TrainingSubFolder[];
    topics:TrainingTopic[];
}