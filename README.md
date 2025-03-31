# 🚗Proyecto Integrador CTD:


Aplicación web para la renta de vehículos desarrollada con Reactjs (frontend) y Java Spring Boot (backend).

## 📋 Características principales

- Autenticación de usuarios (login/registro)
- Sistema de reservas
- Sistema de reseñas
- Diseño responsivo
- Panel de administración (/administracion)
- Gestión de productos, categorías y usuarios

## 🛠️ Tecnologías utilizadas

**Frontend:**
- React
- React Router
- Context API
- Axios
- TailwindCSS

**Backend:**
- Java Spring Boot
- Maven
- JPA

**Testing:**
- Jest, Vitest, React Testing Library
- Mockito, JUnit

## 🚀 Guía de instalación

### Requisitos previos

Antes de comenzar, asegúrese de tener instalado:

- Node.js (versión 16.x o superior)
- npm o yarn
- Java SDK 22.0.2
- IntelliJ IDEA (para backend)
- Visual Studio Code (recomendado para frontend)

### Pasos de instalación

#### 1. Clonar el repositorio

```sh
git clone https://github.com/JPMB91/desafio-profesional.git
cd desafio-profesional
```

#### 2. Configurar el Backend

1. Navegue a la carpeta del backend:
   ```sh
   cd backend
   ```

2. Instale las dependencias:
   - **Opción A:** Si tiene Maven instalado:
     ```sh
     mvn clean install
     ```
   - **Opción B:** Si no tiene Maven:
     1. Abra la carpeta `/backend` con IntelliJ IDEA
     2. Haga clic en el botón de Maven y luego en "Reload All Maven Projects"
     
     ![Instalar dependencias Maven](image.png)

#### 3. Configurar el Frontend

1. Navegue a la carpeta del frontend:
   ```sh
   cd frontend
   ```

2. Instale las dependencias:
   ```sh
   npm install
   ```

#### 4. Iniciar la aplicación

**Backend:**
- **Opción A:** Con Maven instalado:
  ```sh
  cd backend
  mvn spring-boot:run
  ```
- **Opción B:** Desde IntelliJ IDEA:
  1. Localice el archivo `RentApplication.java` en `src/main/java/com/digitalhouse/turnos`
  2. Haga clic derecho y seleccione "Run RentApplication"
  
  ![Ejecutar aplicación](image-1.png)

**Frontend:**
```sh
cd frontend
npm run dev
```

Una vez que ambos servicios estén funcionando, acceda a la aplicación a través de su navegador en la dirección que muestra la terminal al iniciar el frontend: http://localhost:5173


> ⚠️ **NOTA:**  
> Este proyecto viene precargado con una cuenta con privilegios de administrador con el que se puede acceder a las rutas especiales.
> 
> - **E-mail:** `admin@admin.com`  
> - **Contraseña:** `adminadmin`



> ⚠️ **NOTA:**  
> Para que reciba el correo electrónico luego de confimación de reserva, recuerde crear una cuenta de usuario desde la aplicación usando un correo electrónico al que tenga acceso.
>



