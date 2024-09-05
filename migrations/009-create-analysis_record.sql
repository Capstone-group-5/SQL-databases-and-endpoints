-- Create the new table with the updated structure
CREATE TABLE analysis_record (
    analysis_Id integer primary key AUTOINCREMENT,
    Organisation text,
    CropType text,
    Temperature real,
    Humidity real,
    Rainfall real,
    Nitrogen real,
    Potassium real,
    Phosphorus real,
    pH_Level real
);