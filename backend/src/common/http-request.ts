import type { Request } from 'express';
import type { DecodedIdToken } from 'firebase-admin/auth';
import type { User } from '../database/entities';

// Auth guards attach these fields before protected controllers run.
export interface AuthenticatedRequest extends Request {
  user?: User;
  firebaseUser?: DecodedIdToken;
}
