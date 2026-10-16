CREATE TABLE users (
        id BIGINT NOT NULL AUTO_INCREMENT,
        email VARCHAR(255) NOT NULL,
full_name VARCHAR(255) NOT NULL,
password VARCHAR(255) NOT NULL,
role VARCHAR(255) NOT NULL,
PRIMARY KEY (id),
UNIQUE KEY uk_users_email (email)
) ENGINE=InnoDB;

CREATE TABLE credit_applications (
        id BIGINT NOT NULL AUTO_INCREMENT,
        created_at DATETIME(6) DEFAULT NULL,
default_probability DOUBLE DEFAULT NULL,
model_type VARCHAR(255) NOT NULL,
risk_band VARCHAR(255) DEFAULT NULL,
status VARCHAR(255) NOT NULL,
user_id BIGINT NOT NULL,
PRIMARY KEY (id),
KEY idx_credit_applications_user_id (user_id),
CONSTRAINT fk_credit_application_user
FOREIGN KEY (user_id) REFERENCES users(id)
        ) ENGINE=InnoDB;