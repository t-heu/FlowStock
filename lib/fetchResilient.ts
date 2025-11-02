export interface FetchOptions extends RequestInit {
  retries?: number;          // Quantas tentativas
  retryDelay?: number;       // Tempo entre tentativas em ms
  circuitBreaker?: boolean;  // Habilita circuito
}

let failureCount = 0;        // Contador de falhas
const failureThreshold = 3;  // Limite para "abrir" o circuito
const circuitTimeout = 5000; // Tempo para resetar o circuito

export async function fetchResilient(url: string, options: FetchOptions = {}): Promise<any> {
  const { retries = 2, retryDelay = 500, circuitBreaker = true, ...fetchOpts } = options;

  if (circuitBreaker && failureCount >= failureThreshold) {
    throw new Error("Circuit breaker aberto. Servidor indisponível temporariamente.");
  }

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, fetchOpts);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      failureCount = 0; // reset após sucesso
      return await res.json();
    } catch (err) {
      failureCount++;
      console.warn(`fetchResilient: tentativa ${attempt + 1} falhou:`, err);

      if (attempt < retries) {
        await new Promise(r => setTimeout(r, retryDelay));
      } else {
        if (circuitBreaker) {
          // fecha circuito temporariamente
          setTimeout(() => {
            failureCount = 0;
          }, circuitTimeout);
        }
        throw err;
      }
    }
  }
}
