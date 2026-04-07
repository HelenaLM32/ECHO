CREATE DATABASE echo;
USE echo;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE user_roles (
    user_id INT,
    role_id INT,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

CREATE TABLE profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    public_name VARCHAR(100) NOT NULL,
    bio TEXT,
    location VARCHAR(100),
    avatar_url VARCHAR(255),
    banner_url VARCHAR(255),
    linkedin VARCHAR(255),
    instagram VARCHAR(255),
    twitter VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE follows (
    follower_id INT,
    following_id INT,
    PRIMARY KEY (follower_id, following_id),
    FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    creator_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    base_price DECIMAL(10, 2) NOT NULL,
    item_type VARCHAR(50) NOT NULL,
    FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE venues (
    id INT AUTO_INCREMENT PRIMARY KEY,
    manager_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    address VARCHAR(255) NOT NULL,
    capacity INT,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    buyer_id INT NOT NULL,
    item_id INT NOT NULL,
    final_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    FOREIGN KEY (buyer_id) REFERENCES users(id),
    FOREIGN KEY (item_id) REFERENCES items(id)
);

CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT UNIQUE NOT NULL,
    stripe_tx_id VARCHAR(255),
    total_amount DECIMAL(10, 2) NOT NULL,
    platform_fee DECIMAL(10, 2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    venue_id INT NOT NULL,
    creator_id INT NOT NULL,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    status VARCHAR(50) DEFAULT 'REQUESTED',
    FOREIGN KEY (venue_id) REFERENCES venues(id) ON DELETE CASCADE,
    FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE order_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    sender_id INT NOT NULL,
    content TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    author_id INT NOT NULL,
    score INT CHECK (score BETWEEN 1 AND 5),
    comment TEXT,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

/* Insert default roles
CAMBIOS NUEVOS PARA CATEGORIAS!!!!!!!!!!!!!!!!!!!!!!
Nueva tabla de categorias, y cambios en items para relacionarlos,
1 item solo puede tener 1 categoria, demomento


CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,        -- 'Fotografía', 'Ilustración', 'Arte 3D'
    slug VARCHAR(100) UNIQUE NOT NULL,        -- 'fotografia', 'ilustracion', 'arte-3d'
    description TEXT,
    icon_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE
);


ALTER TABLE items
    ADD COLUMN category_id INT,
    ADD FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;



INSERCIONES DE CATEGORIAS , PROVISIONALES, SE PUEDEN CAMBIAR DESPUES

INSERT INTO categories (name, slug, description, icon_url, is_active) VALUES
    ('Para ti',          'for-you',       'Contenido personalizado para ti',              NULL,  TRUE),
    ('Siguiendo',        'following',     'Contenido de los creadores que sigues',         NULL,  TRUE),
    ('Lo mejor de ECHO', 'best-of-echo',  'Lo más destacado de la plataforma',            NULL,  TRUE),
    ('Diseño Gráfico',   'graphic-design','Identidad visual, branding y diseño editorial', NULL, TRUE),
    ('Fotografía',       'photography',   'Fotografía artística, retrato y documental',    NULL, TRUE),
    ('Ilustración',      'illustration',  'Ilustración digital y tradicional',             NULL, TRUE),
    ('Arte 3D',          '3d-art',        'Modelado, escultura y render 3D',               NULL, TRUE),
    ('Arquitectura',     'architecture',  'Proyectos arquitectónicos y visualización',     NULL, TRUE),
    ('Moda',             'fashion',       'Diseño de moda, textil e indumentaria',         NULL, TRUE);
 */