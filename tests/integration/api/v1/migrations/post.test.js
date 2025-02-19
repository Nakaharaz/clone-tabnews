import database from "infra/database.js";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await database.query("drop schema public cascade; create schema public;");
});

describe("POST /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    describe("Running pending migrations", () => {
      test("For the first time", async () => {
        const response = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "POST",
          },
        );

        // Check if /migrations is accessible
        expect(response.status).toBe(201);

        const responseBody = await response.json();
        // Check if migrations run and return is the number of runned migrations
        expect(Array.isArray(responseBody)).toBe(true);
        expect(responseBody.length).toBeGreaterThanOrEqual(1);

        // Check if database live table was affected
        const dbMigrations = (
          await database.query("SELECT * FROM pgmigrations;")
        ).rows;
        expect(dbMigrations.length).toBeGreaterThanOrEqual(1);
      });
      test("For the second time", async () => {
        // Second fetch to check if all the migrations has been runned
        const secondResponse = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "POST",
          },
        );

        // Check if /migrations still accessible
        expect(secondResponse.status).toBe(200);

        const secondResponseBody = await secondResponse.json();

        // Check if number of migrations is 0
        expect(Array.isArray(secondResponseBody)).toBe(true);
        expect(secondResponseBody.length).toBe(0);
      });
    });
  });
});
