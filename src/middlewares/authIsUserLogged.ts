import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const prisma = new PrismaClient();

const authIsUserLogged = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    req.body.isLogged = true;

    if (!token) {
      req.body.isLogged = false;
      next();
      return;
    }

    // Verificar a validade do token JWT
    const secret = process.env.JWT_SECRET as jwt.Secret;
    const decodedToken = jwt.verify(token, secret) as JwtPayload;
    // A partir daqui, o token é válido e você pode realizar ações com o payload decodificado, se necessário

    const user = await prisma.users.findUnique({
      where: {
        id: decodedToken.userId
      }
    });

    if (user == null) throw { message: "Usuário não existe, por favor, faça login novamente" };

    // Incrementar o tempo de validação
    const updatedToken = jwt.sign({ ...decodedToken, exp: 60000}, secret);

    // Adicionar o token atualizado à resposta
    res.setHeader('Authorization', `Bearer ${updatedToken}`);
    req.body.currentUser = user;
    
    next();
  } catch (err) {
    console.error(err);
    res.json(err);
  }
}

export default authIsUserLogged;