-- Create the new table with the updated structure
CREATE TABLE crop_inventory (
    cropRecord_Id integer primary key AUTOINCREMENT,
    Organisation text,
    Crop text,
    Yield text
);