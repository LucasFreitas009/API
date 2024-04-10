const express = require('express')
const app = express()
const {z} = require('zod')
const prisma = require('./lib/prisma')
const router = express.Router()
const port = 3333

// Rota para postar usúarios
router.post('/usuario', async (req, res) => {
    const usersSchema = z.object({
        name: z.string(),
        email: z.string().email()
    })

    try{
        const {name, email} = usersSchema.parse(req.body)
        
        const users = await prisma.users.create({
            data: {
                name,
                email
            }
        })

        res.status(201).json(users)

    } catch (erro) {
        res.status(400).json({error: 'Dados inválidos no corpo da solicitação'})
    }
})

// Rota para obter todos os usúarios
router.get('/usuario', async (req, res) => {
    try{
        const users = await prisma.users.findMany()

    if(users.length === 0) {
        return res.status(404).json({mensagem: 'Usúario não encontrado'})
    }

    res.json(users)

    } catch (error){
        console.error('Erro ao recuperar usúarios', error)
        res.status(500).json({error: 'Erro ao recupera usúarios'})
    }
})

app.use('/', router)

app.listen(port, () => {
    console.log(`Servidor ouvindo na porta ${port}`)
    console.log('http://localhost:3333')
})