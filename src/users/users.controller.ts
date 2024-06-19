import { Controller, Get, Post, Body, Delete, Param, Put, Res } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  async getUsers() {
    return this.userService.getUsers();
  }

  @Get('generate-pdf')
  async generateUsersPDF(@Res() res) {
    const pdfBuffer = await this.userService.generatePdf();
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=users.pdf',
    });
    res.send(pdfBuffer);
  }

  @Post()
  async addUser(@Body() userData: { name: string; email: string; phone: string; address: string }) {
    return this.userService.addUser(userData);  
  }

  @Put(':id')
  async editUser(@Param('id') userId: string, @Body() updatedData: { name?: string; email?: string; phone?: string; address?: string }) {
    return this.userService.editUser(userId, updatedData);
  }

  @Delete(':id')
  async deleteUser(@Param('id') userId: string) {
    return this.userService.deleteUser(userId);
  }

  @Get(':id')
  async getUserById(@Param('id') userId: string) {
    return this.userService.getUserById(userId);
  }
  
}
