import http from 'k6/http';
import { sleep, check } from 'k6';
import { pegarBaseURL } from '../utils/variaveis.js';
const postLogin =  JSON.parse(open('../fixtures/postLogin.json'))

export const options = {
    //iterations: 40,

    //vus: 1, //usuários virtuais
    //duration: '30s',

    stages: [
      { duration: '5s', target: 10 },  // durante 10 segundos coloque 10 usuários virtuais para executar os testes
      { duration: '20s', target: 10 },
      { duration: '5s', target: 0 }
    ],


    thresholds: { // irá validar o teste
      http_req_duration: [ 'p(90)<4000', 'max<6000' ],
      http_req_failed: ['rate<0.01' ]
    }
};

export default function () {
// aqui fica o teste
  const url = pegarBaseURL() + '/login';

  // vc pode manipular o json caso queira alterar o user para um único usuário
  //postLogin.username = "junior.lima"
  //postLogin.senha ="123456"

  //console.log(postLogin)
  const payload = JSON.stringify(postLogin);

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const resposta = http.post(url, payload, params);

  check(resposta, { // o r referencia/representa o resposta, o check apenas verifica que a API esta UP
    'Validar que o Status é 200' : (r) => r.status ===201,
    'Validar que o token é string' : (r) => typeof(r.json().token) == 'string'
  })

  sleep(1);

}