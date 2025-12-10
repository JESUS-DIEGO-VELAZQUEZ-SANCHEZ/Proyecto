CREATE DATABASE IF NOT EXISTS boardgamesdb;
USE boardgamesdb;

CREATE TABLE Boardgames (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(80) NOT NULL,
    Publisher VARCHAR(60) NOT NULL,
    Category VARCHAR(2) NOT NULL,
    Description VARCHAR(200) NULL,
    Year CHAR(4) NULL
);

CREATE TABLE Favorites (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    IdBoardgame INT NOT NULL,
    FOREIGN KEY (IdBoardgame) REFERENCES Boardgames(ID)
);
