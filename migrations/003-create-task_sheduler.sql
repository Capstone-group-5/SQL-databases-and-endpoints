/* -- Rename the existing table
ALTER TABLE task_sheduler RENAME TO old_price_plan; 

 */
-- Create the new table with the updated structure
CREATE TABLE task_sheduler (
    Task_Id integer primary key AUTOINCREMENT,
    Organisation text,
    Task text,
    Assigner text,
    Assignee text,
    Status text,
    Description text,
    Dead_line DATETIME
);

/* -- Drop the old table
DROP TABLE old_price_plan; */