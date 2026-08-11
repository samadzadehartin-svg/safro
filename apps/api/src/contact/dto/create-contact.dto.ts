import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";

export class CreateContactDto {
  @ApiProperty({ example: "Alex Morgan" })
  @IsString()
  @Length(2, 80)
  name: string;

  @ApiProperty({ example: "alex@example.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "We are visiting Paris for four days and want a premium itinerary." })
  @IsString()
  @Length(10, 2000)
  message: string;
}
