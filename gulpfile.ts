import glob from 'glob';
import { spawn } from 'child_process';
import logger from 'gulplog';

function transpileMigrations(): Promise<void> {
    return new Promise(async (resolve, reject) => {
        console.log(`we're here...`);
        glob(`src/migrations/**/*.ts`, {}, async (err, files) => {
            logger.info(`Found ${files.length} file(s)...`);
            for (const file in files) {
                try {
                    await spawnTsc(files[file]);
                } catch (error) {
                    logger.error(error);
                }
            }
        });
        resolve();
    });
}

function spawnTsc(file: string): Promise<void> {
    return new Promise((resolve, reject) => {
        logger.info(`Processing migrations file "${file}"...`);
        const child = spawn(`node`, [
            `node_modules/typescript/bin/tsc`,
            file,
            `--moduleResolution`, `node`,
            `--target`, `esnext`,
            `--outDir`, file.replace(/src/gi, `dist`).replace(/^(.+?)\/[a-zA-Z0-9\-]+\.\w+$/gi, `$1`)
        ], {
            stdio: 'inherit'
        });

        child.on('close', (code, signal) => {
            if (code === 0)
                resolve();
            else
                reject(signal);
        });
    });
}

exports.default = transpileMigrations
