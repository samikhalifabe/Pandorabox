# 🚀 Pandorabox

Une plateforme complète de communication intelligente avec frontend Next.js et backend Express.js.

## 📁 Structure du projet

```
pandorabox/
├── README.md                    # Ce fichier
├── package.json                 # Configuration workspace
├── frontend/                    # Application Next.js
│   ├── app/                    # Pages et API routes
│   ├── components/             # Composants React
│   ├── lib/                    # Utilitaires
│   └── package.json
└── backend/                     # Serveur Express
    ├── services/               # Services de communication & IA
    ├── controllers/            # Contrôleurs API
    ├── models/                 # Modèles de données
    ├── routes/                 # Routes Express
    └── package.json
```

## 🌟 Fonctionnalités

### Frontend (Next.js)
- ✅ Interface moderne avec Shadcn/ui
- ✅ Dashboard d'administration
- ✅ Gestion des contacts et véhicules
- ✅ Envoi de messages individuels et en masse
- ✅ Historique des conversations
- ✅ Authentification Supabase
- ✅ Temps réel avec Socket.IO

### Backend (Express.js)
- ✅ Intégration de communication multi-canaux
- ✅ API REST complète
- ✅ WebSocket pour temps réel
- ✅ Gestion des sessions
- ✅ Base de données Supabase
- ✅ Intelligence artificielle (OpenAI/Grok)
- ✅ Anti-spam et gestion des doublons

## 🚀 Démarrage rapide

### Prérequis
- Node.js 18+
- Compte Supabase
- Compte OpenAI ou Grok (optionnel)

### Installation

1. **Installer les dépendances**
   ```bash
   npm install
   ```

2. **Configuration des variables d'environnement**
   
   **Backend (.env)**
   ```bash
   cd backend
   cp .env.example .env
   # Remplir avec vos clés Supabase et IA
   ```

   **Frontend (.env.local)**
   ```bash
   cd frontend
   cp .env.example .env.local
   # Remplir avec vos clés Supabase
   ```

3. **Démarrer en développement**
   ```bash
   npm run dev
   ```

## 🔧 Configuration

### Variables d'environnement Backend
```env
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key

# Intelligence Artificielle
GROK_API_KEY=your_grok_api_key
OPENAI_API_KEY=your_openai_key

# Serveur
PORT=3001
NODE_ENV=development
```

---

Fait avec ❤️ par [Sami](https://github.com/yourusername)
