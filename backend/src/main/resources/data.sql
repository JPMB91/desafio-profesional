--    CREATE TABLE IF NOT EXISTS roles (ID INTEGER, NAME VARCHAR(255), DESCRIPTION VARCHAR(255))

    INSERT INTO roles (name, description)
    SELECT 'ROLE_USER', 'Usuario registrado normalmente'
    WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'ROLE_USER');

    INSERT INTO roles (name, description)
    SELECT 'ROLE_ADMIN', 'Usuario registrado con permisos administrativos'
    WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'ROLE_ADMIN');

    INSERT INTO roles (name, description)
    SELECT 'ROLE_VISITOR', 'Usuario que no ha iniciado sesión o no se ha registrado'
    WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'ROLE_VISITOR');

--
--MERGE INTO roles (name, description)
--KEY(name) VALUES ('ROLE_USER', 'Usuario registrado normalmente');
--
--MERGE INTO roles (name, description)
--KEY(name) VALUES ('ROLE_ADMIN', 'Usuario registrado con permisos administrativos');
--
--MERGE INTO roles (name, description)
--KEY(name) VALUES ('ROLE_VISITOR', 'Usuario que no ha iniciado sesión o no se ha registrado');