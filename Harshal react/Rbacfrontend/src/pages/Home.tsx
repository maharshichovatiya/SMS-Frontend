import { useEffect, useState } from "react";
import { CreateItem, DeleteItem, ProductsGet, UpdateItem } from "../apis/services";
import { DetailsCard } from "../components/Detailscards";
import { Loader } from "../components/Loader";
import { UpdateModal } from "../components/UpdateModal";
import { CreateModal } from "../components/CreateModal";
import toast from "react-hot-toast";
import { createSearchParams, Link } from "react-router-dom";

export interface Items {
  id: number;
  name: string;
  description: string;
  price: number;
}

export function Home() {
  const [data, setData] = useState<Items[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Items | null>(null);
  const [role,setCurrentrole]=useState<string>("");
  useEffect(() => {
    const currentrole=localStorage.getItem("role")
    const name=localStorage.getItem("name")
    if (currentrole){setCurrentrole(currentrole)}
    async function fetchItems() {
      setLoading(true);
      try {
        const res = await ProductsGet();
        setData(res);
      } catch (err: any) {
        const message=err.message
        toast.error(message)
        setErrors(err);
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, []);
  const capitalizeFirst = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  const handleDelete =async(id: number) => {
    try{
      setLoading(true)
    const res=await DeleteItem(id)
    toast.success("Deleted successfully")
    setData(data.filter((item) => item.id !== id));
    }
    catch(err:any){
      if (err.status==403){
        toast.error("You dont have permissions to do that")
      }
    }
    setLoading(false)
  };
  const handleCreateClick = () => {
    setShowCreateModal(true);
  };

  const handleUpdateClick = (item: Items) => {
    setSelectedItem(item);
    console.log(item)
    setShowUpdateModal(true);
  };
  const handleCreateSubmit =async (formData: { name: string; description: string; price: string }) => {
    // api of create here
    try{
      setLoading(true)
      const res=await CreateItem({name:formData.name,description:formData.description,price:parseFloat(formData.price)})
      toast.success("Item added successfully")
      const newItem: Items = {
        id: res.insertId,
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
      };
      setData([...data, newItem]);
      setLoading(false)
    }
    catch(err:any){
      setLoading(false)
      if (err.status==403){
        toast.error("You dont have permissions to do that")
      }
      console.log(err.status)
    }
    setShowCreateModal(false);
  };

  const handleUpdateSubmit = async (formData: { name: string; description: string; price: string }) => {
    try{
      // update api
      setLoading(true)
      console.log(selectedItem?.id)
      const res=await UpdateItem(selectedItem?.id!,{name:formData.name,description:formData.description,price:parseFloat(formData.price)})
      toast.success("Updated the item successfully")
      setLoading(false)
      setData(
        data.map((item) =>
          item.id === selectedItem?.id
            ? {
                ...item,
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
              }
            : item
        )
      );
    }
    catch(err:any){
      setLoading(false)
      if (err.status==403){
        toast.error("You dont have permissions to do that")
      }
    }
    setShowUpdateModal(false);
  };

  if (loading)
    return (
      <div className="bg-gradient-to-br w-full min-h-screen text-white from-slate-900 via-slate-800 to-slate-900 flex justify-center items-center">
        <Loader/>
      </div>
    );

  if (errors)
  return 
  <div className="bg-gradient-to-br w-full min-h-screen text-white from-slate-900 via-slate-800 to-slate-900 flex justify-center items-center">
      Error from the server or you dont have permission to react items   
     </div>

  return (
    <div className="bg-gradient-to-br w-full min-h-screen text-white from-slate-900 via-slate-800 to-slate-900 relative">
    <div className="w-full flex justify-between pt-10 px-10">
    {role&&<h1 className="text-2xl font-bold">Hi {capitalizeFirst(role)}!!</h1>}
      <div className="flex gap-10">
      {role=="admin"&&<button 
        onClick={handleCreateClick}
        className="bg-blue-600 hover:bg-blue-700 px-3 py-1 sm:px-10  sm:py-2  md:px-15 md:py-4  cursor-pointer  text-xl rounded-3xl font-bold transition-all"
      >
        <Link to='/admin'>Admin panel</Link>
      </button> }
      <button 
        onClick={handleCreateClick}
        className="bg-blue-600 hover:bg-blue-700 px-3 py-1 sm:px-10  sm:py-2  md:px-15 md:py-4  cursor-pointer text-xl rounded-3xl font-bold transition-all"
      >
        Create Item
      </button>
      </div>
    </div>
      <h1 className="text-4xl font-bold pl-10">Products</h1>
      <p className="text-2xl pl-10 font-josefin text-[#cbd5e1] pt-2">
        Browse our collection of quality products
      </p>

      {/* products mapping of apisss*/}
      <div className="grid grid-cols-1 lg:grid-cols-2 max-w-full p-10 gap-6">
        {data.length!=0? <DetailsCard data={data} onDelete={handleDelete} onUpdate={handleUpdateClick}/>:<div>No data vailable</div>}
      </div>
      <CreateModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} onSubmit={handleCreateSubmit} />
      <UpdateModal isOpen={showUpdateModal} item={selectedItem} onClose={() => setShowUpdateModal(false)} onSubmit={handleUpdateSubmit} />
    </div>
  );
}
