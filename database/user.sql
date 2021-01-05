create user 'gucio'@'localhost' identified by 'CHANGEME';
grant select, insert, update on honeymoney.users to 'gucio'@'localhost';

flush privileges;