import { afterEach, describe, expect, it, jest } from '@jest/globals';

jest.unstable_mockModule('axios', () => ({
    default: {
        get: jest.fn(),
    },
}));

const axios = (await import('axios')).default;
const { BASE_URL, buscarCotacao } = await import('../src/conversao.js');

describe('Consulta de cotacao com Axios mockado', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('retorna a cotacao e verifica a chamada da API', async () => {
        axios.get.mockResolvedValue({
            data: {
                rates: {
                    BRL: 5.25,
                },
            },
        });

        await expect(buscarCotacao('USD', 'BRL')).resolves.toBe(5.25);
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledWith(BASE_URL, {
            params: {
                from: 'USD',
                to: 'BRL',
            },
        });
    });

    it('rejeita quando a API retorna erro de rede', async () => {
        axios.get.mockRejectedValue(new Error('API indisponivel'));

        await expect(buscarCotacao('USD', 'BRL')).rejects.toThrow('API indisponivel');
        expect(axios.get).toHaveBeenCalledTimes(1);
    });

    it('rejeita quando a resposta nao contem a cotacao', async () => {
        axios.get.mockResolvedValue({
            data: {
                rates: {},
            },
        });

        await expect(buscarCotacao('USD', 'BRL')).rejects.toThrow(
            'Cotação de USD para BRL não encontrada.',
        );
    });
});
