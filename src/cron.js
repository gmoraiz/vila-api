import cron from 'node-cron';
import { getEscalaDia } from './sheet';
import saobento from './command/saobento';
import angelus from './command/angelus';
import aniversarianteAmanha from './command/aniversariante-amanha';
import aniversarianteHoje from './command/aniversariante-hoje';
import log from './log';

const config = { timezone: 'America/Sao_Paulo' };

export function initCron(bot) {
  cron.schedule('0 0 5 * * *', async () => {
    log('[cron] enviando escala do jornal');
    const dias = await getEscalaDia();
    const mensagem = `<code>Bom dia, ninjas!</code>\n\n${dias}`;
    await bot.telegram.sendMessage(process.env.JORNAL_ID, mensagem, { parse_mode: 'HTML' });
  }, config);

  cron.schedule('0 0 3 * * *', async () => {
    log('[cron] enviando medalha de são bento');
    await bot.telegram.sendPhoto(process.env.VILA_ID, { source: saobento() });
  }, config);

  cron.schedule('0 0 12 * * *', async () => {
    log('[cron] enviando imagem do angelus');
    await bot.telegram.sendPhoto(process.env.VILA_ID, { source: angelus() });
  }, config);

  cron.schedule('0 0 18 * * *', async () => {
    log('[cron] enviando aniversariantes amanhã');
    const mensagem = aniversarianteAmanha();
    if (mensagem) {
      await bot.telegram.sendMessage(process.env.VILA_ID, mensagem, { parse_mode: 'HTML' });
    }
  }, config);

  cron.schedule('0 1 0 * * *', async () => {
    log('[cron] enviando aniversariantes hoje');
    const mensagem = aniversarianteHoje();
    if (mensagem) {
      await bot.telegram.sendMessage(process.env.VILA_ID, mensagem, { parse_mode: 'HTML' });
    }
  }, config);

  cron.schedule('0 0 17 * * *', async () => {
    log('[cron] enviando aniversariantes hoje pela segunda vez');
    const mensagem = aniversarianteHoje();
    if (mensagem) {
      await bot.telegram.sendMessage(process.env.VILA_ID, mensagem, { parse_mode: 'HTML' });
    }
  }, config);
}
