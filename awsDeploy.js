const libStp = require('libStpInvoke/devops');

const jsonConfig = process.argv[2];

libStp.Deploy.awsDeploy(__dirname, jsonConfig);
