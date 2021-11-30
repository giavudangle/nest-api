import { IPostSearchBody } from './post-search-body.interface';

export interface IPostSearchResult {
  hits: {
    total: number;
    hits: Array<{
      _source: IPostSearchBody;
    }>;
  };
}
