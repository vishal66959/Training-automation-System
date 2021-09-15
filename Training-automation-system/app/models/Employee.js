import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany
} from "typeorm";
import { Plan } from "./Plan";
import { Schedule } from "./Schedule";

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  employeeId = undefined;

  @Column({ type: "varchar", unique: true })
  email = "";

  @Column("varchar")
  designation = "employee";

  @Column("text")
  accessToken = "";

  @Column("text")
  refreshToken = "";

  @Column("varchar")
  firstName = "";

  @Column("varchar")
  lastName = "";

  @OneToMany(type => Plan, plan => plan.adminhr)
  adminPlan = undefined;

  @ManyToMany(type => Plan, plan => plan.planTrainer)
  trainerPlan = undefined;

  // @ManyToMany(type => Plan, plan => plan.planTrainee)
  // plan= undefined

  @ManyToMany(type => Schedule, schedule => schedule.shceduleTrainer)
  trainerSchedule = undefined;

  @ManyToMany(type => Schedule, schedule => schedule.shceduleTrainee)
  traineeSchedule = undefined;
}
