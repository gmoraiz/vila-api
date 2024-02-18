import puppeteer from 'puppeteer';

const getAulaNovaAcademiaTrivium = async () => {
    const aulas = [];

    const setAulas = ({
        modulo,
        aula,
        link,
    }) => {
        aulas.push({
            modulo,
            aula,
            link,
        });
    };

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto(`${ACADEMIA_TRIVIUM_URL}/painel-do-aluno/`);

    await page.setViewport({width: 1080, height: 1024});

    await page.type('[name="username"]', process.env.ACADEMIA_TRIVIUM_USER);

    await page.type('[name="password"]', process.env.ACADEMIA_TRIVIUM_PASSWORD);

    await page.click('.tar-login-submit');

    await page.waitForSelector('[name="user_email"]');
    await page.goto(`${ACADEMIA_TRIVIUM_URL}/cursost/academia-trivium/`);

    const modulosEl = await page.$$('.tva-course-module');

    for await (const moduloEl of modulosEl) {
        const modulo = await moduloEl.evaluate((el) => {
            const tituloEl = el.querySelector('[data-shortcode="tva_course_module_title"]');
            return tituloEl ? tituloEl.innerText : '—';
        });

        const aulasEl = await moduloEl.$$('.tva-course-lesson [data-shortcode="tva_course_lesson_title"] a');

        for await (const aulaEl of aulasEl) {
            const { aula, link } = await aulaEl.evaluate((el) => ({
                aula: el.innerText,
                link: el.href,
            }));

            if (aula && link) {
                setAulas({
                    modulo,
                    aula,
                    link,
                });
            }
        };
    };

    console.log(aulas.length);
};

await getAulaNovaAcademiaTrivium();
