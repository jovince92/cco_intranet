import { YooptaContentValue } from "@yoopta/editor";
import { TimeStamp, User } from ".";

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