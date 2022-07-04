import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({name: 'Posts'})
export class PostsEntity{
    @PrimaryGeneratedColumn({type: 'integer'})
    id: number

    @Column()
    title: string

    // @Column({type: 'text'})
    // content: string
    //
    // @Column({type: 'text'})
    // imageUrl: string

    // @Column({type: 'array'})
    // tags: []

    // @Column({type: 'integer'})
    // userId: number
}