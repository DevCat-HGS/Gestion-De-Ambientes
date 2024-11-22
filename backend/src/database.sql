-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS AdministradorAmbientes;
USE AdministradorAmbientes;

-- Tabla de ambientes
CREATE TABLE Ambientes (
    id_ambiente INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    ubicacion VARCHAR(255) NOT NULL
);

-- Tabla de dispositivos
CREATE TABLE Dispositivos (
    id_dispositivo INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL, -- Ejemplo: "PC 1", "PC 2"
    id_ambiente INT NOT NULL,
    estado ENUM('Funcional', 'En Reparación', 'Dañado') DEFAULT 'Funcional',
    mouse ENUM('Sí', 'No') DEFAULT 'Sí',
    teclado ENUM('Sí', 'No') DEFAULT 'Sí',
    almohadilla ENUM('Sí', 'No') DEFAULT 'Sí',
    FOREIGN KEY (id_ambiente) REFERENCES Ambientes(id_ambiente)
);

-- Tabla de instructores
CREATE TABLE Instructores (
    id_instructor INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100),
    telefono VARCHAR(15)
);

-- Tabla de jornadas
CREATE TABLE Jornadas (
    id_jornada INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATE NOT NULL,
    horario VARCHAR(50), -- Ejemplo: "08:00 - 12:00"
    id_ambiente INT NOT NULL,
    id_instructor INT NOT NULL,
    ficha_programa VARCHAR(50) NOT NULL,
    FOREIGN KEY (id_ambiente) REFERENCES Ambientes(id_ambiente),
    FOREIGN KEY (id_instructor) REFERENCES Instructores(id_instructor)
);

-- Tabla de chequeos (al inicio y fin de cada jornada)
CREATE TABLE Chequeos (
    id_chequeo INT AUTO_INCREMENT PRIMARY KEY,
    id_jornada INT NOT NULL,
    id_dispositivo INT NOT NULL,
    estado_inicial ENUM('Funcional', 'En Reparación', 'Dañado') NOT NULL,
    estado_final ENUM('Funcional', 'En Reparación', 'Dañado'),
    observaciones TEXT,
    FOREIGN KEY (id_jornada) REFERENCES Jornadas(id_jornada),
    FOREIGN KEY (id_dispositivo) REFERENCES Dispositivos(id_dispositivo)
);
