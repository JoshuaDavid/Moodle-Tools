create table if not exists revisions (
    id integer primary key autoincrement,
    date datetime default (datetime(current_timestamp)),
    course_id integer,
    activity_id integer,
    user_id integer,
    action text,
    revision_body text
);
