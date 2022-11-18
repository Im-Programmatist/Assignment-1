import { Router } from 'express';
const router = Router();
import assgCtl from '../controllers/assignment.controller.js';
 
/* POST programming language */
router.get('/:limit?/:offset?', assgCtl.fetch);

export default router;