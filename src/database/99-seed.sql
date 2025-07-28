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
  '{"keywords":[{"id": "0", "keyword":"CAD", "definition": "Computer Aided Design.  A software app that  helps you to design your ideas."}]}'

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

)
/*,
(
  (SELECT lesson_id FROM lessons WHERE title = 'Lesson 1: Advanced CAD Techniques'),
  'Description',
  'images',
  '{"images": ["1000x600.jpg","1000x600.jpg" ]}'
)
*/