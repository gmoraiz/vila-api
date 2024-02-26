import { GoogleSpreadsheet } from "google-spreadsheet";
import { getHoje, getNumeroSemana } from "./util";

async function getPlanilhaEscala(title = null) {
  const arquivo = new GoogleSpreadsheet(
    '1gcHWcCy1Oii-_a5pUQTuaVRa_VmLYx3-D4EJM2TVsGw',
    { apiKey: 'AIzaSyDPjLipcZjgXLCt4WUyux5F6IAWO8kZg6w' },
  );

  await arquivo.loadInfo();

  return title ? arquivo.sheetsByTitle[title] : arquivo.sheetsByIndex[0];
}

function getDiaHojeIndex() {
  const dia = (new Date()).getDay();
  return dia === 0 ? 7 : dia;
}

async function getListaDias() {
  const planilha = await getPlanilhaEscala('Semanal');
  const rows = await planilha.getRows();

  return rows.map((row, index) => {
    const listaDias = [Object.entries(row.toObject())];
    return listaDias.reduce((prev, curr) => {
      const [, dia] = curr.shift();
      const jornalistas = curr.map(([tipoJornalista, nomeJornalista]) => {
        return `${nomeJornalista} (${tipoJornalista})`;
      }).join(', ');

      return {
        diaIndex: index + 1,
        dia,
        jornalistas,
      };
    }, {});
  });
}

export async function getEscalaSemanal() {
  const titulo = `<b>Jornal — Escala da semana ${getNumeroSemana()}</b>`;
  const listaDias = await getListaDias();
  const dias = listaDias.map((item) => `<b>${item.dia}:</b> ${item.jornalistas}`).join('\n');

  return `${titulo}\n\n${dias}`;
}

export async function getEscalaDia() {
  const titulo = `<b>Jornal — Escala do dia (${getHoje()})</b>`;
  const listaDias = await getListaDias();
  const diaHojeIndex = getDiaHojeIndex();
  const item = listaDias.find((item )=> item.diaIndex === diaHojeIndex);

  return `${titulo}\n\n${item.jornalistas}`;
}
