import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SavedView {
    @PrimaryGeneratedColumn("uuid")
    id: string
}