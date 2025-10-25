# Guide de déploiement - Le Spot SUP

## 🌐 URL de production
**https://lespotsup.freeddns.org**

## 📦 Build de production

### 1. Construire le site

```bash
npm run build
```

Cela générera un site statique dans le dossier `/out`.

### 2. Vérifier le build localement

```bash
# Installer serve si ce n'est pas déjà fait
npm install -g serve

# Tester le build en local
serve out
```

Le site sera disponible sur `http://localhost:3000`

## 🚀 Déploiement

### Option 1: Déploiement sur un serveur web (Apache, Nginx, etc.)

1. Uploadez le contenu du dossier `/out` vers votre serveur
2. Configurez votre serveur pour servir les fichiers statiques
3. Assurez-vous que le domaine `lespotsup.freeddns.org` pointe vers votre serveur

#### Configuration Nginx (exemple)

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name lespotsup.freeddns.org;

    # Redirection HTTP vers HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name lespotsup.freeddns.org;

    # Certificats SSL (Let's Encrypt recommandé)
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    root /var/www/lespotsup/out;
    index index.html;

    location / {
        try_files $uri $uri.html $uri/ =404;
    }

    # Cache des assets statiques
    location /_next/static {
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location /images {
        add_header Cache-Control "public, max-age=86400";
    }
}
```

#### Configuration Apache (exemple)

```apache
<VirtualHost *:80>
    ServerName lespotsup.freeddns.org
    Redirect permanent / https://lespotsup.freeddns.org/
</VirtualHost>

<VirtualHost *:443>
    ServerName lespotsup.freeddns.org
    DocumentRoot /var/www/lespotsup/out

    SSLEngine on
    SSLCertificateFile /path/to/certificate.crt
    SSLCertificateKeyFile /path/to/private.key

    <Directory /var/www/lespotsup/out>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted

        # Redirection pour les routes Next.js
        RewriteEngine On
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule ^(.*)$ /$1.html [L]
    </Directory>

    # Cache des assets
    <Directory /var/www/lespotsup/out/_next/static>
        Header set Cache-Control "public, max-age=31536000, immutable"
    </Directory>
</VirtualHost>
```

### Option 2: Déploiement sur Vercel (recommandé)

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter à Vercel
vercel login

# Déployer
vercel --prod
```

**Note:** Avec Vercel, vous devrez configurer le domaine custom `lespotsup.freeddns.org` dans les paramètres du projet.

### Option 3: Déploiement sur Netlify

1. Connectez votre repository Git à Netlify
2. Configuration de build :
   - **Build command:** `npm run build`
   - **Publish directory:** `out`
3. Ajoutez le domaine custom `lespotsup.freeddns.org` dans les paramètres

### Option 4: Déploiement sur GitHub Pages

```bash
# Ajouter le script de déploiement dans package.json
"scripts": {
  "deploy": "npm run build && gh-pages -d out"
}

# Installer gh-pages
npm install --save-dev gh-pages

# Déployer
npm run deploy
```

## 🔒 Configuration SSL/HTTPS

Pour activer HTTPS sur `lespotsup.freeddns.org`, utilisez **Let's Encrypt** (gratuit) :

```bash
# Sur un serveur Linux avec Certbot
sudo certbot --nginx -d lespotsup.freeddns.org

# Ou pour Apache
sudo certbot --apache -d lespotsup.freeddns.org
```

## 🌍 Configuration DNS

Assurez-vous que votre DNS FreeDNS pointe vers votre serveur :

- **Type:** A
- **Nom:** lespotsup
- **Valeur:** [VOTRE_IP_SERVEUR]

Ou si vous utilisez un service cloud :
- **Type:** CNAME
- **Nom:** lespotsup
- **Valeur:** [URL_DU_SERVICE_CLOUD]

## ✅ Vérification post-déploiement

Après le déploiement, vérifiez :

1. ✓ Le site est accessible sur https://lespotsup.freeddns.org
2. ✓ Toutes les pages se chargent correctement
3. ✓ Les redirections fonctionnent
4. ✓ Le certificat SSL est valide
5. ✓ Le localStorage fonctionne (testez login/logout)
6. ✓ La carte interactive se charge
7. ✓ Les formulaires fonctionnent

## 🔄 Mise à jour du site

```bash
# 1. Faire les modifications
# 2. Reconstruire
npm run build

# 3. Redéployer le dossier /out
```

## 📊 Analytics (optionnel)

Pour suivre les visiteurs, vous pouvez ajouter :
- Google Analytics
- Plausible Analytics (respect de la vie privée)
- Umami Analytics (auto-hébergé)

Ajoutez le script dans `src/app/layout.tsx`.

## 🐛 Dépannage

### Le site ne se charge pas
- Vérifiez que le dossier `/out` est bien uploadé
- Vérifiez la configuration du serveur web
- Vérifiez les logs du serveur

### Erreur 404 sur les routes
- Configurez la réécriture d'URL (voir exemples Nginx/Apache)
- Vérifiez que `output: 'export'` est dans `next.config.js`

### Le localStorage ne fonctionne pas
- Vérifiez que HTTPS est activé
- Vérifiez les paramètres de cookies du navigateur

## 📝 Notes importantes

- Le site utilise **localStorage** pour stocker les données
- Aucune base de données backend n'est requise
- Les données sont stockées localement dans le navigateur de chaque utilisateur
- Pour un système multi-utilisateurs en production, envisagez d'intégrer Firebase ou une autre solution backend
