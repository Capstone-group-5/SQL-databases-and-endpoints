-- Create the new table with the updated structure
CREATE TABLE user_profile (
    id integer primary key AUTOINCREMENT,
    Organisation text,
    UserName text,
    Surname text,
    E_mail text,
    User_Password text,
    User_Role text
);