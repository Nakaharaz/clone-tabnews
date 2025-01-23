import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

test("GET  to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");

  // Check if /status is accessible
  expect(response.status).toBe(200);

  // Check if updated_at is defined
  const responseBody = await response.json();
  expect(responseBody.updated_at).toBeDefined();

  // Check if response updated_at is a valid and equal to parsed date
  const pasedUpdatedAt = new Date(responseBody.updated_at).toISOString();
  expect(responseBody.updated_at).toEqual(pasedUpdatedAt);

  // Check if Postgres version is 16.0
  expect(responseBody.dependecies.database.db_version).toBe("16.0");

  // Check if Max connections is <= to 100
  expect(responseBody.dependecies.database.max_connections).toBeLessThanOrEqual(
    100,
  );

  // Check if Opened connections is <= to Max connections
  expect(responseBody.dependecies.database.opened_connections).toBe(1);
});
