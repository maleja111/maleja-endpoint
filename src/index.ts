import express, { Request, Response } from 'express';
import { DB } from './config/db';
import { isNotEmpty, isDataValid } from '../utils/user';

const app = express();
const port = process.env.PORT || '3000';
const client = new DB();

app.use(express.json());

app.post('/add',async (req: Request, res: Response) => {
    try {
        if (!isNotEmpty(req.body) && isDataValid(req.body)) {
            const result = await client.addNewUser(req.body);
            res.status(201).json(`🙌 We successful created the user ID: ${result?.rows[0]?.id}`)
        } else {
          res.status(400).json({message: 'Error in the supplied data for user creation'})
        }
    } catch(err: any) {
        res.status(400).json({message: err.message})
    }
});

app.get('/getAll', async (req: Request, res: Response) => {
    try {
        const result = await client.getAll();
        res.status(200).json(result.rows)
    } catch(err: any) {
        res.status(400).json({message: err.message})
    }
});

app.get('/awesome/applicant/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req?.params?.id);
        const result = await client.getApplicantById(id);
        res.status(200).json(result.rows[0])
    } catch(err: any) {
        res.status(404).json({message: err.message})
    }
  
});

app.delete('/delete/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req?.params?.id);
        await client.deleteByID(id);
        res.status(200).json(`🗑️ We successful deleted the user ID: ${id}`)
    } catch(err: any) {
        res.status(404).json({message: err.message})
    }
});

app.put('/update/:id', async (req: Request, res: Response) => {
    try {
      if (!isNotEmpty(req.body) && isDataValid(req.body) && req?.params?.id) {
          const id = parseInt(req?.params?.id)
          await client.updateById(id, req.body);
          res.status(201).json(`📋 We successful updated the user ID: ${id}`);
      } else {
        res.status(400).json({message: 'Error in the supplied data for user creation'})
      }
  } catch(err: any) {
      res.status(400).json({message: err.message})
  }
});


app.listen(port, () => {
  console.log(`👨‍💻 Server is working! Port: ${port}`);
});
