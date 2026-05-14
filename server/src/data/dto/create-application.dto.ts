import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
  IsBoolean,
  ValidateIf,
  IsDateString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

// Helper regex
const NAME_REGEX = /^[A-Za-z\s'-]+$/;
const PHONE_REGEX = /^(09\d{9}|\+639\d{9})$/;

export class CreateApplicationDto {
  // ---------------------------
  // Application Type
  // ---------------------------
  @IsNotEmpty()
  @IsString()
  @IsEnum(['ojt', 'job', 'other'], {
    message: 'application_type must be ojt, job, or other',
  })
  application_type?: 'ojt' | 'job' | 'other';

  @IsOptional()
  @IsString()
  other_application_type?: string | null;

  // ---------------------------
  // Personal Info
  // ---------------------------
  @IsNotEmpty()
  @Matches(NAME_REGEX, {
    message: 'First name must contain only letters',
  })
  first_name?: string;

  @IsNotEmpty()
  @Matches(NAME_REGEX, {
    message: 'Last name must contain only letters',
  })
  last_name?: string;

  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;

  @Matches(PHONE_REGEX, {
    message: 'Phone must be PH format (09XXXXXXXXX or +639XXXXXXXXX)',
  })
  phone?: string;

  // ---------------------------
  // OJT Fields
  // ---------------------------
  @ValidateIf((o: CreateApplicationDto) => o.application_type === 'ojt')
  @IsOptional()
  @IsString()
  school_name?: string | null;

  @ValidateIf((o: CreateApplicationDto) => o.application_type === 'ojt')
  @IsOptional()
  @IsNumber()
  @Min(1, { message: 'Hours needed must be greater than 0' })
  @Type(() => Number)
  hours_needed?: number | null;

  @ValidateIf((o: CreateApplicationDto) => o.application_type === 'ojt')
  @IsOptional()
  @IsString()
  course?: string | null;

  @ValidateIf((o: CreateApplicationDto) => o.application_type === 'ojt')
  @IsOptional()
  @IsDateString({}, { message: 'Deployment date must be valid date' })
  deployment_date?: string | null;

  // ---------------------------
  // Job Fields
  // ---------------------------
  @ValidateIf((o: CreateApplicationDto) => o.application_type === 'job')
  @IsOptional()
  @IsString()
  position_applied?: string | null;

  @ValidateIf((o: CreateApplicationDto) => o.application_type === 'job')
  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Years of experience cannot be negative' })
  @Type(() => Number)
  years_experience?: number | null;

  @ValidateIf((o: CreateApplicationDto) => o.application_type === 'job')
  @IsOptional()
  @IsString()
  current_company?: string | null;

  @ValidateIf((o: CreateApplicationDto) => o.application_type === 'job')
  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Salary expectation must be 0 or higher' })
  @Type(() => Number)
  salary_expectation?: number | null;

  @ValidateIf((o: CreateApplicationDto) => o.application_type === 'job')
  @IsOptional()
  @IsDateString()
  available_date?: string | null;

  // ---------------------------
  // Agreement
  // ---------------------------
  @IsBoolean()
  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      return ['true', '1', 'on', 'yes'].includes(value.toLowerCase());
    }
    return false;
  })
  agreed_terms?: boolean;
}
