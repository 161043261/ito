# ito 糸

<img src="./assets/ito.png" alt="ito" width="416" />

```txt
+------------+ +------------+ +---------------+ +------------+ +-------------+ +------------+ +------------+
| users      | | friends    | | group_members | | groups     | | messages    | | msg_stats  | | tags       |
+------------+ +------------+ +---------------+ +------------+ +-------------+ +------------+ +------------+
| avatar     | | avatar     | | created_at    | | avatar     | | content     | | created_at | | created_at |
| created_at | | created_at | | group_id      | | created_at | | created_at  | | id         | | id         |
| email      | | email      | | id            | | id         | | file_size   | | room_key   | | name       |
| id         | | id         | | nickname      | | name       | | id          | | total      | | updated_at |
| password   | | note_name  | | updated_at    | | note_name  | | media_type  | | updated_at | | user_email |
| signature  | | state      | | user_id       | | owner_id   | | receiver_id | +------------+ | user_id    |
| updated_at | | tag_id     | +---------------+ | readme     | | room_key    |                +------------+
| username   | | unread_cnt |                   | room_key   | | sender_id   |
+------------+ | updated_at |                   | unread_cnt | | state       |
               | user_id    |                   | updated_at | | type        |
               +------------+                   +------------+ +-------------+
```
