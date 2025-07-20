
const { override, addWebpackPlugin } = require('customize-cra');
const webpack = require('webpack');

module.exports = override(
    addWebpackPlugin(
        new webpack.NormalModuleReplacementPlugin(/\/ace-builds\/src-noconflict\/worker-.*/,
            (resource) => {
                const worker = resource.request.replace(/^.*\/ace-builds\/src-noconflict\/worker-(.*)$/, 'ace/worker/$1');
                resource.request = `ace-builds/src-noconflict/${worker}`;
            }
        )
    )
);
