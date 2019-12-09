import { Router } from 'express';
const router = Router();

/* GET home page. */
router.get('/stats', (req, res) => {
  res.send('ok');
});

export default router;
