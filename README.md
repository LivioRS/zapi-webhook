# ZAPI Webhook Handler - Vercel Deploy

## Deploy Rápido (2 min)

### 1. Push para GitHub
```bash
cd C:\Users\rocha\zapi-vercel
git init
git add .
git commit -m "Initial commit"
# Crie repo no GitHub e push
git remote add origin https://github.com/seu-usuario/zapi-webhook.git
git push -u origin main
```

### 2. Import no Vercel
- Acesse [vercel.com](https://vercel.com) → "Add New Project"
- Importe o repo GitHub
- **Configure as Environment Variables** (Settings → Environment Variables):
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_KEY`
  - `ZAPI_INSTANCE_URL`
  - `ZAPI_INSTANCE_ID`
  - `ZAPI_TOKEN`
- Deploy

### 3. Configure Webhook no ZAPI
No painel ZAPI → Instância → Webhook:
```
URL: https://seu-projeto.vercel.app/api/webhook
Eventos: messages.upsert
```

---

## Testar Localmente
```bash
cd C:\Users\rocha\zapi-vercel
npm install
vercel dev
# Teste: POST http://localhost:3000/api/webhook
```

---

## Payload Esperado (ZAPI)
```json
{
  "data": {
    "message": {
      "conversation": "COD123",
      "key": { "remoteJid": "5511999999999@s.whatsapp.net" }
    }
  }
}
```

---

## Custos
- **Vercel Hobby**: Grátis (100GB bandwidth/mês, 100GB-hours serverless)
- **Supabase**: Grátis (500MB DB, 2GB bandwidth)
- **Total**: $0/mês