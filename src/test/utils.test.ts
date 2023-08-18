import { isNotEmpty, isDataValid } from '../../utils/user';

describe('Tests the function isNotEmpty', () => {
    it('should return false when given a non-empty object', () => {
        const dataJson = {
            name: 'John',
            email: 'john@example.com',
            city: 'New York',
            web: 'www.example.com'
        };
        const result = isNotEmpty(dataJson);
        expect(result).toBe(false);
    });

    it('should return true when valid user data is provided', () => {
        const dataJson = {
          name: 'John Doe',
          email: 'johndoe@example.com',
          city: 'New York',
          web: 'www.example.com'
        };
        const result = isDataValid(dataJson);
        expect(result).toBe(true);
    });
})
