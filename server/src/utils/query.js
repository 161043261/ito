import pool from "../model/index.js";

export default function query(sql, values) {
  return new Promise((resolve, reject) => {
    pool.query(
      {
        sql,
        values,
      },
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      },
    );
  });
}
