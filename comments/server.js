import express from "express"
import { v4 } from "uuid"
import fs from "node:fs"
import { join } from "node:path"

const app = express()

const PORT = 2000

const comments = []

app.use(express.json())

app.get("/comments", (req,res) =>{
   
    if(comments.length > 0){
        
        writeFile(comments,"GET_ALL.txt")
        readFile("GET_ALL.txt")
        res.json(comments)
    
    }else{

        res.status(400).send("Insufficient length to show data")
    }

})


app.get("/comments/:id", (req,res,next) =>{
 
    try {
        const {id} = req.params
        const data = comments.find(element => element.id === id)
        

        if(!data){
            
            res.status(400).send("Index not found")
        
        }else{

            writeFile(data,"GET_BY_ID.txt")
            readFile("GET_BY_ID.txt")
            res.json(data)
    
        }
    } catch (error) {
        console.error(error);
        next(error)
        
    }
    

})


app.post("/comments", (req,res,next) =>{

    try {
        const data = req.body
    
        if(!data.content || !data.created_at){
            
            res.status(400).send('Data is not fully created')
        
        }else{
            
            
            data.id = v4();
            data.post_id = v4();
            data.user_id = v4();

            writeFile(data, "POST.txt")
            readFile("POST.txt")
            comments.push(data)
            res.json(data)
    
        }
    } catch (error) {
        console.error(error);
        next(error)
        
    }

})


app.put("/comments/:id", (req,res,next) =>{
    
    try {
        const {id} = req.params
        const index = comments.findIndex(element => element.id === id)
    
        if(index === -1){
            
            res.status(404).send(`Comment with ID ${id} is not found`)
        
        }else{
            
            const data = req.body 
            const newData = {
                ...comments[index],
                ...data
            }
            
            writeFile(newData, "PUT.txt")
            readFile("PUT.txt")
            comments.splice(index,1,newData)
            res.send(`Comment with ID ${id} has been successfully updated`)
        }
    } catch (error) {
        console.error(error);
        next(error)
        
    }
})


app.delete("/comments/:id", (req,res,next) =>{

    try {
        const {id} = req.params
        const index = comments.findIndex(element => element.id === id)
    
        if(index === -1){
            
            res.status(404).send(`Comment with ID ${id} is not found`)
            
        }else{
            
            const data = comments.find(element => element.id === id)

            writeFile(data,"DELETE.txt")
            readFile("DELETE.txt")

            comments.splice(index,1)
            res.send(`Comment with ID ${id} has been successfully deleted`)
        }
    } catch (error) {
        console.error(error);
        next(error)
        
    }

})


function writeFile(data,name){
    
    try {
        const filePath = join(import.meta.dirname,name)
        fs.writeFile(filePath,JSON.stringify(data), 'utf8',(err) =>{ 
            if(err) console.error(err)
        })

        console.log(`${name} has been successfully written`);
    } catch (error) {
        console.error(error);
        next(error)
        
    }

}

function readFile(name) {
    fs.readFile(name, "utf8", (err, data) => {
        if (err) {
            console.error(err.message);
            return;
        }

        console.log(`${name} is being read`);

        try {
            const jsonData = data.trim() ? JSON.parse(data) : [];
            console.log(jsonData);
        } catch (parseError) {
            console.error(parseError.message);
        }
    });
}


app.use((err,req,res,next) => res.status(500).send(err.message))

app.listen(PORT, ()=> console.log(`Server is running on port ${PORT}`));
