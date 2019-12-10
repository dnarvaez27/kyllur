import { Router } from 'express';
const router = Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.send('ok');
});

export default router;
