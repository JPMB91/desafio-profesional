
----  Categorias
--    INSERT INTO categories (name, category_description)
--    SELECT 'SUV', 'Sport Utility Vehicle'
--    WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'SUV');
--
--    INSERT INTO categories (name, category_description)
--    SELECT 'Sedan', 'Standard passenger car with a three-box configuration'
--    WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Sedan');
--
--    INSERT INTO categories (name, category_description)
--    SELECT 'Pick-up', 'Light-duty truck with an open cargo area'
--    WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Pick-up');
--
--    INSERT INTO categories (name, category_description)
--    SELECT 'Van', 'Vehicle used for transporting people or goods'
--    WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Van');

--  Roles

    INSERT INTO roles (name, description)
    SELECT 'ROLE_USER', 'Usuario registrado normalmente'
    WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'ROLE_USER');

    INSERT INTO roles (name, description)
    SELECT 'ROLE_ADMIN', 'Usuario registrado con permisos administrativos'
    WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'ROLE_ADMIN');

    INSERT INTO roles (name, description)
    SELECT 'ROLE_VISITOR', 'Usuario que no ha iniciado sesión o no se ha registrado'
    WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'ROLE_VISITOR');

