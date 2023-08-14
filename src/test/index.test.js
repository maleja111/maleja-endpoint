const request = require('supertest');
const express = require('express');
const app = express();

describe('Maleja endpoint', () => {
  test('should return something', () => {
    request(app).get('/').expect(200);
  })
})