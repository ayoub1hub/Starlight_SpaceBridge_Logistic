// src/app/core/services/keycloak.service.ts
import { Injectable } from '@angular/core';
import { KeycloakService as KeycloakAngularService } from 'keycloak-angular';
import { KeycloakInstance, KeycloakProfile, KeycloakTokenParsed } from 'keycloak-js';

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {

  constructor(
    private readonly keycloak: KeycloakAngularService
  ) {}

  // Initialise Keycloak (à appeler une seule fois au démarrage de l'app)
  async init(): Promise<boolean> {
    try {
      const initialized = await this.keycloak.init({
        config: {
          url: 'http://localhost:8079',                // URL de ton serveur Keycloak
          realm: 'ssl-realm',
          clientId: 'ssl-web',                         // ← différent du mobile (client web)
        },
        initOptions: {
          onLoad: 'check-sso',                         // essaie de récupérer une session existante
          checkLoginIframe: false,                     // souvent désactivé en dev
          silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
          pkceMethod: 'S256',                          // recommandé
          enableLogging: true,                         // utile en dev
        },
        // Optionnel : forcer le login si pas de session
        loadUserProfileAtStartUp: true,
        bearerExcludedUrls: [], // urls qui ne doivent PAS avoir le token Bearer
      });

      console.log('Keycloak initialisé avec succès');
      return initialized;
    } catch (error) {
      console.error('Erreur lors de l’initialisation de Keycloak', error);
      return false;
    }
  }

  // Lance le processus de login (ouvre la page Keycloak)
  async login(redirectUri?: string): Promise<void> {
    try {
      await this.keycloak.login({
        redirectUri: redirectUri || window.location.origin + '/',
        prompt: 'login',                // force l'affichage de la page de login
      });
    } catch (error) {
      console.error('Erreur lors du login Keycloak', error);
    }
  }

  // Déconnexion
  async logout(redirectUri?: string): Promise<void> {
    try {
      await this.keycloak.logout(redirectUri || window.location.origin + '/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion', error);
    }
  }

  // Vérifie si l'utilisateur est connecté
  isLoggedIn(): boolean {
    return this.keycloak.isLoggedIn();
  }

  // Récupère le token d'accès actuel (valide ou rafraîchi si nécessaire)
  async getToken(): Promise<string | undefined> {
    try {
      // Met à jour le token s'il est proche de l'expiration
      await this.keycloak.updateToken(30); // rafraîchit si < 30s restant
      return this.keycloak.getKeycloakInstance().token || undefined;
    } catch (error) {
      console.warn('Impossible de rafraîchir le token', error);
      return undefined;
    }
  }

  // Récupère le refresh token
  getRefreshToken(): string | undefined {
    return this.keycloak.getKeycloakInstance().refreshToken || undefined;
  }

  // Récupère les informations de l'utilisateur
  async getUserProfile(): Promise<KeycloakProfile | null> {
    try {
      return await this.keycloak.loadUserProfile();
    } catch (error) {
      console.error('Erreur lors du chargement du profil', error);
      return null;
    }
  }

  // Récupère les données décodées du token (roles, username, email, etc.)
  getTokenParsed(): KeycloakTokenParsed | undefined {
    return this.keycloak.getKeycloakInstance().tokenParsed;
  }

  // Exemple : récupérer les rôles de l'utilisateur
  getRoles(): string[] {
    const token = this.getTokenParsed();
    return (token?.realm_access?.roles || []) as string[];
  }

  // Vérifie si l'utilisateur a un rôle particulier
  hasRole(role: string): boolean {
    return this.getRoles().includes(role);
  }
}
