-- init.sql

USE tree;
DROP TABLE IF EXISTS Node;
CREATE TABLE Node
(
  ID INT NOT NULL AUTO_INCREMENT,
  parent_ID INT,
  PRIMARY KEY (ID),
  FOREIGN KEY (parent_ID) REFERENCES Node(ID)
);

-- Insert root node
INSERT INTO Node (ID, parent_ID) VALUES (1,NULL);

-- Insert level 1 nodes
INSERT INTO Node (parent_ID) VALUES (1);
INSERT INTO Node (parent_ID) VALUES (1);

-- Insert level 2 nodes
INSERT INTO Node (parent_ID) VALUES (2);
INSERT INTO Node (parent_ID) VALUES (2);
INSERT INTO Node (parent_ID) VALUES (3);
INSERT INTO Node (parent_ID) VALUES (3);