import { test } from "vitest";
import { insertFriend, selectFriendsByTagId, selectFriendsByUserId } from "./friend.js";

test.skip("Test_selectFriendsByTagId", async () => {
  console.log(
    await selectFriendsByTagId(2)
  )
});

test.skip("Test_selectFriendsByUserId", async () => {
  console.log(
    await selectFriendsByUserId(2)
  )
});

// insert into users (email, password, username, avatar, signature)
// values ('user4@example.com', 'user4', 'user4', '', 'user4');
test("Test_insertFriend", async () => {
  const friendItem = {
    user_id: 2,
    email: 'user4@example.com',
    avatar: '',
    note_name: 'user4',
    tag_id: 2,
    state: 'online',
    unread_cnt: 4,
  }
  await insertFriend(friendItem);
})
