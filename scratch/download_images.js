const fs = require('fs');
const path = require('path');
const https = require('https');

const images = {
    "acustica": "https://mmclab.com.br/upload/service/800x600xfit-2apCWAhlsVV4UCCWGweDdlwFdxNHhMemeXY0LHg3.jpeg",
    "guarda-corpo": "https://mmclab.com.br/upload/service/800x600xfit-2UuluQTZSZ7QGQli3N0upEjhb0qEpUfAFSYTOFxc.jpeg",
    "aderencia": "https://mmclab.com.br/upload/service/800x600xfit-2SXNBGPFWl4OHWV0OirmULbhbaL86nkG98ZLwU83.jpeg",
    "pit": "https://mmclab.com.br/upload/service/800x600xfit-cI6EchWYRrGYbtTzUJXJVfc4l5iMhIu8eRBxnZfl.jpeg",
    "ancoragem": "https://mmclab.com.br/upload/service/800x600xfit-Xl4LEaAqGsBzHm2bxCM2bUZOOLvsuKevUsuDML3d.jpeg",
    "permeabilidade": "https://mmclab.com.br/upload/service/800x600xfit-ZV2Td4sDWZSv6IKusdWlfPIG8ZGQUjQc3i9lmxHZ.jpeg",
    "esclerometria": "https://mmclab.com.br/upload/service/800x600xfit-VO7P1FiVeZ7ClMyPTu7XLPSKujTyfZAzLCQnuBZ4.jpeg",
    "luminico": "https://mmclab.com.br/upload/service/800x600xfit-KcHkhOzNsp0lT5X8yZejxX6naWxvYszdQqh6t7QA.jpeg",
    "impacto": "https://mmclab.com.br/upload/service/800x600xfit-cyrbpWCTqdX2Bwu2diwjFsYpcJQ2wwFdsH5CnN5G.jpeg",
    "pecas-suspensas": "https://mmclab.com.br/upload/service/800x600xfit-krUxGW2kViZbt5FYPImDQ3QoFKru9Y2fK6mi32JZ.jpeg",
    "inspecao-fachada": "https://mmclab.com.br/upload/service/800x600xfit-ceOpVAemESJscOqCZJSiizX0fhnq0bF6w1dLmtU5.jpeg",
    "percussao": "https://mmclab.com.br/upload/service/800x600xfit-RVLPRAOzDOqceMrvEj1L7bRFO7ZCQpv2wiY3RZMK.jpeg",
    "termografia": "https://mmclab.com.br/upload/service/800x600xfit-5FZnIwjgF9bOKrnlFtunu8CerSdaNLM5cSNfAtbz.jpeg"
};

const destDir = path.join(__dirname, '../public/images/ensaios');

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

function downloadImage(name, url) {
    return new Promise((resolve, reject) => {
        const filePath = path.join(destDir, `${name}.jpeg`);
        const file = fs.createWriteStream(filePath);
        
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download ${name}: Status ${response.statusCode}`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`Downloaded: ${name}.jpeg`);
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(filePath, () => {});
            reject(err);
        });
    });
}

async function run() {
    console.log("Starting image downloads...");
    for (const [name, url] of Object.entries(images)) {
        try {
            await downloadImage(name, url);
        } catch (error) {
            console.error(`Error downloading ${name}:`, error.message);
        }
    }
    console.log("Finished all downloads.");
}

run();
