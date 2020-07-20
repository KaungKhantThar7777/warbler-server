const errorHandler = (error, req, res, next) => {
  return res.status(error.status).json({
    error: {
      message: error.message,
    },
  });
};

module.exports = errorHandler;
