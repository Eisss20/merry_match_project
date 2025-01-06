import connectionPool from "@/utils/db";
import { protectUser } from "@/middleware/protectUser";

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      await runMiddleware(req, res, protectUser);

      const gender = req.query.gender;
      const minAge = req.query.minAge;
      const maxAge = req.query.maxAge;

      const { userMasterId } = req.query;

      let usersQuery = `
        SELECT
          User_Profiles.user_id,
          User_Profiles.name,
          Gender.gender_name AS gender,
          User_Profiles.age,
          Racial_identity.racial_name AS racial_identity,
          Meeting_interest.meeting_name AS meeting_interest,
          User_Profiles.image_profile
        FROM User_Profiles
        LEFT JOIN Gender ON User_Profiles.gender_id = Gender.gender_id
        LEFT JOIN Racial_identity ON User_Profiles.racial_identity_id = Racial_identity.racial_id
        LEFT JOIN Meeting_interest ON User_Profiles.meeting_interest_id = Meeting_interest.meeting_interest_id
        WHERE User_Profiles.user_id NOT IN (
          SELECT user_other
          FROM matching
          WHERE user_master = $1 AND is_match = false
        )
      `;

      let conditions = [];
      let values = [userMasterId];

      if (gender) {
        if (Array.isArray(gender)) {
          const genderPlaceholders = gender.map(
            (_, index) => `$${values.length + index + 1}`,
          );
          conditions.push(
            `Gender.gender_name IN (${genderPlaceholders.join(", ")})`,
          );
          values.push(...gender);
        } else {
          conditions.push(`Gender.gender_name = $${values.length + 1}`);
          values.push(gender);
        }
      }

      if (minAge) {
        conditions.push(
          `(User_Profiles.age BETWEEN $${values.length + 1} AND $${values.length + 2})`,
        );
        values.push(`${minAge}`, `${maxAge}`);
      }

      if (conditions.length > 0) {
        usersQuery += " AND " + conditions.join(" AND ");
      }

      usersQuery += " ORDER BY User_Profiles.user_id ASC";

      const results = await connectionPool.query(usersQuery, values);

      return res.status(200).json(results.rows);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Server could not get user data because database connection",
      });
    }
  }
}
