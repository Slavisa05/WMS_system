export interface User {
  id: number
  username: string
  ime: string
  prezime: string
  pozicija: {
    id: number
    naziv: string
  } | null
}