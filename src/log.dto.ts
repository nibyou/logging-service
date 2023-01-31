import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AuthUser } from '@nibyou/types';

export class User {
  @ApiProperty()
  userId: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  lastName: string;
  @ApiProperty({
    type: () => [String],
  })
  roles: string[];

  static fromAuthUser(a: AuthUser) {
    const u = new User();
    u.userId = a.userId;
    u.email = a.email;
    u.firstName = a.given_name;
    u.lastName = a.family_name;
    u.roles = a.realm_access.roles;

    return u;
  }

  static toStreamVars(u: User) {
    return {
      subject_userId: u.userId,
      subject_email: u.email,
      subject_name: JSON.stringify({
        firstName: u.firstName,
        lastName: u.lastName,
      }),
      subject_roles: JSON.stringify(u.roles),
    };
  }
}

/**
 * Stream and LogLines described in https://grafana.com/docs/loki/latest/api/#push-log-entries-to-loki
 */
export class LogDto {
  @ApiPropertyOptional({
    type: () => User,
    description:
      'The user logging this request, if undefined => get user from authorization header',
  })
  subject?: User;
  @ApiPropertyOptional({
    type: Object,
    description: 'Add additional queryable info to log entry',
  })
  stream?: Record<string, string>;
  @ApiProperty({
    description: 'Subject application',
    examples: [
      'app.nibyou.com',
      'app.dev.nibyou.com',
      'onboarding.nibyou.com',
      'web.nibyou.com',
    ],
  })
  application: string;
  @ApiProperty({
    type: () => [String],
    description: 'The strings to log to the Loki server, these are not indexed',
  })
  logLines: string[];
  @ApiPropertyOptional({
    description:
      'Full request URI that the log was sent from, if undefined => req.headers.referer',
  })
  uri?: string;
  @ApiPropertyOptional({
    description: 'A queryable action',
  })
  action?: string;
}
