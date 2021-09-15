import {
  Entity,
  ManyToMany,
  JoinTable,
  ManyToOne,
  PrimaryColumn,
  JoinColumn
} from "typeorm";
import { Schedule } from "./Schedule";
import { Topic } from "./Topic";

@Entity()
export class Day {
  @PrimaryColumn("int")
  dayNumber = undefined;

  @PrimaryColumn("int")
  scheduleId = undefined;

  @ManyToMany(type => Topic, topic => topic.day)
  @JoinTable()
  topics = undefined;

  @ManyToOne(type => Schedule, schedule => schedule.day, { primary: true })
  @JoinColumn({ name: "scheduleId" })
  schedule = undefined;
}
