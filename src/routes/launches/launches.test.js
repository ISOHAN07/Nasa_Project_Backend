const request = require("supertest");
//supertest will make requests against our API
const app = require("../../app");

describe("Test GET /launches", () => {
  test("should respond with 200 success", async () => {
    const response = await request(app)
      .get("/launches")
      .expect("Content-Type", /json/)
      .expect(200);
    // expect(response.statusCode).toBe(200);
  });
});

describe("Test POST /launch", () => {
  const completeLaunchData = {
    mission: "ISRO-NASA Exploration",
    rocket: "NCC 1701-D",
    target: "Kepler-49 f",
    launchDate: "July 20, 2025",
  };

  const launchData = {
    mission: "ISRO-NASA Exploration",
    rocket: "NCC 1701-D",
    target: "Kepler-49 f",
  };

  const wrongDateData = {
    mission: "ISRO-NASA Exploration",
    rocket: "NCC 1701-D",
    target: "Kepler-49 f",
    launchDate: "sohan",
  }; 

  test("should respond with 201 created", async () => {
    const response = await request(app)
      .post("/launches")
      .send(completeLaunchData)
      .expect("Content-Type", /json/)
      .expect(201);

    const requestDate = new Date(completeLaunchData.launchDate).valueOf();
    const responseDate = new Date(response.body.launchDate).valueOf();
    expect(responseDate).toBe(requestDate);

    expect(response.body).toMatchObject(launchData);
  });

  test("should catch missing required properties", async () => {
    const response = await request(app)
      .post("/launches")
      .send(launchData)
      .expect("Content-Type", /json/)
      .expect(400);

    expect(response.body).toStrictEqual({
      error: "Missing or invalid launch property",
    });
  });

  test("should catch invalid dates", async() => {
    const response = await request(app)
      .post("/launches")
      .send(wrongDateData)
      .expect("Content-Type", /json/)
      .expect(400);
    
    expect(response.body).toStrictEqual({
      error: "Invalid launch date",
    });
    
  });
});
