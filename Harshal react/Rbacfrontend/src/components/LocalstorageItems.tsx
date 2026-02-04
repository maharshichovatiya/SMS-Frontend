import toast from "react-hot-toast";
interface response{
    token:string,
    name:string,
    email:string
    role:string
}
export function SetitemsToLocalstorage(res:response){
    if (res.token) {
        localStorage.setItem("authToken", res.token);
        localStorage.setItem("name", res.name);
        localStorage.setItem("email", res.email);
        localStorage.setItem("role",res.role)
        toast.success(`Welcome back!!! ${res.name}`);
      }
    else{
        throw Error("No token in response")
    }
}