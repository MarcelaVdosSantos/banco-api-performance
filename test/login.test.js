import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
    //iterations: 40,
    vus: 10, //usuários virtuais
    duration: '30s',
    thresholds: { // irá validar o teste
      http_req_duration: [ 'p(90)<4000', 'max<6000' ],
      http_req_failed: ['rate<0.01' ]
    }
};

export default function () {
// aqui fica o teste
  const url = 'http://localhost:3000/login';

  const payload = JSON.stringify({
    username: 'julio.lima',
    senha: '123456',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const resposta = http.post(url, payload, params);

  check(resposta, { // o r referencia/representa o resposta, o check apenas verifica que a API esta UP
    'Validar que o Status é 200' : (r) => r.status ===200,
    'Validar que o token é string' : (r) => typeof(r.json().token) == 'string'
  })

  sleep(1);

}