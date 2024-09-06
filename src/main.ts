import * as core from '@actions/core';
import * as exec from '@actions/exec';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

function getAssetUrl(version: string): string {
    return `https://github.com/Testing-By-Specification/testspec-action/releases/download/${version}/testspec-java-${version}-all.jar`;
}

async function downloadAsset(url: string, destPath: string): Promise<void> {
    const writer = fs.createWriteStream(destPath);
    const downloadResponse = await axios({
        url,
        method: 'GET',
        responseType: 'stream',
    });
    downloadResponse.data.pipe(writer);
    await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
    core.info(`Downloaded asset to ${destPath}`);
}

async function executeJar(assetPath: string, pluginType: string, pluginPath: string): Promise<void> {
    if (pluginType === 'directory' || pluginType === 'file') {
        await exec.exec('java', ['-jar', assetPath, '--plugin', 'pretty', pluginPath]);
    } else {
        throw new Error(`Invalid plugin_type provided: ${pluginType}`);
    }
}

async function run() {
    try {
        const version = core.getInput('version', { required: true });
        const assetUrl = getAssetUrl(version);
        const currentDir = process.cwd();
        const assetName = path.basename(assetUrl);
        const assetPath = path.join(currentDir, assetName);

        await downloadAsset(assetUrl, assetPath);

        const buildDir = path.join(currentDir, 'build');
        if (!fs.existsSync(buildDir)) {
            fs.mkdirSync(buildDir);
        }

        const pluginType = core.getInput('plugin_type', { required: true });
        const pluginPath = core.getInput('plugin_path', { required: true });

        await executeJar(assetPath, pluginType, pluginPath);

    } catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message);
        } else {
            core.setFailed(String(error));
        }
    }
}

run();