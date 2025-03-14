
----  Categorias
--    INSERT INTO categories (name, category_description, categoryImage)
--    SELECT 'SUV', 'Sport Utility Vehicle'
--    WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'SUV');
--
--    INSERT INTO categories (name, category_description)
--    SELECT 'Sedán', 'Standard passenger car with a three-box configuration'
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


  -- Usuarios
  INSERT INTO users(id, email, enabled, first_name, lastname, password)
  SELECT '16ef4644-dac7-4c0c-b2db-15a9a6d10f7b', 'admin@admin.com', true, 'Admin', 'Admin', '$2a$10$mY9vN438tURy1ihASaVB7O3CzKmUYCzr0KTKoOLyYUV5t7XlOj5AC'
  WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@admin.com');

--  INSERT INTO users(id, email, enabled, first_name, lastname, password)
--  SELECT '34082491-6e50-4a2e-b327-86eb6716c6c3', 'user@user.com', true, 'User', 'User', '$2a$10$ZaJ
--  .sT2OUa9QlQGfeCizQuNps9AmFz59huIoUGJmtqMHXXXVcQWmC'
--  WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'user@user.com');

  -- Asociacion de roles a usuarios
  INSERT INTO users_roles (user_id, role_id)
  SELECT u.id, r.id
  FROM users u, roles r
  WHERE u.email = 'admin@admin.com' AND r.name = 'ROLE_ADMIN'
  AND NOT EXISTS (
      SELECT 1 FROM users_roles ur
      WHERE ur.user_id = u.id AND ur.role_id = r.id
  );

--  INSERT INTO users_roles (user_id, role_id)
--  SELECT u.id, r.id
--  FROM users u, roles r
--  WHERE u.email = 'user@user.com' AND r.name = 'ROLE_USER'
--  AND NOT EXISTS (
--      SELECT 1 FROM users_roles ur
--      WHERE ur.user_id = u.id AND ur.role_id = r.id
--  );