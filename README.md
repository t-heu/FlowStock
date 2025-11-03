# 🧭 Flowstock

**Flowstock** é um sistema corporativo de **gestão de materiais internos**, desenvolvido para controlar estoques, registrar movimentações e garantir segurança e resiliência nas integrações e APIs internas.

O projeto prioriza **segurança**, **controle de acesso granular**, **resiliência de rede** e **auditabilidade**.

---

## 🎯 Objetivo do sistema

Flowstock foi construído para:

- Registrar entradas, saídas e transferências de materiais (logs imutáveis para auditoria).  
- Permitir consultas e relatórios de saldo/ histórico por filial e material.  
- Prover autenticação segura e autorização com permissões granulares (ACL).  
- Garantir alta disponibilidade e tolerância a falhas nas comunicações com serviços e APIs.

---

## 🏗️ Stack técnica (resumo)

- **Frontend / API**: Next.js (App Router)  
- **Banco de dados**: Firestore (Firebase Cloud Firestore)  
- **Admin backend**: Firebase Admin SDK  
- **Autenticação**: JWT (JSON Web Token)  
- **Persistência do token**: Cookie `HttpOnly` (secure, sameSite)  
- **Controle de acesso**: ACL (Access Control List) por papéis/permissões  
- **Resiliência de chamadas**: `fetchResilient` (retries, timeout, exponential backoff) + **Circuit Breaker**  
- **Linguagem**: TypeScript

---

## 🔐 Autenticação (JWT + Cookie HTTPOnly)

- O servidor emite JWTs assinados ao autenticar o usuário.
- O token é enviado ao cliente via **cookie HTTPOnly**, evitando exposição ao JavaScript (proteção contra XSS).
- Rotas protegidas validam o JWT em cada requisição no servidor.

```ts
// emissão e set do cookie (exemplo)
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export function setAuthCookie(payload: object) {
  const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "8h" });
  cookies().set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });
}
```