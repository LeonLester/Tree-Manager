-- init.sql

USE tree;

CREATE TABLE Node
(
  ID INT NOT NULL,
  parent_ID INT,
  PRIMARY KEY (ID),
  FOREIGN KEY (parent_ID) REFERENCES Node(ID)
);

-- Insert root node
INSERT INTO Node (ID, parent_ID) VALUES (1, NULL);

-- Insert level 1 nodes
INSERT INTO Node (ID, parent_ID) VALUES (2, 1);
INSERT INTO Node (ID, parent_ID) VALUES (3, 1);

-- Insert level 2 nodes
INSERT INTO Node (ID, parent_ID) VALUES (4, 2);
INSERT INTO Node (ID, parent_ID) VALUES (5, 2);
INSERT INTO Node (ID, parent_ID) VALUES (6, 3);
INSERT INTO Node (ID, parent_ID) VALUES (7, 3);