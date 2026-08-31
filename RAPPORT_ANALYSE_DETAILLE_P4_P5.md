# RAPPORT DÉTAILLÉ D'ANALYSE - POINTS 4 ET 5

**Date:** 29 août 2026  
**Projet:** FishEye (Next.js 16.3 + React 19 + TypeScript)  
**Scope:** Types dupliqués et inconsistance du casing des dossiers composants

---

## TABLE DES MATIÈRES

1. [Point 4 : Types dupliqués et mal organisés](#point-4--types-dupliqués-et-mal-organisés)
2. [Point 5 : Inconsistance du casing des dossiers composants](#point-5--inconsistance-du-casing-des-dossiers-composants)
3. [Résumé concis et recommandations](#résumé-concis-et-recommandations)

---

## POINT 4 : Types dupliqués et mal organisés

### Problème identifié

Vous avez **plusieurs interfaces `Photographer` définies à différents endroits** au lieu d'avoir une source unique de vérité. C'est problématique car :

- **Risque de désynchronisation** : si le schema Prisma change, vous devez mettre à jour dans 2 places
- **Mauvaise maintenabilité** : changement fragmenté et source d'erreurs
- **Duplication de code** : violation du principe DRY

---

### Endroits où le type `Photographer` est défini

#### 1. Dans `photographHeader.tsx` (lignes 7-15) ❌ DÉDOUBLÉ

```typescript
interface Photographer {
    name: string;
    city: string;
    country: string;
    tagline: string;
    portrait: string;
    id: number;
    price: number;
}
```

**Problème :** Cette interface est redéfinie alors qu'elle existe déjà dans Prisma.

---

#### 2. Disponible dans Prisma (package `@prisma/client`) ✅ CORRECT

```typescript
import type { Photographer } from "@prisma/client";
```

**Utilisation correcte dans :**
- `PhotographerCard.tsx` (ligne 3)
- `TagPhotographer.tsx` (import implicite via getAllPhotographers)

---

### Tableau récapitulatif des types actuels

| Fichier | Type/Interface | Source | Statut |
|---------|---|---|---|
| `photographHeader.tsx` | `Photographer` | Défini localement (7-15) | ❌ **DÉDOUBLÉ** |
| `PhotographerCard.tsx` | `Photographer` | Import Prisma ✅ | ✅ CORRECT |
| `TagPhotographer.tsx` | `Photographer` | Import Prisma ✅ | ✅ CORRECT |
| `Gallery.tsx` | `Media`, `Medias` | `Media` importé Prisma ✅, `Medias` local | ⚠️ PARTIEL |
| `GalleryModal.tsx` | `Media`, `GalleryModalProps` | `Media` importé Prisma ✅ | ✅ CORRECT |
| `ContactModal.tsx` | `ContactModalProps` | Défini localement | ✅ OK (props locale) |
| `PhotographerCard.tsx` | - | Props destructurées directement | ✅ CORRECT |

---

### Autre duplication : Interface `Medias` vs type `Media`

#### Dans `Gallery.tsx` (lignes 9-12)

```typescript
interface Medias {
    initialMedias: Media[];
    price: number;
}
```

**Problèmes :**
1. Le nom `Medias` (pluriel) pour les **props** n'est pas explicite
2. Convention React : devrait s'appeler `GalleryProps` ou `GalleryComponentProps`
3. Confusion : `Medias` (pluriel) vs `Media` (singulier importé de Prisma)

**Exemple d'utilisation :**
```typescript
export default function Gallery({ initialMedias, price }: Medias) {
```

**Meilleure approche :**
```typescript
interface GalleryProps {
    initialMedias: Media[];
    price: number;
}

export default function Gallery({ initialMedias, price }: GalleryProps) {
```

---

### Autres types bien structurés ✅

#### Contact Modal - `ContactModal.tsx` (lignes 6-8)

```typescript
interface ContactModalProps {
    photographerName: string;
    onClose: () => void;
}
```

**Status :** ✅ **CORRECT**
- Suffixe `Props` respecté
- Interface spécifique au composant
- Pas de duplication

---

#### Gallery Modal - `GalleryModal.tsx` (lignes 5-8)

```typescript
interface GalleryModalProps {
    medias: Media[];
    onClose: () => void;
    indexClicked: number;
}
```

**Status :** ✅ **CORRECT**
- Suffixe `Props` respecté
- Interface spécifique au composant
- Type `Media` importé de Prisma

---

### Comment ça DEVRAIT être organisé

#### Structure recommandée

**Option 1 : Types métier dans `src/types/index.ts`**

```typescript
// src/types/index.ts
// Types custom, extensions, enums spécifiques à votre métier

export interface SortOption {
    value: string;
    label: string;
}

export interface LikesState {
    [mediaId: number]: boolean;
}

export interface FormValidationErrors {
    [fieldName: string]: string;
}
```

**Option 2 : Types Prisma importés directement**

```typescript
// Dans chaque composant
import type { Photographer, Media } from "@prisma/client";
```

**Option 3 : Props-interfaces au niveau composant (local)**

```typescript
// src/app/components/PhotographHeader/PhotographHeader.tsx
import type { Photographer } from "@prisma/client";

interface PhotographHeaderProps {
    photographer: Photographer;  // ✅ Importe depuis Prisma
}

export default function PhotographHeader({ photographer }: PhotographHeaderProps) {
    // ...
}
```

---

### Approche idéale : Exemple complet

**AVANT (Actuellement - `photographHeader.tsx`):**

```typescript
"use client";

import styles from "./photographHeader.module.css";
import ContactModal from "../ContactModal/ContactModal";
import { useState } from "react";

interface Photographer {
    name: string;
    city: string;
    country: string;
    tagline: string;
    portrait: string;
    id: number;
    price: number;
}

interface PhotographerProps {
    photographer: Photographer;
}

export default function PhotographHeader({ photographer }: PhotographerProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    // ...
}
```

**APRÈS (Ce qu'il FAUDRAIT faire):**

```typescript
"use client";

import styles from "./photographHeader.module.css";
import ContactModal from "../ContactModal/ContactModal";
import { useState } from "react";
import type { Photographer } from "@prisma/client";  // ✅ Import Prisma

interface PhotographHeaderProps {
    photographer: Photographer;
}

export default function PhotographHeader({ photographer }: PhotographHeaderProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    // ...
}
```

**Changements :**
- ❌ Suppression de l'interface `Photographer` dupliquée (lignes 7-15)
- ✅ Ajout : `import type { Photographer } from "@prisma/client"`
- ✅ Renommage : `PhotographerProps` au lieu de juste `Props`

---

### Impact réel : Imports actuels vs cohérents

**Actuellement (mélange de conventions):**

```typescript
// Page ou autre composant
import Header from "@/app/components/header/header";               
import PhotographHeader from "@/app/components/photographHeader/photographHeader";  
import Gallery from "@/app/components/Gallery/Gallery";           
import ContactModal from "@/app/components/ContactModal/ContactModal";
```

**Types utilisés mélangés :**
- Photographer dédoublé (photographHeader)
- Photographer importé (PhotographerCard)
- Media importé (Gallery)
- Medias interface locale (Gallery)

---

## POINT 5 : Inconsistance du casing des dossiers composants

### Structure actuelle

```
src/app/components/
├── ContactModal/          ✅ PascalCase
├── Gallery/              ✅ PascalCase
├── GalleryModal/         ✅ PascalCase
├── header/               ❌ lowercase
├── PhotographerCard/     ✅ PascalCase
├── photographHeader/     ❌ camelCase (devrait être "PhotographHeader")
└── TagPhotographer/      ✅ PascalCase
```

---

### Le problème : 2 conventions mélangées

| Dossier | Fichier | Composant | Convention | Statut |
|---------|---------|-----------|---|---|
| `header/` | `header.tsx` | `Header` | ❌ Mismatch | Dossier ≠ Composant |
| `photographHeader/` | `photographHeader.tsx` | `PhotographHeader` | ❌ camelCase rare | Dossier ≠ Composant |
| `ContactModal/` | `ContactModal.tsx` | `ContactModal` | ✅ PascalCase | OK |
| `Gallery/` | `Gallery.tsx` | `Gallery` | ✅ PascalCase | OK |
| `GalleryModal/` | `GalleryModal.tsx` | `GalleryModal` | ✅ PascalCase | OK |
| `PhotographerCard/` | `PhotographerCard.tsx` | `PhotographerCard` | ✅ PascalCase | OK |
| `TagPhotographer/` | `TagPhotographer.tsx` | `TagPhotographer` | ✅ PascalCase | OK |

**Résultat :** 5/7 dossiers en PascalCase, 2 en convention différente

---

### Pourquoi c'est un problème

1. **Inconsistance visuelle** : en explorant les dossiers, on se demande pourquoi 2 sont différents
2. **Navigation difficile** : `header` vs `Header` vs `photographHeader` demande mémorisation extra
3. **Convention Next.js** : dans la plupart des projets React/Next.js, les composants = PascalCase (dossier = composant)
4. **Maintenabilité** : un nouveau dev se demandera quelle convention suivre
5. **Typo potentielle** : `photographHeader` (camelCase très rare) crée une asymétrie déconcertante

---

### Cas d'usage des deux conventions

#### Option A : Dossier = nom du composant (✅ Recommandé - React standard)

```
src/app/components/
├── Header/             # ← dossier PascalCase
│   ├── Header.tsx      # ← composant
│   └── Header.module.css
├── PhotographHeader/   # ← dossier PascalCase
│   ├── PhotographHeader.tsx
│   └── PhotographHeader.module.css
├── Gallery/
│   ├── Gallery.tsx
│   └── Gallery.module.css
```

**Import :**
```typescript
import Header from "@/app/components/Header/Header";
import Gallery from "@/app/components/Gallery/Gallery";
```

---

#### Option B : Dossier kebab-case, composant PascalCase (valide mais moins courant)

```
src/app/components/
├── header/            # ← dossier kebab-case
│   ├── Header.tsx     # ← composant PascalCase
│   └── header.module.css
├── photo-header/      # ← dossier kebab-case
│   ├── PhotographHeader.tsx
│   └── photo-header.module.css
```

**Import :**
```typescript
import Header from "@/app/components/header/Header";
import PhotographHeader from "@/app/components/photo-header/PhotographHeader";
```

---

#### Votre code = mélange les deux = ❌ Problématique

- `header/` : lowercase (Option B partiellement)
- `photographHeader/` : camelCase (Option B partiellement, MAIS camelCase très rare)
- Autres : PascalCase (Option A)

**Verdict :** Inconsistance complète

---

### Détails sur chaque dossier problématique

#### 1. `header/` folder

**Chemin :** `src/app/components/header/`

**Contenu :**
- Dossier: `header` (lowercase)
- Fichier: `header.tsx` (lowercase)
- Composant export: `Header` (PascalCase)

**Code (`src/app/components/header/header.tsx`):**

```typescript
export default function Header({ onText }: Props) {
    return (
        <Link href="/" aria-label="Allez à la page principal">
            <header className={styles.header}>
                <img src="/iconFisheye.svg" />
                {onText ? <h1 className={styles.title}>Nos photographes</h1> : <></>}
            </header>
        </Link>
    );
}
```

**Problème :** Dossier = `header` (lowercase), Composant = `Header` (PascalCase)

**Import ailleurs :**

```typescript
import Header from "@/app/components/header/header";  // ❌ Chemin = lowercase
```

**Anomalie visuelle :**
```
@/app/components/header/header  <- tout lowercase
BUT
function Header              <- PascalCase
```

---

#### 2. `photographHeader/` folder

**Chemin :** `src/app/components/photographHeader/`

**Contenu :**
- Dossier: `photographHeader` (camelCase - très rare!)
- Fichier: `photographHeader.tsx` (camelCase)
- Composant export: `PhotographHeader` (PascalCase)

**Code (`src/app/components/photographHeader/photographHeader.tsx`):**

```typescript
export default function PhotographHeader({ photographer }: PhotographerProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    // ...
}
```

**Problème :** camelCase TRÈS RARE pour un dossier composant React

**Import ailleurs :**

```typescript
import PhotographHeader from "@/app/components/photographHeader/photographHeader";
```

**Anomalies visuelles :**
1. `photographHeader` en camelCase (très rare)
2. `PhotographHeader` en PascalCase (standard)
3. Inconsistance avec tous les autres composants
4. Typo potentielle : confusionnable avec `PhotographerHeader`

---

### Tableau comparatif : Problèmes par dossier

| Dossier | Fichier | Composant | Cas d'usage | Sévérité |
|---------|---------|-----------|---|---|
| `header` | `header.tsx` | `Header` | Mismatch case | ⚠️ **MOYEN** |
| `photographHeader` | `photographHeader.tsx` | `PhotographHeader` | camelCase rare + mismatch | ❌ **HAUT** |
| `ContactModal` | `ContactModal.tsx` | `ContactModal` | ✅ Cohérent | ✅ **CORRECT** |
| `Gallery` | `Gallery.tsx` | `Gallery` | ✅ Cohérent | ✅ **CORRECT** |
| `GalleryModal` | `GalleryModal.tsx` | `GalleryModal` | ✅ Cohérent | ✅ **CORRECT** |
| `PhotographerCard` | `PhotographerCard.tsx` | `PhotographerCard` | ✅ Cohérent | ✅ **CORRECT** |
| `TagPhotographer` | `TagPhotographer.tsx` | `TagPhotographer` | ✅ Cohérent | ✅ **CORRECT** |

---

### Impact réel : Imports deviennent bizarres

**Actuellement (mélange complet):**

```typescript
// src/app/page.tsx ou [slug]/page.tsx
import Header from "@/app/components/header/header";               // ❌ lowercase
import PhotographHeader from "@/app/components/photographHeader/photographHeader";  // ❌ camelCase
import Gallery from "@/app/components/Gallery/Gallery";           // ✅ PascalCase
import ContactModal from "@/app/components/ContactModal/ContactModal";  // ✅ PascalCase
import PhotographerCard from "@/app/components/PhotographerCard/PhotographerCard";  // ✅ PascalCase
import TagPhotographer from "@/app/components/TagPhotographer/TagPhotographer";  // ✅ PascalCase
```

**Lecture difficile :** l'œil détecte l'inconsistance

---

**Si on standardisait en PascalCase (ce qu'il FAUDRAIT faire):**

```typescript
import Header from "@/app/components/Header/Header";               // ✅ Cohérent
import PhotographHeader from "@/app/components/PhotographHeader/PhotographHeader";  // ✅ Cohérent
import Gallery from "@/app/components/Gallery/Gallery";           // ✅ Cohérent
import ContactModal from "@/app/components/ContactModal/ContactModal";  // ✅ Cohérent
import PhotographerCard from "@/app/components/PhotographerCard/PhotographerCard";  // ✅ Cohérent
import TagPhotographer from "@/app/components/TagPhotographer/TagPhotographer";  // ✅ Cohérent
```

**Lecture facile :** pattern cohérent partout

---

## RÉSUMÉ CONCIS ET RECOMMANDATIONS

### Récapitulatif Point 4 : Types dupliqués

**État actuel :**
- ❌ Interface `Photographer` redéfinie dans `photographHeader.tsx` (lignes 7-15)
- ✅ Autres composants font correctement : importent depuis `@prisma/client`
- ✅ `ContactModalProps` et `GalleryModalProps` bien structurées
- ⚠️ Interface `Medias` dans `Gallery.tsx` confuse (devrait être `GalleryProps`)

**Actions recommandées :**

1. **Dans `photographHeader.tsx` :**
   - ❌ Supprimer interface `Photographer` (lignes 7-15)
   - ✅ Ajouter : `import type { Photographer } from "@prisma/client"`
   - ✅ Renommer `Props` → `PhotographHeaderProps`

2. **Dans `Gallery.tsx` :**
   - ⚠️ Renommer `Medias` → `GalleryProps` (meilleure convention)

3. **Créer `src/types/index.ts` (optionnel mais recommandé) :**
   - Types custom, enums, interfaces métier
   - Types Prisma = importer depuis `@prisma/client`

---

### Récapitulatif Point 5 : Casing des dossiers

**État actuel :**
- ❌ `header/` en lowercase (attendrait `Header/`)
- ❌ `photographHeader/` en camelCase (très rare, attendrait `PhotographHeader/`)
- ✅ 5/7 dossiers en PascalCase

**Actions recommandées :**

1. **Renommer `header/` → `Header/`**
   - Fichier : `header.tsx` → `Header.tsx`
   - Module CSS : `header.module.css` → `Header.module.css`

2. **Renommer `photographHeader/` → `PhotographHeader/`**
   - Dossier : `photographHeader/` → `PhotographHeader/`
   - Fichier : `photographHeader.tsx` → `PhotographHeader.tsx`
   - Module CSS : `photographHeader.module.css` → `PhotographHeader.module.css`

3. **Mettre à jour tous les imports :**
   - `import Header from "@/app/components/header/header"` → `import Header from "@/app/components/Header/Header"`
   - `import PhotographHeader from "@/app/components/photographHeader/photographHeader"` → `import PhotographHeader from "@/app/components/PhotographHeader/PhotographHeader"`

---

### Checklist de correction

**Point 4 :**
- [ ] Supprimer `Photographer` interface de `photographHeader.tsx`
- [ ] Ajouter `import type { Photographer } from "@prisma/client"` dans `photographHeader.tsx`
- [ ] Renommer `Props` → `PhotographHeaderProps` dans `photographHeader.tsx`
- [ ] Renommer `Medias` → `GalleryProps` dans `Gallery.tsx`
- [ ] *(Optionnel)* Créer `src/types/index.ts` pour types custom

**Point 5 :**
- [ ] Renommer dossier `header/` → `Header/`
- [ ] Renommer fichier `header/header.tsx` → `Header/Header.tsx`
- [ ] Renommer fichier `header/header.module.css` → `Header/Header.module.css`
- [ ] Renommer dossier `photographHeader/` → `PhotographHeader/`
- [ ] Renommer fichier `photographHeader/photographHeader.tsx` → `PhotographHeader/PhotographHeader.tsx`
- [ ] Renommer fichier `photographHeader/photographHeader.module.css` → `PhotographHeader/PhotographHeader.module.css`
- [ ] Mettre à jour imports dans `src/app/page.tsx`
- [ ] Mettre à jour imports dans `src/app/[slug]/page.tsx`
- [ ] Mettre à jour imports dans autres composants (si applicable)

---

### Impact attendu après correction

**Avant :**
- Types dupliqués = risque de désynchronisation
- Casing inconsistant = confusion pour nouveaux devs
- Imports mélangés = lecture difficile

**Après :**
- Source unique de vérité pour types (Prisma)
- Convention cohérente PascalCase partout
- Imports clairs et prévisibles
- Maintenabilité améliorée
- Onboarding de nouveaux devs plus facile

---

**Fin du rapport détaillé - Points 4 et 5**
