import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { createApp } from "../src/app.js";

const app = createApp();

test("GET /health returns ok", async () => {
  const response = await request(app).get("/health");
  assert.equal(response.statusCode, 200);
  assert.equal(response.body.ok, true);
});

test("GET /robots.txt returns sitemap reference", async () => {
  const response = await request(app).get("/robots.txt");
  assert.equal(response.statusCode, 200);
  assert.match(response.text, /Sitemap:/);
});

test("POST /api/contact-submissions validates required fields", async () => {
  const response = await request(app).post("/api/contact-submissions").field("naam", "");
  assert.equal(response.statusCode, 400);
});

test("POST /api/newsletter-subscriptions validates email", async () => {
  const response = await request(app).post("/api/newsletter-subscriptions").send({});
  assert.equal(response.statusCode, 400);
});
