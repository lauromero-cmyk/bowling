// La API corre en el mismo computador que sirve la app, en el puerto 3000.
// Así funciona igual desde el PC (localhost) y desde el celular (IP del PC en el Wi-Fi).
export const API_URL = `${window.location.protocol}//${window.location.hostname}:3000/api`
