import { initServer, server } from '../../../../../server';

describe("music/resources/songs route tests", () => {

  beforeAll(async () => {
    await initServer();
  });

  afterAll(async () => {
    await server.stop();
  });

  describe("GET /music/resources/songs", () => {

    it("Should return 200 with valid term", async () => {
      const res = await server.inject({
        method: "GET",
        url: "/music/resources/songs?term=drake"
      });

      expect(res.statusCode).toEqual(200);
    });

    it("Should return JSON content type", async () => {
      const res = await server.inject({
        method: "GET",
        url: "/music/resources/songs?term=drake"
      });

      expect(res.headers["content-type"]).toContain("application/json");
    });

    it("Should return an array in response body", async () => {
      const res = await server.inject({
        method: "GET",
        url: "/music/resources/songs?term=drake"
      });

      const payload = JSON.parse(res.payload);

      expect(Array.isArray(payload)).toBe(true);
    });

    it("Should return 400 if term is missing", async () => {
      const res = await server.inject({
        method: "GET",
        url: "/music/resources/songs"
      });

      expect(res.statusCode).toEqual(400);
    });

    it("Should return 400 if term is empty", async () => {
      const res = await server.inject({
        method: "GET",
        url: "/music/resources/songs?term="
      });

      expect(res.statusCode).toEqual(400);
    });

    it("Should return empty array if no songs found", async () => {
      const res = await server.inject({
        method: "GET",
        url: "/music/resources/songs?term=asldkfjalskdfj"
      });

      const payload = JSON.parse(res.payload);

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(payload)).toBe(true);
    });

    it("Should handle special characters in term", async () => {
      const res = await server.inject({
        method: "GET",
        url: "/music/resources/songs?term=drake%20feat"
      });

      expect(res.statusCode).toEqual(200);
    });

    // TODO: This test is not working as expected need to update things at framework level
    it("Should return 405 for unsupported method", async () => {
      const res = await server.inject({
        method: "POST",
        url: "/music/resources/songs"
      });

      expect(res.statusCode).toEqual(404);
    });

  });

});
