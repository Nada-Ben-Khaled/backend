import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Role } from '../roles/role.schema';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  // _id is kept by Mongoose in DB but not used in the API; only userId is used
  @Prop({ required: true, unique: true })
  userId: string; // e.g. mediflow1, mediflow2 (never reused after delete)

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  photo?: string;

  @Prop()
  phone?: string;

  @Prop()
  dateOfBirth?: Date;

  @Prop()
  gender?: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: String, default: null })
  resetToken: string | null;

  // ⚠️ Ici on stocke juste l'id du rôle
  @Prop({ type: Types.ObjectId, ref: Role.name })
  role: Types.ObjectId | Role;

  @Prop()
  medicalRecordNumber?: string;

  @Prop()
  specialization?: string;

  @Prop()
  department?: string;

  @Prop()
  assignedPatients?: string;

  @Prop()
  address?: string;

  @Prop()
  emergencyContact?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Keep _id in DB (Mongoose default) but use only userId in the API: hide _id from responses
UserSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    const o = ret as unknown as Record<string, unknown>;
    delete o._id;
    delete o.__v;
    delete o.password;
    delete o.resetToken;
    return ret;
  },
});
UserSchema.set('toObject', {
  virtuals: true,
  transform: (_doc, ret) => {
    const o = ret as unknown as Record<string, unknown>;
    delete o._id;
    delete o.__v;
    delete o.password;
    delete o.resetToken;
    return ret;
  },
});
