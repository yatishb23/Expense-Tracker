
const {Client}=require('pg')
const client = new Client({
    host:"localhost",
    user:"postgres",
    port:3000,
    password:"Yatish@123",
    database:"NewDB"
})
client.connect()
 
client.query('SELECT * from Student', (err,res)=>{
    if(!err){
        console.log(res.rows);
    }else{
        console.log(err.message);
    }
    client.end;
})