module.exports = function (format) {
  return function (req, res, next) {
    if (!req.log) {
      return next()
    }

    const logger = req.log.child({ type: 'request' })

    const reqStart = Date.now()

    function cleanup () {
      res.removeListener('finish', finishLog)
      res.removeListener('close', closeLog)
      res.removeListener('error', errorLog)
    }

    function finishLog () {
      cleanup()
      logger.info(format(res, Date.now() - reqStart), 'request done')
    }

    function closeLog () {
      cleanup()
      logger.info(format(res, Date.now() - reqStart), 'request closed')
    }

    function errorLog (error) {
      cleanup()
      logger.error({ ...format(res, Date.now() - reqStart), error }, 'request error')
    }

    res.on('finish', finishLog)
    res.on('close', closeLog)
    res.on('error', errorLog)

    next()
  }
}
