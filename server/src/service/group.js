import { v4 as uuid } from "uuid";
import { BaseState, GroupState } from "../utils/state.js";
import { resOk, resErr } from "../utils/res.js";
import pub from "../utils/pub.js";
import query from "../utils/query.js";
import { snack2camel } from "../utils/fmt.js";

async function selectGroupMembers(groupId, roomKey) {
  try {
    const sql = `
select s.*, m.latest_msg_time
from (select user_id, users.avatar, users.email, users.username, nickname, group_members.created_at
      from group_members,
           users
      where group_id = ?
        and user_id = users.id) as s
       left join (select sender_id, max(created_at) as latest_msg_time
                  from messages
                  where messages.room_key = ?
                  group by sender_id) as m on m.sender_id = s.user_id;
  `;
    const results = await query(sql, [groupId, roomKey]);
    return results.map((item) => snack2camel(item));
  } catch (err) {
    console.error(err);
    throw err;
  }
}

//! >>>>>>>>>>>>>>>>>>>> DAO end >>>>>>>>>>>>>>>>>>>>

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function addGroup(req, res) {
  const { name, avatar, readme, members } = req.body;
  if (!name) {
    return resErr(res, BaseState.ParamErr);
  }
  try {
    const roomKey = uuid();
    const group = {
      name,
      avatar,
      readme,
      room_key: roomKey,
      owner_id: req.userInfo.id,
    };
    const { affectedRows, insertId } = await query("insert into `groups` set ?", group);
    if (affectedRows === 1) {
      const msg = {
        sender_id: req.userInfo.id,
        receiver_id: insertId,
        type: "group",
        media_type: "text",
        state: 0,
        content: "欢迎",
        room_key: roomKey,
      };
      await Promise.all([
        query("insert into messages set ?", msg),
        query("insert into msg_stats set ?", { room_key: roomKey, total: 1 }),
      ]);

      members.push({
        userId: req.userInfo.id,
        email: req.userInfo.email,
        avatar: req.userInfo.avatar,
      });
      for (const member of members) {
        await query("insert into group_members set ?", {
          group_id: insertId,
          user_id: member.userId,
          nickname: member.email,
        });
        pub({ receiverEmail: member.email, type: "wsGroupList" });
      }
      return resOk(res);
    }
  } catch (err) {
    console.error(err);
    return resErr(err, BaseState.ServerErr);
  }
}

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function fetchGroupList(req, res) {
  const id = req.userInfo.id;
  if (!id) {
    return resErr(res, BaseState.ParamErr);
  }
  try {
    const results = await query(
      `
select g.*
from ((select group_id from group_members where user_id = 1) as gm)
       left join \`groups\` as g on gm.group_id = g.id;
      `,
      [id],
    );
    return resOk(
      res,
      results.map((item) => snack2camel(item)),
    );
  } catch (err) {
    console.error(err);
    return resErr(res, BaseState.ServerErr);
  }
}

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function searchGroup(req, res) {
  const { name } = req.query;
  if (!name) {
    return resErr(res, BaseState.ParamErr);
  }
  try {
    const results = await query("select * from `groups` where name like ?", [`%${name}%`]);
    const retList = [];
    if (results.length === 0) {
      return resOk(res, []);
    }
    const { id } = req.userInfo;
    for (const group of results) {
      const members = await query("select user_id from group_members where group_id = ?", [
        group.id,
      ]);
      retList.push({
        name: group.name,
        avatar: group.avatar,
        number: members.length,
        // 是否已加入
        state: members.some((item) => item.user_id === id),
        groupId: group.id,
      });
    }
    return resOk(res, retList);
  } catch (err) {
    console.error(err);
    return resErr(res, BaseState.ServerErr);
  }
}

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function fetchGroupInfo(req, res) {
  const groupId = req.query.groupId;
  if (!groupId) {
    return resErr(res, BaseState.ParamErr);
  }
  try {
    const sql = `
select g.id,
       g.name,
       g.owner_id,
       u.email as owner_email,
       g.avatar,
       g.readme,
       g.room_key,
       g.created_at
from \`groups\` g
       join users u on g.owner_id = u.id
where g.id = ?;
  `;
    const [{ id, name, owner_id, owner_email, avatar, readme, room_key, created_at }] = await query(
      sql,
      [groupId],
    );
    const groupInfo = {
      id,
      name,
      ownerId: owner_id,
      ownerEmail: owner_email,
      avatar,
      readme,
      roomKey: room_key,
      createdAt: created_at,
      members: [],
    };
    const members = await query(groupId, groupInfo.roomKey);
    for (const member of members) {
      groupInfo.members.push({ ...member });
    }
    return resOk(res, groupInfo);
  } catch (err) {
    console.error(err);
    return resErr(res, BaseState.ServerErr);
  }
}

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function addFriends2group(req, res) {
  const { groupId, friendList } = req.body;
  if (!groupId || !friendList) {
    return resErr(res, BaseState.ParamErr);
  }
  try {
    const userIdList = friendList.map((item) => item.user);
  } catch (err) {
    console.error(err);
    return resErr(res, BaseState.ServerErr);
  }
}

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function addMe2group(req, res) {}

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function fetchGroupMembers(req, res) {}
