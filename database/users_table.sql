create table users (
    id int not null AUTO_INCREMENT,
    username varchar(25) not null,
    pass varchar(60) not null,
    PRIMARY KEY(id),
    UNIQUE(username));

alter table users AUTO_INCREMENT = 1;