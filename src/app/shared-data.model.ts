export interface UserData {
  Id: number;
  Admin: number;
  Usuario: String;
  Contrasena: String;
  expiresAt: Date;
  Desabilitada?: number;
  VIP?: number;
}
