import {
  Entity,
  Column,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinTable
} from "typeorm";
import { Topic } from "./Topic";
import { Employee } from "./Employee";
import { Schedule } from "./Schedule";

@Entity()
export class Plan {
  @PrimaryGeneratedColumn("increment")
  planId;

  @Column("varchar")
  name = "";

  @Column("text")
  description = "";
  // {name : "hrId"}
  @ManyToOne(type => Employee, employee => employee.plan)
  @JoinColumn()
  adminhr = "";

  @ManyToMany(type => Topic, topic => topic.plan)
  @JoinTable()
  topics = undefined;
  // { name: "trainerId" }
  @ManyToMany(type => Employee, employee => employee.plan)
  @JoinTable()
  Trainer = undefined;
  // { name: "traineeId" })
  // @ManyToMany(type => Employee, employee => employee.plan)
  // @JoinTable()
  // Trainee = undefined

  @OneToMany(type => Schedule, schedule => schedule.plan)
  schedule = undefined;
}
