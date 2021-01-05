create table transfers (
    id int not null auto_increment,
    sender int not null,
    reciver int not null,
    title varchar(50) not null,
    value int not null,
    primary key(id)
    );