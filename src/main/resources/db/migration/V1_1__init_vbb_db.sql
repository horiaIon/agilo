-- Dumping structure for table vbb.t_authority
CREATE TABLE IF NOT EXISTS t_authority (
  name varchar(50) NOT NULL,
  PRIMARY KEY (name)
);

-- Dumping structure for table vbb.t_user
CREATE TABLE IF NOT EXISTS t_user (
  user_name varchar(100) NOT NULL,
  password varchar(100) DEFAULT '',
  first_name varchar(100) NOT NULL,
  last_name varchar(100) NOT NULL,
  PRIMARY KEY (user_name)
) ;


-- Dumping structure for table vbb.t_user_authority
CREATE TABLE IF NOT EXISTS t_user_authority (
  user_name varchar(100) NOT NULL,
  name varchar(50) NOT NULL,
  PRIMARY KEY (user_name,name),
  KEY usr_authority_fk_auth (name),
  CONSTRAINT usr_authority_fk_auth FOREIGN KEY (name) REFERENCES t_authority (name),
  CONSTRAINT usr_authority_fk_user FOREIGN KEY (user_name) REFERENCES t_user (user_name)
);

COMMIT;

