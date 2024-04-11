-- Your SQL commands follow
CREATE TABLE teams (
  pk_teamid SERIAL PRIMARY KEY,
  email VARCHAR,
  name VARCHAR,
  leader_name VARCHAR
);
CREATE TABLE events (
  pk_eventId SERIAL PRIMARY KEY,
  name varchar,
  starting_date DATE,
  ending_date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE event_parameters (
  pk_paramid SERIAL PRIMARY KEY,
  name VARCHAR,
  full_marks INTEGER,
  fk_eventid INTEGER,
  FOREIGN KEY (fk_eventid) REFERENCES events (pk_eventId)
);
CREATE TABLE user_events (
  pk_id SERIAL PRIMARY KEY,
  fk_teamid INTEGER,
  fk_eventid INTEGER,
  FOREIGN KEY (fk_eventid) REFERENCES events (pk_eventId),
  FOREIGN KEY (fk_teamid) REFERENCES teams (pk_teamid)
);
CREATE TABLE judges(
  pk_judgeid SERIAL PRIMARY KEY,
  email VARCHAR,
  name VARCHAR,
  password VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE judge_events(
  pk_id SERIAL PRIMARY KEY,
  fk_judgeid INTEGER,
  fk_eventid INTEGER,
  FOREIGN KEY (fk_eventid) REFERENCES events (pk_eventId),
  FOREIGN KEY (fk_judgeid) REFERENCES judges (pk_judgeid)
);
CREATE TABLE judge_scores(
  pk_id SERIAL PRIMARY KEY,
  fk_judgeid INTEGER,
  fk_teamid INTEGER,
  fk_eventid INTEGER,
  fk_paramid INTEGER,
  score INTEGER,
  FOREIGN KEY (fk_eventid) REFERENCES events (pk_eventId),
  FOREIGN KEY (fk_judgeid) REFERENCES judges (pk_judgeid),
  FOREIGN KEY (fk_teamid) REFERENCES teams (pk_teamid),
  FOREIGN KEY (fk_paramid) REFERENCES event_parameters (pk_paramid)
);