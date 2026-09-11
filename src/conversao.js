import axios from 'axios';
import { existsSync } from 'node:fs';

if (existsSync('.env')) {
    process.loadEnvFile();
}

export const BASE_URL = process.env.BASE_URL;

export async function obterCotacao(de, para, http = axios) {
    const { data } = await http.get(BASE_URL, {
        params: {
            from: de,
            to: para,
        },
    });

    const taxa = data.rates?.[para];
    if (taxa === undefined) {
        throw new Error(`Cotação de ${de} para ${para} não encontrada.`);
    }

    return taxa;
}

export const buscarCotacao = obterCotacao;

export async function converterMoeda(valor, de, para, http = axios) {
    if (typeof valor !== 'number' || valor <= 0) {
        throw new Error('O valor a ser convertido deve ser um número positivo.');
    }
    if (de === para) {
        return Number(valor.toFixed(2));
    }

    const taxa = await obterCotacao(de, para, http);
    return Number((valor * taxa).toFixed(2));
}
