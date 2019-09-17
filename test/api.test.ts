import request from "supertest";
import app from "../src/app";

//TODO: Implement test for api
describe("GET /host", () => {
    it("should return 200 OK", () => {
        return request(app).get("/api")
            .expect(200);
    });
});
