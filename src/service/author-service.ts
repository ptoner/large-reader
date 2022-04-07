import { Author } from "../dto/author";
import { injectable } from "inversify";
import { AuthorRepository } from "../repository/author-repository";


@injectable()
class AuthorService {

  db: any

  constructor(
    private authorRepository: AuthorRepository
  ) { }

  async get(_id: string): Promise<Author> {
    return this.authorRepository.get(_id)
  }

  getDisplayName(author: Author): string {

    if (!author) return
    if (author.name) return author.name

    return "..." + author._id.slice(author._id.length - 10) //shorten

  }


}


export { AuthorService }

