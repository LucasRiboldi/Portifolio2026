import { redirect } from "next/navigation"

/**
 * O Style Guide agora vive dentro do Design System, um por realm.
 *
 * Esta rota era o guia comic — ou seja, o guia do realm Criativo. Em vez de
 * apagá-la (links antigos e o menu apontavam para cá), ela redireciona para o
 * lugar novo. Um redirect permanente: a mudança é definitiva.
 */
export default function StyleguideRedirect() {
  redirect("/design-system/realms/creative")
}
