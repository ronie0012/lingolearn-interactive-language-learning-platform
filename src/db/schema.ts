import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';



// Auth tables for better-auth
export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  role: text("role").notNull().default('user'), // user | admin | instructor | premium
  isActive: integer("is_active", { mode: "boolean" })
    .$defaultFn(() => true)
    .notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", {
    mode: "timestamp",
  }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", {
    mode: "timestamp",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
});

// Language learning platform tables
export const userProgress = sqliteTable('user_progress', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  languageCode: text('language_code').notNull(),
  wordsLearned: integer('words_learned').notNull().default(0),
  lessonsCompleted: integer('lessons_completed').notNull().default(0),
  quizzesPassed: integer('quizzes_passed').notNull().default(0),
  currentStreak: integer('current_streak').notNull().default(0),
  lastPracticeDate: integer('last_practice_date', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
});

export const quizResults = sqliteTable('quiz_results', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  languageCode: text('language_code').notNull(),
  quizType: text('quiz_type').notNull(),
  score: integer('score').notNull(),
  totalQuestions: integer('total_questions').notNull(),
  completedAt: integer('completed_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
});

export const learnedVocabulary = sqliteTable('learned_vocabulary', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  languageCode: text('language_code').notNull(),
  word: text('word').notNull(),
  translation: text('translation').notNull(),
  learnedAt: integer('learned_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
  timesReviewed: integer('times_reviewed').notNull().default(0),
});

// Course catalog tables
export const courses = sqliteTable('courses', {
  id: text('id').primaryKey(), // slug, e.g., 'spanish-beginners'
  languageCode: text('language_code').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  level: text('level').notNull(), // Beginner | Intermediate | Advanced
  category: text('category').notNull(),
  flag: text('flag'), // emoji or URL to image if needed
  duration: text('duration'), // e.g., '8 weeks'
  students: integer('students').notNull().default(0),
  ratingTenths: integer('rating_tenths').notNull().default(0), // 48 => 4.8
  totalLessons: integer('total_lessons').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
});

export const courseModules = sqliteTable('course_modules', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  courseId: text('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
  index: integer('index').notNull().default(0),
  title: text('title').notNull(),
  description: text('description'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
});

export const lessons = sqliteTable('lessons', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  moduleId: integer('module_id').notNull().references(() => courseModules.id, { onDelete: 'cascade' }),
  index: integer('index').notNull().default(0),
  title: text('title').notNull(),
  content: text('content'), // markdown or rich text
  duration: text('duration'), // e.g., '20 min'
  lessonType: text('lesson_type').notNull().default('general'), // vocabulary | grammar | conversation | general
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
});

export const courseVocabulary = sqliteTable('course_vocabulary', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  courseId: text('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
  word: text('word').notNull(),
  translation: text('translation').notNull(),
  partOfSpeech: text('part_of_speech'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
});

export const courseGrammar = sqliteTable('course_grammar', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  courseId: text('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  content: text('content').notNull(),
  example: text('example'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
});

export const culturalContent = sqliteTable('cultural_content', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  courseId: text('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  url: text('url'),
  imageUrl: text('image_url'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
});

export const quizQuestions = sqliteTable('quiz_questions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  courseId: text('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
  question: text('question').notNull(),
  optionsJson: text('options_json').notNull(), // JSON string array of options
  correctIndex: integer('correct_index').notNull(),
  type: text('type').notNull().default('vocabulary'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
});

export const userCourseProgress = sqliteTable('user_course_progress', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  courseId: text('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
  completedLessons: integer('completed_lessons').notNull().default(0),
  totalLessons: integer('total_lessons').notNull().default(0),
  lastLessonId: integer('last_lesson_id'),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
});
