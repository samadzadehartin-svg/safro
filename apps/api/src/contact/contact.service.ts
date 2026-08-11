import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { CreateContactDto } from "./dto/create-contact.dto";

type ContactRequest = CreateContactDto & { id: string; createdAt: string };

@Injectable()
export class ContactService {
  private readonly requests: ContactRequest[] = [];

  create(dto: CreateContactDto) {
    const request: ContactRequest = {
      id: randomUUID(),
      ...dto,
      createdAt: new Date().toISOString(),
    };
    this.requests.unshift(request);
    return { accepted: true, id: request.id };
  }

  findAll() {
    return this.requests;
  }
}
