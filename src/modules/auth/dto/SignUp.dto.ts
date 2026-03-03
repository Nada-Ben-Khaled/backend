import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty({ example: 'Jean' })
  firstName: string;

  @ApiProperty({ example: 'Dupont' })
  lastName: string;

  @ApiProperty({ example: 'jean.dupont@example.com' })
  email: string;

  @ApiProperty({ example: 'SecurePass123!', minLength: 1 })
  password: string;

  @ApiProperty({ example: '674abc123def456789012345', description: 'MongoDB ObjectId of the role' })
  roleId: string;
}
