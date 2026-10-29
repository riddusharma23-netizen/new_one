ALTER TABLE classes
  DROP INDEX uq_class_section_year;

ALTER TABLE subjects
  DROP INDEX uq_subject_code_class;
