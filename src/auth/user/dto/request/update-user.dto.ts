import { IsOptional, IsString } from "class-validator";

export class UpdateUserDto{
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  location?: string;
}