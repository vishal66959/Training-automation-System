import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { Plan } from "./Plan";
import { Day } from "./Day";

@Entity()
export class Topic {
  @PrimaryGeneratedColumn("increment")
  topicId = undefined;

  @Column("varchar")
  topicName = "";

  @Column("float")
  duration = undefined;

  @Column("varchar")
  attachment = "";

  @Column("text")
  description = "";

  @ManyToMany(type => Plan, plan => plan.topics)
  plan = undefined;

  @ManyToMany(type => Day, day => day.topics)
  day = undefined;
}
