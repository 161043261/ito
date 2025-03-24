import pool from "../model/index.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function query(sql: string, values: any): Promise<any> {
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
