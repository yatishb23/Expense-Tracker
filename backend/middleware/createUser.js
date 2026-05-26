const zod=require("zod")

const createUser=zod.object({
    username:zod.string().email(),
    password:zod.string().min(8, ()=>{
        alert("Password must be at least 8 characters long")
    })
})

module.exports={
    createUser:createUser
}