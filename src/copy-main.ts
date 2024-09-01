import * as core from '@actions/core';
import * as exec from '@actions/exec';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

async function run() {
    try {
        // Direct URL for the asset
        const assetUrl = "https://github.com/Testing-By-Specification/testspec-action/releases/download/0.0.4/testspec-java-0.0.4-all.jar";
        const assetName = path.basename(assetUrl);
        const assetPath = path.join(process.cwd(), assetName); // Save the file in the current directory

        // Download the asset
        const writer = fs.createWriteStream(assetPath);
        const downloadResponse = await axios({
            url: assetUrl,
            method: 'GET',
            responseType: 'stream',
        });

        downloadResponse.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        core.info(`Downloaded asset to ${assetPath}`);


        // Create 'build' directory if it doesn't exist
        const buildDir = path.join(process.cwd(), 'build');
        if (!fs.existsSync(buildDir)) {
            fs.mkdirSync(buildDir);
        }

        // Determine whether to use a directory or file
        const pluginType = core.getInput('plugin_type', { required: true }); // 'directory' or 'file'
        const pluginPath = core.getInput('plugin_path', { required: true }); // Path to directory or file

        // Run the jar file with appropriate arguments
        if (pluginType === 'directory') {
            await exec.exec('java', ['-jar', assetPath, '--plugin', 'pretty', pluginPath]);
        } else if (pluginType === 'file') {
            await exec.exec('java', ['-jar', assetPath, '--plugin', 'pretty', pluginPath]);
        } else {
            throw new Error(`Invalid plugin_type provided: ${pluginType}`);
        }

    } catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message);
        } else {
            core.setFailed(String(error));  // Fallback for non-Error types
        }
    }
}

run();
