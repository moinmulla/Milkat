const request = require('supertest');
const app = require('./server');

describe("POST /register", () => {
    test.only("should return 200", async () => {
        const response = await request(app).post("/register").send({
            name: "test",
            password: "test",
            email: "test2",
            role: 1
        });
        expect(response.statusCode).toBe(200);
    });
})

describe("POST /login", () => {
    test("should return 200", async () => {
        const response = await request(app).post("/login").send({
            password: "Abcd123$",
            email: "moinmulla100@gmail.com",
        });
        expect(response.statusCode).toBe(200);
    });
})

describe("GET /logout", () => {
    test("should return 200", async () => {
        const response = await request(app).get("/logout").set("Cookie",["token=U2FsdGVkX1%2BxeOkMjhfUtTw4oF3r%2BHaJq%2FXAqz6wnObv02Aj8IFXr6BKUHXz9c9gvUsLAY95f7EYQfIO3sVCGe%2BwlJRFdCGIcc568%2FFSbNVSS5CsJufPa3EOd%2FQL7Q%2FmNJoKScfTrJDlKwNccMEM%2FgrNlQjaSQphoTwXwbqJAxfn96afliuZCuu9gQr4aF8RReRh4d6vEIGdsZm412YWkL1%2BOX8fEvWZnQ90s4GWFocIZ2VGv8YLGoo6%2B6bDLm7EJsA0yddqpe9n74eXV2FyO2dOvKsdQ0bv2L0%2BqQRA2CUMrvBx14921v5x3nQSibfh"]); 
        expect(response.statusCode).toBe(200);
    });
})

describe("POST /nearby", () => {
    test("should return 200", async () => {
        const response = await request(app).post("/nearby").send({
            latitude: 0,
            longitude: 0
        });
        expect(response.statusCode).toBe(200);
    });
})

describe("GET /properties", () => {
    test("should return 200", async () => {
        const response = await request(app).get("/properties?postcode=le12fx");
        expect(response.statusCode).toBe(200);
    });
})

describe("GET /property/:id", () => {
    test("should return 200", async () => {
        const response = await request(app).get("/property/11");
        expect(response.statusCode).toBe(200);
    });
})

describe("POST /postcode", () => {
    test("should return 200", async () => {
        const response = await request(app).post("/postcode").send({
            postcode: "le12fx"
        });
        expect(response.statusCode).toBe(200);
    });
})

describe("POST /postcodeAddress", () => {
    test("should return 200", async () => {
        const response = await request(app).post("/postcodeAddress").send({
            url:"/get/OWYyMWRlMTkzYWVkMDFjIDQ4MjUzNDUyNzEgZDQ0NzdlOTE0OGEzNWFi"
        });
        expect(response.statusCode).toBe(200);
    });
})

describe("GET /propertiesPrice", () => {
    test("should return 200", async () => {
        const response = await request(app).get("/propertiesPrice");
        expect(response.statusCode).toBe(200);
    });
})

describe("GET /chatLookup", () => {
    test("should return 200", async () => {
        const response = await request(app).get("/chatLookup");
        expect(response.statusCode).toBe(200);
    });
})

describe("POST /chat", () => {
    test("should return 200", async () => {
        const response = await request(app).post("/chat").send({
            postcode: "le12fx",
            comments: "test"
        });
        expect(response.statusCode).toBe(200);
    });
})

describe("POST /adminDashboard", () => {
    test("should return 200", async () => {
        const response = await request(app).post("/adminDashboard").send({
            page:1
        });
        expect(response.statusCode).toBe(200);
    });
})

describe("POST /userDashboard", () => {
    test("should return 200", async () => {
        const response = await request(app).post("/userDashboard").send({
            page:1
        });
        expect(response.statusCode).toBe(200);
    });
})

describe("POST /booking", () => {
    test("should return 200", async () => {
        const response = await request(app).post("/booking").send({
            tid: 1, 
            pid: 1, 
            email: "test", 
            timeslots:[{start_time:"test", end_time:"test"}], 
            streetName:"test", 
            postcode:"test",
        });
        expect(response.statusCode).toBe(200);
    });
})

describe("POST /unsave", () => {
    test("should return 200", async () => {
        const response = await request(app).post("/unsave").send({
            pid: 2
        });
        expect(response.statusCode).toBe(200);
    });
})

describe("POST /save", () => {
    test("should return 200", async () => {
        const response = await request(app).post("/save").send({
            pid: 2
        });
        expect(response.statusCode).toBe(200);
    });
})

describe("POST /saved", () => {
    test("should return 200", async () => {
        const response = await request(app).post("/saved").send({
            pid: 2
        });
        expect(response.statusCode).toBe(200);
    });
})

describe("GET /rating", () => {
    test("should return 200", async () => {
        const response = await request(app).get("/rating?pid=11&rating=5");
        expect(response.statusCode).toBe(200);
    });
})



describe("GET /deleteProperty", () => {
    test("should return 200", async () => {
        const response = await request(app).get("/deleteProperty?pid=11");
        expect(response.statusCode).toBe(200);
    });
})

describe("POST /timeslot", () => {
    test("should return 200", async () => {
        const response = await request(app).post("/timeslot").send({
            pid: 9,
            timeslots:[{
                start:"12:00",
                end:"13:00"
            }]
        });
        expect(response.statusCode).toBe(200);
    });
})




