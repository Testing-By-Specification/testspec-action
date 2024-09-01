import * as core from '@actions/core';
import * as github from '@actions/github';
import * as exec from '@actions/exec';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

async function run() {
    try {
        // Inputs from the action.yml
        const versionTag = core.getInput('version_tag', { required: true });
        const owner = 'Testing-By-Specification';
        const repo = 'testspec-action';
        const assetName = `testspec-java-${versionTag}-all.jar`;

        // GitHub API base URL for releases
        const apiUrl = `https://api.github.com/repos/${owner}/${repo}/releases/tags/${versionTag}`;

        // Fetch the release information
        const response = await axios.get(apiUrl);
        const release = response.data;

        // Find the asset download URL
        const asset = release.assets.find((a: any) => a.name === assetName);
        if (!asset) {
            throw new Error(`Asset ${assetName} not found in release ${versionTag}`);
        }

        const downloadUrl = asset.browser_download_url;

        // Download the asset
        const assetPath = path.join(process.cwd(), assetName);
        const writer = fs.createWriteStream(assetPath);
        const downloadResponse = await axios({
            url: downloadUrl,
            method: 'GET',
            responseType: 'stream',
        });

        downloadResponse.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        core.info(`Downloaded asset to ${assetPath}`);

        // Run the jar file
        await exec.exec('java', ['-jar', assetPath]);

    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
