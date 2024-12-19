import connectionPool from "@/utils/db";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const userProfileQuery = `
      SELECT 
      user_profiles.date_of_birth, 
      user_profiles.name,
      user_Profiles.age,  
      array_agg(DISTINCT hobbies.hobby_name) AS hobbies,  
      array_agg(DISTINCT hobbies_profiles.hobbies_id) AS hobbies_id,
      city.city_name AS city, 
      location.location_name AS location, 
      users.username AS username,    
      users.email AS email,
      g1.gender_name AS gender,
      g2.gender_name AS sexual_preference,
      racial_identity.racial_name AS racial_preference,
      meeting_interest.meeting_name AS meeting_interest,
      user_profiles.about_me,
      COALESCE(
            JSON_AGG(
              json_build_object(
                'image_profile_id', image_profiles.image_profile_id,
                'image_url', image_profiles.image_profile_url,
                'is_primary', image_profiles.is_primary
              )
            ) FILTER (WHERE image_profiles.image_profile_id IS NOT NULL),
            '[]'
          ) AS image_profiles
      FROM user_profiles

      LEFT JOIN users 
      ON user_profiles.user_id = users.user_id
      
      LEFT JOIN city 
      ON user_profiles.city_id = city.city_id
      
      LEFT JOIN location 
      ON user_profiles.location_id = location.location_id

      LEFT JOIN gender AS g1
      ON user_profiles.gender_id = g1.gender_id

      LEFT JOIN gender AS g2
      ON user_profiles.sexual_preference_id = g2.gender_id

      LEFT JOIN racial_identity
      ON user_profiles.racial_preference_id = racial_identity.racial_id

      LEFT JOIN meeting_interest
      ON user_profiles.meeting_interest_id = meeting_interest.meeting_interest_id

      LEFT JOIN hobbies_profiles
      ON user_profiles.profile_id = hobbies_profiles.profile_id

      LEFT JOIN hobbies
      ON hobbies_profiles.hobbies_id = hobbies.hobbies_id

      LEFT JOIN image_profiles 
      ON user_profiles.profile_id = image_profiles.profile_id

      WHERE user_profiles.user_id = $1

      GROUP BY
      user_profiles.profile_id,
      user_profiles.user_id,
      user_profiles.date_of_birth,
      user_profiles.name,
      user_profiles.age,
      city.city_name,
      location.location_name,
      users.username,
      users.email,
      g1.gender_name,
      g2.gender_name,
      racial_identity.racial_name,
      meeting_interest.meeting_name,
      user_profiles.about_me
      `;

      //const query = `select * from user_profiles where user_id = $1`;
      const { rows } = await connectionPool.query(userProfileQuery, [id]);

      if (rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.status(200).json(rows[0]);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Failed to fetch user data" });
    }
  }
}
