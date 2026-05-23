const productLogic = require('../controllers/productLogic');
const pool = require('../config/database');

jest.mock('../config/database', () => ({ query: jest.fn() }));

describe('UPDATE Product Tests', () => {
    beforeEach(() => jest.clearAllMocks());

    test('1. should update price and stock successfully', async () => {
        pool.query.mockResolvedValue([{ affectedRows: 1 }]);
        const updateData = { price: 29.99, stock: 50 };

        const result = await productLogic.updateProduct(3, updateData);

        expect(result).toEqual({ message: "Product successfully updated." });
        expect(pool.query).toHaveBeenCalledWith(expect.any(String), [29.99, 50, 3]);
    });

    test('2. should throw an error if product is not found', async () => {
        pool.query.mockResolvedValue([{ affectedRows: 0 }]);
        const updateData = { price: 29.99, stock: 50 };

        await expect(productLogic.updateProduct(999, updateData)).rejects.toThrow("Product not found.");
    });

    test('3. should throw an error if price or stock is missing', async () => {
        const badUpdateData = { price: 29.99 }; 
        await expect(productLogic.updateProduct(3, badUpdateData)).rejects.toThrow(
            "Price and stock are required to update a product."
        );
    });
});