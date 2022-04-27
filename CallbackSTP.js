const consoleStp = require('libStpInvoke').Console;

class CallbackSTP {
  constructor(eventAws, callbackAws) {
    this.callbackAws = callbackAws;
    this.eventAws = eventAws;
    consoleStp.info(this.eventAws);
  }

  send(erro, detail) {
    if (erro === null) {
      // Sucesso
      consoleStp.info(detail);
      this.callbackAws(null, detail);
    } else {
      // Exception
      erro.status.evento = this.eventAws.env;
      consoleStp.error(erro, detail, this.eventAws);
      this.callbackAws(JSON.stringify(erro));
    }
  }
}

exports.CallbackSTP = CallbackSTP;
