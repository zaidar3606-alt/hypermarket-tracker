const productLogic = require('../controllers/productLogic');
const pool = require('../config/database');

jest.mock('../config/database', () => ({ query: jest.fn() }));

describe('DELETE Product Tests', () => {
    beforeEach(() => jest.clearAllMocks());

    test('1. should return success message if product exists', async () => {
        pool.query.mockResolvedValue([{ affectedRows: 1 }]);
        const result = await productLogic.deleteProduct(7);

        expect(result).toEqual({ message: "Product successfully removed." });
        expect(pool.query).toHaveBeenCalledWith(`DELETE FROM Products WHERE id = ?`, [7]);
    });

    test('2. should throw error if product does not exist', async () => {
        pool.query.mockResolvedValue([{ affectedRows: 0 }]);
        await expect(productLogic.deleteProduct(999)).rejects.toThrow("Product not found.");
    });
});