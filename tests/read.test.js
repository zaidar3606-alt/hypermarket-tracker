const productLogic = require('../controllers/productLogic');
const pool = require('../config/database');

jest.mock('../config/database', () => ({ query: jest.fn() }));

describe('READ Product Tests', () => {
    beforeEach(() => jest.clearAllMocks());

    test('1. getAllProducts should return a list of all products', async () => {
        const mockProducts = [
            { id: 1, name: 'Mobile', category: 'electronics', price: 499.99, stock: 45 },
            { id: 3, name: 'Shirt', category: 'clothes', price: 25.50, stock: 150 }
        ];
        pool.query.mockResolvedValue([mockProducts]);

        const result = await productLogic.getAllProducts();

        expect(result).toEqual(mockProducts);
        expect(pool.query).toHaveBeenCalledTimes(1);
    });
});