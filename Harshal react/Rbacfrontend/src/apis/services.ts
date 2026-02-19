import { Trophy } from "lucide-react";
import apiClient  from "./client";



interface loginData{
    email:string,
    password:string
}

interface signupdata{
    name:string,
    email:string,
    password:string
}

interface Item{
    name:string,
    description:string,
    price:number
    
}
interface AssignData{
    role_id:number,
    name:string,
    actions:string[]
}


export async function LoginPost(loginData:loginData){
    try{
        const res=await apiClient.post("/auth/login",loginData)
        return res.data
    }
    catch (error:any){
        throw error
    }
}


export async function SignupPost(signupdata:signupdata){
    try{
        const res=await apiClient.post("/auth/signup",{name:signupdata.name,email:signupdata.email,password:signupdata.password})
        return res.data
    }
    catch(err:any){
        throw err
    }
}

export async function ProductsGet(){
    try{
        const res=await apiClient.get("/products")
        return res.data
    }
    catch(err:any){
        throw err
    }
}


export async function CreateItem(data:Item){
    try{
        const res=await apiClient.post("/products",data)
        return res.data
    }
    catch(err:any){
        throw err
    }
}

export async function UpdateItem(id:number,data:Partial<Item>){
    console.log(id)
    try{
        const res=await apiClient.patch(`/products/${id}`,data)
        return res.data
    }
    catch(err:any){
        throw err
    }
}
export async function DeleteItem(id:number){
    try{
        const res=await apiClient.delete(`/products/${id}`)
        return res.data
    }
    catch(err:any){
        throw err
    }
}


export async function AdminGet(){
    try{
        const res=await apiClient.get(`/admin`)
        return res.data
    }
    catch(err:any){
        throw err
    }

}

export async function AdminDelete(id:number){
    try{
        const res=await apiClient.delete(`/admin/${id}`)
        return res.data
    }
    catch(err:any){
        throw err
    }
    
}

export async function Adminaddpermissions(data:AssignData){
    try{
        const res=await apiClient.post(`/admin/assign`,data)
        return res.data
    }
    catch(err:any){
        throw err
    }
}