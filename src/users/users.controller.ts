import { Controller, Get, Post, Body, Delete, Param, Put, NotFoundException, Res } from '@nestjs/common';
import { FirebaseAdminService } from 'src/firebase-admin.service';
import { PDFDocument, rgb } from 'pdf-lib'

@Controller('users')
export class UsersController {
  constructor(private readonly firebaseAdminService: FirebaseAdminService) {}

  @Get()
  async getUsers() {
    const firestore = this.firebaseAdminService.getFirestore();
    const usersSnapshot = await firestore.collection('users').get();
    const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return users;
  }

  @Get('generate-pdf')
  async generateUsersPDF(@Res() res) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([400, 600]);
    const { width, height } = page.getSize();

    // Draw text on the PDF
    page.drawText('Hello, PDF!', {
      x: 50,
      y: height - 100,
      size: 24,
      color: rgb(0, 0, 0), // Black color
    });

    // Generate PDF bytes
    const pdfBytes = await pdfDoc.save();

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="users.pdf"');

    // Send PDF bytes as response
    res.send(pdfBytes)
  }

  @Post()
  async addUser(@Body() userData: { name: string; email: string; phone: string; address: string }) {
    const firestore = this.firebaseAdminService.getFirestore();
    const newUserRef = await firestore.collection('users').add(userData);
    return { message: 'User added successfully', id: newUserRef.id };
  }

  @Put(':id')
  async editUser(@Param('id') userId: string, @Body() updatedData: { name?: string; email?: string; phone?: string; address?: string }) {
    const firestore = this.firebaseAdminService.getFirestore();
    await firestore.collection('users').doc(userId).update(updatedData);
    return { message: `User updated successfully` };
  }

  @Delete(':id')
  async deleteUser(@Param('id') userId: string) {
    const firestore = this.firebaseAdminService.getFirestore();
    await firestore.collection('users').doc(userId).delete();
    return { message: `User deleted successfully` };
  }

  @Get(':id')
  async getUserById(@Param('id') userId: string) {
    const firestore = this.firebaseAdminService.getFirestore();
    const userDoc = await firestore.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return { id: userDoc.id, ...userDoc.data() };
  }
  
}
