import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseModule } from './firebase.module';
import { UsersController } from './users/users.controller';

@Module({
  imports: [FirebaseModule],
  controllers: [AppController, UsersController],
  providers: [AppService],
})
export class AppModule {}
