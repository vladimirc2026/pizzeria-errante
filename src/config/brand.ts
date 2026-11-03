// Identidad y datos de ERRANTE en UN solo lugar.
// WhatsApp, dirección y horario también se pueden cambiar desde Admin > Ajustes (sin redeplegar).
export const BRAND = {
  name: 'ERRANTE',
  tagline: 'Explorando sabores',
  currency: 'Bs',
  whatsapp: '59168609243',
  address: 'Calle Colomi #2078, entre calles Ayoma y Tablas, zona Jayhuayco, Cochabamba',
  hours: 'Consulta nuestro horario por WhatsApp',
  logo: '/logo.png',
  storageBucket: 'productos',
}
export const money = (n: number) => `${BRAND.currency} ${Number(n).toFixed(2).replace(/\.00$/, '')}`
