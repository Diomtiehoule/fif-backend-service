

export const loginUser = async (req : any , res : any , next : any)  => {
    try {
        const { email , password } = req.body;
        const userExist = await prisma.user.findFirst({
            where : {email}
        })
        if(!userExist) return res.status(400).json({message : "email or password incorrect"})
        const isPasswordValid = await bcrypt.compare(password , userExist.password!)
        if(!isPasswordValid) return res.status(400).json({message : "email or password incorrect"})
        const token = generatoken(userExist.id)
        res.status(200).json({message : "login success" ,data : userExist , token})
    } catch (error : any) {
        console.log(`Error : ${error.message}`);
        return res.status(500).json({message : "Internal Server Error" , error : error.message});
    }
},