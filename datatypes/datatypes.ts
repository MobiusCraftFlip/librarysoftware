interface author {
    name: string
}

export interface bookType {
    _id: string,
    name: string
    authors: string[]
    isbn10: number
    isbn13: number
}