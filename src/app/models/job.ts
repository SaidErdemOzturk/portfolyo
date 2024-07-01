import { JobDescription } from "./jobDescription"

export interface Job{
    jobId:number,
    tab:string,
    startedDate:Date,
    endedDate:Date,
    title:string
    descriptions:JobDescription[]
}