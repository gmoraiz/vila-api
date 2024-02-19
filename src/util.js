export function getHoje() {
	return new Date().toLocaleDateString('pt-BR');
}

export function getAmanha() {
    const hoje = new Date();
    return new Date(hoje.setDate(hoje.getDate() + 1));
}

export function getDiaHoje() {
    return new Date().getDate();
}

export function getNumeroSemana() {
    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), 0, 1);
    let days = Math.floor((currentDate - startDate) /
        (24 * 60 * 60 * 1000));
    return Math.ceil(days / 7);
}

export const aniversariantesMes = [
    { mes: 1, dia: 17, nome: 'Mestre Rafael Falcón' },
    { mes: 1, dia: 28, nome: 'Isabela Arruda' },

    { mes: 2, dia: 3, nome: 'Thauan' },
    { mes: 2, dia: 4, nome: 'Douglas' },
    { mes: 2, dia: 8, nome: 'Raul Martins' },
    { mes: 2, dia: 21, nome: 'Mateus P.' },
    { mes: 2, dia: 17, nome: 'Rômulo C.' },
    { mes: 2, dia: 22, nome: 'João Vítor Benetti' },

    { mes: 3, dia: 10, nome: 'Alice Falcón' },
    { mes: 3, dia: 12, nome: 'Luiz Felipe' },
    { mes: 3, dia: 16, nome: 'Paim' },
    { mes: 3, dia: 18, nome: 'Renata Thiesen' },
    { mes: 3, dia: 24, nome: 'Isaque Mlak De Carvalho' },

    { mes: 4, dia: 6, nome: 'Émile' },
    { mes: 4, dia: 11, nome: 'Felipe Fernandes' },
    { mes: 4, dia: 29, nome: 'Karl' },

    { mes: 5, dia: 4, nome: 'Régis Trentim' },
    { mes: 5, dia: 5, nome: 'Passivo Incipiente' },
    { mes: 5, dia: 9, nome: 'José Lima' },
    { mes: 5, dia: 9, nome: 'Laura Mateus' },
    { mes: 5, dia: 22, nome: 'Mariana' },

    { mes: 6, dia: 16, nome: 'Camila B.' },
    { mes: 6, dia: 17, nome: 'Ademir Amaral' },
    { mes: 6, dia: 26, nome: 'Maiara Gomes' },
    { mes: 6, dia: 29, nome: 'Gabriel Morais' },

    { mes: 7, dia: 1, nome: 'Pedro Santana' },
    { mes: 7, dia: 1, nome: 'Pedro Arruda' },
    { mes: 7, dia: 7, nome: 'Yuri Milioli' },
    { mes: 7, dia: 10, nome: 'Sarah' },
    { mes: 7, dia: 28, nome: 'Gabriel Aleixo' },

    { mes: 8, dia: 6, nome: 'Bruno Soares' },
    { mes: 8, dia: 9, nome: 'Vivian' },
    { mes: 8, dia: 27, nome: 'Gabriela Veríssimo' },

    { mes: 9, dia: 1, nome: 'Pedro Eduardo' },
    { mes: 9, dia: 6, nome: 'Emerson' },
    { mes: 9, dia: 12, nome: 'Otávio Menezes'},
    { mes: 9, dia: 23, nome: 'Rafael Cassol' },
    { mes: 9, dia: 26, nome: 'Adonis' },

    { mes: 10, dia: 6, nome: 'Aliceana Arruda' },
    { mes: 10, dia: 10, nome: 'Samuel' },
    { mes: 10, dia: 31, nome: 'Vitória' },

    { mes: 11, dia: 3, nome: 'Andrade' },
    { mes: 11, dia: 8, nome: 'João Carlos' },
    { mes: 11, dia: 14, nome: 'Rafael Mateus' },
    { mes: 11, dia: 22, nome: 'Milo Maximum' },
    { mes: 11, dia: 23, nome: 'Gabriel Torres' },
    { mes: 11, dia: 24, nome: 'I. Albert Weiß y Bernardes' },
    { mes: 11, dia: 26, nome: 'Veríssimo' },
    { mes: 11, dia: 29, nome: 'Amanda Stella' },

    { mes: 12, dia: 16, nome: 'Larissa' },
    { mes: 12, dia: 19, nome: 'Nathália Ferreira' },
    { mes: 12, dia: 24, nome: 'Thiago Silveira' },
    { mes: 12, dia: 25, nome: 'Emilio Bariani' },
    { mes: 12, dia: 30, nome: 'Bruno de Nadai' },
];

export function getAniversariantesDia(dateParam) {
    const date = dateParam || new Date();
    return aniversariantesMes.filter((x) => {
        return x.dia === date.getDate() && x.mes === (date.getMonth() + 1)
    });
}
