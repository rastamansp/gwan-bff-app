import { Injectable } from "@nestjs/common";
import { Hello } from "../../domain/entities/hello.entity";
import { IHelloRepository } from "../../domain/repositories/hello.repository";

@Injectable()
export class HelloRepositoryImpl implements IHelloRepository {
  async findById(id: string): Promise<Hello | null> {
    throw new Error("Method not implemented.");
  }

  async findAll(): Promise<Hello[]> {
    throw new Error("Method not implemented.");
  }

  async create(data: Partial<Hello>): Promise<Hello> {
    throw new Error("Method not implemented.");
  }

  async update(id: string, data: Partial<Hello>): Promise<Hello> {
    throw new Error("Method not implemented.");
  }

  async delete(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
