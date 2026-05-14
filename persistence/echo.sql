USE echo;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    provider    VARCHAR(255) DEFAULT 'local',
    provider_id VARCHAR(255) NULL
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
    avatar_url LONGTEXT,
    banner_url LONGTEXT,
    linkedin VARCHAR(255),
    instagram VARCHAR(255),
    twitter VARCHAR(255),
    experience VARCHAR(255),
    calendar_url VARCHAR(500),
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
    base_price DOUBLE NULL,
    item_type VARCHAR(50) NOT NULL,
    FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE venues (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    manager_id  INT NOT NULL,
    name        VARCHAR(150) NOT NULL,
    address     VARCHAR(255) NOT NULL,
    capacity    INT,
    telefono    VARCHAR(20),
    email       VARCHAR(255),
    sitio_web   VARCHAR(500),
    horario     VARCHAR(500),
    img1        VARCHAR(500),
    img2        VARCHAR(500),
    img3        VARCHAR(500),
    FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    buyer_id INT NOT NULL,
    item_id INT NOT NULL,
    final_price DOUBLE NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES items(id)
);

CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT UNIQUE NOT NULL,
    stripe_tx_id VARCHAR(255),
    total_amount DOUBLE NOT NULL,
    platform_fee DOUBLE NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE TABLE events (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    venue_id       INT NOT NULL,
    creator_id     INT NOT NULL,
    start_date     DATETIME NOT NULL,
    end_date       DATETIME NOT NULL,
    title          VARCHAR(150),
    description    TEXT,
    img            VARCHAR(500),
    precio         DECIMAL(10, 2),
    categoria      VARCHAR(100),
    link_entradas  VARCHAR(500),
    FOREIGN KEY (venue_id)    REFERENCES venues(id) ON DELETE CASCADE,
    FOREIGN KEY (creator_id)  REFERENCES users(id)  ON DELETE CASCADE
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

CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,        -- 'Fotografía', 'Ilustración', 'Arte 3D'
    slug VARCHAR(100) UNIQUE NOT NULL,        -- 'fotografia', 'ilustracion', 'arte-3d'
    description TEXT,
    icon_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE
);

--nueva tabla de item_projects

CREATE TABLE IF NOT EXISTS item_projects (
  id INT NOT NULL,
  blocks LONGTEXT,
  background LONGTEXT,
  block_gap INT,
  likes INT DEFAULT 0,
  views INT DEFAULT 0,
  comments INT DEFAULT 0,
  published BOOLEAN DEFAULT FALSE,
  slug VARCHAR(255) UNIQUE,
  created_at DATETIME NULL,
  updated_at DATETIME NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_item_projects_item FOREIGN KEY (id) REFERENCES items(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla para likes por usuario en proyectos
CREATE TABLE IF NOT EXISTS project_likes (
    user_id INT NOT NULL,
    project_id INT NOT NULL,
    PRIMARY KEY (user_id, project_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES item_projects(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla para comentarios de proyectos
CREATE TABLE IF NOT EXISTS project_comments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    user_id INT NOT NULL,
    comment LONGTEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES item_projects(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Indexes (plain CREATE INDEX is compatible with MySQL versions)
CREATE INDEX idx_item_projects_slug ON item_projects(slug);
CREATE INDEX idx_item_projects_published ON item_projects(published);

--- fin de la tabla

ALTER TABLE items
    ADD COLUMN category_id INT,
    ADD FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;



INSERT INTO categories (name, slug, description, icon_url, is_active) VALUES
    ('Diseño Gráfico',   'graphic-design','Identidad visual, branding y diseño editorial', NULL, TRUE),
    ('Fotografía',       'photography',   'Fotografía artística, retrato y documental',    NULL, TRUE),
    ('Ilustración',      'illustration',  'Ilustración digital y tradicional',             NULL, TRUE),
    ('Arte 3D',          '3d-art',        'Modelado, escultura y render 3D',               NULL, TRUE),
    ('Arquitectura',     'architecture',  'Proyectos arquitectónicos y visualización',     NULL, TRUE),
    ('Moda',             'fashion',       'Diseño de moda, textil e indumentaria',         NULL, TRUE),
    ('Comic',            'comic',         'Historietas, novelas gráficas y cómics',        NULL, TRUE),
    ('Producción Musical','music-production','Composición, mezcla, mastering y diseño sonoro', NULL, TRUE),
    ('Video y Edición',  'video-editing', 'Grabación, montaje y postproducción audiovisual', NULL, TRUE);

INSERT INTO roles (name) VALUES
    ('ADMIN'),
    ('USER'),
    ('CREATOR'),
    ('VENUE_MANAGER');

CREATE TABLE disputes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    created_by_user_id INT NOT NULL,
    created_by_username VARCHAR(50),
    reason VARCHAR(500) NOT NULL,
    status VARCHAR(50) DEFAULT 'OPEN',
    resolution TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE dispute_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dispute_id INT NOT NULL,
    user_id INT NOT NULL,
    username VARCHAR(50),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dispute_id) REFERENCES disputes(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE item_services (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    item_id          INT NOT NULL UNIQUE,
    name             VARCHAR(150) NOT NULL,
    description      TEXT,
    delivery_duration INT NOT NULL,
    category         VARCHAR(100) NOT NULL,
    cover_image_url  VARCHAR(500),
    creator_id       INT NOT NULL,
    FOREIGN KEY (item_id)    REFERENCES items(id)   ON DELETE CASCADE,
    FOREIGN KEY (creator_id) REFERENCES users(id)   ON DELETE CASCADE
);

CREATE TABLE item_service_projects (
    service_id INT NOT NULL,
    project_id INT NOT NULL,
    PRIMARY KEY (service_id, project_id),
    FOREIGN KEY (service_id) REFERENCES item_services(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES item_projects(id)      ON DELETE CASCADE
);

CREATE TABLE venue_event_reviews (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    author_id   INT         NOT NULL,
    target_id   INT         NOT NULL,
    target_type VARCHAR(10) NOT NULL,
    score       INT         NOT NULL CHECK (score BETWEEN 1 AND 5),
    comment     TEXT,
    created_at  TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_author_target (author_id, target_id, target_type)
);


