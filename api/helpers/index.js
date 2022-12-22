const Boom = require("@hapi/boom");

const httpResp = (status, message, code, data) => {
  const response = {
    statusCode: code,
    error: false,
    message: message,
    data: data,
  };

  return response;
};

const isDef = (param) => {
  if (param == null || param == undefined) {
    return false;
  } else {
    return true;
  }
};

const errBuilder = (err) => {
  let finalError = err;

  if (err.isBoom) {
    if (isDef(err.data)) {
      err.output.payload.data = err.data;
    }
    err.reformat();

    console.log(err);
    finalError = err.output.payload;
    if (isDef(err.message) && finalError.statusCode == 500) {
      finalError.message = err.message;
    }
  } else {
    err.error = true;
    if (!isDef(err.message) && isDef(err.type)) {
      err.message = err.type;
    }
  }

  return finalError;
};

const errHandler = (error, res) => {
  const resp = httpResp(false, "There is some error occured", 500, error);
  return res.status(resp.code).send(resp);
};

const successHandler = (res, data, message, metadata) => {
  message = message || "Operation successful";
  let resp;
  if (isDef(metadata)) {
    resp = httpResp(false, message, 200, data);
  } else {
    resp = httpResp(false, message, 200, data);
  }

  return res.status(resp.statusCode).send(resp);
};

module.exports = {
  httpResp,
  isDef,
  errBuilder,
  errHandler,
  successHandler,
};
