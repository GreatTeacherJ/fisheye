<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

## Structure du projet

**Next.js 16.3 + React 19 + Prisma SQLite** (app pédagogique pour photographes)

- **App frontend** : `fisheye/` (Next.js App Router, TypeScript)
- **Base de données** : SQLite local `prisma/dev.db` (Photographer + Media models)
- **Accès données** : `src/app/lib/prisma-db.js` — 4 requêtes prédéfinies
- **Entrypoint** : `src/app/page.tsx`
- **Root README** : voir `../README.md` pour setup Prisma complet et détails schema

---

## Commandes développeur

Exécutez **depuis `fisheye/`** :

```bash
npm run dev           # Démarrer dev server (http://localhost:3000)
npm run build         # Build production
npm run start         # Démarrer serveur production
npm run lint          # Linter avec ESLint (Next.js + TypeScript rules)
```

**Prisma** (depuis racine `Mission_FishEye/` ou depuis `fisheye/`) :

```bash
npx prisma migrate dev --name <nom>  # Créer/appliquer migration après schema.prisma change
npx prisma db seed                   # ⚠️  Injecter données JSON (UNE SEULE FOIS, ne pas rejouer)
npx prisma studio                    # GUI pour explorer DB
```

---

## Installation & Base de données

**Setup initial** (une seule fois) :

1. **Schema Prisma** : voir `prisma/schema.prisma` (Photographer, Media models)
2. **Migration** : `npx prisma migrate dev --name init` → crée `dev.db`
3. **Seed** : `npx prisma db seed` → insère data depuis `data/photographer.json` et `data/media.json`
4. **Vérifier** : `npx prisma studio` pour consulter DB

**Important** :
- `DATABASE_URL` = `file:./dev.db` (voir `.env`)
- Seed = une seule exécution. Pour réinitialiser : supprimer `prisma/dev.db` et relancer migrate + seed.
- Données disponibles : 8 photographes + leurs médias (images/vidéos)

---

## Conventions de code

**Path alias** : `@/*` → `./src/*`
- Utiliser `import { foo } from '@/app/lib/prisma-db'` au lieu de `../../../`

**Couche données** : `src/app/lib/prisma-db.js`
- Requêtes prédéfinies : `getAllPhotographers()`, `getPhotographer(id)`, `getAllMediasForPhotographer(photographerId)`, `updateNumberOfLikes(mediaId, newNumberOfLikes)`
- Appeler directement depuis Server Components

**TypeScript** :
- Mode strict activé
- Types résolus : `@types/react`, `@types/react-dom`, `@types/node`
- Fichiers composants : `.tsx`

---

## Schema & Requêtes

**Models** (voir `prisma/schema.prisma`) :

**Photographer** : id, name, city, country, tagline, price, portrait, medias[]
**Media** : id, title, image?, video?, likes, date, price, photographer (FK)

**Requêtes disponibles** (dans `src/app/lib/prisma-db.js`) :
```javascript
getAllPhotographers()                          // → Photographer[]
getPhotographer(id: number)                    // → Photographer | null
getAllMediasForPhotographer(photographerId)    // → Media[]
updateNumberOfLikes(mediaId, newLikes)         // → Media (updated)
```

---

## Gotchas

- **Seed one-time** : Ne relancer `npx prisma db seed` qu'après suppression de `dev.db`
- **Node ESM** : `package.json` a `"type": "module"` ; les imports CommonJS classiques ne marchent pas
- **Données publiques** : Tous les fichiers `/public/*` sont servis statiquement (images/vidéos)
- **Images assets** : Placer les fichiers dans `public/` pour les référencer avec `next/image`
