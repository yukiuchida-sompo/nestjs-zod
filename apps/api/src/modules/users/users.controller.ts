import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UsePipes,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { UsersService } from './users.service';
import {
  SearchUsersInputDto,
  CreateUserInputDto,
  UpdateUserInputDto,
  UserOutputDto,
  UserWithPostsOutputDto,
  UsersListOutputDto,
} from './users.dto';

@ApiTags('users')
@Controller('users')
@UsePipes(ZodValidationPipe)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('search')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Search users with complex filters' })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of users matching the search criteria',
    type: UsersListOutputDto,
  })
  async search(@Body() searchDto: SearchUsersInputDto): Promise<UsersListOutputDto> {
    return this.usersService.search(searchDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User details with posts',
    type: UserWithPostsOutputDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string): Promise<UserWithPostsOutputDto> {
    return this.usersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserOutputDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async create(@Body() createUserDto: CreateUserInputDto): Promise<UserOutputDto> {
    return this.usersService.create(createUserDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UserOutputDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserInputDto
  ): Promise<UserOutputDto> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 204, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.usersService.remove(id);
  }
}
