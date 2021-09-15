import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable
} from "typeorm";
import { Plan } from "./Plan";
import { Employee } from "./Employee";
import { Day } from "./Day";

@Entity()
export class Schedule {
  @PrimaryGeneratedColumn("increment")
  scheduleId = undefined;

  @Column("varchar")
  name = "";

  @Column("date")
  date = undefined;

  @ManyToOne(type => Plan, plan => plan.schedule)
  @JoinColumn({ name: "planId" })
  plan = Plan;

  @ManyToMany(type => Employee, employee => employee.schedule)
  @JoinTable()
  Trainer = undefined;
  // { name: "trainerSchedules" }
  @ManyToMany(type => Employee, employee => employee.schedule)
  @JoinTable()
  Trainee = undefined;
  // { name: "traineeSchedules" }
  @OneToMany(type => Day, day => day.topics)
  day = undefined;
}
