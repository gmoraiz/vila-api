import { TelegramClient, Api } from "telegram";
import { StringSession } from "telegram/sessions";
import input from "input";
import fs from "fs";

const nameFileSession = 'telegram-api-session.txt';

function saveSession(session) {
	fs.writeFileSync(nameFileSession, session);
}

function readSession() {
	let session = '';

	try {
		session = fs.readFileSync(nameFileSession, 'utf-8');
	} catch (err) {
		console.error(err);
		console.log('Problema ao ler sessão');
	}

	return session;
}

function dataHoje() {
	const dataAtual = new Date();
	return dataAtual.setHours(0, 0, 0, 0);
}

export default async function getHistory() {
	const apiId = process.env.TELEGRAM_API_ID;
	const apiHash = process.env.TELEGRAM_API_HASH;
	const session = readSession();
	const stringSession = new StringSession(session); // fill this later with the value from session.save()

	const client = new TelegramClient(stringSession, apiId, apiHash, {
		connectionRetries: 5,
	});

	if (session) {
		await client.connect();
	} else {
		await client.start({
			phoneNumber: async () => await input.text("number ?"),
			password: async () => await input.text("password?"),
			phoneCode: async () => await input.text("Code ?"),
			onError: (err) => console.log(err),
		});
		saveSession(client.session.save());
	}

	const callId = Math.floor(Math.random() * 10000);

	const result = await client.invoke(
		new Api.phone.CreateGroupCall({
			peer: process.env.JORNAL_ID,
			title: 'Oração',
			randomId: callId,
		}),
	);

	console.log(result);

	await client.invoke(
		new Api.phone.JoinGroupCall({
			videoStopped: true,
			call: new Api.InputGroupCall({
				id: result.chatId,
				accessHash: result.chatId,
			}),
			muted: true,
		}),
	);

	// if (result.messages?.length) {
	// 	const mensagensComReacao = result.messages
	// 		.filter((x) => x.reactions?.length)
	// 		.map((x) => ({
	// 			message: x.message,
	// 			countReactions: x.reactions.length,
	// 		}));

	// 	console.log('------------- mensagens mais reagidas ----------------');
	// 	console.log(mensagensComReacao);
	// 	console.log('------------- fim mensagens mais reagidas ----------------');
	// } else {
	// 	console.log('Nenhuma mensagem recebeu reações...');
	// }
}
