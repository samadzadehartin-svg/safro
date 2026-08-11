import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { ContactService } from "./contact.service";
import { CreateContactDto } from "./dto/create-contact.dto";

@ApiTags("contact")
@Controller("contact")
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @ApiCreatedResponse({ description: "Contact request accepted" })
  create(@Body() dto: CreateContactDto) {
    return this.contactService.create(dto);
  }

  @Get()
  @ApiOkResponse({ description: "Development-only list of received contact requests" })
  findAll() {
    return this.contactService.findAll();
  }
}
