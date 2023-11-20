-- Create the Comments table
CREATE TABLE IF NOT EXISTS Comments (
    CommentID INTEGER PRIMARY KEY,  -- Unique identifier for each comment
    User TEXT,                 -- Identifier for the user who made the comment
    CommentText TEXT,               -- The actual comment
    SourceID TEXT,               -- The ID of the source that the comment is about
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,  -- Timestamp for when the comment was created
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP   -- Timestamp for when the comment was last updated
);

-- Sample INSERT statements to populate the Comments table
INSERT INTO Comments (User, CommentText, SourceID) VALUES 
('Ean', 'Welcome!', "welcome")

