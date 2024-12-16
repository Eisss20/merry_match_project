import connectionPool from "@/utils/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const cityQuery = `SELECT city_id, city_name, location_name FROM city LEFT JOIN location 
      ON city.location_id = location.location_id`;
      const locationQuery = `SELECT location_id, location_name FROM location`;

      const [cityResult, locationResult] = await Promise.all([
        connectionPool.query(cityQuery),
        connectionPool.query(locationQuery),
      ]);

      res.status(200).json({
        cities: cityResult.rows || [],
        locations: locationResult.rows || [],
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
