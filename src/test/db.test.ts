import { DB } from '../config/db';
jest.mock('../config/db');
const DBmockedClass = <jest.Mock<DB>>DB; 
describe('Tests the function DB class', () => {
    it('should insert a new user into the database', async () => {
        const data = {
          name: 'John Doe',
          email: 'johndoe@example.com',
          city: 'New York',
          web: 'www.example.com'
        };
        const db = new DBmockedClass();
        const addNewUserMock = <jest.Mock<typeof db.addNewUser>><unknown>db.addNewUser;

        await db.addNewUser(data);
        expect(addNewUserMock).toHaveBeenCalledWith(data);

    });

    it('should return a result with all users in the database', async () => {
        const mockClient = {
          query: jest.fn().mockResolvedValue({ rowCount: 2, rows: [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }] }),
          release: jest.fn()
        };
        const mockPool = { connect: jest.fn().mockResolvedValue(mockClient) };
        const db = new DBmockedClass();
    
        const getAllMock = <jest.Mock<typeof db.getAll>><unknown>db.getAll;
        await db.getAll();

        expect(getAllMock).toHaveBeenCalled();
    });

    it('should return the user object with the given ID when it exists', async () => {
        const mockClient = {
          query: jest.fn().mockResolvedValue({ rowCount: 1, rows: [{ id: 1, name: 'John', email: 'john@example.com', city: 'New York', web: 'example.com' }] }),
          release: jest.fn()
        };
        const mockPool = { connect: jest.fn().mockResolvedValue(mockClient) };
        const db = new DBmockedClass();
        const getApplicantByIdMock = <jest.Mock<typeof db.getApplicantById>><unknown>db.getApplicantById;

        await db.getApplicantById(1);

        expect(getApplicantByIdMock).toHaveBeenCalled();
    });

    it('should throw an error if the user with the given ID does not exist', async () => {
        const mockClient = {
          query: jest.fn().mockResolvedValue({ rowCount: 0 }),
          release: jest.fn()
        };
            const mockPool = { connect: jest.fn().mockResolvedValue(mockClient) };
            const db = new DBmockedClass();
            const getApplicantByIdMock = <jest.Mock<typeof db.getApplicantById>><unknown>db.getApplicantById;
            jest.spyOn(db, 'getApplicantById').mockImplementation(() => {
            throw new Error(`The user with ID 1 does not exist`);
        });

        try {
            await db.getApplicantById(1);
        } catch (error) {
            expect(getApplicantByIdMock).toHaveBeenCalled();
            expect(error).toEqual(new Error('The user with ID 1 does not exist'));
        }
    });

    it('should throw an error when deleting a user with a non-existent ID', async () => {
        const id = 1;
        const db = new DBmockedClass();
        const deleteByIDMock = <jest.Mock<typeof db.deleteByID>><unknown>db.deleteByID;

       await db.deleteByID(id);
        expect(deleteByIDMock).toHaveBeenCalled();
    });

    it('should update user data when user exists in the database', async () => {
        const mockClient = {
          query: jest.fn().mockReturnValue({ rowCount: 1 }),
          release: jest.fn()
        };
        const mockPool = {
          connect: jest.fn().mockReturnValue(mockClient)
        };
        const db = new DBmockedClass();
        const updateByIdMock = <jest.Mock<typeof db.updateById>><unknown>db.updateById;

        const updatedUserData = { id: 1, name: 'John Doe', email: 'john@example.com', city: 'New York', web: 'example.com' };
        mockClient.query.mockResolvedValueOnce({ rowCount: 1, rows: [updatedUserData] });

        await db.updateById(1, { name: 'John Doe', email: 'john@example.com', city: 'New York', web: 'example.com' });

        expect(updateByIdMock).toHaveBeenCalledWith(
          1, {'city': 'New York', 'email': 'john@example.com', 'name': 'John Doe', 'web': 'example.com'}
        );

        expect(updateByIdMock).toHaveBeenCalled();
    });
})
