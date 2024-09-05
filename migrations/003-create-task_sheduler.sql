-- Create the new table with the updated structure
CREATE TABLE task_sheduler (
    Task_Id integer primary key AUTOINCREMENT,
    Organisation text,
    Task text,
    Assigner text,
    Assignee text,
    Status text,
    Dead_line DATETIME
);