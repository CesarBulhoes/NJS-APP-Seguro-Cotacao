const consoleStp = require('libStpInvoke').Console;

const test = require('./index-atualizar-cotacao');

const event = {
  Records: [
    {
      messageId: 'ec2b1fb7-bd11-4bbc-8061-5b919cbd559d',
      receiptHandle:
        'AQEBBupbs8trH1Bl3dW74/PKg5RehccURvs4KaJxyUMGjbR76KuzT0j6TwQI/LrGRaRn9jlqjIwXtnB0glj96s5kVNk0gJPRlhbKMauvfWtxLgAmIdufAdFbg2T1M1sgoQFkjo+bHyYnXtmcRxPaUQmM77knh4vC9urYvG3o/hjOYXeHQr0vv8PIf6OcXFbdgBOik2723vBsri+FUVwvLuedu5p2JDN4nAstH2opWwAX7t0S7eF4RRtf1ZnnlEQFEw3Mn6n1G/6HpZQqpV9DUyB+kLxdVdFtGWRkxkMayK23Lysnx1l3cgsAaOWTL87baqO8hMSnlPnuC9T+nNsHDBMoWgFg2mSgyvIuCeBWe2IxQlgbsImRcHwm2su8KuMEbY/kEdfUW3ldQKiGwfBtnw+fxA==',
      body: '{"idCotacao":"11e19af8-ee66-4226-829b-775e5a6a893b","NRC":"NRC_teste_001"}',
      attributes: [Object],
      messageAttributes: {},
      md5OfBody: '8eff04b1d50a055705be1fbb15f77562',
      eventSource: 'aws:sqs',
      eventSourceARN: 'arn:aws:sqs:sa-east-1:843980727574:SINCRONIZA_OFERTAS_COTACAO_SEGURO',
      awsRegion: 'sa-east-1'
    }
  ]
};

const callback = (erro, data) => {
  consoleStp.info('*******************');
  consoleStp.info('Erro: ', erro === null ? 'Não há erros' : erro);
  consoleStp.info('*******************');
  consoleStp.info('Sucesso: ', JSON.stringify(data));
  consoleStp.info('*******************');
};

test.execute(event, null, callback);
