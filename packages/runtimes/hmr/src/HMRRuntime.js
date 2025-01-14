// @flow strict-local

import {Runtime} from '@parcel/plugin';
import fs from 'fs';
import {md5FromObject} from '@parcel/utils';
import path from 'path';

const HMR_RUNTIME = fs.readFileSync(
  path.join(__dirname, './loaders/hmr-runtime.js'),
  'utf8',
);

export default (new Runtime({
  apply({bundle, options}) {
    if (bundle.type !== 'js' || !options.hot) {
      return;
    }

    let {host, port} = options.hot;
    if (options.publicURL) {
      const url = new URL(options.publicURL);
      host = url.hostname;
      port = url.port;
    }
    return {
      filePath: __filename,
      code:
        `var HMR_HOST = ${JSON.stringify(host != null ? host : null)};` +
        `var HMR_PORT = ${JSON.stringify(port != null ? port : null)};` +
        `var HMR_ENV_HASH = "${md5FromObject(bundle.env)}";` +
        `module.bundle.HMR_BUNDLE_ID = ${JSON.stringify(bundle.id)};` +
        HMR_RUNTIME,
      isEntry: true,
    };
  },
}): Runtime);
