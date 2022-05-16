export type TMDBCredits = {
  id: string,
  cast: {
    name: string,
    order: number
  }[],
  crew: {
    name: string,
    job: string,
    department: string
  }[]
}