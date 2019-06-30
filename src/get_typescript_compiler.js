function getTypescriptCompiler(log, requireFn) {
  try {
    const ts = requireFn('typescript');
    log.info('using typescript@' + ts.version);
    return ts;
  } catch (e) {
    log.error('typescript peer dependency can not be found...');
    throw e;
  }
}

module.exports = getTypescriptCompiler;
