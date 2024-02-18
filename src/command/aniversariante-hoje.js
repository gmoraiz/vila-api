import { getAniversariantesDia } from "../util";

const aniversarianteHoje = () => {
	const aniversariantes = getAniversariantesDia();

	if (!aniversariantes.length) return null;

	const nomes = aniversariantes.map((x) => x.nome).join(', ');

	return `🎂🎂🎂🎂🎂🎂🎂🎂

Feliz aniversário, <b>${nomes}</b>!!!

🎂🎂🎂🎂🎂🎂🎂🎂`;
};

export default aniversarianteHoje;
