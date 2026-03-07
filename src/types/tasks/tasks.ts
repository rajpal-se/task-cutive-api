export interface Task {
    _id: string;
    title: string;
    description: string;
    is_high_priority: boolean;
    is_completed: boolean;
    completed_at: Date | null;
    due_datetime: Date;
    created_at: Date;
    updated_at: Date;
}
