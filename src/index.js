import { config } from 'dotenv';
import Fastify from 'fastify';
import { Telegraf, Markup } from 'telegraf';
import getHistory from './telegram-api';
import { getEscalaDia, getEscalaSemanal } from './sheet';
import { aniversariantesMes, getDiaHoje, getHoje, getMesHoje } from './util';
import { initCron } from './cron';
import saobento from './command/saobento';
import log from './log';

config({ path: `.env.${process.env.NODE_ENV}` });

let bot;

const fastify = Fastify({
	logger: true
});

function getNumeroEdicao() {
	const primeiraEdicao = new Date('07 Jan 2024');
	const edicaoDeHoje = new Date();
	const diferenca = Math.abs(edicaoDeHoje.getTime() - primeiraEdicao.getTime());
	const diasFolga = 6; // luto pela Madalena
	return Math.ceil(diferenca / (1000 * 60 * 60 * 24)) - diasFolga;
}

function getDiaSemana() {
	const hoje = new Date();
	const dia = hoje.toLocaleDateString('pt-BR', { weekday: 'long' });
	return dia.at(0).toUpperCase().concat(dia.slice(1));
}

const mesNome = [
	'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

const getAniversariantesMesTexto = (mes) => {
	const nomeMes = mesNome[mes - 1];
	const aniversariantes = aniversariantesMes.filter((aniversariante) => aniversariante.mes === Number(mes));
	const titulo = `<b>Aniversariantes do mês de ${nomeMes}:</b>\n`;
	const diaHoje = getDiaHoje();
	const mesHoje = getMesHoje();
	const corpo = aniversariantes.reduce((prev, curr) => {
		let sufixo = curr.dia === diaHoje && curr.mes === mesHoje ? ' 🎂🎂🎂' : '';
		return prev.concat(`${curr.dia.toString().padStart(2, '0')} - ${curr.nome}${sufixo}\n`);
	}, '');
	return corpo ? titulo.concat(corpo) : `Nenhum ninja faz aniversário no mês de ${nomeMes} 😞`;
};

function transformarLinkMensagem(link) {
	return link.replace(/https?:\/\/t\.me\/[^\s]+/g, (termo) => {
		const [link, horario] = termo.split('?');
		return `<b><a href="${link}">[${(horario || '00:00').replace('h', ':')}]</a></b>`;
	}).trim();
}

function formatarFragmentoSumario(texto) {
	let mensagens = texto.trim()
		.replace('\t', '')
		.split('\n')
		.map((x) => transformarLinkMensagem(x))

	return mensagens.join('\n');
};

function getSumario() {
	return `<code>📰 Jornal da Vila, ${getNumeroEdicao()} ed.
${getDiaSemana()}, ${getHoje()}</code>

<pre>Sumário</pre>

Coloque aqui as manchetes do dia

<b><a href="https://www.google.com.br">Clique aqui para continuar a ler o jornal...</a></b>`;
}

function getSiglas() {
	return `<b>AL</b> - Animus Loquendi
<b>AT</b> - Academia Trivium
<b>CLO</b> ou <b>CLOF</b> - Curso de Latim Online
<b>COF</b> - Curso Online de Filosofia
<b>GDL</b> - Graus de Letramento
<b>IB</b> - Instituto Borborema
<b>MML</b> - Mateus Mota Lima
<b>PA</b> - Projeto Animus
<b>PB</b> - Passivo Bruto
<b>PBI</b> - Passivo Bruto Incompleto
<b>PC</b> - Passivo Culto
<b>PI</b> - Passivo Incipiente
<b>PM</b> - Parvus Magnus
<b>PPR</b> - Padre Paulo Ricardo
<b>PR</b> - Passivo Refinado`;
}

fastify.get('/bot-jornal', async () => {
	bot.telegram.sendMessage(process.env.JORNAL_ID, 'teste', { parse_mode: 'HTML' });
});

fastify.get('/bot-vila', async () => {
	// bot.telegram.sendMessage(process.env.VILA_ID, `Atenção, ninjas: amanhã é o aniversário de <b>Isabela Arruda</b> 🎂`, { parse_mode: 'HTML' });
});

fastify.get('/telegram-api', async () => {
	try {
		getHistory();
	} catch (err) {
		console.error(err);
	}
});

try {
	bot = new Telegraf(process.env.BOT_TOKEN);

	bot.command(('saobento'), async (ctx) => {
		return ctx.replyWithPhoto({ source: saobento() });
	});

	bot.command(('escala'), async (ctx) => {
		return ctx.replyWithHTML(await getEscalaDia());
	});

	bot.command(('escala_semana'), async (ctx) => {
		return ctx.replyWithHTML(await getEscalaSemanal());
	});

	bot.command('aniversariantes', async (ctx) => {
		const buttons = mesNome.map((mes, i) => ([{
			text: mes,
			callback_data: `aniversariante-mes-${i + 1}`,
		}]));

		return await ctx.reply(
			"Deseja ver os aniversariantes de que mês?",
			Markup.inlineKeyboard(buttons),
		);
	});

	bot.action(/^aniversariante-mes-.+/, (ctx) => {
		const [, , mes] = ctx.update.callback_query.data.split('-');

		ctx.editMessageText({
			text: getAniversariantesMesTexto(mes),
			parse_mode: 'HTML',
		});
	});

	bot.command('sumario', (ctx) => {
		return ctx.replyWithHTML(getSumario());
	});

	bot.command('siglas', (ctx) => {
		return ctx.replyWithHTML(getSiglas());
	});

	bot.command('formatar', (ctx) => {
		const mensagem = ctx.update.message.text.replace(/\/formatar/, '');

		const mensagemFormatada = !mensagem ? `<b>É necessário enviar o sumário a ser editado nesta mensagem. Exemplo:</b>
Presente dos alunos da vila ao Prof. https://t.me/c/1727496596/130499?10h20
Superverus funda o SindiNeri https://t.me/c/1727496596/130506?10:25
`.trim() : formatarFragmentoSumario(mensagem);

		ctx.replyWithHTML(mensagemFormatada);
	});

	bot.on('message', (ctx) => {
		log(`Grupo: ${ctx.update.message.chat.title || ctx.update.message.chat.username}
Pessoa: ${ctx.update.message.from.first_name + ' ' + (ctx.update.message.from.last_name || '') + ' (' + (ctx.update.message.from.username || '') +')'}
Mensagem: ${JSON.stringify(ctx.update.message)}
`);

		// verissimo 1314174146
		// gabriel 761561482
		// if (ctx.update?.message?.from?.id === 1314174146 && ctx.update?.message?.text) {
		// 	const msg = ctx.update.message.text.toLowerCase();
		// 	if (msg.includes('boa noite') || msg.includes('boanoite') || msg.includes('good night')) {
		// 		ctx.reply('Boa noite, Veríssimo!');
		// 	} else if (msg.includes('boa tarde') || msg.includes('boatarde')) {
		// 		ctx.reply('Boa tarde, Veríssimo!');
		// 	} else if (msg.includes('bom dia') || msg.includes('bomdia')) {
		// 		ctx.reply('Bom dia, Veríssimo!');
		// 	}
		// }
	});

	await fastify.listen({ host: process.env.HOST, port: process.env.PORT });

	initCron(bot);

	bot.launch(); // precisa ser por último após todos os registros
} catch (err) {
	fastify.log.error(err)
	process.exit(1)
}
