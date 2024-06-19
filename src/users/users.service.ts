import { Injectable, NotFoundException } from '@nestjs/common';
import { FirebaseAdminService } from 'src/firebase-admin.service';
import PDFDocument from 'pdfkit';


@Injectable()
export class UsersService {
    
    constructor(private readonly firebaseAdminService: FirebaseAdminService){}
    
    
    async getUsers() {
        const firestore = this.firebaseAdminService.getFirestore();
        const usersSnapshot = await firestore.collection('users').get();
        return usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    async addUser(userData){
        const firestore = this.firebaseAdminService.getFirestore();
        const newUserRef = await firestore.collection('users').add(userData);
        return { message: 'User added successfully', id: newUserRef.id };
    }

    async editUser(userId, updatedData){
        const firestore = this.firebaseAdminService.getFirestore();
        await firestore.collection('users').doc(userId).update(updatedData);
        return { message: `User updated successfully` };
    }

    async deleteUser(userId){
        const firestore = this.firebaseAdminService.getFirestore();
        await firestore.collection('users').doc(userId).delete();
        return { message: `User deleted successfully` };
    }

    async getUserById(userId){
        const firestore = this.firebaseAdminService.getFirestore();
        const userDoc = await firestore.collection('users').doc(userId).get();
        if (!userDoc.exists) {
          throw new NotFoundException(`User not found`);
        }
        return { id: userDoc.id, ...userDoc.data() };
    }

    async generatePdf(): Promise<Buffer> {
        const users = await this.getUsers();
    
        const doc = new PDFDocument();
        doc.text('User List', { align: 'center' });
        doc.moveDown();
        
        const addObjectToPdf = (obj: any, indent = 0) => {
            const keys = Object.keys(obj).filter(key => key !== 'id');
            keys.forEach(key => {
              const value = obj[key];
              if (typeof value === 'object' && value !== null) {
                doc.text(`${' '.repeat(indent)}${key}:`);
                addObjectToPdf(value, indent + 2);
              } else {
                doc.text(`${' '.repeat(indent)}${key}: ${value}`);
              }
            });
          };
      
          users.forEach(user => {
            addObjectToPdf(user);
            doc.moveDown();
          });

        return new Promise<Buffer>((resolve, reject) => {
          const buffers: Uint8Array[] = [];
          doc.on('data', buffers.push.bind(buffers));
          doc.on('end', () => {
            resolve(Buffer.concat(buffers));
          });
          doc.end();
        });
      }
}
