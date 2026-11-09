export interface UpdateJobDto {
    id: number;
    tab: string;
    startedDate: Date | string;
    endedDate: Date | string | null;
    title: string;
}

