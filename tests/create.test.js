const productLogic = require('../controllers/productLogic');
const pool = require('../config/database');

jest.mock('../config/database', () => ({ query: jest.fn() }));

describe('CREATE Product Tests', () => {
    beforeEach(() => jest.clearAllMocks());

    test('1. should throw an error if fields are missing', async () => {
        const badProductData = { price: 10.99, stock: 50, categoryId: 1 };
        await expect(productLogic.createProduct(badProductData)).rejects.toThrow(
            "All fields (name, price, stock, categoryId) are required."
        );
    });

    test('2. should return the product object on success', async () => {
        const goodProductData = { name: 'Orange', price: 2.50, stock: 100, categoryId: 3 };
        pool.query.mockResolvedValue([{ insertId: 7 }]);

        const result = await productLogic.createProduct(goodProductData);

        expect(result).toEqual({ id: 7, name: 'Orange', price: 2.50, stock: 100, categoryId: 3 });
        expect(pool.query).toHaveBeenCalledTimes(1);
    });
});