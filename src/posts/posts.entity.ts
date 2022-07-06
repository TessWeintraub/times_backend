import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({name: 'Posts'})
export class PostsEntity{
    @PrimaryGeneratedColumn({type: 'integer'})
    id: number

    @Column()
    title: string

    @Column({type: 'text'})
    content: string

    @Column({type: 'text'})
    imageUrl: string

    @Column({type: 'text', array: true})
    tags: string[]

    @Column({type: 'integer', default: 0})
    views_count: number

    @Column({type: 'bigint' })
    date: number

    @Column({type: 'text', default: '45 min read'})
    timeRead: string

    @Column({type: 'integer'})
    userId: number
}