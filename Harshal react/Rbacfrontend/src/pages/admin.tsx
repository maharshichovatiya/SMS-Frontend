import React, { useState, useEffect } from "react";
import { Check, Trash2, X } from "lucide-react";
import { Adminaddpermissions, AdminDelete, AdminGet } from "../apis/services";
import toast from "react-hot-toast";
import { Loader } from "../components/Loader";
import { SmallLoader } from "../components/smallLoader";

// interface Permission {
//   id: string;
//   name: string;
// }

// interface Role {
//   role_id: number;
//   name: string;
//   actions: string;
// }

// interface ParsedRole {
//   role_id: number;
//   name: string;
//   permissions: Permission[];
// }

// export function AdminPanel() {
//   const [roles, setRoles] = useState<ParsedRole[]>([]);
//   const [showAddPermissionModal, setShowAddPermissionModal] = useState(false);
//   const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
//   const [selectedUserName, setSelectedUserName] = useState<string | null>(null);
//   const [newPermissionId, setNewPermissionId] = useState("");
//   const [loading, setLoading] = useState<boolean>(false);
//   const [errors,setErrors]=useState<string>("")
//   const availablePermissions: Permission[] = [
//     { id: "1", name: "create_records" },
//     { id: "2", name: "read_records" },
//     { id: "3", name: "update_records" },
//     { id: "4", name: "delete_records" },
//   ];

//   useEffect(() => {
//     async function fetchAllusers() {
//       try {
//         setLoading(true)
//         const data: Role[] = await AdminGet();
//         const parsedRoles = data.map((role) => ({
//           role_id: role.role_id,
//           name: role.name,
//           permissions: parsePermissions(role.actions),
//         }));
//         setRoles(parsedRoles);
//       } catch (err:any){
//         const message=err.message
//         toast.error(message)
//         setErrors(message)
//       }
//       finally{
//         setLoading(false)
//       }
//     }
//     fetchAllusers();
//   }, []);
//   const parsePermissions = (actionString: string): Permission[] => {
//     return actionString.split(",").map((action) => {
//       const [id, name] = action.split("-");
//       return { id, name };
//     });
//   };

//   const getUnassignedPermissions = (
//     roleId: number,
//     userName: string
//   ): Permission[] => {
//     const role = roles.find((r) => r.role_id === roleId && r.name === userName);
//     if (!role) return availablePermissions;
//     return availablePermissions.filter(
//       (perm) => !role.permissions.some((p) => p.name === perm.name)
//     );
//   };
//   const handleDeletePermission = async (
//     roleId: number,
//     userName: string,
//     permissionId: string
//   ) => {
//     try {
//       setLoading(true)
//       const res = await AdminDelete(parseInt(permissionId));
//       toast.success("Successfully deleted the permission");
//       setRoles(
//         roles.map((role) =>
//           role.role_id === roleId && role.name === userName
//             ? {
//                 ...role,
//                 permissions: role.permissions.filter(
//                   (p) => p.id !== permissionId
//                 ),
//               }
//             : role
//         )
//       );
//     } catch (err:any) {
//       const message = err.message;
//       toast.error(message);
//     }finally{
//         setLoading(false)
//     }
//   };

//   const handleAddPermissionClick = (roleId: number, userName: string) => {
//     setSelectedRoleId(roleId);
//     setSelectedUserName(userName);
//     setNewPermissionId("");
//     setShowAddPermissionModal(true);
//   };

//   // Add permission to role
//   const handleAddPermission = async () => {
//     if (!newPermissionId || !selectedRoleId || !selectedUserName) return;
//     const permissionExists = roles
//       .find((r) => r.role_id === selectedRoleId && r.name === selectedUserName)
//       ?.permissions.some((p) => p.id === newPermissionId);

//     if (permissionExists) {
//       return;
//     }
//     const selectedPermission = availablePermissions.find(
//       (p) => p.id === newPermissionId
//     );
//     if (!selectedPermission) {
//       toast.error("Invalid permission selected");
//       return;
//     }
//     try{
//         setLoading(true)
//         const res=await Adminaddpermissions({role_id:selectedRoleId,name:selectedUserName,actions:[selectedPermission.name]})
//         toast.success("Added particular permission successfully") 
//     }
//     catch(err:any){
//         const message=err.message
//         toast.error(message)
//     }
//     finally{
//         setLoading(false)
//     }
//     console.log(selectedRoleId,selectedUserName,selectedPermission.name);
//     setRoles(
//       roles.map((role) =>
//         role.role_id === selectedRoleId && role.name === selectedUserName
//           ? {
//               ...role,
//               permissions: [...role.permissions, selectedPermission],
//             }
//           : role
//       )
//     );

//     setShowAddPermissionModal(false);
//     setNewPermissionId("");
//     setSelectedRoleId(null);
//     setSelectedUserName(null);
//   };
//   if(loading){
//     <div className="bg-gradient-to-br w-full min-h-screen text-white from-slate-900 via-slate-800 to-slate-900 flex justify-center items-center">
//         <Loader/>
//       </div>
//   }
//   if (errors){
//   return <div className="bg-gradient-to-br w-full min-h-screen text-white from-slate-900 via-slate-800 to-slate-900 flex justify-center items-center">
//       Error from the server or you dont have permission to come on this page   
//      </div>

//   }
//   return (

//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
//       <div className="max-w-full mx-auto">
//         {/* Header */}
//         <div className="mb-12">
//           <h1 className="text-4xl font-bold text-white mb-2">Admin Panel</h1>
//           <p className="text-slate-400">Manage roles and their permissions</p>
//         </div>

//         {/* Roles Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {roles.map((role) => (
//             <div
//               key={`${role.role_id}-${role.name}`}
//               className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6"
//             >
//               {/* Role Header */}
//               <div className="mb-6">
//                 <h2 className="text-2xl font-bold text-white mb-1">
//                   {role.name}
//                 </h2>
//                 <p className="text-slate-400 text-sm">
//                   Role ID: {role.role_id}
//                 </p>
//               </div>

//               {/* Permissions Section */}
//               <div className="mb-6">
//                 <h3 className="text-lg font-semibold text-slate-300 mb-4">
//                   Permissions
//                 </h3>

//                 {role.permissions.length > 0 ? (
//                   <div className="space-y-2">
//                     {role.permissions.map((permission) => (
//                       <div
//                         key={permission.id}
//                         className="flex items-center justify-between bg-slate-700/30 border border-slate-600/50 rounded-lg p-3 hover:border-blue-500/30 transition-all"
//                       >
//                         <div className="flex items-center gap-3">
//                           <span className="text-slate-300">
//                             {permission.name}
//                           </span>
//                         </div>
//                         <button
//                           onClick={() =>
//                             handleDeletePermission(
//                               role.role_id,
//                               role.name,
//                               permission.id
//                             )
//                           }
//                           className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-all"
//                           title="Delete permission"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <p className="text-slate-500 text-sm italic">
//                     No permissions assigned
//                   </p>
//                 )}
//               </div>

//               {/* Add Permission Button */}
//               <button
//                 onClick={() =>
//                   handleAddPermissionClick(role.role_id, role.name)
//                 }
//                 disabled={
//                   getUnassignedPermissions(role.role_id, role.name).length === 0
//                 }
//                 className="w-full px-4 py-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed border border-blue-500/30 rounded-lg font-medium text-sm transition-all"
//               >
//                 + Add Permission
//               </button>
//             </div>
//           ))}
//         </div>

//         {/* Add Permission Modal */}
//         {showAddPermissionModal &&
//           selectedRoleId !== null &&
//           selectedUserName !== null && (
//             <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//               <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full mx-4 border border-slate-700/50">
//                 <h2 className="text-2xl font-bold text-white mb-6">
//                   Add Permission
//                 </h2>

//                 <div className="mb-6">
//                   <label className="block text-slate-300 text-sm mb-3">
//                     Select Permission
//                   </label>
//                   <select
//                     value={newPermissionId}
//                     onChange={(e) => setNewPermissionId(e.target.value)}
//                     className="w-full px-4 py-2 bg-slate-700/30 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:border-blue-500 outline-none transition-all"
//                   >
//                     <option value="">Choose a permission...</option>
//                     {selectedRoleId !== null &&
//                       selectedUserName !== null &&
//                       getUnassignedPermissions(
//                         selectedRoleId,
//                         selectedUserName
//                       ).map((permission) => (
//                         <option key={permission.id} value={permission.id}>
//                           {permission.id} - {permission.name}
//                         </option>
//                       ))}
//                   </select>
//                 </div>

//                 {/* Selected Permission Preview */}
//                 {newPermissionId && (
//                   <div className="mb-6 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
//                     <p className="text-slate-300 text-sm">
//                       <span className="font-semibold">Permission:</span>{" "}
//                       {
//                         availablePermissions.find(
//                           (p) => p.id === newPermissionId
//                         )?.name
//                       }
//                     </p>
//                   </div>
//                 )}

//                 <div className="flex gap-3">
//                   <button
//                     onClick={handleAddPermission}
//                     disabled={!newPermissionId}
//                     className="flex-1 px-4 py-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed border border-green-500/30 rounded-lg font-medium transition-all"
//                   >
//                     Add
//                   </button>
//                   <button
//                     onClick={() => {
//                       setShowAddPermissionModal(false);
//                       setNewPermissionId("");
//                       setSelectedRoleId(null);
//                       setSelectedUserName(null);
//                     }}
//                     className="flex-1 px-4 py-2 bg-gray-500/20 text-gray-400 hover:bg-gray-500/30 border border-gray-500/30 rounded-lg font-medium transition-all"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//       </div>
//     </div>
//   );
// }

// export default AdminPanel;

interface Permission {
  id: string;
  name: string;
}

interface Role {
  role_id: number;
  name: string;
  actions: string;
}

interface ParsedRole {
  role_id: number;
  name: string;
  permissions: Permission[];
}

export function AdminPanel() {
  const [roles, setRoles] = useState<ParsedRole[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<string>("");
  const [availablePermissions, setAvailablePermissions] = useState<Permission[]>([]);
  const [permissionLoading,setPermissionLoading]=useState<boolean>(false)
  const fetchRolesData = async () => {
    try {
      const data: Role[] = await AdminGet();
      const parsedRoles = data.map((role) => ({
        role_id: role.role_id,
        name: role.name,
        permissions: parsePermissions(role.actions),
      }));
      setRoles(parsedRoles);
      const allPerms = new Map<string, Permission>();
      parsedRoles.forEach((role) => {
        role.permissions.forEach((perm) => {
          if (!allPerms.has(perm.name)) {
            allPerms.set(perm.name, perm);
          }
        });
      });
      setAvailablePermissions(Array.from(allPerms.values()));
    } catch (err: any) {
      const message = err.message;
      toast.error(message);
      setErrors(message);
    }
  };
  useEffect(() => {
    try{
      setLoading(true)
      fetchRolesData();}
    catch(err:any){setErrors(err.message)}
    finally{
      setLoading(false)
    }
  }, []);
  
  const parsePermissions = (actionString: string): Permission[] => {
    return actionString.split(",").map((action) => {
      const [id, name] = action.split("-");
      return { id, name };
    });
  };

  const hasPermission = (role: ParsedRole, permissionName: string): boolean => {
    return role.permissions.some((p) => p.name === permissionName);
  };

  const getPermissionForRole = (role: ParsedRole, permissionName: string): Permission | undefined => {
    return role.permissions.find((p) => p.name === permissionName);
  };

  const handleTogglePermission = async (
    roleId: number,
    roleName: string,
    permissionName: string,
    isCurrentlyEnabled: boolean
  ) => {
    try {
      setPermissionLoading(true)
      if (isCurrentlyEnabled) {
        const role = roles.find((r) => r.role_id === roleId && r.name === roleName);
        const permissionToDelete = role?.permissions.find((p) => p.name === permissionName);
        
        if (!permissionToDelete) {
          toast.error("Permission not found");
          return;
        }
        await AdminDelete(parseInt(permissionToDelete.id));
        toast.success(`Removed ${permissionName} permission`);
        setRoles(
          roles.map((role) =>
            role.role_id === roleId && role.name === roleName
              ? {
                  ...role,
                  permissions: role.permissions.filter(
                    (p) => p.name !== permissionName
                  ),
                }
              : role
          )
        );
      } else {
        // Add permission
        await Adminaddpermissions({
          role_id: roleId,
          name: roleName,
          actions: [permissionName],
        });
        toast.success(`Added ${permissionName} permission`);
        await fetchRolesData();
      }
    } catch (err: any) {
      const message = err.message;
      toast.error(message);
    }finally{
      setPermissionLoading(false)
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br w-full min-h-screen text-white from-slate-900 via-slate-800 to-slate-900 flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (errors) {
    return (
      <div className="bg-gradient-to-br w-full min-h-screen text-white from-slate-900 via-slate-800 to-slate-900 flex justify-center items-center">
        Error from the server or you don't have permission to access this page
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-full mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-slate-400">
            Manage roles and their permissions using toggle switches
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {roles.map((role) => (
            <div
              key={`${role.role_id}-${role.name}`}
              className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6"
            >
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-1">
                  {role.name}
                </h2>
                <p className="text-slate-400 text-sm">
                  Role ID: {role.role_id}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-300 mb-4">
                  Permissions
                </h3>

                <div className="space-y-3">
                  {availablePermissions.map((permission) => {
                    const isEnabled = hasPermission(role, permission.name);
                    return (
                      <div
                        key={permission.id}
                        className="flex items-center justify-between bg-slate-700/30 border border-slate-600/50 rounded-lg p-4 hover:border-slate-600 transition-all"
                      >
                        <div className="flex-1">
                          <p className="text-white font-medium">
                            {permission.name}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            handleTogglePermission(
                              role.role_id,
                              role.name,
                              permission.name,
                              isEnabled
                            )
                          }
                          className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all ${
                            isEnabled
                              ? "bg-green-500/30 border border-green-500/50"
                              : "bg-red-500/30 border border-red-500/50"
                          }`}
                          title={isEnabled ? "Disable permission" : "Enable permission"}
                        >
                          <span
                            className={`inline-flex h-6 w-6 transform items-center justify-center rounded-full transition-all ${
                              isEnabled
                                ? "translate-x-7 bg-green-500"
                                : "translate-x-1 bg-red-500"
                            }`}
                          >
                            {isEnabled ? (
                              <Check className="h-3 w-3 text-white" />
                            ) : (
                              <X className="h-3 w-3 text-white" />
                            )}
                          </span>
                        </button>
                        <span
                          className={`ml-3 text-xs font-semibold px-3 py-1 rounded-full ${
                            isEnabled
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {isEnabled ? "Yes" : "No"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;