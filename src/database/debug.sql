-- File: 00-drops.sql


-- ================================
-- Drop Activities Table
-- ================================
DROP FUNCTION IF EXISTS set_activities_order_by CASCADE;
DROP TRIGGER IF EXISTS trg_set_activities_order_by on activities CASCADE;
DROP TABLE IF EXISTS activities CASCADE;


-- ================================
-- Drop Assignments Table
-- ================================
DROP TABLE IF EXISTS assignments CASCADE;


-- ================================
-- Drop Profiles Table
-- ================================
DROP TABLE IF EXISTS group_membership CASCADE;

-- ================================
-- Drop Profiles Table
-- ================================
DROP TABLE IF EXISTS profiles CASCADE;


-- ================================
-- Drop Profiles Table
-- ================================
DROP TABLE IF EXISTS groups CASCADE;


-- ================================
-- Drop LearningObjectiveLessonMap Table
-- ================================
DROP TABLE IF EXISTS learning_objective_lesson_map CASCADE;

-- ================================
-- DROP the criteria table
-- ================================
DROP TRIGGER IF EXISTS trg_set_criteria_order_by ON criteria CASCADE;
DROP FUNCTION IF EXISTS set_criteria_order_by CASCADE;
DROP TABLE IF EXISTS criteria CASCADE;


-- ================================
-- DROP the lessons table
-- ================================
DROP TRIGGER IF EXISTS trg_set_lessons_order_by on lessons CASCADE;
DROP FUNCTION IF EXISTS set_lessons_order_by CASCADE;
DROP TABLE IF EXISTS lessons CASCADE;



-- ================================
-- DROP the units table
-- ================================
DROP TRIGGER  IF EXISTS trg_set_learning_objectives_order_by on learning_objectives CASCADE;
DROP FUNCTION IF EXISTS set_learning_objectives_order_by CASCADE;
DROP TABLE IF EXISTS learning_objectives CASCADE ;

-- ================================
-- DROP the units table
-- ================================
DROP TRIGGER  IF EXISTS trg_set_units_order_by on units CASCADE;
DROP FUNCTION IF EXISTS set_units_order_by CASCADE;
DROP TABLE IF EXISTS units CASCADE ;

-- ================================
-- DROP the courses table
-- ================================
DROP TRIGGER  IF EXISTS trg_set_courses_order_by on courses CASCADE;
DROP FUNCTION IF EXISTS set_courses_order_by CASCADE;
DROP TABLE IF EXISTS courses CASCADE;

-- ================================
-- DROP the nc_item table
-- ================================
DROP TRIGGER  IF EXISTS trg_set_nc_items_order_by on nc_items   CASCADE;
DROP FUNCTION IF EXISTS set_nc_items_order_by CASCADE;
DROP TABLE if exists nc_items CASCADE;


-- ================================
-- DROP the ncs table
-- ================================
DROP TRIGGER  IF EXISTS trg_set_ncs_order_by on ncs CASCADE;
DROP FUNCTION IF EXISTS set_ncs_order_by CASCADE;    
DROP TABLE IF EXISTS ncs CASCADE;




-- File: 01-nc.sql
-- create_nc.sql
-- Ensure the pgcrypto extension is available for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;



-- Create the top‑level curriculum table
CREATE TABLE ncs (
  nc_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  active      boolean default true,
  created     timestamp default now(),
  created_by  text default 'auto',
  order_by    int
);

-- Function to set default order_id
CREATE OR REPLACE FUNCTION set_ncs_order_by()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_by IS NULL THEN
    SELECT COALESCE(MAX(order_by), 0) + 1 INTO NEW.order_by FROM ncs;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to set default order
CREATE TRIGGER trg_set_ncs_order_by
BEFORE INSERT ON ncs
FOR EACH ROW
EXECUTE FUNCTION set_ncs_order_by();


-- File: 02-nc-items.sql


CREATE TABLE nc_items (
  nc_item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nc_id       UUID NOT NULL REFERENCES ncs(nc_id),
  item_text   TEXT NOT NULL,
  category    TEXT NOT NULL,
  active      boolean default true,
  created     timestamp default now(),
  created_by  text default 'auto',
  order_by    int 
);

-- Function to set default order_by
CREATE OR REPLACE FUNCTION set_nc_items_order_by()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_by IS NULL THEN
    SELECT COALESCE(MAX(order_by), 0) + 1 INTO NEW.order_by FROM nc_items;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to set default order
CREATE TRIGGER trg_set_nc_items_order_by
BEFORE INSERT ON nc_items
FOR EACH ROW
EXECUTE FUNCTION set_nc_items_order_by();


-- File: 03-courses.sql


CREATE TABLE courses (
  course_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  nc_id       UUID NULL REFERENCES ncs(nc_id) ON DELETE CASCADE,
  tags        TEXT[] NOT NULL,
  active      boolean default true,
  created     timestamp default now(),
  created_by  text default 'auto',
  order_by    int 
);

-- Function to set default order_by
CREATE OR REPLACE FUNCTION set_courses_order_by()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_by IS NULL THEN
    SELECT COALESCE(MAX(order_by), 0) + 1 INTO NEW.order_by FROM courses;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to set default order
CREATE TRIGGER trg_set_courses_order_by
BEFORE INSERT ON courses
FOR EACH ROW
EXECUTE FUNCTION set_courses_order_by();


-- File: 04-units.sql

-- ===============================================================
-- 04-units.sql
-- ===============================================================

CREATE TABLE units (
  unit_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  course_id    UUID NOT NULL REFERENCES courses(course_id) ON DELETE CASCADE,
  tags        TEXT[] NOT NULL,
  active      boolean default true,
  created     timestamp default now(),
  created_by  text default 'auto',
  order_by    int 
);

-- Function to set default order_by
CREATE OR REPLACE FUNCTION set_units_order_by()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_by IS NULL THEN
    SELECT COALESCE(MAX(order_by), 0) + 1 INTO NEW.order_by FROM units;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to set default order
CREATE TRIGGER trg_set_units_order_by
BEFORE INSERT ON units
FOR EACH ROW
EXECUTE FUNCTION set_units_order_by();


-- File: 05-learning-objectives.sql

-- ===============================================================
-- 04-units.sql
-- ===============================================================

CREATE TABLE learning_objectives (
  learning_objective_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  tags        TEXT[] NOT NULL,
  unit_id     UUID REFERENCES units(unit_id),
  active      boolean default true,
  created     timestamp default now(),
  created_by  text default 'auto',
  order_by    int 
);

-- Function to set default order_by
CREATE OR REPLACE FUNCTION set_learning_objectives_order_by()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_by IS NULL THEN
    SELECT COALESCE(MAX(order_by), 0) + 1 INTO NEW.order_by FROM learning_objectives;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to set default order
CREATE TRIGGER trg_set_learning_objectives_order_by
BEFORE INSERT ON learning_objectives
FOR EACH ROW
EXECUTE FUNCTION set_learning_objectives_order_by();


-- File: 06-lessons.sql
-- ===============================================================
-- 06-lessons.sql
-- ===============================================================

CREATE TABLE lessons (
    lesson_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title       TEXT NOT NULL,
    description TEXT,
    tags        TEXT[] NOT NULL,
    unit_id     UUID REFERENCES units(unit_id),
    active      BOOLEAN DEFAULT true,
    created     TIMESTAMP DEFAULT now(),
    created_by  TEXT DEFAULT 'auto',
    order_by    INT
);

-- Function to set default order_by
CREATE OR REPLACE FUNCTION set_lessons_order_by()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_by IS NULL THEN
        SELECT COALESCE(MAX(order_by), 0) + 1 INTO NEW.order_by FROM lessons WHERE unit_id = NEW.unit_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to set default order
CREATE TRIGGER trg_set_lessons_order_by
BEFORE INSERT ON lessons
FOR EACH ROW
EXECUTE FUNCTION set_lessons_order_by();

-- File: 07-criteria.sql
-- ===============================================================
-- 07-criteria.sql
-- ===============================================================

CREATE TABLE criteria (
    criteria_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     learning_objective_id UUID NOT NULL REFERENCES learning_objectives(learning_objective_id),
    title TEXT NOT NULL,
    active      BOOLEAN DEFAULT true,
    created     TIMESTAMP DEFAULT now(),
    created_by  TEXT DEFAULT 'auto',
    order_by    INT
);

-- Function to set default order_by
CREATE OR REPLACE FUNCTION set_criteria_order_by()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_by IS NULL THEN
        SELECT COALESCE(MAX(order_by), 0) + 1 INTO NEW.order_by FROM criteria WHERE learning_objective_id = NEW.learning_objective_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to set default order
CREATE TRIGGER trg_set_criteria_order_by
BEFORE INSERT ON criteria
FOR EACH ROW
EXECUTE FUNCTION set_criteria_order_by();

-- File: 08-learning-objective-lesson-map.sql
create table learning_objective_lesson_map (
    learning_objective_id uuid references learning_objectives (learning_objective_id) not null,
    lesson_id uuid references lessons(lesson_id) not null,
    primary key (learning_objective_id, lesson_id)
);

-- File: 09-profiles.sql
-- ==============================================
-- Profile Table to store user attributes
-- ==============================================

CREATE TABLE profiles (
    user_id text PRIMARY KEY , -- 1 to 1 relationship with users
    first_name TEXT NULL,     
    last_name TEXT NULL,
    is_teacher BOOLEAN DEFAULT false,


    active      BOOLEAN DEFAULT true,
    created     TIMESTAMP DEFAULT now(),
    created_by  TEXT DEFAULT 'auto',
    order_by    INT
);

-- File: 10-groups.sql
-- ==============================================
-- Profile Table to store user attributes
-- ==============================================

CREATE TABLE groups (
    group_id    uuid PRIMARY KEY DEFAULT gen_random_uuid(), 
    title       TEXT NOT NULL,   
    

    active      BOOLEAN DEFAULT true,
    created     TIMESTAMP DEFAULT now(),
    created_by  TEXT DEFAULT 'auto',
    order_by    INT
);

-- File: 11-group-membership.sql
create table group_membership (
    user_id text references profiles (user_id) not null,
    group_id uuid references groups (group_id) not null,
    role text not null default 'member',
    
    active boolean default true,
    created timestamp default now(),    
    primary key (user_id, group_id)
);


-- File: 12-assignments.sql
create table assignments (
    
    unit_id     uuid   not null references units(unit_id),
    group_id    uuid   not null references groups(group_id), 
   

    active boolean default true,
    created timestamp default now(),    
    primary key (unit_id, group_id)
);


-- File: 13-activities.sql
create table activities (
    
    activity_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title           text,

    lesson_id       uuid not null references lessons(lesson_id),
    activity_type            text,
    body            jsonb, 

    active      boolean default true,
    created     timestamp default now(),
    created_by  text default 'auto',
    order_by    int   
    
);

-- Function to set default order_by
CREATE OR REPLACE FUNCTION set_activities_order_by()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_by IS NULL THEN
    SELECT COALESCE(MAX(order_by), 0) + 1 INTO NEW.order_by FROM activities;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to set default order
CREATE TRIGGER trg_set_activities_order_by
BEFORE INSERT ON activities
FOR EACH ROW
EXECUTE FUNCTION set_activities_order_by();

-- File: 99-seed.sql
-- 01_insert_nc.sql
-- Seed the ncs table with the key stages and subjects

INSERT INTO ncs (title) VALUES
('KS3 Design and Technology'),
('KS4 Design and Technology'),
('KS3 Computing'),
('KS4 Computing');


-- 02_insert_nc_item.sql
-- Seed the nc_items table with curriculum bullets for KS3 Design and Technology

INSERT INTO nc_items (nc_id, item_text, category) VALUES

-- Design
((SELECT nc_id FROM ncs WHERE title = 'KS3 Design and Technology'), 'use research and exploration, such as the study of different cultures, to identify and understand user needs', 'design'),
((SELECT nc_id FROM ncs WHERE title = 'KS3 Design and Technology'), 'identify and solve their own design problems and understand how to reformulate problems given to them', 'design'),
((SELECT nc_id FROM ncs WHERE title = 'KS3 Design and Technology'), 'develop specifications to inform the design of innovative, functional, appealing products that respond to needs in a variety of situations', 'design'),
((SELECT nc_id FROM ncs WHERE title = 'KS3 Design and Technology'), 'use a variety of approaches (for example biomimicry and user-centred design) to generate creative ideas and avoid stereotypical responses', 'design'),
((SELECT nc_id FROM ncs WHERE title = 'KS3 Design and Technology'), 'develop and communicate design ideas using annotated sketches, detailed plans, 3-D and mathematical modelling, oral and digital presentations and computer-based tools', 'design'),

-- Make
((SELECT nc_id FROM ncs WHERE title = 'KS3 Design and Technology'), 'select from and use specialist tools, techniques, processes, equipment and machinery precisely, including computer-aided manufacture', 'make'),
((SELECT nc_id FROM ncs WHERE title = 'KS3 Design and Technology'), 'select from and use a wider, more complex range of materials, components and ingredients, taking into account their properties', 'make'),

-- Evaluate
((SELECT nc_id FROM ncs WHERE title = 'KS3 Design and Technology'), 'analyse the work of past and present professionals and others to develop and broaden their understanding', 'evaluate'),
((SELECT nc_id FROM ncs WHERE title = 'KS3 Design and Technology'), 'investigate new and emerging technologies', 'evaluate'),
((SELECT nc_id FROM ncs WHERE title = 'KS3 Design and Technology'), 'test, evaluate and refine their ideas and products against a specification, taking into account the views of intended users and other interested groups', 'evaluate'),
((SELECT nc_id FROM ncs WHERE title = 'KS3 Design and Technology'), 'understand developments in design and technology, its impact on individuals, society and the environment, and the responsibilities of designers, engineers and technologists', 'evaluate'),

-- Technical Knowledge
((SELECT nc_id FROM ncs WHERE title = 'KS3 Design and Technology'), 'understand and use the properties of materials and the performance of structural elements to achieve functioning solutions', 'technical knowledge'),
((SELECT nc_id FROM ncs WHERE title = 'KS3 Design and Technology'), 'understand how more advanced mechanical systems used in their products enable changes in movement and force', 'technical knowledge'),
((SELECT nc_id FROM ncs WHERE title = 'KS3 Design and Technology'), 'understand how more advanced electrical and electronic systems can be powered and used in their products (for example, circuits with heat, light, sound and movement as inputs and outputs)', 'technical knowledge'),
((SELECT nc_id FROM ncs WHERE title = 'KS3 Design and Technology'), 'apply computing and use electronics to embed intelligence in products that respond to inputs (for example, sensors), and control outputs (for example, actuators), using programmable components (for example, microcontrollers)', 'technical knowledge'),

-- Cooking and Nutrition
((SELECT nc_id FROM ncs WHERE title = 'KS3 Design and Technology'), 'understand and apply the principles of nutrition and health', 'cooking and nutrition'),
((SELECT nc_id FROM ncs WHERE title = 'KS3 Design and Technology'), 'cook a repertoire of predominantly savoury dishes so that they are able to feed themselves and others a healthy and varied diet', 'cooking and nutrition'),
((SELECT nc_id FROM ncs WHERE title = 'KS3 Design and Technology'), 'become competent in a range of cooking techniques (for example, selecting and preparing ingredients; using utensils and electrical equipment; applying heat in different ways; using awareness of taste, texture and smell to decide how to season dishes and combine ingredients; adapting and using their own recipes)', 'cooking and nutrition'),
((SELECT nc_id FROM ncs WHERE title = 'KS3 Design and Technology'), 'understand the source, seasonality and characteristics of a broad range of ingredients', 'cooking and nutrition');


-- 03_insert_courses.sql
-- Courses for KS3 Design and Technology

INSERT INTO courses (title, tags, nc_id) VALUES
('YR7 Design and Technology', '{ks3, yr7, dt}', (SELECT nc_id FROM ncs WHERE title = 'KS3 Design and Technology')),
('YR8 Design and Technology', '{ks3, yr8, dt}', (SELECT nc_id FROM ncs WHERE title = 'KS3 Design and Technology')),
('YR9 Design and Technology', '{ks3, yr9, dt}', (SELECT nc_id FROM ncs WHERE title = 'KS3 Design and Technology'));


-- 04_insert_units.sql
-- Units for each course

INSERT INTO units (title, tags, course_id) VALUES
('YR7 Design and Technology - Introduction to Design', '{ks3, yr7, dt}', (SELECT course_id FROM courses WHERE title = 'YR7 Design and Technology')),
('YR7 Design and Technology - Introduction to Electronics', '{ks3, yr7, dt}', (SELECT course_id FROM courses WHERE title = 'YR7 Design and Technology')),
('YR8 Design and Technology - Introduction to Electronics', '{ks3, yr8, dt}', (SELECT course_id FROM courses WHERE title = 'YR8 Design and Technology')),
('YR8 Design and Technology - Introduction to CAD', '{ks3, yr8, dt}', (SELECT course_id FROM courses WHERE title = 'YR8 Design and Technology')),
('YR9 Design and Technology - Introduction to CAD', '{ks3, yr9, dt}', (SELECT course_id FROM courses WHERE title = 'YR9 Design and Technology')),
('YR9 Design and Technology - Introduction to Electronics', '{ks3, yr9, dt}', (SELECT course_id FROM courses WHERE title = 'YR9 Design and Technology'));


-- 05_insert_learning_objectives.sql
-- Learning objectives for YR7 Design

INSERT INTO learning_objectives (title, tags, unit_id) VALUES
('TBAT Understand User Needs', '{}', (SELECT unit_id FROM units WHERE title = 'YR7 Design and Technology - Introduction to Design')),
('TBAT Explore Design Ideas', '{}', (SELECT unit_id FROM units WHERE title = 'YR7 Design and Technology - Introduction to Design')),
('TBAT Communicate Designs', '{}', (SELECT unit_id FROM units WHERE title = 'YR7 Design and Technology - Introduction to Design'));


-- 06_insert_lessons.sql
-- Lessons for each unit

INSERT INTO lessons (title, tags, unit_id) VALUES
('Lesson 1: Introduction to Design Principles', '{ks3, yr7, dt}', (SELECT unit_id FROM units WHERE title = 'YR7 Design and Technology - Introduction to Design')),
('Lesson 2: Exploring User Needs', '{ks3, yr7, dt}', (SELECT unit_id FROM units WHERE title = 'YR7 Design and Technology - Introduction to Design')),
('Lesson 3: Sketching and Prototyping', '{ks3, yr7, dt}', (SELECT unit_id FROM units WHERE title = 'YR7 Design and Technology - Introduction to Design')),
('Lesson 1: Basics of Electronics', '{ks3, yr7, dt}', (SELECT unit_id FROM units WHERE title = 'YR7 Design and Technology - Introduction to Electronics')),
('Lesson 2: Circuit Design', '{ks3, yr7, dt}', (SELECT unit_id FROM units WHERE title = 'YR7 Design and Technology - Introduction to Electronics')),
('Lesson 1: Introduction to Electronics', '{ks3, yr8, dt}', (SELECT unit_id FROM units WHERE title = 'YR8 Design and Technology - Introduction to Electronics')),
('Lesson 2: Advanced Circuit Design', '{ks3, yr8, dt}', (SELECT unit_id FROM units WHERE title = 'YR8 Design and Technology - Introduction to Electronics')),
('Lesson 1: Basics of CAD', '{ks3, yr8, dt}', (SELECT unit_id FROM units WHERE title = 'YR8 Design and Technology - Introduction to CAD')),
('Lesson 2: 3D Modelling', '{ks3, yr8, dt}', (SELECT unit_id FROM units WHERE title = 'YR8 Design and Technology - Introduction to CAD')),
('Lesson 1: Advanced CAD Techniques', '{ks3, yr9, dt}', (SELECT unit_id FROM units WHERE title = 'YR9 Design and Technology - Introduction to CAD')),
('Lesson 2: CAD for Product Design', '{ks3, yr9, dt}', (SELECT unit_id FROM units WHERE title = 'YR9 Design and Technology - Introduction to CAD')),
('Lesson 1: Advanced Electronics', '{ks3, yr9, dt}', (SELECT unit_id FROM units WHERE title = 'YR9 Design and Technology - Introduction to Electronics')),
('Lesson 2: Electronics in Real-World Applications', '{ks3, yr9, dt}', (SELECT unit_id FROM units WHERE title = 'YR9 Design and Technology - Introduction to Electronics'));


-- 07_insert_criteria.sql
-- Criteria for each learning objective

INSERT INTO criteria (learning_objective_id, title) VALUES
((SELECT learning_objective_id FROM learning_objectives WHERE title = 'TBAT Understand User Needs'), 'I can research user needs through interviews and questionnaires'),
((SELECT learning_objective_id FROM learning_objectives WHERE title = 'TBAT Understand User Needs'), 'I can describe user needs in a specification'),
((SELECT learning_objective_id FROM learning_objectives WHERE title = 'TBAT Explore Design Ideas'), 'I can brainstorm multiple creative ideas'),
((SELECT learning_objective_id FROM learning_objectives WHERE title = 'TBAT Explore Design Ideas'), 'I can sketch initial design concepts'),
((SELECT learning_objective_id FROM learning_objectives WHERE title = 'TBAT Communicate Designs'), 'I can produce annotated sketches'),
((SELECT learning_objective_id FROM learning_objectives WHERE title = 'TBAT Communicate Designs'), 'I can create 3D CAD models to communicate designs');


-- 08_insert_learning_objective_lesson_map.sql
-- Link existing learning objectives to existing lessons (many-to-many)

INSERT INTO learning_objective_lesson_map (learning_objective_id, lesson_id) VALUES
-- TBAT Understand User Needs
((SELECT learning_objective_id FROM learning_objectives WHERE title = 'TBAT Understand User Needs'),
 (SELECT lesson_id FROM lessons WHERE title = 'Lesson 1: Introduction to Design Principles')),
((SELECT learning_objective_id FROM learning_objectives WHERE title = 'TBAT Understand User Needs'),
 (SELECT lesson_id FROM lessons WHERE title = 'Lesson 2: Exploring User Needs')),

-- TBAT Explore Design Ideas
((SELECT learning_objective_id FROM learning_objectives WHERE title = 'TBAT Explore Design Ideas'),
 (SELECT lesson_id FROM lessons WHERE title = 'Lesson 2: Exploring User Needs')),
((SELECT learning_objective_id FROM learning_objectives WHERE title = 'TBAT Explore Design Ideas'),
 (SELECT lesson_id FROM lessons WHERE title = 'Lesson 3: Sketching and Prototyping')),

-- TBAT Communicate Designs
((SELECT learning_objective_id FROM learning_objectives WHERE title = 'TBAT Communicate Designs'),
 (SELECT lesson_id FROM lessons WHERE title = 'Lesson 3: Sketching and Prototyping')),
((SELECT learning_objective_id FROM learning_objectives WHERE title = 'TBAT Communicate Designs'),
 (SELECT lesson_id FROM lessons WHERE title = 'Lesson 1: Basics of CAD'));



-- Set Up USers
INSERT INTO profiles (user_id, is_teacher, first_name, last_name) VALUES ('user_2yjidP4UdYKaAmizJ9TzJvecPhw', true, 'Leroy', 'Salih');

-- Set Up Groups
INSERT INTO groups (title, created_by) VALUES ('25-09A-DT', 'user_2yjidP4UdYKaAmizJ9TzJvecPhw'),
('25-09B-DT', 'user_2yjidP4UdYKaAmizJ9TzJvecPhw'),
('25-09C-DT', 'user_2yjidP4UdYKaAmizJ9TzJvecPhw'),
('25-09D-DT', 'user_2yjidP4UdYKaAmizJ9TzJvecPhw');


-- Group Membership

INSERT INTO group_membership (user_id, group_id, role) VALUES
('user_2yjidP4UdYKaAmizJ9TzJvecPhw', (SELECT group_id FROM groups WHERE title = '25-09A-DT'), 'teacher'),
('user_2yjidP4UdYKaAmizJ9TzJvecPhw', (SELECT group_id FROM groups WHERE title = '25-09B-DT'), 'teacher'),
('user_2yjidP4UdYKaAmizJ9TzJvecPhw', (SELECT group_id FROM groups WHERE title = '25-09C-DT'), 'teacher'),
('user_2yjidP4UdYKaAmizJ9TzJvecPhw', (SELECT group_id FROM groups WHERE title = '25-09D-DT'), 'teacher');


-- Assignments

INSERT INTO assignments (unit_id, group_id) VALUES
(
  (SELECT unit_id FROM units WHERE title = 'YR9 Design and Technology - Introduction to CAD'),
  (SELECT group_id FROM groups WHERE title = '25-09A-DT')
),
(
  (SELECT unit_id FROM units WHERE title = 'YR9 Design and Technology - Introduction to CAD'),
  (SELECT group_id FROM groups WHERE title = '25-09B-DT')
),
(
  (SELECT unit_id FROM units WHERE title = 'YR9 Design and Technology - Introduction to CAD'),
  (SELECT group_id FROM groups WHERE title = '25-09C-DT')
),
(
  (SELECT unit_id FROM units WHERE title = 'YR9 Design and Technology - Introduction to CAD'),
  (SELECT group_id FROM groups WHERE title = '25-09D-DT')
);


INSERT INTO activities (lesson_id, title, activity_type, body) VALUES
(
  (SELECT lesson_id FROM lessons WHERE title = 'Lesson 1: Advanced CAD Techniques'),
  'Keywords',
  'keywords',
  '[{"id": "0", "keyword":"CAD", "definition": "Computer Aided Design.  A software app that  helps you to design your ideas."}]'

),
(
  (SELECT lesson_id FROM lessons WHERE title = 'Lesson 1: Advanced CAD Techniques'),
  'Description',
  'text',
  '{"html": "<p>Hello, this is a <strong>Great</strong> description.</p>"}'

),
(
  (SELECT lesson_id FROM lessons WHERE title = 'Lesson 1: Advanced CAD Techniques'),
  'Description',
  'video',
  '{"url": "X8u3zhDUDzE"}'

),
(
  (SELECT lesson_id FROM lessons WHERE title = 'Lesson 1: Advanced CAD Techniques'),
  'Description',
  'images',
  '{"images": "X8u3zhDUDzE"}'
)

