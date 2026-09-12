DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'lesson_progress_user_lesson_unique') THEN
    ALTER TABLE lesson_progress ADD CONSTRAINT lesson_progress_user_lesson_unique UNIQUE (user_id, lesson_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'topic_progress_user_topic_unique') THEN
    ALTER TABLE topic_progress ADD CONSTRAINT topic_progress_user_topic_unique UNIQUE (user_id, topic_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_progress_user_discipline_unique') THEN
    ALTER TABLE user_progress ADD CONSTRAINT user_progress_user_discipline_unique UNIQUE (user_id, discipline_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_flashcard_progress_user_flashcard_unique') THEN
    ALTER TABLE user_flashcard_progress ADD CONSTRAINT user_flashcard_progress_user_flashcard_unique UNIQUE (user_id, flashcard_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'lab_progress_user_item_unique') THEN
    ALTER TABLE lab_progress ADD CONSTRAINT lab_progress_user_item_unique UNIQUE (user_id, item_id);
  END IF;
END $$;

