import { Injectable } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { Post } from "../../posts/entities/post.entity";
import { IPostSearchBody } from "../../posts/types/post-search-body.interface";
import { IPostSearchResult } from "../../posts/types/post-search-result.interface";

@Injectable()
export class PostsSearchService {
    private readonly SEARCH_INDEX = 'posts'

    constructor(private readonly elasticsearchService: ElasticsearchService) {

    }

    async indexPost(post: Post) {
        return this.elasticsearchService.index<IPostSearchResult, IPostSearchBody>({
            index: this.SEARCH_INDEX,
            body: {
                id: post.id,
                title: post.title,
                content: post.content,
                authorId: post.author.id
            }
        })
    }

    async search(text: string) {
        console.log(text)
        const { body } = await this.elasticsearchService.search<IPostSearchResult>({
            index: this.SEARCH_INDEX,
            body: {
                query: {
                    multi_match: {
                        query: text,
                        fields: ['title', 'content']
                    }
                }
            }
        })
        const hits = body.hits.hits;
        return hits.map((item) => item._source)
    }
    
    async remove(postId : number){
        this.elasticsearchService.deleteByQuery({
            index:this.SEARCH_INDEX,
            body:{
                query:{
                    match:{
                        id:postId
                    }
                }
            }
        })
    }

    async update(post:Post){
        const newBody: IPostSearchBody = {
            id:post.id,
            title:post.title,
            content:post.content,
            authorId:post.author.id
        }
        console.log(Object.entries(newBody))
        const script = Object.entries(newBody).reduce((result,[key,value]) => {
            console.log(`${result} ctx._source.${key}='${value}';`)
            return `${result} ctx._source.${key}='${value}';`;
        },'')
        console.log(script)

        return this.elasticsearchService.updateByQuery({
            index:this.SEARCH_INDEX,
            body:{
                query:{
                    match:{
                        id:post.id
                    }
                },
                script:{
                    inline:script
                }
            }
        })


    }

    

}