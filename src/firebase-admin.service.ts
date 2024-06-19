import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as serviceAccount from './firebase-adminsdk.json';

@Injectable()
export class FirebaseAdminService implements OnModuleInit {
  onModuleInit() {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    //   databaseURL: 'https://fir-project-374e0-default-rtdb.asia-southeast1.firebasedatabase.app',
    });
  }

//   getDatabase() {
//     return admin.database();
//   }

  getFirestore() {
    return admin.firestore();
  }
}
