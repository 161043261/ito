import mysql from "mysql";
import fs from "node:fs";
import path from "node:path";

let conf = {
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "pass",
  db: "db0",
};
const confPath = path.join(process.cwd(), "./conf.json");
if (fs.existsSync(confPath)) {
  const conf2 = JSON.parse(fs.readFileSync(confPath, { encoding: "utf-8" }));
  conf = { ...conf, ...conf2 };
} else {
  console.warn("[model/db] conf.json not found");
}

const pool = mysql.createPool({
  ...conf,
  multipleStatements: true,
  charset: "utf8mb4",
});

function createUsers() {
  const sql = `
create table if not exists users
(
  id         int(31)      not null auto_increment primary key,
  email      varchar(255) not null unique,
  password   varchar(255) not null,
  avatar     varchar(255) null,
  username   varchar(255) null,
  salt       varchar(255) not null,
  signature  longtext     null,
  created_at timestamp default current_timestamp,
  updated_at timestamp default current_timestamp on update
) engine = InnoDB
  default charset = utf8mb4;
  `;

  pool.query(sql, (err) => {
    if (err) {
      console.error("[model/db]", err);
    }
  });
}

function createFriends() {
  const sql = `
create table if not exists friends
(
  id         int(31)      not null auto_increment primary key,
  user_id    int(31)      not null,
  email      varchar(255) not null,
  avatar     varchar(255) null,
  state      enum ('online', 'offline') default 'offline',
  note_name  varchar(255),
  tag_id     int(31),
  unread_cnt int(31)                    default 0,
  created_at timestamp                  default current_timestamp,
  updated_at timestamp                  default current_timestamp on update current_timestamp,
  index idx_tag_id (tag_id),
  foreign key (tag_id) references tags (id) on delete set null
) engine = InnoDB
  default charset = utf8mb4;
  `;
  pool.query(sql, (err) => {
    if (err) {
      console.error("[model/db]", err);
    }
  });
}

function createTags() {
  const sql = `
create table if not exists tags
(
  id         int(31)      not null auto_increment primary key,
  user_id    int(31)      not null,
  email      varchar(255) not null,
  tag_name   varchar(255) not null,
  created_at timestamp default current_timestamp,
  updated_at timestamp default current_timestamp on update current_timestamp,
  index idx_user_id (user_id),
  foreign key (user_id) references users (id) on delete cascade
) engine = InnoDB
  default charset = utf8mb4;
  `;
  pool.query(sql, (err) => {
    if (err) {
      console.error("[model/db]", err);
    }
    createFriends();
    createGroups();
  });
}

function createGroups() {
  const sql = `
create table if not exists \`groups\`
(
  id         int(31)      not null auto_increment primary key,
  group_name varchar(255) not null,
  owner_id   int(31)      not null,
  avatar     varchar(255),
  readme     text,
  room_num   varchar(255) not null unique,
  created_at timestamp default current_timestamp,
  updated_at timestamp default current_timestamp on update current_timestamp,
  index idx_owner_id (owner_id),
  foreign key (owner_id) references users (id) on delete cascade
) engine = InnoDB
  charset = utf8mb4;
  `;
  pool.query(sql, (err) => {
    if (err) {
      console.error("[model/db]", err);
    }
    createGroupMembers();
  });
}

function createGroupMembers() {
  const sql = `
create table if not exists group_members
(
  id         int(31)      not null auto_increment primary key,
  nickname   varchar(255) not null,
  group_id   int(31)      not null,
  user_id    int(31)      not null,
  created_at timestamp default current_timestamp,
  updated_at timestamp default current_timestamp on update current_timestamp,
  index idx_group_id (group_id),
  index idx_user_id (user_id),
  foreign key (group_id) references \`groups\` (id) on delete cascade
) engine = InnoDB
  charset = utf8mb4;
  `;
  pool.query(sql, (err) => {
    if (err) {
      console.error("[model/db]", err);
    }
  });
}

function createMessages() {
  const sql = `
create table if not exists messages
(
  id          int(31)                                 not null auto_increment,
  sender_id   int(31)                                 not null,
  receiver_id int(31)                                 not null,
  content     longtext                                not null,
  room_num    varchar(255)                            not null,
  msg_type    enum ('private', 'public')              not null,
  media_type  enum ('text', 'image', 'video', 'file') not null,
  file_size   int(31)                                 null     default 0,
  msg_state   int(1)                                  not null default 0,
  created_at  timestamp                                        default current_timestamp,
  foreign key (sender_id) references users (id) on delete cascade on update cascade
) engine = InnoDB
  charset = utf8mb4;
  `;
  pool.query(sql, (err) => {
    if (err) {
      console.error("[model/db]", err);
    }
    createMsgStats();
  });
}

function createMsgStats() {
  const sql = `
create table if not exists msg_stats
(
  id         int(31)      not null auto_increment,
  room_num   varchar(255) not null,
  total      int(255)     not null,
  created_at timestamp default current_timestamp,
  updated_at timestamp default current_timestamp on update current_timestamp,
  primary key (id)
) engine = InnoDB
  charset = utf8mb4;
  `;
  pool.query(sql, (err) => {
    if (err) {
      console.error("[model/db]", err);
    }
  });
}

pool.query("select 1", (err) => {
  if (err) {
    console.error("[model/db]", err);
    process.exit(1);
  }
  createUsers();
  createTags();
  createMessages();
});

export default pool;
