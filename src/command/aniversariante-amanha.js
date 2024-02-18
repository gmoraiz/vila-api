import { getAmanha, getAniversariantesDia } from "../util";

const aniversarianteAmanha = () => {
	const aniversariantes = getAniversariantesDia(getAmanha());

	if (!aniversariantes.length) return null;

	const nomes = aniversariantes.map((x) => x.nome).join(', ');

	return `🚨🚨🚨🚨🚨🚨🚨🚨

Atenção, ninjas: amanhã é o aniversário de <b>${nomes}</b>. 🎂

🚨🚨🚨🚨🚨🚨🚨🚨`;
};

export default aniversarianteAmanha;
