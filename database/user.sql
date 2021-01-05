create user 'gucio'@'localhost' identified by 'CHANGEME';
grant select, insert, update on honeymoney.users to 'gucio'@'localhost';
grant select, insert, update on honeymoney.balances to 'gucio'@'localhost'; 
grant select, insert on honeymoney.transfers to 'gucio'@'localhost';

flush privileges;