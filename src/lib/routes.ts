/**
 * ROUTES — constantes centralizadas de navegação (fonte única de verdade).
 * Lidas diretamente do registry REALMS, garantem sync entre roteador e script de gate.
 */

import { REALMS } from "./realms"

export const ROUTE_CREATIVE = REALMS.creative.route   // "/criativo"
export const ROUTE_DEVELOPER = REALMS.developer.route // "/desenvolvedor"
export const ROUTE_ARCANE = REALMS.arcane.route       // "/anfitriao"

export const ROUTE_PORTAL = "/portal"
export const ROUTE_ADMIN = "/admin"
