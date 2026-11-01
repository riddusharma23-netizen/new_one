  -- =====================================================================
  -- Smt. Champi Devi Inter College - development seed data
  -- Run AFTER schema.sql, on a FRESH database only.
  -- (IDs below are hard-coded and assume empty tables with AUTO_INCREMENT = 1.
  --  Run against an explicitly empty local database; do not drop existing school data.
  -- =====================================================================

  USE cdic;

  SET NAMES utf8mb4;

  -- ---------------------------------------------------------------------
  -- Admin + settings
  -- ---------------------------------------------------------------------
  -- Development admin only. Change this password immediately in production.
  -- Login email:    admin@champidevi.local
  -- Login password: Admin@12345
  INSERT INTO admins (name, email, password_hash, role, status)
  VALUES (
    'School Administrator',
    'admin@champidevi.local',
    '$2b$12$yUwwkGakxfbB0inx2wc4.O9kASB.8PTGN8jZ13W8jY52Fc/u3dZWK',
    'ADMIN',
    'ACTIVE'
  )
  ON DUPLICATE KEY UPDATE name = VALUES(name);

  INSERT INTO settings (setting_key, setting_value) VALUES
    ('school_name', 'Smt. Champi Devi Inter College'),
    ('academic_year', '2025-26')
  ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value);

  -- ---------------------------------------------------------------------
  -- Academic year, rooms, time slots
  -- ---------------------------------------------------------------------
  INSERT INTO academic_years (name, start_date, end_date, status) VALUES
    ('2025-26', '2025-04-01', '2026-03-31', 'ACTIVE');

  -- Room ids: 101=1, 102=2, 201=3, 202=4, 204=5, 301=6, 302=7, 401=8, 402=9
  INSERT INTO rooms (name, room_type, active) VALUES
    ('101', 'CLASSROOM', 'ACTIVE'),
    ('102', 'CLASSROOM', 'ACTIVE'),
    ('201', 'CLASSROOM', 'ACTIVE'),
    ('202', 'CLASSROOM', 'ACTIVE'),
    ('204', 'CLASSROOM', 'ACTIVE'),
    ('301', 'CLASSROOM', 'ACTIVE'),
    ('302', 'CLASSROOM', 'ACTIVE'),
    ('401', 'CLASSROOM', 'ACTIVE'),
    ('402', 'CLASSROOM', 'ACTIVE');

  -- Initial school day structure from Time Table 8 OCT.
  -- Editable later in Admin > Schedules.
  -- Slot ids: Prayer=1, P-I=2, P-II=3, Break=4, P-III=5, P-IV=6, Lunch=7,
  --           P-V=8, P-VI=9, Break=10, P-VII=11, P-VIII=12
  INSERT INTO time_slots
    (label, start_time, end_time, slot_order, slot_type, is_break, is_lunch, active)
  VALUES
    ('Prayer',          '09:30:00', '09:45:00',  1, 'ASSEMBLY', 0, 0, 'ACTIVE'),
    ('Period I',        '09:45:00', '10:30:00',  2, 'REGULAR',  0, 0, 'ACTIVE'),
    ('Period II',       '10:30:00', '11:15:00',  3, 'REGULAR',  0, 0, 'ACTIVE'),
    ('Morning Break',   '11:15:00', '11:20:00',  4, 'BREAK',    1, 0, 'ACTIVE'),
    ('Period III',      '11:20:00', '12:05:00',  5, 'REGULAR',  0, 0, 'ACTIVE'),
    ('Period IV',       '12:05:00', '12:45:00',  6, 'REGULAR',  0, 0, 'ACTIVE'),
    ('Lunch',           '12:45:00', '13:15:00',  7, 'LUNCH',    0, 1, 'ACTIVE'),
    ('Period V',        '13:15:00', '13:55:00',  8, 'REGULAR',  0, 0, 'ACTIVE'),
    ('Period VI',       '13:55:00', '14:35:00',  9, 'REGULAR',  0, 0, 'ACTIVE'),
    ('Afternoon Break', '14:35:00', '14:40:00', 10, 'BREAK',    1, 0, 'ACTIVE'),
    ('Period VII',      '14:40:00', '15:20:00', 11, 'REGULAR',  0, 0, 'ACTIVE'),
    ('Period VIII',     '15:20:00', '15:50:00', 12, 'REGULAR',  0, 0, 'ACTIVE');

  -- ---------------------------------------------------------------------
  -- Teachers, classes, subjects
  -- ---------------------------------------------------------------------
  INSERT INTO teachers
    (name, designation, department, subject, qualification, experience, email, phone, image, bio, staff_type, status, display_order)
  VALUES
    ('Bhagwati Prasad', 'Principal', 'Administration', 'Hindi', 'M.A. (Sanskrit), L.T.', '20+ Years', 'bhagwati@example.com', NULL, '/teachers/bhagwati-prasad.png', NULL, 'TEACHER', 'ACTIVE', 1),
    ('Devki Nandan Sharma', 'Vice-Principal', 'Administration', 'SST', 'M.A., I.G.D. (Bombay)', '18+ Years', 'dnsharma779@gmail.com', NULL, '/teachers/devki-nandan-sharma.jpeg', NULL, 'TEACHER', 'ACTIVE', 2),
    ('Krishna Murari Upadhyay', 'Lecturer - Mathematics', 'Mathematics', 'Mathematics', 'M.Sc. (Mathematics), B.Ed.', '12+ Years', 'krishnamurari8532@gmail.com', NULL, '/teachers/krishna-murari.jpeg', NULL, 'TEACHER', 'ACTIVE', 3),
    ('Vineet Kumar', 'Lecturer - Chemistry', 'Science', 'Chemistry', 'M.Sc. (Chemistry), B.Ed.', '10+ Years', 'vineetupadhyay2014@gmail.com', NULL, '/teachers/vineet-kumar.jpeg', NULL, 'TEACHER', 'ACTIVE', 4),
    ('Megh Shyam', 'Lecturer - English', 'Languages', 'English', 'M.A. (English), B.Ed.', '9+ Years', 'sharmameghshyam6@gmail.com', NULL, '/teachers/megh-shyam.jpeg', NULL, 'TEACHER', 'ACTIVE', 5),
    ('Rakesh Kumar', 'Lecturer - History', 'Social Science', 'History', 'M.A., B.Ed.', '11+ Years', 'glpathak779@gmail.com', NULL, '/teachers/rakesh-kumar.jpeg', NULL, 'TEACHER', 'ACTIVE', 6),
    ('Sandeep Kumar', 'Lecturer - Physics', 'Science', 'Physics', 'M.Sc. (Physics), B.Ed.', '8+ Years', 'sandeepksharma4243@gmail.com', NULL, '/teachers/sandeep-kumar.jpeg', NULL, 'TEACHER', 'ACTIVE', 7),
    ('Vineet Sharma', 'Lecturer - English', 'Languages', 'English', 'M.A., B.Ed.', '7+ Years', 'vineetsharma1600@gmail.com', NULL, '/teachers/vineet-sharma.jpeg', NULL, 'TEACHER', 'ACTIVE', 8),
    ('Vikram Babu', 'Lecturer - Hindi', 'Languages', 'Hindi', 'M.A., B.Ed.', '9+ Years', 'vikrambabu101271@gmail.com', NULL, '/teachers/vikram-babu.jpeg', NULL, 'TEACHER', 'ACTIVE', 9),
    ('Shivam Varshney', 'Lecturer - Biology', 'Science', 'Biology', 'M.Sc. (Biology), B.Ed.', '6+ Years', 'mth.shivam20@gmail.com', NULL, '/teachers/shivam-varshney.jpeg', NULL, 'TEACHER', 'ACTIVE', 10),
    ('Anil Kumar Kaushik', 'Lecturer - Physics', 'Science', 'Science', 'M.Sc. (Physics)', '5+ Years', 'pt.akkaushik1997@gmail.com', NULL, '/teachers/anilkumar-Kaushik.jpeg', NULL, 'TEACHER', 'ACTIVE', 11),
    ('Dharmvir Sharma', 'Assistant Teacher - Science', 'Science', 'Mathematics', 'B.Sc., B.Ed.', '6+ Years', 'dharmvirsharma15@gmail.com', NULL, '/teachers/SCHOOL.jpg', NULL, 'TEACHER', 'ACTIVE', 12),
    ('Hemalata Garg', 'Assistant Teacher - Science', 'Science', 'Science', 'B.Sc.', '4+ Years', 'neerajkaushik734@gmail.com', NULL, '/teachers/hemalata-garg.jpeg', NULL, 'TEACHER', 'ACTIVE', 13);

  -- Class ids: 1-A=1, 1-B=2, 2-A=3, 2-B=4, 3-A=5, 3-B=6, 4-A=7, 4-B=8, 10-A=9
  INSERT INTO classes (class_name, section, academic_year, class_teacher_id, room, status) VALUES
    ('1',  'A', '2025-26', 3,  '101', 'ACTIVE'),
    ('1',  'B', '2025-26', 5,  '102', 'ACTIVE'),
    ('2',  'A', '2025-26', 6,  '201', 'ACTIVE'),
    ('2',  'B', '2025-26', 8,  '202', 'ACTIVE'),
    ('3',  'A', '2025-26', 7,  '301', 'ACTIVE'),
    ('3',  'B', '2025-26', 10, '302', 'ACTIVE'),
    ('4',  'A', '2025-26', 4,  '401', 'ACTIVE'),
    ('4',  'B', '2025-26', 11, '402', 'ACTIVE'),
    ('10', 'A', '2025-26', 3,  '204', 'ACTIVE');

  -- Subject ids 1..14 (in the order below)
  INSERT INTO subjects (subject_name, subject_code, class_id, teacher_id, weekly_periods, status) VALUES
    ('Mathematics', 'MATH-1A',  1, 3,  6, 'ACTIVE'),
    ('English',     'ENG-1A',   1, 5,  5, 'ACTIVE'),
    ('Hindi',       'HIN-1A',   1, 9,  5, 'ACTIVE'),
    ('Science',     'SCI-1A',   1, 13, 5, 'ACTIVE'),
    ('Mathematics', 'MATH-1B',  2, 12, 6, 'ACTIVE'),
    ('English',     'ENG-1B',   2, 8,  5, 'ACTIVE'),
    ('Physics',     'PHY-2A',   3, 7,  5, 'ACTIVE'),
    ('History',     'HIS-2A',   3, 6,  4, 'ACTIVE'),
    ('Chemistry',   'CHE-2B',   4, 4,  5, 'ACTIVE'),
    ('Biology',     'BIO-3A',   5, 10, 5, 'ACTIVE'),
    ('SST',         'SST-3B',   6, 2,  4, 'ACTIVE'),
    ('Computer',    'COM-4A',   7, 11, 3, 'ACTIVE'),
    ('Mathematics', 'MATH-10A', 9, 3,  6, 'ACTIVE'),
    ('Physics',     'PHY-10A',  9, 7,  5, 'ACTIVE');

  -- ---------------------------------------------------------------------
  -- Timetable
  -- Times now match the time_slots table above (school starts 09:30).
  -- period_number 1 = Period I (09:45), 2 = Period II (10:30),
  -- 3 = Period III (11:20, after morning break), 4 = Period IV (12:05).
  -- ---------------------------------------------------------------------
  INSERT INTO schedules
    (teacher_id, class_id, subject_id, day_of_week, period_number, start_time, end_time, room, academic_year, status)
  VALUES
    (3,  1, 1,  'Monday',    1, '09:45:00', '10:30:00', '101', '2025-26', 'ACTIVE'),
    (5,  1, 2,  'Monday',    2, '10:30:00', '11:15:00', '101', '2025-26', 'ACTIVE'),
    (9,  1, 3,  'Monday',    3, '11:20:00', '12:05:00', '101', '2025-26', 'ACTIVE'),
    (13, 1, 4,  'Tuesday',   1, '09:45:00', '10:30:00', '101', '2025-26', 'ACTIVE'),
    (3,  1, 1,  'Wednesday', 1, '09:45:00', '10:30:00', '101', '2025-26', 'ACTIVE'),
    (7,  3, 7,  'Monday',    1, '09:45:00', '10:30:00', '201', '2025-26', 'ACTIVE'),
    (6,  3, 8,  'Monday',    2, '10:30:00', '11:15:00', '201', '2025-26', 'ACTIVE'),
    (4,  4, 9,  'Tuesday',   2, '10:30:00', '11:15:00', '202', '2025-26', 'ACTIVE'),
    (10, 5, 10, 'Wednesday', 2, '10:30:00', '11:15:00', '301', '2025-26', 'ACTIVE'),
    (3,  9, 13, 'Monday',    3, '11:20:00', '12:05:00', '204', '2025-26', 'ACTIVE'),
    (7,  9, 14, 'Monday',    4, '12:05:00', '12:45:00', '204', '2025-26', 'ACTIVE'),
    (3,  9, 13, 'Friday',    2, '10:30:00', '11:15:00', '204', '2025-26', 'ACTIVE');

  -- Sample entries for the slot-based timetable (Class 1-A, Monday).
  -- academic_year_id=1, class_id=1, room 101 => room_id=1
  INSERT INTO schedule_entries
    (academic_year_id, class_id, subject_id, teacher_id, room_id, time_slot_id, day_of_week, entry_type, display_label, status)
  VALUES
    (1, 1, NULL, NULL, NULL, 1, 'Monday', 'ASSEMBLY', 'Prayer',        'PUBLISHED'),
    (1, 1, 1,    3,    1,    2, 'Monday', 'SUBJECT',  NULL,            'PUBLISHED'),
    (1, 1, 2,    5,    1,    3, 'Monday', 'SUBJECT',  NULL,            'PUBLISHED'),
    (1, 1, NULL, NULL, NULL, 4, 'Monday', 'BREAK',    'Morning Break', 'PUBLISHED'),
    (1, 1, 3,    9,    1,    5, 'Monday', 'SUBJECT',  NULL,            'PUBLISHED'),
    (1, 1, NULL, NULL, NULL, 7, 'Monday', 'LUNCH',    'Lunch',         'PUBLISHED');

  -- ---------------------------------------------------------------------
  -- Website content
  -- ---------------------------------------------------------------------
  INSERT INTO gallery (title, description, image, category, event_name, display_order, status) VALUES
    ('Folk Dance Performance', 'Students presenting a folk dance on Annual Day.', '/images/gallery/school.jpg', 'Cultural Event', 'Annual Cultural Function', 1, 'PUBLISHED'),
    ('Patriotic Song', 'Choir performance during the cultural function.', '/images/gallery/T2.jpg', 'Cultural Event', 'Annual Cultural Function', 2, 'PUBLISHED'),
    ('Drama Performance', 'Stage drama by senior students.', '/images/gallery/school.jpg', 'Cultural Event', 'Annual Cultural Function', 3, 'PUBLISHED'),
    ('Prize Distribution', 'Annual prize distribution ceremony.', '/images/gallery/PG9.jpg', 'Cultural Event', 'Annual Cultural Function', 4, 'PUBLISHED'),
    ('Annual Sports Meet', 'Opening ceremony of the sports meet.', '/images/gallery/PLA1.jpg', 'Sports', 'Annual Sports Meet', 5, 'PUBLISHED'),
    ('Cricket Tournament', 'Inter-house cricket match.', '/images/gallery/PLA1.jpg', 'Sports', 'Annual Sports Meet', 6, 'PUBLISHED'),
    ('Athletics Competition', 'Track events on sports day.', '/images/gallery/PG9.jpg', 'Sports', 'Annual Sports Meet', 7, 'PUBLISHED'),
    ('Republic Day Celebration', 'Flag hoisting and cultural programme.', '/images/gallery/PG9.jpg', 'Celebration', 'Republic Day', 8, 'PUBLISHED'),
    ('Independence Day', 'Independence Day assembly.', '/images/gallery/PG9.jpg', 'Celebration', 'Independence Day', 9, 'PUBLISHED'),
    ('Science Exhibition', 'Student science models and experiments.', '/images/gallery/PG9.jpg', 'Academic', 'Science Exhibition', 10, 'PUBLISHED'),
    ('Campus View', 'School campus photograph.', '/images/gallery/PG9.jpg', 'Campus', 'Campus Life', 11, 'PUBLISHED');

  INSERT INTO blogs
    (title, slug, excerpt, content, featured_image, author, category, status, published_at, seo_title, seo_description)
  VALUES
    (
      'How Modern Education Builds Better Future',
      'how-modern-education-builds-better-future',
      'Discover innovative learning methods and how students gain confidence through practical education.',
      '<p>Modern classrooms combine practical work, digital tools and mentoring so students can apply what they learn.</p><p>At Smt. Champi Devi Inter College we emphasise hands-on labs, extra classes and character building.</p>',
      '/school.jpg',
      'Admin',
      'Education',
      'PUBLISHED',
      '2026-02-12 10:00:00',
      'How Modern Education Builds Better Future',
      'Innovative learning methods at Champi Devi Inter College.'
    ),
    (
      'Why Students Need Creative Learning',
      'why-students-need-creative-learning',
      'Interactive activities improve understanding and make learning enjoyable.',
      '<p>Creative learning helps students remember concepts and build confidence on stage and in class.</p>',
      '/images/gallery/PG9.jpg',
      'Admin',
      'Learning',
      'PUBLISHED',
      '2026-02-16 10:00:00',
      'Why Students Need Creative Learning',
      'Creative learning at Champi Devi Inter College.'
    ),
    (
      'Building Leadership In School Life',
      'building-leadership-in-school-life',
      'Student development through events, teamwork and practical activities.',
      '<p>Sports, cultural events and classroom responsibilities help students become leaders.</p>',
      '/images/gallery/PLA1.jpg',
      'Admin',
      'Student Life',
      'PUBLISHED',
      '2026-02-22 10:00:00',
      'Building Leadership In School Life',
      'Leadership development at Champi Devi Inter College.'
    );

  -- Event dates moved forward so they show as upcoming (today: Nov 2026).
  INSERT INTO events (title, description, event_date, start_time, end_time, location, image, status) VALUES
    ('Annual Sports Meet',       'Athletics, cricket, volleyball and team games.',              '2026-11-20', '08:00:00', '16:00:00', 'School Ground',    '/images/gallery/PLA1.jpg', 'PUBLISHED'),
    ('Annual Cultural Function', 'Folk dance, drama and music performances by students.',       '2026-12-15', '10:00:00', '16:00:00', 'School Auditorium', '/images/gallery/PG9.jpg',  'PUBLISHED'),
    ('Science Exhibition',       'Student projects from Physics, Chemistry and Biology labs.',  '2027-01-18', '09:00:00', '13:00:00', 'Science Block',     '/images/gallery/PG9.jpg',  'PUBLISHED');

  INSERT INTO departments (name, slug, description, hero_image, icon_name, color, extra_json, status, display_order) VALUES
    ('Computer Lab', 'computer-lab', 'Modern computer laboratory equipped with the latest systems, high-speed internet and practical learning environment.', '/department/computer/com-lab-2.jpg', 'MonitorSmartphone', '#DF6525',
      JSON_OBJECT('facilities', JSON_ARRAY('Computer Lab','High Speed Internet','Projector','Digital Classroom','Air Conditioned Lab','Practical Sessions')), 'ACTIVE', 1),
    ('Library', 'library', 'A quiet learning space with books and reference material for students.', '/department/library/banner.jpg', 'Library', '#2563EB',
      JSON_OBJECT('facilities', JSON_ARRAY()), 'ACTIVE', 2),
    ('Science Lab', 'science-lab', 'Practical science learning through experiments and observation.', '/department/science/banner.jpg', 'FlaskConical', '#16A34A',
      JSON_OBJECT('facilities', JSON_ARRAY()), 'ACTIVE', 3),
    ('Math Lab', 'math-lab', 'Activity-based mathematics learning.', '/department/math/banner.jpg', 'Calculator', '#7C3AED',
      JSON_OBJECT('facilities', JSON_ARRAY()), 'ACTIVE', 4),
    ('Games & Sports', 'games-sports', 'Sports facilities that build teamwork, fitness and discipline.', '/department/sports/banner.jpg', 'Trophy', '#DC2626',
      JSON_OBJECT('facilities', JSON_ARRAY()), 'ACTIVE', 5);

  -- Slugs are all lowercase now.
  INSERT INTO facilities (name, slug, description, image, features, extra_json, status, display_order) VALUES
    ('Spiritual Tour', 'spiritual-tour', 'Annual value-based spiritual tours in collaboration with ISKCON Vrindavan for moral science and character building.', '/why/scho.png',
      JSON_ARRAY('Educational visits','Cultural experiences','Spiritual learning','Real-world exploration'),
      JSON_OBJECT('contentImage','/why/scho1.png','label','Explore & Learn','heading','Learning Beyond The Classroom'), 'ACTIVE', 1),
    ('Certified Teachers', 'certified-teachers', 'Dedicated certified lecturers providing personalized academic attention.', '/why/digi1.png',
      JSON_ARRAY('Qualified and experienced educators','Student-focused teaching approach','Academic guidance and mentorship','Supportive classroom environment'),
      JSON_OBJECT('contentImage','/why/ext-class.png','label','Our Educators','heading','Inspiring Students To Achieve More'), 'ACTIVE', 2),
    ('English Speaking', 'english-speaking', 'English speaking and personality development sessions for rural students.', '/why/spo.png',
      JSON_ARRAY('Improved communication skills','Better vocabulary','Better pronunciation','Increased speaking confidence'),
      JSON_OBJECT('contentImage','/why/spo1.png','label','Communication Skills','heading','Speak With Confidence'), 'ACTIVE', 3),
    ('Extra Classes', 'extra-classes', 'Regular extra classes to support students preparing for board exams.', '/why/ext-class.png',
      JSON_ARRAY('Extra support for difficult subjects','Concept clarification','Additional practice sessions','Academic performance improvement'),
      JSON_OBJECT('contentImage','/why/sc4.jpg','label','Academic Support','heading','Helping Students Learn Better'), 'ACTIVE', 4),
    ('Scholarship', 'scholarship', 'Scholarship opportunities for talented and hardworking students.', '/why/scho.png',
      JSON_ARRAY('Encourages academic excellence','Supports deserving students','Motivates students to achieve higher goals','Helps support quality education'),
      JSON_OBJECT('contentImage','/why/scho2.png','label','Scholarship Program','heading','Rewarding Talent & Hard Work'), 'ACTIVE', 5);

  -- NOTE: rename the physics image file to /labs/physics/phy-2.png
  -- (spaces and brackets in file names cause URL-encoding problems).
  INSERT INTO laboratories (name, slug, description, images, facilities, extra_json, status, display_order) VALUES
    ('Physics Lab', 'physics-lab', 'Practical knowledge of mechanics, electricity, optics and magnetism.',
      JSON_ARRAY('/labs/physics/phy-2.png','/labs/physics/physics-1.jpg'),
      JSON_ARRAY('Modern Physics Equipment','Electricity Experiments','Optics Practical','Measurement Instruments'),
      JSON_OBJECT('shortTitle','Physics Laboratory','icon','Atom'), 'ACTIVE', 1),
    ('Chemistry Lab', 'chemistry-lab', 'Fully equipped chemistry laboratory for reactions, observation and safe practical work.',
      JSON_ARRAY('/labs/chemistry/chem1.png'),
      JSON_ARRAY('Chemical Reactions','Laboratory Safety','Glassware Practice','Scientific Observation'),
      JSON_OBJECT('shortTitle','Chemistry Laboratory','icon','FlaskConical'), 'ACTIVE', 2),
    ('Biology Lab', 'biology-lab', 'Hands-on biology practicals with specimens and microscopes.',
      JSON_ARRAY('/labs/biology/bio1.png'),
      JSON_ARRAY('Microscopes','Specimens','Practical Observation'),
      JSON_OBJECT('shortTitle','Biology Laboratory','icon','Microscope'), 'ACTIVE', 3);

  -- ---------------------------------------------------------------------
  -- Sample student result (Class 10-A => class_id 9)
  -- ---------------------------------------------------------------------
  INSERT INTO students (student_name, father_name, mother_name, class_id, class_label, section, roll_no, session, status) VALUES
    ('Aarav Sharma', 'Rakesh Sharma', 'Sunita Sharma', 9, '10', 'A', '1001', '2025-26', 'ACTIVE');

  INSERT INTO results (student_id, session, overall_grade, result_status) VALUES
    (1, '2025-26', 'A+', 'PASS');

  INSERT INTO result_subjects (result_id, subject, max_marks, obtain_marks, grade) VALUES
    (1, 'English',        100, 90, 'A+'),
    (1, 'Hindi',          100, 82, 'A'),
    (1, 'Mathematics',    100, 98, 'A+'),
    (1, 'Science',        100, 88, 'A'),
    (1, 'Social Science', 100, 85, 'A');

  INSERT INTO activity_logs (admin_id, action, entity, entity_id, message) VALUES
    (1, 'SEED', 'system', NULL, 'Development database seeded');