import request from 'supertest';
import express from 'express';
import { DB } from '../config/db';

const app = express();

jest.mock('../config/db');
const DBmockedClass = <jest.Mock<DB>>DB; 

describe('Maleja endpoint', () => {
    it('should return /awesome/applicant', async () => {
        const req = {
            params: {
                id: '1'
            }
        };

        const db = new DBmockedClass();
        const getApplicantByIdMock = <jest.Mock<typeof db.getApplicantById>><unknown>db.getApplicantById;
        getApplicantByIdMock.mockReturnValueOnce(()=> Promise.resolve([true]));

        request(app).get(`/awesome/applicant/${req.params.id}`).expect(200);
    });

    it('should delete a user with a valid ID', async () => {
        const req = {
            params: {
                id: '1'
            }
        };
        const db = new DBmockedClass();
        const deleteByIDMock = <jest.Mock<typeof db.deleteByID>><unknown>db.deleteByID;
        deleteByIDMock.mockReturnValueOnce(()=> Promise.resolve([true]));

        request(app).delete(`/delete/${req.params.id}`).expect(200);
    });
});
