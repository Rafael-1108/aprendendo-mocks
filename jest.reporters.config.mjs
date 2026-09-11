export default {
    reporters: [
        'default',
        [
            'jest-html-reporters',
            {
                publicPath: './_html-report',
                filename: 'index.html',
                pageTitle: 'Relatório de Testes — CodeVerse',
                openReport: true,
            },
        ],
    ],
};
