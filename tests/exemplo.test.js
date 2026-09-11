import { afterEach, jest } from '@jest/globals';

jest.unstable_mockModule('axios', () => ({
    default: { get: jest.fn() },
}));

const axios = (await import('axios')).default;

const { converterMoeda, obterCotacao, BASE_URL } = await import('../src/exemplo.js');

describe('Conversor de moedas - mock de modulo', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('deve retornar usando a taxa devolvida pela API', async () => {
        axios.get.mockResolvedValue({
            data: {
                amount: 1,
                base: 'USD',
                rates: { BRL: 5 },
            },
        });
        const resultado = await converterMoeda(10, 'USD', 'BRL');
        expect(resultado).toBe(50);
    });

    it('deve propagar o erro quando a requisição falhar', async () => {
        axios.get.mockRejectedValue(new Error('Erro na requisição'));
        await expect(converterMoeda(10, 'USD', 'BRL')).rejects.toThrow('Erro na requisição');
    });
});
